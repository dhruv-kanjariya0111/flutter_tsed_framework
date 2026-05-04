# AGENTS.md — Agent Registry

## Orchestrator
**File**: `.cursor/agents/orchestrator.md`
**Trigger**: `/plan`, `/tdd` phase 1
**Role**: Reads PROJECT_CONFIG, MEMORY, BUG_PATTERNS → produces wave-ordered plans with risk flags. Never writes production code. Max 3 retries before human escalation.

## Flutter Coder
**File**: `.cursor/agents/flutter-coder.md`
**Trigger**: `/tdd` phase 3, `/code`
**Role**: Implements Flutter features. Order: domain → data → presentation. Runs build_runner + format + analyze before done.

## Ts.ED Backend Coder
**File**: `.cursor/agents/tsed-backend-coder.md`
**Trigger**: `/tdd-backend` phase 3
**Role**: Implements Ts.ED modules. Order: DTO → Entity → Service → Controller → Module. Checks openapi.yaml first.

## API Designer
**File**: `.cursor/agents/api-designer.md`
**Trigger**: `/api-design`
**Role**: Designs OpenAPI 3.0 contracts in `shared/openapi.yaml`. Waits for approval before any implementation.

## Tester
**File**: `.cursor/agents/tester.md`
**Trigger**: `/tdd` phase 2, `/tdd-backend` phase 2
**Role**: Writes failing tests first (RED). Reads TEST_SPEC.md. Reports coverage %.

## Test Spec Generator
**File**: `.cursor/agents/test-spec-generator.md`
**Trigger**: `/analyze-bugs`
**Role**: Reads BUG_PATTERNS.md → generates TEST_SPEC.md with regression test specs.

## Reviewer
**File**: `.cursor/agents/reviewer.md`
**Trigger**: `/review`
**Role**: 8-dimension Flutter + backend + contract + a11y + perf review. Verdict: APPROVE | WARN | FAIL. Writes lessons to MEMORY.md.

## Migrator
**File**: `.cursor/agents/migrator.md`
**Trigger**: `/migrate`
**Role**: Reference-first migration. Opens source → extracts intent → writes idiomatic Flutter.

## Refactor Agent
**File**: `.cursor/agents/refactor.md`
**Trigger**: `/refactor`
**Role**: Behavior-neutral cleanup. Tests must pass before AND after every change.

## Analytics Agent
**File**: `.cursor/agents/analytics-agent.md`
**Trigger**: `/tdd` post-implementation
**Role**: Ensures every feature has tracked events defined in the analytics schema.

## Release Agent
**File**: `.cursor/agents/release-agent.md`
**Trigger**: `/release`
**Role**: Bumps semver, generates CHANGELOG.md from Conventional Commits, tags git, triggers Codemagic production workflow.

## Node Backend Coder
**File**: `.cursor/agents/node-backend-coder.md`
**Trigger**: `/tdd-backend` when `backendFramework: node` in PROJECT_CONFIG.md
**Role**: Implements plain Node.js (Express/Fastify) backend modules. Uses zod/joi validation, middleware pattern, no decorators. Environment-aware via `process.env`.

---

## Command Reference (all commands)
| Command | Purpose |
|---|---|
| `/init` | Project setup wizard (new / existing / migrating / mid-project) |
| `/plan <feature>` | Wave-ordered feature plan with web research |
| `/api-design <feature>` | OpenAPI contract design (tsed/node only) |
| `/tdd <feature>` | Full Flutter TDD cycle |
| `/tdd-backend <feature>` | Full backend TDD cycle (branched by backendFramework) |
| `/fix <description>` | Research + fix a bug with failing test first |
| `/integrate <service>` | Add a 3rd-party service with manual step guidance |
| `/migrate <target>` | Platform migration (absorbs analyze-source as Phase 0) |
| `/analyze-source <path>` | Migration source analysis alias |
| `/refactor <module>` | Behavior-neutral cleanup |
| `/verify` | All quality gates (flags: --flutter-only, --backend-only, --pre-release) |
| `/review <feature>` | 8-dimension code review |
| `/sync-contract` | Flutter models ↔ openapi.yaml alignment |
| `/analyze-bugs` | Regenerate TEST_SPEC.md from BUG_PATTERNS with test-type tags |
| `/explore <question>` | Read-only codebase Q&A |
| `/a11y-check` | WCAG AA accessibility audit |
| `/perf-check` | Performance budget check |
| `/offline-check` | Offline-first audit (when offlineFirst: true) |
| `/store-check` | App Store + Play Store compliance |
| `/release <type>` | Semantic versioning + CHANGELOG + CI trigger |
| `/git-branch` | GitHub branching strategy manager (Gitflow) |
| `/env` | Dev/prod environment file manager |
