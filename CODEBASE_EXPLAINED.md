# Codebase Explained — Flutter × Ts.ED Framework

> End-to-end guide: every file, its purpose, and how it all connects.

---

## What This Project Is

An **npm-publishable AI automation framework** (`@boscdev/flutter-tsed-framework`) that scaffolds and governs full-stack mobile projects built with Flutter (frontend) + Ts.ED/Node.js (backend). It is not a running app — it is a **toolkit** that you install into a project and it brings opinionated structure, AI agents, slash commands, and quality gates.

---

## Repository Layout

```
root/
├── bin/flutter-tsed.js         ← CLI entry point
├── src/
│   ├── init.js                 ← init command stub
│   ├── mcp-server.js           ← MCP server (exposes commands to AI)
│   └── sync-rules.js           ← symlinks framework rules into user project
├── frontend/                   ← Flutter app scaffold
├── backend/                    ← Ts.ED Node.js API scaffold
├── shared/openapi.yaml         ← Single API contract (source of truth)
├── .cursor/
│   ├── commands/               ← Slash commands (/.plan, /tdd, /verify…)
│   ├── agents/                 ← AI agent role definitions
│   ├── hooks/                  ← Shell hooks (auto-run on file save / commit)
│   ├── rules/                  ← Cursor MDC rules (AI guardrails per domain)
│   └── plans/                  ← Saved implementation plans
├── .claude/skills/             ← Claude Code skill files (same commands, CC format)
├── .github/                    ← GitHub Actions CI/CD workflows
├── scripts/                    ← Build & deployment helper scripts
├── package.json                ← npm package definition
├── codemagic.yaml              ← Mobile CI/CD (Codemagic)
├── lefthook.yml                ← Git hook runner config
├── CLAUDE.md                   ← Claude Code reads this first — project brain
├── AGENTS.md                   ← Agent registry & delegation rules
├── PROJECT_CONFIG.md           ← All project-level configuration flags
├── MEMORY.md                   ← Architectural decisions & review lessons
├── BUG_PATTERNS.md             ← Known failure modes (input to test generation)
└── TEST_SPEC.md                ← Generated test specifications
```

---

## File-by-File Reference

### Package Entry Points

| File | Purpose |
|------|---------|
| `package.json` | Declares the npm package `@boscdev/flutter-tsed-framework`. Sets `bin.flutter-tsed → bin/flutter-tsed.js` and `main → src/init.js`. Lists what gets published (`files` array). |
| `bin/flutter-tsed.js` | CLI binary. When you run `npx flutter-tsed <cmd>`, execution starts here. Routes to the right handler in `src/`. |
| `src/init.js` | Stub for the `init` command. Logs that the full flow is documented in `.cursor/commands/init.md`. The real init logic lives in AI command docs, not code. |
| `src/mcp-server.js` | **MCP (Model Context Protocol) server**. Reads every `.md` file in `.cursor/commands/`, registers each as a tool that AI assistants can call. Resolves the commands dir via `FLUTTER_TSED_COMMANDS_DIR` env var or falls back to `./cursor/commands`. |
| `src/sync-rules.js` | Symlinks the framework's `.cursor/rules/*.mdc` files into a user's project so they inherit all AI guardrails without copying files manually. Handles already-existing symlinks gracefully. |

---

### The MCP Bridge (`src/mcp-server.js` in detail)

This is the glue between the framework docs and AI tools:

```
.cursor/commands/*.md  ←── mcp-server.js reads all these
                            ↓
                      MCP Tool registry
                            ↓
                 AI assistant calls tool by name
                            ↓
                 Returns .md content as instructions
                            ↓
                 AI follows those instructions
```

Each command `.md` file becomes an MCP tool automatically — no code change needed to add new commands.

---

### Slash Commands (`.cursor/commands/`)

Each `.md` file is both human-readable documentation and an AI tool payload.

| Command | What it does |
|---------|-------------|
| `init.md` | Project initialization wizard — sets up folder structure, fills `PROJECT_CONFIG.md` |
| `plan.md` | Feature planning — delegates to Orchestrator agent, produces wave-ordered plan |
| `tdd.md` | Full TDD cycle for Flutter features (RED → GREEN → REFACTOR) |
| `tdd-backend.md` | Same TDD cycle for Ts.ED backend modules |
| `api-design.md` | Designs OpenAPI contract in `shared/openapi.yaml` before any code is written |
| `verify.md` | Full quality gate — runs lint, tests, coverage, contract check, a11y |
| `review.md` | 8-dimension code review (architecture, security, performance, a11y, etc.) |
| `release.md` | Semantic versioning, CHANGELOG generation, git tag, Codemagic trigger |
| `refactor.md` | Behavior-neutral cleanup — one focus area per session |
| `sync-contract.md` | Syncs `openapi.yaml` ↔ Flutter Freezed models |
| `analyze-bugs.md` | Reads `BUG_PATTERNS.md`, updates `TEST_SPEC.md` |
| `a11y-check.md` | WCAG AA compliance audit |
| `perf-check.md` | Performance budget check (APK size, startup time, frame rate) |
| `store-check.md` | App Store / Google Play submission compliance |
| `migrate.md` | Migrates React/RN/Android/iOS codebase to Flutter |
| `explore.md` | Read-only codebase Q&A |
| `env.md` | Environment variable management |
| `git-branch.md` | Gitflow branch creation helper |
| `fix.md` | Systematic debugging workflow |
| `integrate.md` | Feature integration guide |
| `offline-check.md` | Offline-first architecture audit |
| `analyze-source.md` | Migration source analysis |

---

### AI Agents (`.cursor/agents/`)

Agents are specialized AI roles. The **Orchestrator** delegates to the others.

| Agent | Role |
|-------|------|
| `orchestrator.md` | Plans feature work across 7 waves, assigns to other agents. Never writes code. |
| `flutter-coder.md` | Implements Flutter features (domain, data, presentation layers) |
| `tsed-backend-coder.md` | Implements Ts.ED backend modules (DTO, service, controller, Prisma) |
| `api-designer.md` | Designs OpenAPI contracts — runs BEFORE any implementation |
| `tester.md` | Writes tests FIRST (RED phase), verifies GREEN after implementation |
| `reviewer.md` | 8-dimension code review, appends lessons to `MEMORY.md` |
| `analytics-agent.md` | Ensures every feature has analytics event coverage |
| `refactor.md` | Behavior-neutral code cleanup |
| `release-agent.md` | Automates versioning and changelog |
| `test-spec-generator.md` | Generates `TEST_SPEC.md` from `BUG_PATTERNS.md` |
| `migrator.md` | Migrates existing apps to Flutter |
| `node-backend-coder.md` | Generic Node.js backend tasks |

---

### Cursor Rules (`.cursor/rules/`)

MDC rules are **always-on AI constraints** — they govern what code is allowed to look like.

| Rule file | Governs |
|-----------|---------|
| `000-critical-context.mdc` | First read — points AI to CLAUDE.md, MEMORY.md, BUG_PATTERNS.md |
| `100-architecture.mdc` | Feature-first clean architecture, no cross-feature imports |
| `200-state-management.mdc` | Riverpod patterns, provider naming, state lifecycle |
| `350-tsed-backend.mdc` | Ts.ED controller/service/DTO patterns |
| `400-domain-patterns.mdc` | Entities, value objects, `Failure` sealed types |
| `500-design-system.mdc` | Design tokens only — no hardcoded colors/spacing |
| `550-gestures.mdc` | Custom gesture registry rules |
| `560-performance.mdc` | ListView.builder, const constructors, build method rules |
| `565-a11y.mdc` | Semantics identifiers on every interactive widget |
| `570-i18n.mdc` | ARB files, flutter_localizations, no hardcoded strings |
| `600-routing.mdc` | GoRouter patterns, route guards |
| `650-env-security.mdc` | No secrets in code, FlutterSecureStorage only |
| `700-testing.mdc` | TDD enforcement, mocktail patterns, coverage targets |
| `750-store-compliance.mdc` | App store metadata, permissions, privacy rules |
| `800-dart-quality.mdc` | Dart style, analysis_options strictness |
| `850-offline-first.mdc` | Hive/Drift patterns (when offlineFirst: true) |
| `900-feature-flags.mdc` | Firebase Remote Config integration rules |

---

### Shell Hooks (`.cursor/hooks/`)

Auto-run by Cursor IDE on file save or on AI code generation.

| Hook | Trigger |
|------|---------|
| `dart-format.sh` | After any `.dart` file change — runs `dart format` |
| `backend-format.sh` | After any `.ts` file change — runs ESLint + Prettier |
| `a11y-lint.sh` | After any widget file change — checks Semantics presence |
| `perf-budget.sh` | After build — checks APK size and startup metrics |
| `secret-guard.sh` | Before commit — blocks hardcoded secrets/keys |
| `tdd-enforce.sh` | Before new feature code — checks test file exists first |
| `store-asset-check.sh` | Before release — validates icons, screenshots, metadata |
| `log-changes.sh` | After any change — appends to change log |
| `notify.sh` | On completion — desktop notification |
| `command-safety.sh` | Before any destructive command — confirmation gate |
| `hooks.json` | Declares which hook runs on which Cursor event |

---

### Documentation Files (root)

| File | Purpose |
|------|---------|
| `CLAUDE.md` | **Root brain** — Claude reads this first. Mandatory checklist, quality gates, architecture principles. |
| `PROJECT_CONFIG.md` | All project flags (stack, auth strategy, platforms, CI, features). Fill during `/init`. |
| `MEMORY.md` | Architectural decisions and lessons from past reviews. AI appends here after every review. |
| `AGENTS.md` | Agent registry — who does what, when to delegate to which agent. |
| `BUG_PATTERNS.md` | Known failure modes with descriptions. Input to test spec generation. |
| `TEST_SPEC.md` | Generated Given/When/Then test specs derived from `BUG_PATTERNS.md`. |
| `CHANGELOG.md` | Auto-generated by `/release` command. |
| `README.md` | Public-facing framework overview and quick-start guide. |

---

### CI/CD & Git Tooling

| File | Purpose |
|------|---------|
| `codemagic.yaml` | Codemagic CI/CD pipelines — Flutter build, sign, and deploy to App Store / Play Store |
| `lefthook.yml` | Git hook runner — pre-commit runs lint + type-check; pre-push runs tests |
| `.github/` | GitHub Actions workflows for backend CI (lint, test, contract validation) |
| `.gitignore` | Excludes `.env.*`, build artifacts, node_modules, `.dart_tool` |
| `.claudeignore` | Files Claude Code should not read (generated files, secrets) |

---

### Frontend Scaffold (`frontend/`)

Follows **feature-first clean architecture**:

```
frontend/lib/src/
├── core/
│   ├── config/        AppConfig — loads .env.{flavor}, exposes apiBaseUrl
│   ├── di/            Riverpod providers (DI container for entire app)
│   ├── network/       Dio client + AuthInterceptor + SslPinningInterceptor
│   ├── storage/       SecureStorage wrapper (flutter_secure_storage)
│   ├── theme/         AppColors, AppSpacing, AppTheme (design tokens)
│   ├── error/         Failure sealed types (NetworkFailure, ServerFailure…)
│   ├── analytics/     AnalyticsService → Firebase Analytics
│   ├── i18n/          Localization (ARB files + generated l10n.dart)
│   ├── features/      Feature flag service → Firebase Remote Config
│   └── gestures/      Custom gesture registry
└── features/
    └── auth/          Example feature module
        ├── data/      UserDto, AuthRepositoryImpl, mappers
        ├── domain/    UserEntity, AuthRepository interface, Failure types
        └── presentation/ AuthNotifier (Riverpod), LoginScreen, widgets
```

**Layer rules:** `data` depends on `domain`; `presentation` depends on `domain`. Nothing crosses feature boundaries.

---

### Backend Scaffold (`backend/`)

Ts.ED framework on Express + Prisma + PostgreSQL:

```
backend/src/
├── Server.ts          @Configuration — mounts routes, applies middleware, sets up Swagger
├── index.ts           Creates PlatformApplication and starts the server
├── config/env.ts      Loads .env.{NODE_ENV}, validates required vars, exports config
├── middlewares/
│   ├── auth.middleware.ts       JWT validation, extracts user context
│   └── rate-limit.middleware.ts Per-endpoint rate limits
└── modules/
    └── auth/
        ├── controllers/         @Controller — HTTP route handlers
        ├── services/            Business logic, Prisma queries
        ├── dto/                 CreateAuthDto, AuthResponseDto (validated with class-validator)
        └── guards/              JWT guards for protected routes
```

---

### Shared Contract (`shared/openapi.yaml`)

The **single source of truth** for the API. Both sides consume it:

- **Backend**: Swagger UI auto-generated at `/api/docs`
- **Frontend**: Code generation via `openapi-generator` → Dart DTOs + `freezed` models
- **CI**: Spectral linting validates schema on every PR

---

## How Everything Connects

### Installation Flow

```
npm install -g @boscdev/flutter-tsed-framework
     ↓
flutter-tsed init (bin/flutter-tsed.js → src/init.js)
     ↓
Copies frontend/ backend/ shared/ scaffolds into user project
     ↓
sync-rules.js symlinks .cursor/rules/ into user project
     ↓
User runs AI assistant (Cursor / Claude Code)
     ↓
mcp-server.js starts → registers all commands/ as MCP tools
```

### Feature Development Flow

```
Developer types: /plan login-with-google
     ↓
MCP server serves plan.md instructions
     ↓
Orchestrator agent reads them → delegates across 7 waves:
  Wave 1: api-designer → openapi.yaml contract
  Wave 2: tsed-backend-coder → DTO, service, controller
  Wave 3: flutter-coder → domain, data, presentation layers
  Wave 4: tester → unit + widget + contract tests
  Wave 5: analytics-agent → AnalyticsService.track() calls
  Wave 6: reviewer → 8-dimension review, appends to MEMORY.md
  Wave 7: release-agent → version bump, CHANGELOG, tag
     ↓
Hooks run automatically on each file save:
  dart-format.sh, secret-guard.sh, tdd-enforce.sh, a11y-lint.sh
     ↓
Developer commits → lefthook pre-commit: lint + type-check
Developer pushes → lefthook pre-push: full test suite
     ↓
Codemagic CI picks up → build, sign, deploy
```

### Runtime Request Flow (deployed app)

```
Flutter UI action
     ↓
Riverpod Notifier method
     ↓
Repository interface (domain)
     ↓
RepositoryImpl (data layer)
     ↓
Dio HTTP client
  → AuthInterceptor adds Bearer token
  → SslPinningInterceptor (prod only)
     ↓
POST /api/v1/auth/login
     ↓
Express middleware: helmet → CORS → rateLimit → json parser
     ↓
Ts.ED Router → AuthController.login()
     ↓
AuthService → bcrypt compare → JWT sign
     ↓
returns AuthResponseDto { accessToken, refreshToken, user }
     ↓
AuthInterceptor receives response
     ↓
SecureStorage saves tokens
     ↓
AuthNotifier updates Riverpod state
     ↓
UI re-renders via Provider.watch()
```

### Token Refresh Flow (automatic)

```
Any API call returns 401
     ↓
AuthInterceptor.onError() intercepts
     ↓
Reads refreshToken from SecureStorage
     ↓
POST /api/v1/auth/refresh { refreshToken }
     ↓
Gets new accessToken → saves to SecureStorage
     ↓
Retries original failed request automatically
     ↓
If refresh also fails → clears all tokens → navigates to login
```

---

## Quality Gate Summary

Every task is only "done" when ALL pass:

| Check | Command | Target |
|-------|---------|--------|
| Dart format | `dart format --set-exit-if-changed frontend/` | Zero diffs |
| Flutter analyze | `flutter analyze --fatal-infos frontend/` | Zero issues |
| Flutter tests | `flutter test --coverage frontend/` | ≥ 85% line coverage |
| Backend lint | `npm run lint` | Zero warnings |
| Backend tests | `npm run test` | All pass |
| Load test | `npm run test:load` | p95 < 500ms |
| Contract sync | `/verify` | openapi.yaml ↔ Dart models match |
| Accessibility | `/a11y-check` | WCAG AA |
| Performance | `/perf-check` | APK ≤ 25MB delta, startup < 2s |
