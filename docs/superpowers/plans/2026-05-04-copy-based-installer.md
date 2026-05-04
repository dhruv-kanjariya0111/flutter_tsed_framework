# Copy-Based Installer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the MCP server with `flutter-tsed setup-claude` and `flutter-tsed setup-cursor` commands that copy the framework scaffold into namespaced hidden folders and merge `settings.json`.

**Architecture:** A shared `installer.js` module handles all file copy and settings merge logic. Two thin command modules (`setup-claude.js`, `setup-cursor.js`) parse flags, prompt the user when needed, and delegate to `installer.js`. The CLI entry point (`bin/flutter-tsed.js`) is updated to route the new commands and remove the old `--mcp` entry.

**Tech Stack:** Node.js (built-ins only: `fs`, `path`, `os`, `readline`). No new dependencies.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `src/installer.js` | Copy files, merge settings.json, print summary |
| Create | `src/setup-claude.js` | Parse flags/prompt, call installer with Claude config |
| Create | `src/setup-cursor.js` | Parse flags/prompt, call installer with Cursor config |
| Modify | `bin/flutter-tsed.js` | Add setup-claude/setup-cursor routes, remove --mcp |
| Modify | `package.json` | Remove MCP deps, add `.claude/agents` + `.claude/commands` to files |
| Delete | `src/mcp-server.js` | No longer needed |
| Delete | `.mcp.json` | No longer needed |

---

## Task 1: Write tests for `installer.js`

**Files:**
- Create: `src/__tests__/installer.test.js`

- [ ] **Step 1: Create test file with setup/teardown**

Create `src/__tests__/installer.test.js`:

```javascript
const fs = require("fs");
const path = require("path");
const os = require("os");

// We will require installer after writing it
let installer;

function makeTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "flutter-tsed-test-"));
}

function writeFile(dir, relPath, content = "test content") {
  const full = path.join(dir, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  return full;
}

describe("installer", () => {
  let pkgRoot, targetBase, cwd;

  beforeEach(() => {
    pkgRoot = makeTmpDir();
    targetBase = makeTmpDir();
    cwd = makeTmpDir();
    installer = require("../installer");
  });

  afterEach(() => {
    fs.rmSync(pkgRoot, { recursive: true, force: true });
    fs.rmSync(targetBase, { recursive: true, force: true });
    fs.rmSync(cwd, { recursive: true, force: true });
    jest.resetModules();
  });
```

- [ ] **Step 2: Write test — copies internal files always**

Add inside the `describe` block:

```javascript
  test("copies internal files into namespaced folder, always overwriting", () => {
    writeFile(pkgRoot, ".claude/agents/orchestrator.md", "agent content");
    writeFile(pkgRoot, ".claude/commands/tdd.md", "command content");

    installer.copyInternalFiles({
      pkgRoot,
      targetBase,
      internalDirs: [".claude/agents", ".claude/commands"],
      namespacedDir: "flutter-tsed",
    });

    const agentDest = path.join(targetBase, "flutter-tsed", "agents", "orchestrator.md");
    const cmdDest = path.join(targetBase, "flutter-tsed", "commands", "tdd.md");
    expect(fs.existsSync(agentDest)).toBe(true);
    expect(fs.readFileSync(agentDest, "utf8")).toBe("agent content");
    expect(fs.existsSync(cmdDest)).toBe(true);
  });

  test("overwrites existing internal files on re-run", () => {
    writeFile(pkgRoot, ".claude/agents/orchestrator.md", "new content");
    const dest = path.join(targetBase, "flutter-tsed", "agents", "orchestrator.md");
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, "old content");

    installer.copyInternalFiles({
      pkgRoot,
      targetBase,
      internalDirs: [".claude/agents"],
      namespacedDir: "flutter-tsed",
    });

    expect(fs.readFileSync(dest, "utf8")).toBe("new content");
  });
```

- [ ] **Step 3: Write test — user-facing files skip/force**

```javascript
  test("copies user-facing files to cwd, skips if exists", () => {
    writeFile(pkgRoot, "MEMORY.md", "memory content");
    writeFile(pkgRoot, "AGENTS.md", "agents content");

    const results = installer.copyUserFacingFiles({
      pkgRoot,
      cwd,
      userFacingFiles: ["MEMORY.md", "AGENTS.md"],
      force: false,
    });

    expect(fs.existsSync(path.join(cwd, "MEMORY.md"))).toBe(true);
    expect(results.find(r => r.file === "MEMORY.md").action).toBe("copied");

    // Run again — should skip
    const results2 = installer.copyUserFacingFiles({
      pkgRoot,
      cwd,
      userFacingFiles: ["MEMORY.md"],
      force: false,
    });
    expect(results2.find(r => r.file === "MEMORY.md").action).toBe("skipped");
  });

  test("overwrites user-facing files when --force", () => {
    writeFile(pkgRoot, "MEMORY.md", "new content");
    fs.writeFileSync(path.join(cwd, "MEMORY.md"), "old content");

    const results = installer.copyUserFacingFiles({
      pkgRoot,
      cwd,
      userFacingFiles: ["MEMORY.md"],
      force: true,
    });

    expect(fs.readFileSync(path.join(cwd, "MEMORY.md"), "utf8")).toBe("new content");
    expect(results.find(r => r.file === "MEMORY.md").action).toBe("updated");
  });
```

- [ ] **Step 4: Write test — mergeSettings creates file if missing**

```javascript
  test("mergeSettings creates settings.json if missing", () => {
    const settingsPath = path.join(cwd, "settings.json");
    installer.mergeSettings(settingsPath, { myKey: "myValue" });
    const parsed = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    expect(parsed.myKey).toBe("myValue");
  });

  test("mergeSettings adds keys without removing existing ones", () => {
    const settingsPath = path.join(cwd, "settings.json");
    fs.writeFileSync(settingsPath, JSON.stringify({ existingKey: true }, null, 2));
    installer.mergeSettings(settingsPath, { newKey: "newValue" });
    const parsed = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    expect(parsed.existingKey).toBe(true);
    expect(parsed.newKey).toBe("newValue");
  });

  test("mergeSettings throws on malformed JSON", () => {
    const settingsPath = path.join(cwd, "settings.json");
    fs.writeFileSync(settingsPath, "{ bad json }");
    expect(() => installer.mergeSettings(settingsPath, { k: "v" })).toThrow(/malformed/i);
  });
});
```

- [ ] **Step 5: Run tests — expect them to fail (installer not written yet)**

```bash
cd /path/to/project && npx jest src/__tests__/installer.test.js --no-coverage 2>&1 | tail -20
```

Expected: `Cannot find module '../installer'`

---

## Task 2: Implement `installer.js`

**Files:**
- Create: `src/installer.js`

- [ ] **Step 1: Write `copyInternalFiles`**

Create `src/installer.js`:

```javascript
const fs = require("fs");
const path = require("path");

function copyInternalFiles({ pkgRoot, targetBase, internalDirs, namespacedDir }) {
  const results = [];
  for (const srcDir of internalDirs) {
    const srcPath = path.join(pkgRoot, srcDir);
    if (!fs.existsSync(srcPath)) {
      results.push({ file: srcDir, action: "missing-source" });
      continue;
    }
    // Last segment of srcDir becomes the subfolder name under namespacedDir
    const subDir = path.basename(srcDir);
    const destDir = path.join(targetBase, namespacedDir, subDir);
    copyDir(srcPath, destDir, results, targetBase);
  }
  return results;
}

function copyDir(src, dest, results, displayBase) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcEntry = path.join(src, entry.name);
    const destEntry = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcEntry, destEntry, results, displayBase);
    } else {
      fs.copyFileSync(srcEntry, destEntry);
      results.push({ file: destEntry, action: "installed" });
    }
  }
}
```

- [ ] **Step 2: Write `copyUserFacingFiles`**

Add to `src/installer.js`:

```javascript
function copyUserFacingFiles({ pkgRoot, cwd, userFacingFiles, force }) {
  const results = [];
  for (const fileName of userFacingFiles) {
    const src = path.join(pkgRoot, fileName);
    const dest = path.join(cwd, fileName);
    if (!fs.existsSync(src)) {
      results.push({ file: fileName, action: "missing-source" });
      continue;
    }
    if (fs.existsSync(dest) && !force) {
      results.push({ file: fileName, action: "skipped" });
      continue;
    }
    fs.copyFileSync(src, dest);
    results.push({ file: fileName, action: fs.existsSync(dest) && force ? "updated" : "copied" });
  }
  return results;
}
```

Fix the action label — `copyFileSync` overwrites before we can check existence. Correct version:

```javascript
function copyUserFacingFiles({ pkgRoot, cwd, userFacingFiles, force }) {
  const results = [];
  for (const fileName of userFacingFiles) {
    const src = path.join(pkgRoot, fileName);
    const dest = path.join(cwd, fileName);
    if (!fs.existsSync(src)) {
      results.push({ file: fileName, action: "missing-source" });
      continue;
    }
    const alreadyExists = fs.existsSync(dest);
    if (alreadyExists && !force) {
      results.push({ file: fileName, action: "skipped" });
      continue;
    }
    fs.copyFileSync(src, dest);
    results.push({ file: fileName, action: alreadyExists ? "updated" : "copied" });
  }
  return results;
}
```

- [ ] **Step 3: Write `mergeSettings`**

Add to `src/installer.js`:

```javascript
function mergeSettings(settingsPath, keysToMerge) {
  let existing = {};
  if (fs.existsSync(settingsPath)) {
    const raw = fs.readFileSync(settingsPath, "utf8").trim();
    try {
      existing = JSON.parse(raw);
    } catch {
      throw new Error(
        `Malformed JSON in ${settingsPath} — fix or delete it and re-run.`
      );
    }
  }
  const merged = Object.assign({}, existing, keysToMerge);
  fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
  fs.writeFileSync(settingsPath, JSON.stringify(merged, null, 2) + "\n");
}
```

- [ ] **Step 4: Write `printSummary`**

Add to `src/installer.js`:

```javascript
function printSummary({ label, internalResults, userResults, settingsPath }) {
  console.log(`\nflutter-tsed ${label}`);
  console.log("─".repeat(40));
  for (const r of internalResults) {
    const tag = r.action === "missing-source" ? "[missing]" : "[installed]";
    console.log(`${tag.padEnd(12)} ${r.file}`);
  }
  for (const r of userResults) {
    const tag =
      r.action === "copied" ? "[copied]" :
      r.action === "updated" ? "[updated]" :
      r.action === "skipped" ? "[skipped]" : "[missing]";
    const note = r.action === "skipped" ? " (already exists — use --force to overwrite)" : "";
    console.log(`${tag.padEnd(12)} ${r.file}${note}`);
  }
  console.log(`${"[updated]".padEnd(12)} ${settingsPath}`);
}

module.exports = { copyInternalFiles, copyUserFacingFiles, mergeSettings, printSummary };
```

- [ ] **Step 5: Run tests — expect them to pass**

```bash
npx jest src/__tests__/installer.test.js --no-coverage
```

Expected: All tests pass (green).

- [ ] **Step 6: Commit**

```bash
git add src/installer.js src/__tests__/installer.test.js
git commit -m "feat: add installer.js with copyInternalFiles, copyUserFacingFiles, mergeSettings"
```

---

## Task 3: Implement `src/setup-claude.js`

**Files:**
- Create: `src/setup-claude.js`

- [ ] **Step 1: Write the flag parser and prompt helper**

Create `src/setup-claude.js`:

```javascript
const path = require("path");
const os = require("os");
const readline = require("readline");
const { copyInternalFiles, copyUserFacingFiles, mergeSettings, printSummary } = require("./installer");

const PKG_ROOT = path.join(__dirname, "..");

function parseScope(argv) {
  if (argv.includes("--global")) return "global";
  if (argv.includes("--local")) return "local";
  return null;
}

function parseForce(argv) {
  return argv.includes("--force");
}

function promptScope() {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    let attempts = 0;

    function ask() {
      rl.question(
        "? Install flutter-tsed framework globally (~/.claude) or locally (this project)? [global/local]: ",
        (answer) => {
          const a = answer.trim().toLowerCase();
          if (a === "global" || a === "g") { rl.close(); resolve("global"); }
          else if (a === "local" || a === "l") { rl.close(); resolve("local"); }
          else if (attempts === 0) { attempts++; ask(); }
          else { rl.close(); reject(new Error("Invalid scope. Use 'global' or 'local'.")); }
        }
      );
    }
    ask();
  });
}
```

- [ ] **Step 2: Write the main `setupClaude` function**

Add to `src/setup-claude.js`:

```javascript
async function setupClaude() {
  const argv = process.argv.slice(3);
  const force = parseForce(argv);
  let scope = parseScope(argv);

  if (!scope) {
    try {
      scope = await promptScope();
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }

  const isGlobal = scope === "global";
  const targetBase = isGlobal
    ? path.join(os.homedir(), ".claude")
    : path.join(process.cwd(), ".claude");

  const settingsPath = path.join(targetBase, "settings.json");
  const namespacedDir = "flutter-tsed";

  const internalDirs = [".claude/agents", ".claude/commands", ".claude/skills"];
  let internalResults;
  try {
    internalResults = copyInternalFiles({ pkgRoot: PKG_ROOT, targetBase, internalDirs, namespacedDir });
  } catch (err) {
    console.error(`[error] Failed to copy internal files: ${err.message}`);
    if (err.code === "EACCES") {
      console.error(`       No write permission to ${targetBase}`);
      if (isGlobal) console.error("       Try: sudo flutter-tsed setup-claude --global");
    }
    process.exit(1);
  }

  const missingSource = internalResults.filter(r => r.action === "missing-source");
  if (missingSource.length > 0) {
    console.error("[error] Source files missing from package:");
    missingSource.forEach(r => console.error(`       ${r.file}`));
    console.error("       Try: npm install -g @boscdev/flutter-tsed-framework");
    process.exit(1);
  }

  const userFacingFiles = ["CLAUDE.md", "PROJECT_CONFIG.md", "MEMORY.md", "BUG_PATTERNS.md", "TEST_SPEC.md", "AGENTS.md"];
  const userResults = copyUserFacingFiles({
    pkgRoot: PKG_ROOT,
    cwd: process.cwd(),
    userFacingFiles,
    force,
  });

  const settingsKeys = isGlobal
    ? {
        customAgentsDirectory: path.join(os.homedir(), ".claude", namespacedDir, "agents"),
        customCommandsDirectory: path.join(os.homedir(), ".claude", namespacedDir, "commands"),
      }
    : {
        customAgentsDirectory: path.join(".claude", namespacedDir, "agents"),
        customCommandsDirectory: path.join(".claude", namespacedDir, "commands"),
      };

  try {
    mergeSettings(settingsPath, settingsKeys);
  } catch (err) {
    console.error(`[error] ${err.message}`);
    process.exit(1);
  }

  printSummary({
    label: `setup-claude (${scope})`,
    internalResults,
    userResults,
    settingsPath,
  });

  console.log("\nDone. Restart Claude Code to pick up the new agents and commands.");
}

module.exports = setupClaude;
```

- [ ] **Step 3: Commit**

```bash
git add src/setup-claude.js
git commit -m "feat: add setup-claude command"
```

---

## Task 4: Implement `src/setup-cursor.js`

**Files:**
- Create: `src/setup-cursor.js`

- [ ] **Step 1: Write `setup-cursor.js`**

Create `src/setup-cursor.js`:

```javascript
const path = require("path");
const os = require("os");
const readline = require("readline");
const { copyInternalFiles, copyUserFacingFiles, mergeSettings, printSummary } = require("./installer");

const PKG_ROOT = path.join(__dirname, "..");

function parseScope(argv) {
  if (argv.includes("--global")) return "global";
  if (argv.includes("--local")) return "local";
  return null;
}

function parseForce(argv) {
  return argv.includes("--force");
}

function promptScope() {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    let attempts = 0;

    function ask() {
      rl.question(
        "? Install flutter-tsed framework globally (~/.cursor) or locally (this project)? [global/local]: ",
        (answer) => {
          const a = answer.trim().toLowerCase();
          if (a === "global" || a === "g") { rl.close(); resolve("global"); }
          else if (a === "local" || a === "l") { rl.close(); resolve("local"); }
          else if (attempts === 0) { attempts++; ask(); }
          else { rl.close(); reject(new Error("Invalid scope. Use 'global' or 'local'.")); }
        }
      );
    }
    ask();
  });
}

async function setupCursor() {
  const argv = process.argv.slice(3);
  const force = parseForce(argv);
  let scope = parseScope(argv);

  if (!scope) {
    try {
      scope = await promptScope();
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }

  const isGlobal = scope === "global";
  const targetBase = isGlobal
    ? path.join(os.homedir(), ".cursor")
    : path.join(process.cwd(), ".cursor");

  const settingsPath = path.join(targetBase, "settings.json");
  const namespacedDir = "flutter-tsed";

  const internalDirs = [".cursor/agents", ".cursor/rules"];
  let internalResults;
  try {
    internalResults = copyInternalFiles({ pkgRoot: PKG_ROOT, targetBase, internalDirs, namespacedDir });
  } catch (err) {
    console.error(`[error] Failed to copy internal files: ${err.message}`);
    if (err.code === "EACCES") {
      console.error(`       No write permission to ${targetBase}`);
      if (isGlobal) console.error("       Try: sudo flutter-tsed setup-cursor --global");
    }
    process.exit(1);
  }

  const missingSource = internalResults.filter(r => r.action === "missing-source");
  if (missingSource.length > 0) {
    console.error("[error] Source files missing from package:");
    missingSource.forEach(r => console.error(`       ${r.file}`));
    console.error("       Try: npm install -g @boscdev/flutter-tsed-framework");
    process.exit(1);
  }

  const userFacingFiles = ["PROJECT_CONFIG.md", "MEMORY.md", "BUG_PATTERNS.md", "TEST_SPEC.md", "AGENTS.md"];
  const userResults = copyUserFacingFiles({
    pkgRoot: PKG_ROOT,
    cwd: process.cwd(),
    userFacingFiles,
    force,
  });

  const settingsKeys = isGlobal
    ? {
        "cursor.agentsDirectory": path.join(os.homedir(), ".cursor", namespacedDir, "agents"),
        "cursor.rulesDirectory": path.join(os.homedir(), ".cursor", namespacedDir, "rules"),
      }
    : {
        "cursor.agentsDirectory": path.join(".cursor", namespacedDir, "agents"),
        "cursor.rulesDirectory": path.join(".cursor", namespacedDir, "rules"),
      };

  try {
    mergeSettings(settingsPath, settingsKeys);
  } catch (err) {
    console.error(`[error] ${err.message}`);
    process.exit(1);
  }

  printSummary({
    label: `setup-cursor (${scope})`,
    internalResults,
    userResults,
    settingsPath,
  });

  console.log("\nDone. Restart Cursor to pick up the new agents and rules.");
}

module.exports = setupCursor;
```

- [ ] **Step 2: Commit**

```bash
git add src/setup-cursor.js
git commit -m "feat: add setup-cursor command"
```

---

## Task 5: Update `bin/flutter-tsed.js` and clean up

**Files:**
- Modify: `bin/flutter-tsed.js`
- Delete: `src/mcp-server.js`
- Delete: `.mcp.json`

- [ ] **Step 1: Update `bin/flutter-tsed.js`**

Replace the entire file with:

```javascript
#!/usr/bin/env node

const path = require("path");

const command = process.argv[2];

const commandHandlers = {
  "setup-claude": () => require(path.join(__dirname, "../src/setup-claude"))(),
  "setup-cursor": () => require(path.join(__dirname, "../src/setup-cursor"))(),
  "sync-rules": () => require(path.join(__dirname, "../src/sync-rules"))(),
  init: () => require(path.join(__dirname, "../src/init"))(),
};

if (!command || command === "-h" || command === "--help") {
  console.log("Usage: flutter-tsed <setup-claude|setup-cursor|sync-rules|init>");
  console.log("");
  console.log("Commands:");
  console.log("  setup-claude [--global|--local] [--force]  Install for Claude Code");
  console.log("  setup-cursor [--global|--local] [--force]  Install for Cursor");
  console.log("  sync-rules                                 Sync framework rules");
  console.log("  init                                       Initialize project");
  process.exit(0);
}

const handler = commandHandlers[command];

if (!handler) {
  console.error(`Unknown command: ${command}`);
  console.error("Use --help to see available commands.");
  process.exit(1);
}

handler();
```

- [ ] **Step 2: Delete `src/mcp-server.js`**

```bash
rm src/mcp-server.js
```

- [ ] **Step 3: Delete `.mcp.json`**

```bash
rm .mcp.json
```

- [ ] **Step 4: Commit**

```bash
git add bin/flutter-tsed.js
git rm src/mcp-server.js .mcp.json
git commit -m "feat: wire setup-claude and setup-cursor into CLI, remove --mcp"
```

---

## Task 6: Update `package.json`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove MCP dependencies and add `.claude/agents` + `.claude/commands` to files**

Edit `package.json` — replace the `dependencies` block and `files` array:

```json
{
  "name": "@boscdev/flutter-tsed-framework",
  "version": "1.1.0",
  "description": "",
  "main": "src/init.js",
  "bin": {
    "flutter-tsed": "bin/flutter-tsed.js"
  },
  "files": [
    "bin",
    "src",
    ".claude/agents",
    ".claude/commands",
    ".claude/skills",
    ".cursor/agents",
    ".cursor/rules",
    "AGENTS.md",
    "CLAUDE.md",
    "PROJECT_CONFIG.md",
    "MEMORY.md",
    "BUG_PATTERNS.md",
    "TEST_SPEC.md"
  ],
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Note: `@modelcontextprotocol/sdk` and `zod` are removed. `jest` added as devDependency for tests. `.cursor/hooks` and `.cursor/commands` removed from `files` (Cursor uses `rules` not `hooks`/`commands`). `.claude/agents` and `.claude/commands` added.

- [ ] **Step 2: Install devDependencies**

```bash
npm install
```

Expected: jest installed, MCP deps removed.

- [ ] **Step 3: Run all tests**

```bash
npx jest --no-coverage
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove MCP deps, add jest, update published files list"
```

---

## Task 7: Update README.md installation instructions

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the Installation section**

Find the `## Installation` section in `README.md` and replace it with:

```markdown
## Installation

Install the package globally:

```bash
npm install -g @boscdev/flutter-tsed-framework
```

Then run the setup command for your IDE:

**Claude Code:**
```bash
flutter-tsed setup-claude
# Prompts: global (~/.claude) or local (this project)?
# --global and --local flags skip the prompt
# --force overwrites existing user-facing files
```

**Cursor:**
```bash
flutter-tsed setup-cursor
# Prompts: global (~/.cursor) or local (this project)?
```

Both commands are idempotent — re-running updates the framework internals without touching files you've edited (like `PROJECT_CONFIG.md` or `MEMORY.md`). To update those too, pass `--force`.

**What gets installed:**
- Framework agents and commands → `~/.claude/flutter-tsed/` (hidden, managed by the framework)
- User-facing config files → your project root (edit these freely)
- `settings.json` → updated with the framework paths (existing keys preserved)
```

- [ ] **Step 2: Remove the old MCP JSON snippet**

Search for and delete any remaining reference to `.cursor/mcp.json` or `--mcp` in README.md.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update installation instructions for setup-claude and setup-cursor"
```

---

## Task 8: Smoke test end-to-end

**Files:** None (verification only)

- [ ] **Step 1: Verify help output**

```bash
node bin/flutter-tsed.js --help
```

Expected:
```
Usage: flutter-tsed <setup-claude|setup-cursor|sync-rules|init>

Commands:
  setup-claude [--global|--local] [--force]  Install for Claude Code
  setup-cursor [--global|--local] [--force]  Install for Cursor
  sync-rules                                 Sync framework rules
  init                                       Initialize project
```

- [ ] **Step 2: Smoke test setup-claude --local in a temp dir**

```bash
mkdir /tmp/test-setup && cd /tmp/test-setup
node /path/to/project/bin/flutter-tsed.js setup-claude --local
```

Expected:
- `.claude/flutter-tsed/agents/` directory exists with agent files
- `.claude/flutter-tsed/commands/` directory exists with command files
- `.claude/settings.json` exists with `customAgentsDirectory` and `customCommandsDirectory` keys
- `PROJECT_CONFIG.md`, `MEMORY.md`, etc. exist in `/tmp/test-setup/`
- Summary printed with `[installed]`, `[copied]`, `[updated]` lines

- [ ] **Step 3: Smoke test idempotency**

```bash
node /path/to/project/bin/flutter-tsed.js setup-claude --local
```

Expected:
- User-facing files show `[skipped]` (already exist)
- Internal files show `[installed]` (always overwritten)
- `settings.json` still valid JSON with keys merged

- [ ] **Step 4: Smoke test setup-cursor --local**

```bash
node /path/to/project/bin/flutter-tsed.js setup-cursor --local
```

Expected:
- `.cursor/flutter-tsed/agents/` and `.cursor/flutter-tsed/rules/` exist
- `.cursor/settings.json` has `cursor.agentsDirectory` and `cursor.rulesDirectory`

- [ ] **Step 5: Final commit if any fixes needed, then done**

```bash
git log --oneline -8
```
