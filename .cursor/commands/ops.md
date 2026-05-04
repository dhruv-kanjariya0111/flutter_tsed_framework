# /ops — Project Operations

Single command for all project plumbing: Git branching and environment file management.
Use for anything that is not feature development.

---

## Git branching
```
/ops git                          # show branch status and what to do next
/ops git new feat/<name>          # create feature branch from develop
/ops git new fix/<name>           # create fix branch from develop
/ops git new hotfix/<name>        # create hotfix branch from main (urgent prod fixes)
/ops git new release/<version>    # create release stabilization branch from develop
/ops git finish feat/<name>       # merge feature into develop + delete branch
/ops git finish fix/<name>        # merge fix into develop + delete branch
/ops git finish hotfix/<name>     # merge hotfix into main AND develop + tag
/ops git finish release/<ver>     # merge release into main + tag + back to develop
/ops git status                   # all branches, age, ahead/behind, stale list
```

### Branch strategy (Gitflow — from PROJECT_CONFIG.md)
| Branch | Base | Merges into |
|---|---|---|
| `main` | — | — | Production only. Tagged at every release. Never push directly. |
| `develop` | main | main (via release) | Integration. All features merge here. |
| `feat/<name>` | develop | develop | New features. |
| `fix/<name>` | develop | develop | Non-urgent bug fixes. |
| `hotfix/<name>` | main | main + develop | Urgent production fixes. |
| `release/<ver>` | develop | main + develop | Stabilization. Bug fixes only. |

### /ops git new <type>/<name>
Always confirms before running:
```
▶  Creating: feat/user-auth from develop
   Commands:
     git checkout develop && git pull origin develop
     git checkout -b feat/user-auth
     git push -u origin feat/user-auth
Proceed? [y/N]
```

### /ops git finish feat/<name>
```
▶  Merging feat/<name> into develop:
   Commands:
     git checkout develop && git pull origin develop
     git merge --no-ff feat/<name>
     git push origin develop
     git branch -d feat/<name> && git push origin --delete feat/<name>
Proceed? [y/N]
```

### /ops git finish hotfix/<name>
Merges into BOTH main and develop:
```
▶  Merging hotfix/<name> into main AND develop:
   Commands:
     git checkout main
     git merge --no-ff hotfix/<name>
     git tag -a v<bump> -m "hotfix: <name>"
     git push origin main --tags
     git checkout develop
     git merge --no-ff hotfix/<name>
     git push origin develop
     git branch -d hotfix/<name>
Proceed? [y/N]
```

### /ops git status
```
📊 Branch status
   main:    at v1.2.3 (last release tag)
   develop: 4 commits ahead of main
   Open feature branches: [list with age]
   Stale (> 2 weeks): [list — consider deleting or merging]
```

---

## Environment files
```
/ops env                          # show current env status for all environments
/ops env init                     # create all env files from .env.example templates
/ops env diff                     # compare dev vs prod — missing or mismatched keys
/ops env add <KEY> <env>          # add key to specific env file + .env.example
/ops env rotate <KEY>             # flag a key as needing rotation (logs to MEMORY.md)
/ops env validate                 # check all required keys present in each env
/ops env check-secrets            # scan staged files for accidentally committed secrets
```

### Environment file structure
Flutter (frontend):
```
frontend/.env.dev        ← dev values (NOT committed if has secrets)
frontend/.env.prod       ← prod values (NEVER committed)
frontend/.env.example    ← committed: all keys, empty values, with source comments
```

Backend (Node/Ts.ED):
```
backend/.env.dev         ← dev values (NOT committed)
backend/.env.prod        ← prod values (NEVER committed)
backend/.env.test        ← test values (safe defaults, can commit)
backend/.env.example     ← committed: all keys, empty values
```

### /ops env init
Creates missing env files from .env.example with empty values:
```
⚠️  Files to create (empty — fill in manually):
   frontend/.env.dev     ← CREATED
   frontend/.env.prod    ← CREATED
   backend/.env.dev      ← CREATED
   backend/.env.prod     ← CREATED
Next: fill in actual values for each environment.
```

### /ops env diff
```
📋 Environment diff (frontend)
   ✅ Matching: API_BASE_URL, ANALYTICS_KEY
   ⚠️  Missing in prod: FEATURE_FLAG_KEY
📋 Environment diff (backend)
   ✅ Matching: DATABASE_URL, JWT_SECRET
   ⚠️  Missing in prod: STRIPE_WEBHOOK_SECRET
```

### /ops env add <KEY> <env>
Adds placeholder only — never writes real secret values:
```
Adding STRIPE_PUBLIC_KEY to frontend/.env.dev:
1. Placeholder added to frontend/.env.dev: STRIPE_PUBLIC_KEY=
2. Added to frontend/.env.example: STRIPE_PUBLIC_KEY=  # get from Stripe Dashboard → API Keys
⚠️  Fill in the actual value in frontend/.env.dev manually.
```

### /ops env validate
```
✅ frontend/.env.dev: all 8 required keys present
❌ frontend/.env.prod: missing STRIPE_SECRET_KEY, SENTRY_DSN
✅ backend/.env.dev: all 5 required keys present
```

### /ops env check-secrets
```
🔍 Scanning staged files...
⚠️  POTENTIAL SECRET in frontend/.env.dev line 4: API_KEY=sk-live-...
   Remove from staging: git reset HEAD frontend/.env.dev
```

### .gitignore rules (always enforced)
```
frontend/.env.dev
frontend/.env.prod
backend/.env.dev
backend/.env.prod
backend/.env.test
!frontend/.env.example
!backend/.env.example
```

## Rules (both sub-commands)
- Always confirm before running any destructive git operation
- Never write actual secret values in any file — placeholders only
- Never push directly to main or develop — use PRs when `requirePRForMain: true`

## What's next
```
✅ Done: operation complete.

👉 Git: branch created?   → start coding, then /tdd "<feature>"
         branch finished?  → open PR on GitHub
   Env:  files created?   → fill in values, then run /ops env validate
         secrets found?   → unstage and fix before committing
```
