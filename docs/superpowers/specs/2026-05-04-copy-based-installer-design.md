# Copy-Based Installer Design
**Date:** 2026-05-04  
**Status:** Approved  
**Scope:** Replace MCP server with `setup-claude` and `setup-cursor` copy-based installers

---

## Problem

The current framework requires users to manually paste JSON config into `.cursor/mcp.json` or Claude Code settings to register an MCP stdio server (`flutter-tsed --mcp`). This is fragile, complex to explain, and exposes internals users don't need to see or manage. The MCP server itself is overkill — all it does is serve markdown command docs.

---

## Solution

Two new CLI commands that copy the full framework scaffold into a namespaced hidden folder inside the user's IDE config directory, register the paths in `settings.json`, and surface only the user-facing files to the project root.

---

## CLI Interface

```
flutter-tsed setup-claude [--global | --local] [--force]
flutter-tsed setup-cursor [--global | --local] [--force]
```

**Flags:**
- `--global` — installs into `~/.claude/flutter-tsed/` or `~/.cursor/flutter-tsed/`
- `--local` — installs into `<cwd>/.claude/flutter-tsed/` or `<cwd>/.cursor/flutter-tsed/`
- No flag — interactive prompt: `Install globally or locally? [global/local]`
- `--force` — overwrite user-facing files in CWD even if they already exist

Both commands are idempotent. Re-running updates internal files and merges `settings.json`.

---

## Installation Layout

### `setup-claude --global`

```
~/.claude/
  flutter-tsed/              ← namespaced, users never edit this
    agents/                  ← copied from package's .claude/agents/
    commands/                ← copied from package's .claude/commands/
    skills/                  ← copied from package's .claude/skills/
  settings.json              ← merged (framework keys added, existing keys preserved)
```

### `setup-claude --local`

```
<cwd>/
  .claude/
    flutter-tsed/            ← namespaced, users never edit this
      agents/
      commands/
      skills/
  CLAUDE.md                  ← user-facing (skip if exists, unless --force)
  PROJECT_CONFIG.md          ← user-facing (skip if exists, unless --force)
  MEMORY.md                  ← user-facing (skip if exists, unless --force)
  BUG_PATTERNS.md            ← user-facing (skip if exists, unless --force)
  TEST_SPEC.md               ← user-facing (skip if exists, unless --force)
  AGENTS.md                  ← user-facing (skip if exists, unless --force)
```

### `setup-cursor --global`

```
~/.cursor/
  flutter-tsed/              ← namespaced, users never edit this
    agents/                  ← copied from package's .cursor/agents/
    rules/                   ← copied from package's .cursor/rules/ (hooks)
  settings.json              ← merged
```

### `setup-cursor --local`

```
<cwd>/
  .cursor/
    flutter-tsed/            ← namespaced, users never edit this
      agents/
      rules/
  PROJECT_CONFIG.md          ← user-facing (skip if exists, unless --force)
  MEMORY.md                  ← user-facing (skip if exists, unless --force)
  BUG_PATTERNS.md            ← user-facing (skip if exists, unless --force)
  TEST_SPEC.md               ← user-facing (skip if exists, unless --force)
  AGENTS.md                  ← user-facing (skip if exists, unless --force)
```

---

## settings.json Entries

> **Implementation note:** The exact Claude Code settings keys for custom agent/command directories must be verified against the current Claude Code version during implementation. The installer logic is correct regardless — only the key names may need adjustment.

### Claude Code (`~/.claude/settings.json` or `<cwd>/.claude/settings.json`)

```json
{
  "customAgentsDirectory": "~/.claude/flutter-tsed/agents",
  "customCommandsDirectory": "~/.claude/flutter-tsed/commands"
}
```

For local installs, paths are relative:
```json
{
  "customAgentsDirectory": ".claude/flutter-tsed/agents",
  "customCommandsDirectory": ".claude/flutter-tsed/commands"
}
```

### Cursor (`~/.cursor/settings.json` or `<cwd>/.cursor/settings.json`)

```json
{
  "cursor.agentsDirectory": "~/.cursor/flutter-tsed/agents",
  "cursor.rulesDirectory": "~/.cursor/flutter-tsed/rules"
}
```

For local installs, paths are relative:
```json
{
  "cursor.agentsDirectory": ".cursor/flutter-tsed/agents",
  "cursor.rulesDirectory": ".cursor/flutter-tsed/rules"
}
```

---

## Source File Structure

### New files added

```
src/
  setup-claude.js    ← handles setup-claude command, resolves flags, delegates to installer
  setup-cursor.js    ← handles setup-cursor command, resolves flags, delegates to installer
  installer.js       ← shared copy/merge logic
```

### `installer.js` responsibilities

1. Resolve target base dir from `--global`/`--local` flag or interactive prompt
2. Copy internal files (agents, commands, skills/rules) into namespaced folder — **always overwrite**
3. Copy user-facing files to CWD root — **skip if exists**, unless `--force`
4. Merge `settings.json` — read existing JSON, add/update framework keys, write back atomically
5. Print install summary

### `bin/flutter-tsed.js` changes

Add two entries, remove one:
```javascript
// Add:
"setup-claude": () => require("../src/setup-claude")(),
"setup-cursor": () => require("../src/setup-cursor")(),

// Remove:
"--mcp": () => require("../src/mcp-server")(),
```

Help text updated to:
```
Usage: flutter-tsed <setup-claude|setup-cursor|sync-rules|init>
```

### Files deleted

- `src/mcp-server.js`
- `.mcp.json`

### `package.json` changes

- Remove dependencies: `@modelcontextprotocol/sdk`, `zod`
- No new dependencies (interactive prompt uses Node built-in `readline`)

---

## Installer Logic Detail

### Copy internal files

```
source: <npm-package-root>/.claude/agents/     → target: <base>/flutter-tsed/agents/
source: <npm-package-root>/.claude/commands/   → target: <base>/flutter-tsed/commands/
source: <npm-package-root>/.claude/skills/     → target: <base>/flutter-tsed/skills/
```

`<npm-package-root>` is resolved via `path.join(__dirname, '..')` from within `src/installer.js`.

Each file is copied individually. Directories are created recursively if they don't exist. Always overwrites — these are framework internals.

### Copy user-facing files

```
source: <npm-package-root>/CLAUDE.md           → target: <cwd>/CLAUDE.md
source: <npm-package-root>/PROJECT_CONFIG.md   → target: <cwd>/PROJECT_CONFIG.md
source: <npm-package-root>/MEMORY.md           → target: <cwd>/MEMORY.md
source: <npm-package-root>/BUG_PATTERNS.md     → target: <cwd>/BUG_PATTERNS.md
source: <npm-package-root>/TEST_SPEC.md        → target: <cwd>/TEST_SPEC.md
source: <npm-package-root>/AGENTS.md           → target: <cwd>/AGENTS.md
```

Skip if target exists (print `[skipped]`). Overwrite if `--force` (print `[updated]`).

### Merge settings.json

1. Read existing `settings.json` — if missing, start with `{}`
2. If content is not valid JSON, print error with file path and exit 1
3. Merge framework keys into parsed object (never delete other keys)
4. Write back with 2-space indentation

### Interactive prompt (no flag)

Uses `readline.createInterface` from Node stdlib. Single question:

```
? Install flutter-tsed framework globally (~/.claude) or locally (this project)? [global/local]:
```

Accepts `global`, `g`, `local`, `l`. Any other input re-asks once, then exits with error.

---

## Error Handling

| Scenario | Behavior |
|---|---|
| `settings.json` malformed JSON | Print error + file path, exit 1. Never corrupt it. |
| Target directory not writable | Print permission error with exact path. Suggest `sudo` only for global installs. |
| Source files missing from package | Print which files are missing, exit 1, suggest reinstalling package. |
| CWD user-facing file already exists | `[skipped] MEMORY.md (already exists — use --force to overwrite)` |
| `settings.json` doesn't exist | Create it with just the framework keys |
| Partial install (crash mid-copy) | Each file is individually copied — no partial state per file. Summary shows exactly what succeeded. |

---

## Install Summary Output

```
flutter-tsed setup-claude (global)
──────────────────────────────────
[installed] ~/.claude/flutter-tsed/agents/orchestrator.md
[installed] ~/.claude/flutter-tsed/agents/reviewer.md
... (all agents)
[installed] ~/.claude/flutter-tsed/commands/tdd.md
... (all commands)
[copied]    CLAUDE.md
[copied]    PROJECT_CONFIG.md
[skipped]   MEMORY.md (already exists)
[updated]   ~/.claude/settings.json

Done. Restart Claude Code to pick up the new agents and commands.
```

---

## What is NOT in scope

- `uninstall` command — users delete `~/.claude/flutter-tsed/` manually
- `setup-all` command — run both separately
- Auto-update / version pinning — re-run setup command after `npm update`
- Windows path handling beyond `path.join` — symlinks not used so this is safe
