# CLAUDE.md — Root Brain

> Claude Code reads this file FIRST before any task in this repository.

## Framework Identity
This is the **Flutter × Ts.ED Unified Automation Framework** — a benchmark-level, plugin-based development system for building production Flutter apps with Node.js backends.

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
See `.cursor/commands/` for all slash commands.

## Decision Log
See `MEMORY.md` for all architectural decisions and review lessons.
