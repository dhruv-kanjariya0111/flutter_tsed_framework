# Claude ↔ Cursor Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `.claude/` to full feature parity with `.cursor/` — rules, hooks, commands, and agents.

**Architecture:** Four independent work streams: (1) port 17 Cursor rules to `.claude/rules/` and wire them into `CLAUDE.md`; (2) create `.claude/settings.json` mapping all Cursor hook events to Claude Code hook format; (3) replace 10 stub commands and add 3 missing commands in `.claude/commands/`; (4) add the missing `node-backend-coder` agent.

**Tech Stack:** Markdown files, JSON (Claude Code settings), Bash hook scripts (already exist in `.cursor/hooks/`, just need wiring)

---

## File Map

| Action | File |
|--------|------|
| Create | `.claude/rules/000-critical-context.md` through `900-feature-flags.md` (17 files) |
| Modify | `CLAUDE.md` — add `@`-references + fix command path |
| Create | `.claude/settings.json` |
| Modify | `.claude/commands/analyze-bugs.md` |
| Modify | `.claude/commands/api-design.md` |
| Modify | `.claude/commands/migrate.md` |
| Modify | `.claude/commands/plan.md` |
| Modify | `.claude/commands/release.md` |
| Modify | `.claude/commands/review.md` |
| Modify | `.claude/commands/sync-contract.md` |
| Modify | `.claude/commands/tdd-backend.md` |
| Modify | `.claude/commands/tdd.md` |
| Modify | `.claude/commands/verify.md` |
| Create | `.claude/commands/env.md` |
| Create | `.claude/commands/fix.md` |
| Create | `.claude/commands/git-branch.md` |
| Create | `.claude/agents/node-backend-coder.md` |

---

## Task 1: Port all 17 Cursor rules to `.claude/rules/`

**Files:** Create `.claude/rules/*.md` (17 files — content identical to `.cursor/rules/*.mdc` but without frontmatter)

- [ ] **Step 1: Create `000-critical-context.md`**

```markdown
# Critical Context — Read Before Any Task

## Mandatory Pre-Task Steps
1. Read PROJECT_CONFIG.md (architecture, stateManagement, backendType, feature toggles)
2. Read MEMORY.md (past decisions + reviewer lessons)
3. Read BUG_PATTERNS.md (all known failure modes)
4. Read TEST_SPEC.md (coverage obligations)

## Non-Negotiable Code Rules
- Frontend imports: package:frontend/... only. Never relative across features.
- All errors: sealed Failure hierarchy. UI never receives raw HTTP errors or exceptions.
- Colors, spacing, typography: theme extension tokens ONLY. No hardcoded values.
- Interactivity: every interactive widget carries Semantics(identifier, label, hint).
- Lists: ListView.builder or Sliver widgets. Never children:[] for dynamic content.
- Images: CachedNetworkImage with placeholder AND errorWidget. Always.
- State: no setState() in screen widgets. Providers/notifiers only.
- Secrets: FlutterSecureStorage only. Never SharedPreferences for sensitive data.

## Definition of Done
Frontend:
  dart format --set-exit-if-changed .
  flutter analyze --fatal-infos
  flutter test --coverage (>=85% line coverage)
  /a11y-check PASS
  /perf-check PASS

Backend:
  npm run lint (zero warnings, zero errors)
  npm run test (all pass)
  npm run test:contract (openapi.yaml <-> models in sync)

## Backend Pre-Implementation
- Always read shared/openapi.yaml before writing any endpoint.
- Update openapi.yaml FIRST, then implement.
- Never expose raw Prisma entities in API responses.
```

- [ ] **Step 2: Create remaining 16 rule files** (content identical to corresponding `.cursor/rules/*.mdc` minus the frontmatter block)

Files to create:
- `.claude/rules/100-architecture.md`
- `.claude/rules/200-state-management.md`
- `.claude/rules/350-tsed-backend.md`
- `.claude/rules/400-domain-patterns.md`
- `.claude/rules/500-design-system.md`
- `.claude/rules/550-gestures.md`
- `.claude/rules/560-performance.md`
- `.claude/rules/565-a11y.md`
- `.claude/rules/570-i18n.md`
- `.claude/rules/600-routing.md`
- `.claude/rules/650-env-security.md`
- `.claude/rules/700-testing.md`
- `.claude/rules/750-store-compliance.md`
- `.claude/rules/800-dart-quality.md`
- `.claude/rules/850-offline-first.md`
- `.claude/rules/900-feature-flags.md`

---

## Task 2: Update `CLAUDE.md` to wire in rules + fix command path

**Files:** Modify `CLAUDE.md`

- [ ] **Step 1: Add `@`-imports for the 5 always-apply rules and fix the command reference**

Replace the existing `CLAUDE.md` with:

```markdown
# CLAUDE.md — Root Brain

> Claude Code reads this file FIRST before any task in this repository.

## Framework Identity
This is the **Flutter × Ts.ED Unified Automation Framework** — a benchmark-level, plugin-based development system for building production Flutter apps with Node.js backends.

## Always-Active Rules (loaded for every task)
@.claude/rules/000-critical-context.md
@.claude/rules/560-performance.md
@.claude/rules/565-a11y.md
@.claude/rules/650-env-security.md
@.claude/rules/800-dart-quality.md

## Context-Specific Rules (read when working in these areas)
| Area | Rule file |
|------|-----------|
| Frontend architecture | `.claude/rules/100-architecture.md` |
| State management | `.claude/rules/200-state-management.md` |
| Ts.ED backend | `.claude/rules/350-tsed-backend.md` |
| Domain modeling | `.claude/rules/400-domain-patterns.md` |
| UI / design system | `.claude/rules/500-design-system.md` |
| Gestures | `.claude/rules/550-gestures.md` |
| i18n | `.claude/rules/570-i18n.md` |
| Routing | `.claude/rules/600-routing.md` |
| Testing | `.claude/rules/700-testing.md` |
| Store compliance | `.claude/rules/750-store-compliance.md` |
| Offline-first | `.claude/rules/850-offline-first.md` |
| Feature flags | `.claude/rules/900-feature-flags.md` |

## Mandatory Pre-Task Checklist
Before ANY work, Claude Code MUST:
1. Read `PROJECT_CONFIG.md` — understand the stack, architecture, and all enabled features
2. Read `MEMORY.md` — understand past decisions and review lessons
3. Read `BUG_PATTERNS.md` — know all known failure modes
4. Check `TEST_SPEC.md` — understand existing test coverage obligations

## Quality Gates (ALL must pass before any task is "done")
```
Frontend:
  dart format --set-exit-if-changed frontend/
  flutter analyze --fatal-infos frontend/
  flutter test --coverage frontend/
  Coverage ≥ 85% line coverage

Backend:
  npm run lint (zero warnings)
  npm run test (all pass)
  npm run test:load (p95 < 500ms)

Contract:
  /verify-contract (Flutter models ↔ openapi.yaml)

Accessibility:
  /a11y-check (WCAG AA compliance)

Performance:
  APK size ≤ 25MB delta, startup < 2s
```

## Architecture Principles (Never Violate)
- Feature-first clean architecture. No cross-feature imports.
- Domain layer is pure Dart — no Flutter, no HTTP, no DB.
- All errors are sealed `Failure` types. UI never sees raw exceptions.
- All secrets in `FlutterSecureStorage`. Never `SharedPreferences` for sensitive data.
- All colours, typography, spacing from theme tokens. Never hardcoded.
- Every interactive widget has `Semantics(identifier:..., label:...)`.
- All list views use `ListView.builder` or Slivers. Never `children:[]` dynamic.

## Agent Registry
See `AGENTS.md` for full agent definitions and delegation rules.

## Command Reference
See `.claude/commands/` for all slash commands.

## Decision Log
See `MEMORY.md` for all architectural decisions and review lessons.
```

---

## Task 3: Create `.claude/settings.json` with all hooks

**Files:** Create `.claude/settings.json`

- [ ] **Step 1: Create settings.json mapping all 4 Cursor hook events to Claude Code format**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash .cursor/hooks/command-safety.sh \"$CLAUDE_TOOL_INPUT_COMMAND\""
          }
        ]
      },
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "bash .cursor/hooks/secret-guard.sh \"$CLAUDE_TOOL_INPUT_FILE_PATH\""
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash .cursor/hooks/dart-format.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          },
          {
            "type": "command",
            "command": "bash .cursor/hooks/backend-format.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          },
          {
            "type": "command",
            "command": "bash .cursor/hooks/tdd-enforce.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          },
          {
            "type": "command",
            "command": "bash .cursor/hooks/log-changes.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          },
          {
            "type": "command",
            "command": "bash .cursor/hooks/store-asset-check.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          },
          {
            "type": "command",
            "command": "bash .cursor/hooks/a11y-lint.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          },
          {
            "type": "command",
            "command": "bash .cursor/hooks/perf-budget.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash .cursor/hooks/dart-format.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          },
          {
            "type": "command",
            "command": "bash .cursor/hooks/backend-format.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          },
          {
            "type": "command",
            "command": "bash .cursor/hooks/tdd-enforce.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          },
          {
            "type": "command",
            "command": "bash .cursor/hooks/log-changes.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          },
          {
            "type": "command",
            "command": "bash .cursor/hooks/store-asset-check.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          },
          {
            "type": "command",
            "command": "bash .cursor/hooks/a11y-lint.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          },
          {
            "type": "command",
            "command": "bash .cursor/hooks/perf-budget.sh \"$CLAUDE_TOOL_RESULT_FILE_PATH\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .cursor/hooks/notify.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Task 4: Replace 10 stub commands with full content from `.cursor/commands/`

**Files:** Modify `.claude/commands/` — 10 files

- [ ] **Step 1: Replace `analyze-bugs.md`** — copy full content from `.cursor/commands/analyze-bugs.md`
- [ ] **Step 2: Replace `api-design.md`** — copy full content from `.cursor/commands/api-design.md`
- [ ] **Step 3: Replace `migrate.md`** — copy full content from `.cursor/commands/migrate.md`
- [ ] **Step 4: Replace `plan.md`** — copy full content from `.cursor/commands/plan.md`
- [ ] **Step 5: Replace `release.md`** — copy full content from `.cursor/commands/release.md`
- [ ] **Step 6: Replace `review.md`** — copy full content from `.cursor/commands/review.md`
- [ ] **Step 7: Replace `sync-contract.md`** — copy full content from `.cursor/commands/sync-contract.md`
- [ ] **Step 8: Replace `tdd-backend.md`** — copy full content from `.cursor/commands/tdd-backend.md`
- [ ] **Step 9: Replace `tdd.md`** — copy full content from `.cursor/commands/tdd.md`
- [ ] **Step 10: Replace `verify.md`** — copy full content from `.cursor/commands/verify.md`

---

## Task 5: Add 3 missing commands

**Files:** Create `.claude/commands/env.md`, `fix.md`, `git-branch.md`

- [ ] **Step 1: Create `env.md`** — copy full content from `.cursor/commands/env.md`
- [ ] **Step 2: Create `fix.md`** — copy full content from `.cursor/commands/fix.md`
- [ ] **Step 3: Create `git-branch.md`** — copy full content from `.cursor/commands/git-branch.md`

---

## Task 6: Add missing `node-backend-coder` agent

**Files:** Create `.claude/agents/node-backend-coder.md`

- [ ] **Step 1: Create `node-backend-coder.md`** — copy full content from `.cursor/agents/node-backend-coder.md`

---

## Verification

- [ ] Count `.claude/rules/`: should be 17 files
- [ ] Count `.claude/commands/`: should be 23 files (was 20, +3 new)
- [ ] Count `.claude/agents/`: should be 12 files (was 11, +1 new)
- [ ] `.claude/settings.json` exists and is valid JSON: `python3 -c "import json; json.load(open('.claude/settings.json'))"`
- [ ] `CLAUDE.md` references `.claude/commands/` (not `.cursor/commands/`)
- [ ] `CLAUDE.md` has 5 `@.claude/rules/` import lines
