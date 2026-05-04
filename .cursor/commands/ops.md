# /ops — Project Operations

Project plumbing commands. For anything that isn't writing feature code.

## Usage
```
/ops git <sub-command>   # Gitflow branch management
/ops env <sub-command>   # Environment file management
```

---

## /ops git — GitHub Branching Strategy Manager

Set up, verify, or enforce the Git branching strategy. Reads `gitBranchingStrategy` from PROJECT_CONFIG.md.

### Sub-commands
```
/ops git                             # show current branch status and what to do next
/ops git setup                       # create branch structure if it doesn't exist
/ops git new feat/<name>             # create a new feature branch from develop
/ops git new fix/<name>              # create a fix branch from develop
/ops git new hotfix/<name>           # create a hotfix branch from main (urgent prod fixes)
/ops git new release/<ver>           # create a release branch from develop
/ops git finish feat/<name>          # merge feature into develop + delete branch
/ops git finish fix/<name>           # merge fix into develop + delete branch
/ops git finish hotfix/<name>        # merge hotfix into main AND develop
/ops git finish release/<ver>        # merge release into main + tag + merge back to develop
/ops git status                      # show all branches and their status vs main/develop
```

### Strategy: Gitflow (default)

| Branch | Base | Merges into | Purpose |
|---|---|---|---|
| `main` | — | — | Production-ready code only. Tagged at every release. |
| `develop` | main | main (via release) | Integration branch. All features merge here. |
| `feat/<name>` | develop | develop | New features. One branch per feature. |
| `fix/<name>` | develop | develop | Bug fixes (non-urgent). |
| `hotfix/<name>` | main | main + develop | Urgent production fixes. |
| `release/<ver>` | develop | main + develop | Stabilization before release. Only bug fixes allowed. |

### Rules (enforced)
1. **Never push directly to main** — all changes via PR
2. **Never push directly to develop** — all changes via PR (for teams) or explicit merge
3. Feature branches branch from `develop`, not `main`
4. Hotfixes branch from `main`, then merge into BOTH `main` and `develop`
5. Release branches only receive bug fixes — no new features

### /ops git setup
Creates the following if they don't exist:
```
⚠️  BRANCH SETUP — the following commands will be run:
   git checkout -b develop
   git push -u origin develop
   (main already exists)
Shall I proceed? (yes/no)
```
Wait for confirmation. Then run only after approval.

### /ops git new <type>/<name>
```
Creating branch: feat/user-auth from develop
Commands to run:
  git checkout develop
  git pull origin develop
  git checkout -b feat/user-auth
  git push -u origin feat/user-auth

⚠️  This will be run. Confirm? (yes/no)
```

### /ops git finish feat/<name>
```
Merging feat/<name> into develop:
Commands to run:
  git checkout develop
  git pull origin develop
  git merge --no-ff feat/<name>
  git push origin develop
  git branch -d feat/<name>
  git push origin --delete feat/<name>

⚠️  This will be run. Confirm? (yes/no)
```

### /ops git finish hotfix/<name>
```
Merging hotfix/<name> into BOTH main and develop:
Commands to run:
  git checkout main
  git merge --no-ff hotfix/<name>
  git tag -a v<bump> -m "hotfix: <name>"
  git push origin main --tags
  git checkout develop
  git merge --no-ff hotfix/<name>
  git push origin develop
  git branch -d hotfix/<name>
  git push origin --delete hotfix/<name>

⚠️  This will be run. Confirm? (yes/no)
```

### /ops git finish release/<ver>
```
Finalizing release/<ver>:
Commands to run:
  git checkout main
  git merge --no-ff release/<ver>
  git tag -a v<ver> -m "release: <ver>"
  git push origin main --tags
  git checkout develop
  git merge --no-ff release/<ver>
  git push origin develop
  git branch -d release/<ver>
  git push origin --delete release/<ver>

⚠️  This will be run. Confirm? (yes/no)
```

### /ops git status
```
📊 Branch Status
   main:    ← last release tag
   develop: N commits ahead of main
   Open feature branches: [list with age]
   Open fix branches: [list with age]
   Stale branches (> 2 weeks old): [list — consider deleting or merging]
```

### PR Requirements (for team projects)
When `requirePRForMain: true` in PROJECT_CONFIG.md:
- All merges to `main` must go through a GitHub Pull Request
- Use: `gh pr create --base main --head release/<ver> --title "Release v<ver>"`
- PR must be reviewed before merge — never use `git push --force` on main

---

## /ops env — Dev/Prod Environment Manager

Manage environment files for dev and prod across Flutter (frontend) and Node/Ts.ED (backend). Ensures secrets stay out of source control and environment configs are consistent across the team.

### Sub-commands
```
/ops env                     # show current env status for all environments
/ops env init                # create all env files from .env.example templates
/ops env diff                # compare dev vs prod — show missing or mismatched keys
/ops env add <KEY> <env>     # add a new key to a specific env file + .env.example
/ops env rotate <KEY>        # flag a key as needing rotation (adds to MEMORY.md)
/ops env validate            # check all required keys are present for each env
/ops env check-secrets       # scan staged files for accidentally committed secrets
```

### Environment Files Structure

#### Flutter (frontend)
```
frontend/
  .env.dev        ← dev values (NOT committed if has secrets)
  .env.prod       ← prod values (NEVER committed)
  .env.example    ← committed: all keys, no values, with comments
```

Usage in Flutter code:
```dart
// In main_dev.dart: --dart-define-from-file=frontend/.env.dev
// In main_prod.dart: --dart-define-from-file=frontend/.env.prod
const apiBaseUrl = String.fromEnvironment('API_BASE_URL');
```

Build commands:
```bash
# Dev build
flutter run --dart-define-from-file=frontend/.env.dev

# Prod build
flutter build appbundle --dart-define-from-file=frontend/.env.prod --obfuscate --split-debug-info=build/symbols
```

#### Backend (Node/Ts.ED)
```
backend/
  .env.dev        ← dev values (NOT committed)
  .env.prod       ← prod values (NEVER committed)
  .env.test       ← test values (can be committed if no secrets)
  .env.example    ← committed: all keys, no values
```

### /ops env init
Creates missing env files from `.env.example`:
```
⚠️  The following files will be created (empty values — fill in manually):
   frontend/.env.dev      ← CREATED (empty)
   frontend/.env.prod     ← CREATED (empty)
   backend/.env.dev       ← CREATED (empty)
   backend/.env.prod      ← CREATED (empty)
   backend/.env.test      ← CREATED (with safe test defaults)

Next step: Fill in your actual values for each environment.
Keys needed (from .env.example):
  [list all keys]
```

### /ops env diff
```
📋 Environment Diff (frontend)
   ✅ Matching keys: API_BASE_URL, ANALYTICS_KEY
   ⚠️  Missing in prod: FEATURE_FLAG_KEY
   ⚠️  Missing in dev:  PROD_ONLY_WEBHOOK_SECRET

📋 Environment Diff (backend)
   ✅ Matching keys: DATABASE_URL, JWT_SECRET
   ⚠️  Missing in prod: STRIPE_WEBHOOK_SECRET
```

### /ops env add <KEY> <env>
```
Adding STRIPE_PUBLIC_KEY to frontend/.env.dev:
1. Added placeholder to frontend/.env.dev:
   STRIPE_PUBLIC_KEY=
2. Added to frontend/.env.example:
   STRIPE_PUBLIC_KEY=  # get from Stripe Dashboard → Developers → API Keys

⚠️  Fill in the actual value in frontend/.env.dev manually.
```
Never writes actual secret values — only adds placeholders.

### /ops env validate
```
✅ frontend/.env.dev: all 8 required keys present
❌ frontend/.env.prod: missing STRIPE_SECRET_KEY, SENTRY_DSN
✅ backend/.env.dev: all 5 required keys present
❌ backend/.env.prod: missing DATABASE_URL
```

### /ops env check-secrets
```
🔍 Scanning staged files for secrets...
   Checking: git diff --cached --name-only

⚠️  POTENTIAL SECRET DETECTED:
   File: frontend/.env.dev
   Line 4: API_KEY=sk-live-... (looks like a real API key)

   This file appears to be staged for commit. Remove it:
   git reset HEAD frontend/.env.dev
```

### .gitignore Rules (always enforced)
```
# Environment files (never commit real values)
frontend/.env.dev
frontend/.env.prod
backend/.env.dev
backend/.env.prod
backend/.env.test

# .env.example IS committed — it's the template
!frontend/.env.example
!backend/.env.example
```

### Codemagic CI/CD Integration
```
ℹ️  In Codemagic, set your prod env vars under:
   App Settings → Environment variables → Production group
   These are injected at build time — no .env.prod file needed in CI.
```

---

## What's next
```
✅ Done: Operation complete.

👉 Git: Working on a feature? → /ops git new feat/<name>
        Ready to release?     → /ops git finish release/<ver>, then /release <patch|minor|major>
        Production bug?        → /ops git new hotfix/<name>

   Env:  Build for dev?        → flutter run --dart-define-from-file=frontend/.env.dev
         Build for prod?       → flutter build appbundle --dart-define-from-file=frontend/.env.prod
         Add new env key?      → /ops env add <KEY> dev

⚠️  REMINDER: Run /ops env check-secrets before every commit.
```
