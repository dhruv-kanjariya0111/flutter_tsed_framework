# AGENTS.md — Agent Registry

## Orchestrator
**File**: `.claude/agents/orchestrator.md` / `.cursor/agents/orchestrator.md`
**Trigger**: `/plan`, `/tdd` phase 1
**Role**: Reads PROJECT_CONFIG, MEMORY, BUG_PATTERNS → produces wave-ordered plans with risk flags. Never writes production code. Max 3 retries before human escalation.

## Flutter Coder
**File**: `.claude/agents/flutter-coder.md` / `.cursor/agents/flutter-coder.md`
**Trigger**: `/tdd` phase 3, `/fix`
**Role**: Implements Flutter features. Order: domain → data → presentation. Runs build_runner + format + analyze before done.

## Ts.ED Backend Coder
**File**: `.claude/agents/tsed-backend-coder.md` / `.cursor/agents/tsed-backend-coder.md`
**Trigger**: `/tdd-backend` phase 3 (when backendFramework: tsed)
**Role**: Implements Ts.ED modules. Order: DTO → Entity → Service → Controller → Module. Checks openapi.yaml first.

## Node Backend Coder
**File**: `.claude/agents/node-backend-coder.md` / `.cursor/agents/node-backend-coder.md`
**Trigger**: `/tdd-backend` phase 3 (when backendFramework: node)
**Role**: Implements plain Node.js (Express/Fastify) modules. Zod/Joi validation, middleware pattern, no decorators.

## API Designer
**File**: `.claude/agents/api-designer.md` / `.cursor/agents/api-designer.md`
**Trigger**: `/api-design`
**Role**: Designs OpenAPI 3.0 contracts in `shared/openapi.yaml`. Waits for approval before any implementation.

## Tester
**File**: `.claude/agents/tester.md` / `.cursor/agents/tester.md`
**Trigger**: `/tdd` phase 2, `/tdd-backend` phase 2
**Role**: Writes failing tests first (RED). Reads TEST_SPEC.md. Reports coverage %. Uses Patrol for integration tests.

## Reviewer
**File**: `.claude/agents/reviewer.md` / `.cursor/agents/reviewer.md`
**Trigger**: `/review`
**Role**: 8-dimension Flutter + backend + contract + a11y + perf review. Verdict: APPROVE | WARN | FAIL. Writes lessons to MEMORY.md. Auto-syncs BUG_PATTERNS → TEST_SPEC after review.

## Migrator
**File**: `.claude/agents/migrator.md` / `.cursor/agents/migrator.md`
**Trigger**: `/migrate`
**Role**: Reference-first migration. Phase 0 scans source → MIGRATION_MAP.md. Then wave-by-wave Flutter reimplementation.

## Refactor Agent
**File**: `.claude/agents/refactor.md` / `.cursor/agents/refactor.md`
**Trigger**: `/refactor`
**Role**: Behavior-neutral cleanup. Tests must pass before AND after every change.

## Analytics Agent
**File**: `.claude/agents/analytics-agent.md` / `.cursor/agents/analytics-agent.md`
**Trigger**: `/tdd` post-implementation
**Role**: Ensures every feature has tracked events defined in the analytics schema.

## Release Agent
**File**: `.claude/agents/release-agent.md` / `.cursor/agents/release-agent.md`
**Trigger**: `/release`
**Role**: Bumps semver, generates CHANGELOG.md from Conventional Commits, tags git, triggers Codemagic production workflow.

## Test Spec Generator
**File**: `.claude/agents/test-spec-generator.md` / `.cursor/agents/test-spec-generator.md`
**Trigger**: `/review` post-review sync (automatic)
**Role**: Reads BUG_PATTERNS.md → generates/updates TEST_SPEC.md with regression specs. No longer a standalone command — runs automatically after each review session.

---

## Command Reference (14 commands)

| Command | Purpose |
|---|---|
| `/init` | Project setup wizard — accepts PRD, fills PROJECT_CONFIG, scaffolds structure |
| `/plan <feature>` | Wave-ordered feature plan with web research |
| `/api-design <feature>` | OpenAPI contract design (tsed/node only) — always before implementation |
| `/tdd <feature>` | Full Flutter TDD cycle (plan → RED → GREEN → verify → review) |
| `/tdd-backend <feature>` | Full backend TDD cycle (branched by backendFramework) |
| `/fix <description>` | Research + failing test first + minimal fix |
| `/integrate <service>` | Add 3rd-party service with manual step guidance |
| `/jira fetch\|start\|done <id>` | Jira ticket management: fetch details, start work, mark done |
| `/migrate <target>` | Platform migration — Phase 0 auto-analyzes source, then wave-by-wave |
| `/refactor <module>` | Behavior-neutral code cleanup |
| `/verify` | All quality gates — flags: --flutter-only, --backend-only, --pre-release, --a11y, --perf, --contract |
| `/review <feature>` | 8-dimension code review — auto-syncs BUG_PATTERNS → TEST_SPEC after each session |
| `/release <type>` | Semantic versioning + CHANGELOG + CI trigger |
| `/ops` | Project operations hub — git branching (new/finish/status) + env file management |

### /verify flag reference
| Flag | What runs |
|---|---|
| (none) | All applicable gates for current PROJECT_CONFIG |
| `--flutter-only` | Flutter format + analyze + test only |
| `--backend-only` | Backend lint + test + openapi validate only |
| `--pre-release` | Flutter + a11y + perf + store compliance |
| `--a11y` | Accessibility audit only |
| `--perf` | Performance budget only |
| `--contract` | API contract sync only |

### /ops sub-command reference
| Sub-command | What it does |
|---|---|
| `git new feat\|fix\|hotfix\|release <name>` | Create branch from correct base |
| `git finish feat\|fix\|hotfix\|release <name>` | Merge to correct target(s) + delete |
| `git status` | All branches, age, stale list |
| `env init` | Create env files from .env.example |
| `env diff` | Compare dev vs prod keys |
| `env add <KEY> <env>` | Add key + placeholder |
| `env validate` | Check all required keys present |
| `env check-secrets` | Scan staged files for leaked secrets |
