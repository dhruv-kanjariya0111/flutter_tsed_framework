# Flutter × Ts.ED Framework Plugin

Automation toolkit for building Flutter apps with Ts.ED backends using repeatable commands, quality gates, and project scaffolding.

## What this plugin gives you

- Project bootstrap and structure setup
- Guided feature/backend workflows
- Verification, review, and release helpers
- Accessibility, performance, and API-contract checks

---

## Installation (choose one)

### Option A: MCP (Cursor / Claude Code)

Add this block in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "flutter-tsed": {
      "command": "npx",
      "args": ["@boscdev/flutter-tsed-framework@latest", "--mcp"]
    }
  }
}
```

Then restart Cursor (or reload MCP servers) and verify the server appears in your MCP tools.

### Option B: VS Code Marketplace recommendation

Add this to `.vscode/extensions.json`:

```json
{
  "recommendations": ["boscdev.flutter-tsed-framework"]
}
```

Open the Extensions panel and install the recommended extension.

### Option C: Direct npm (repo-local dependency)

Add in `package.json`:

```json
{
  "devDependencies": {
    "@boscdev/flutter-tsed-framework": "latest"
  }
}
```

Install dependencies:

```bash
npm install
```

---

## Quick start (real usage flow)

1. Open your project root in Cursor/VS Code.
2. Ensure key files exist (or run init): `PROJECT_CONFIG.md`, `MEMORY.md`, `BUG_PATTERNS.md`, `TEST_SPEC.md`.
3. Run **Init project** once.
4. Implement work through feature/backend commands.
5. Run verification commands before PR/merge.

---

## How to use in VS Code

After installing the extension:

1. Open Command Palette (`Cmd+Shift+P` on macOS).
2. Type `Flutter TSed` to discover commands.
3. Start with:
   - `Flutter TSed: Init project`
   - `Flutter TSed: Plan`
   - `Flutter TSed: TDD feature` (or backend variant)
4. Use validation commands as checkpoints.

### Available commands

- `Flutter TSed: Init project`
- `Flutter TSed: TDD feature`
- `Flutter TSed: TDD backend`
- `Flutter TSed: Verify`
- `Flutter TSed: Review`
- `Flutter TSed: Plan`
- `Flutter TSed: Refactor`
- `Flutter TSed: Release`
- `Flutter TSed: Analyze bugs`
- `Flutter TSed: Perf check`
- `Flutter TSed: A11y check`
- `Flutter TSed: Sync contract`
- `Flutter TSed: API design`
- `Flutter TSed: Migrate`
- `Flutter TSed: Store check`
- `Flutter TSed: Explore`
- `Flutter TSed: Offline check`

---

## How to use through MCP

When MCP is enabled, the framework can be invoked from your AI workflow as a tool-backed assistant:

1. Configure `.cursor/mcp.json` with the `flutter-tsed` server.
2. Restart Cursor / reconnect MCP.
3. Open your repo and ask for actions like:
   - "Initialize this Flutter + Ts.ED project"
   - "Run a TDD flow for a new auth feature"
   - "Perform accessibility and performance checks"
   - "Sync OpenAPI contract with app models"

---

## Recommended workflow

1. `Init` once per repository.
2. `Plan` before large changes.
3. `TDD feature` / `TDD backend` for implementation.
4. `Analyze bugs` to keep regression specs current.
5. `Verify` + `Review` before merge.
6. `Release` when shipping.

---

## Troubleshooting

- Plugin commands not showing:
  - Confirm extension is installed/enabled
  - Reload window (`Cmd+Shift+P` -> `Developer: Reload Window`)
- MCP server not available:
  - Validate `.cursor/mcp.json` JSON syntax
  - Ensure `npx` is available in your shell
  - Restart Cursor after config changes
- Command fails unexpectedly:
  - Re-run from workspace root
  - Check terminal output for missing toolchain (Flutter, Node, npm, etc.)

---

## Notes

- Use `@boscdev/flutter-tsed-framework` and `boscdev.flutter-tsed-framework` for published package and extension IDs.
- Prefer committing shared setup files (`.vscode/extensions.json`, project docs) so teams get a consistent workflow.
