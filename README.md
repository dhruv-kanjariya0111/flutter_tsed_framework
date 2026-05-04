# Flutter × Ts.ED Framework

A production-grade Flutter development framework with guided AI-powered workflows for every project scenario.

---

## What this gives you

- Guided setup for any starting point (new project, existing app, migration, partial adoption)
- TDD-first feature development with web research before any code
- 8-dimension automated code review
- Support for Ts.ED, plain Node.js, Supabase, Firebase, hybrid, or no backend
- Quality gates (accessibility, performance, API contract, store compliance)
- 3rd-party integration guide — never silent CLI execution
- **Gitflow branching strategy** — `main` (prod) / `develop` (integration) / `feat/` / `fix/` / `hotfix/` / `release/`
- **Dev/prod environment management** — env files, secret safety, Codemagic integration

---

## Installation

**Option A: MCP (Cursor / Claude Code) — recommended**
```json
// .cursor/mcp.json
{
  "mcpServers": {
    "flutter-tsed": {
      "command": "npx",
      "args": ["-y", "@boscdev/flutter-tsed-framework@latest", "--mcp"]
    }
  }
}
```
Restart Cursor after adding.

**Option B: VS Code**
Install `boscdev.flutter-tsed-framework` from the VS Code Marketplace.

**Option C: npm (repo-local)**
```bash
npm install --save-dev @boscdev/flutter-tsed-framework
```

---

## Git Branching Strategy

This framework enforces **Gitflow**. Every project gets this branch structure:

```
main        ← production-ready code only. Tagged at every release. NEVER push directly.
develop     ← integration branch. All features merge here first.
feat/<name> ← new features, branch from develop
fix/<name>  ← non-urgent bug fixes, branch from develop
hotfix/<name> ← urgent production fixes, branch from main → merges into main AND develop
release/<ver> ← stabilization, branch from develop → merges into main AND develop
```

**Key rules:**
1. Never push directly to `main` or `develop` — use PRs or `/git-branch finish`
2. Features branch from `develop`, not `main`
3. Hotfixes branch from `main` and merge back into BOTH `main` and `develop`
4. `/release` only runs from `main`

**Quick branch commands:**
```
/git-branch setup                  # create develop branch if it doesn't exist
/git-branch new feat/user-auth     # create feature branch from develop
/git-branch finish feat/user-auth  # merge feature into develop, delete branch
/git-branch new hotfix/crash       # urgent fix from main
/git-branch finish hotfix/crash    # merge into main + develop, tag
/git-branch status                 # see all branch ages and status
```

---

## Dev/Prod Environment Management

Every project has **two environments**: `dev` and `prod`.

**File structure:**
```
frontend/
  .env.dev      ← dev values (git-ignored if has secrets)
  .env.prod     ← prod values (NEVER committed)
  .env.example  ← committed template with all keys, no values

backend/
  .env.dev      ← dev values
  .env.prod     ← prod values (NEVER committed)
  .env.example  ← committed template
```

**Flutter build commands:**
```bash
# Dev run
flutter run --dart-define-from-file=frontend/.env.dev

# Prod build
flutter build appbundle --dart-define-from-file=frontend/.env.prod \
  --obfuscate --split-debug-info=build/symbols
```

**Quick env commands:**
```
/env                    # show status of all env files
/env init               # create all env files from .env.example
/env diff               # compare dev vs prod — find missing keys
/env add API_KEY dev    # add a new key to a specific env
/env validate           # check all required keys present
/env check-secrets      # scan staged files for accidentally committed secrets
```

---

## How to write prompts

Every command follows: `/command "description of what you want"`

The AI will:
1. Tell you **what it did** in plain language
2. Warn you about any **manual steps** you need to take (`⚠️ MANUAL STEP REQUIRED`)
3. Tell you **what to run next** with an exact example

---

## All scenarios with exact prompt examples

### Scenario 1: Brand new project — Flutter + Ts.ED or Node backend
```
/init
# Wizard: name, platforms, backendType=tsed|node, backendAccess, figmaAvailable
# Creates PROJECT_CONFIG.md, env files, Git branches

/git-branch setup
# Creates develop branch: main (prod) + develop (integration)

/api-design "user authentication with JWT"
# Designs endpoints in openapi.yaml — WAIT for your approval

/plan "user authentication with JWT"
# Wave-ordered plan — WAIT for your approval

# Start feature branch
/git-branch new feat/user-auth

/tdd "login screen"
/tdd-backend "auth endpoints"
/sync-contract
/verify
/review "user authentication"

# Merge feature
/git-branch finish feat/user-auth

# Release
/git-branch new release/1.0.0
/release minor
/git-branch finish release/1.0.0
```

### Scenario 2: Flutter only — Supabase backend
```
/init
# Choose backendType=supabase
# ⚠️  Manual steps: create Supabase project, copy URL + anon key to frontend/.env.dev

/git-branch setup
/git-branch new feat/product-listing

/plan "product listing"
# Skips API design — uses Supabase SDK directly

/tdd "product list screen"
/verify --flutter-only   # backend gates skipped automatically
/review "product listing"

/git-branch finish feat/product-listing
/release minor
```

### Scenario 3: Flutter only — Firebase backend
```
/init
# Choose backendType=firebase
# ⚠️  Manual steps: download google-services.json, GoogleService-Info.plist

/integrate "firebase auth"
# Research → manual steps listed → Flutter implementation → tests

/git-branch new feat/user-profile
/plan "user profile"
/tdd "user profile screen"
/verify --flutter-only
/review "user profile"
/git-branch finish feat/user-profile
/release minor
```

### Scenario 4: Flutter + hybrid backend (Supabase DB + custom Node API)
```
/init
# Choose backendType=hybrid

/api-design "order processing"
# Only for the Node API features

/git-branch new feat/order-processing
/plan "order processing"
/tdd "order screen"
/tdd-backend "order endpoints"   # uses node-backend-coder for Node features
/sync-contract
/verify
/git-branch finish feat/order-processing
/release patch
```

### Scenario 5: No backend access
```
/init
# Choose backendAccess=false
# ℹ️  All tests will use mock data; integration tests skipped

/git-branch new feat/dashboard
/plan "dashboard screen"           # orchestrator uses mock-repository wave plan
/tdd "dashboard screen"            # unit + widget tests only
/verify --flutter-only
/review "dashboard"
/git-branch finish feat/dashboard
```

### Scenario 6: Migrating from React Native — existing backend stays
```
/init
# type=existing, detect architecture

/analyze-source ./old-react-native-app
# Generates MIGRATION_MAP.md with screen list, complexity, timeline

/migrate "home screen"
/migrate "profile screen"
/migrate "login screen"
/sync-contract
/verify
/review "migration wave 1"
/release minor
```

### Scenario 7: Migrating from Android/iOS native app — with Supabase
```
/init
# type=existing, backendType=supabase

/analyze-source ./old-android-app
/migrate "home screen"
/migrate "settings screen"
/verify
/release minor
```

### Scenario 8: Joining an existing Flutter project mid-stream
```
/init
# Scans lib/, detects architecture + state + router + backend hint
# Confirms with you before writing PROJECT_CONFIG.md

/explore "how is authentication currently handled?"
# Read-only Q&A before touching anything

/analyze-bugs
# Generates TEST_SPEC.md from BUG_PATTERNS.md

/git-branch setup
# Sets up develop branch if missing

/git-branch new feat/biometric-login
/plan "add biometric login"
/tdd "biometric login screen"
/verify
/review "biometric login"
/git-branch finish feat/biometric-login
```

### Scenario 9: Fixing a bug
```
/analyze-bugs
# Regenerate TEST_SPEC.md so we know what's covered

/git-branch new fix/cart-total-discount

/fix "cart total is wrong when a discount code is applied"
# Research → hypothesis shown → you confirm → failing test → fix → verify

/verify --flutter-only
/review "cart module"   # optional — recommended if fix touched core logic

/git-branch finish fix/cart-total-discount
```

### Scenario 10: Urgent production bug (hotfix)
```
/git-branch new hotfix/crash-on-launch
# Branches from main (not develop)

/fix "app crashes on launch when user has no network connection"
# Research → test → fix → verify

/verify --flutter-only
/git-branch finish hotfix/crash-on-launch
# Merges into main AND develop automatically, creates tag

/release patch
```

### Scenario 11: Adding a 3rd-party integration
```
/integrate "push notifications with FCM"
# Research → manual steps (Firebase, google-services.json, APNs cert)
# You confirm → Dart implementation → tests → verify

/integrate "Apple Sign-In"
# Research → manual steps (Xcode entitlements, Apple Developer Console)
# You confirm → implementation → tests → verify
```

### Scenario 12: Setting up a new team member
```
/env init
# Creates frontend/.env.dev and backend/.env.dev from .env.example templates
# Developer fills in their own values — never share .env.prod

/git-branch status
# Shows all open branches, ages, and what to work on

/explore "what's the current state of the auth feature?"
# Catch up without touching any code
```

---

## Command reference

| Command | What it does | When to use |
|---|---|---|
| `/init` | Project setup wizard | Always first |
| `/git-branch` | Gitflow branch manager | After init, for every feature/fix/release |
| `/env` | Dev/prod environment manager | After init, when adding new services |
| `/plan <feature>` | Wave-ordered implementation plan | Before any feature work |
| `/api-design <feature>` | Design REST endpoints in openapi.yaml | Custom backend only — before /plan |
| `/tdd <feature>` | Full Flutter TDD cycle | Implementing any Flutter feature |
| `/tdd-backend <feature>` | Full backend TDD cycle | Implementing any backend feature |
| `/fix <description>` | Research + fix a bug with a test | Any bug |
| `/integrate <service>` | Add a 3rd-party service with guided setup | Firebase, Supabase Auth, Stripe, etc. |
| `/migrate <screen>` | Migrate one screen from source platform | React/RN/Android/iOS → Flutter |
| `/analyze-source <path>` | Analyze source project, generate migration map | Before /migrate |
| `/refactor <module>` | Behavior-neutral cleanup | Code quality — tests must pass before + after |
| `/verify` | All quality gates | After every feature or fix |
| `/review <feature>` | 8-dimension code review | After /verify passes |
| `/sync-contract` | Align Flutter models ↔ openapi.yaml | After backend changes |
| `/analyze-bugs` | Regenerate TEST_SPEC.md from BUG_PATTERNS | Before fixing bugs or starting TDD |
| `/explore <question>` | Read-only codebase Q&A | Understanding code before changing it |
| `/a11y-check` | WCAG AA accessibility audit | Before release |
| `/perf-check` | Performance budget check | Before release |
| `/offline-check` | Offline-first audit | When offlineFirst: true |
| `/store-check` | App Store + Play Store compliance | Before submitting |
| `/release <patch\|minor\|major>` | Semantic versioning + CHANGELOG + CI trigger | After /git-branch finish release/<ver> |

---

## Key rules the framework enforces

1. **Research before code** — `/fix`, `/integrate`, `/plan` all search for best practices before writing anything
2. **No silent CLI execution** — any step requiring manual action is shown as `⚠️ MANUAL STEP REQUIRED`; AI waits for your confirmation
3. **Tests before implementation** — every feature goes RED before GREEN
4. **Integration tests are earned** — written only when `backendAccess: true` AND the TEST_SPEC tag says `Integration`
5. **Figma is optional** — design reference improves output but is never required
6. **Backend is optional** — `backendAccess: false` skips all backend gates cleanly
7. **Never push to main directly** — all production code goes through develop → release → main
8. **Never commit secrets** — all sensitive values stay in git-ignored `.env.dev` / `.env.prod` files
9. **One screen at a time** — `/migrate` never attempts a full app rewrite in one pass
10. **Environment files are always in sync** — `/env diff` and `/env validate` catch missing keys before they hit production

---

## Troubleshooting

**Command not showing in VS Code:**
- Confirm extension installed and enabled
- Reload window: `Cmd+Shift+P` → `Developer: Reload Window`

**MCP server not available:**
- Validate `.cursor/mcp.json` JSON syntax
- Ensure `npx` is available: `which npx`
- Restart Cursor after config changes

**Command fails with configuration error:**
- The AI will show a `⚠️ CONFIGURATION REQUIRED` block with exact steps
- Do NOT retry with code changes — fix the configuration first

**Integration test failures:**
- Confirm `backendAccess: true` in `PROJECT_CONFIG.md`
- Confirm backend is running on `backendPort`
- Run backend tests first: `npm run test`

**Accidentally committed a secret:**
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch frontend/.env.dev" \
  --prune-empty --tag-name-filter cat -- --all
git push --force --tags origin main develop
```
Then rotate the compromised key immediately.

**Wrong branch for a release:**
```bash
git checkout main
git merge --no-ff release/<ver>
git tag -a v<ver> -m "release: <ver>"
git push origin main --tags
```
