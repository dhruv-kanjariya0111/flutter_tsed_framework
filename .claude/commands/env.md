# /env — Dev/Prod Environment Manager

## Purpose
Manage environment files for dev and prod across Flutter (frontend) and Node/Ts.ED (backend). Ensures secrets stay out of source control and environment configs are consistent across the team.

## Usage
```
/env                    # show current env status for all environments
/env init               # create all env files from .env.example templates
/env diff               # compare dev vs prod — show missing or mismatched keys
/env add <KEY> <env>    # add a new key to a specific env file + .env.example
/env rotate <KEY>       # flag a key as needing rotation (adds to MEMORY.md)
/env validate           # check all required keys are present for each env
/env check-secrets      # scan staged files for accidentally committed secrets
```

## Environment Files Structure

### Flutter (frontend)
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

### Backend (Node/Ts.ED)
```
backend/
  .env.dev        ← dev values (NOT committed)
  .env.prod       ← prod values (NEVER committed)
  .env.test       ← test values (can be committed if no secrets)
  .env.example    ← committed: all keys, no values
```

Usage in backend:
```typescript
// dotenv loads the correct file based on NODE_ENV
import 'dotenv/config';
const apiPort = process.env.PORT ?? 3000;
```

## /env init
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

## /env diff
Compares dev vs prod keys:
```
📋 Environment Diff (frontend)
   ✅ Matching keys: API_BASE_URL, ANALYTICS_KEY
   ⚠️  Missing in prod: FEATURE_FLAG_KEY
   ⚠️  Missing in dev:  PROD_ONLY_WEBHOOK_SECRET

📋 Environment Diff (backend)
   ✅ Matching keys: DATABASE_URL, JWT_SECRET
   ⚠️  Missing in prod: STRIPE_WEBHOOK_SECRET
```

## /env add <KEY> <env>
Adds a key to a specific env:
```
Adding STRIPE_PUBLIC_KEY to frontend/.env.dev:
1. Added placeholder to frontend/.env.dev:
   STRIPE_PUBLIC_KEY=
2. Added to frontend/.env.example:
   STRIPE_PUBLIC_KEY=  # get from Stripe Dashboard → Developers → API Keys

⚠️  Fill in the actual value in frontend/.env.dev manually.
```
Never writes actual secret values — only adds placeholders.

## /env validate
Checks all required keys are present:
```
✅ frontend/.env.dev: all 8 required keys present
❌ frontend/.env.prod: missing STRIPE_SECRET_KEY, SENTRY_DSN
✅ backend/.env.dev: all 5 required keys present
❌ backend/.env.prod: missing DATABASE_URL
```

## /env check-secrets
Scans staged files before commit:
```
🔍 Scanning staged files for secrets...
   Checking: git diff --cached --name-only

⚠️  POTENTIAL SECRET DETECTED:
   File: frontend/.env.dev
   Line 4: API_KEY=sk-live-... (looks like a real API key)

   This file appears to be staged for commit. Remove it:
   git reset HEAD frontend/.env.dev
```

## .gitignore Rules (always enforced)
The following must be in `.gitignore`:
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

## Codemagic CI/CD Integration
For production builds in Codemagic, secrets come from environment variables, not files:
```
ℹ️  In Codemagic, set your prod env vars under:
   App Settings → Environment variables → Production group
   These are injected at build time — no .env.prod file needed in CI.
```

## What's next
```
✅ Done: Environment files configured.

👉 Build for dev?  → flutter run --dart-define-from-file=frontend/.env.dev
   Build for prod? → flutter build appbundle --dart-define-from-file=frontend/.env.prod
   Add new env key? → /env add <KEY> dev

⚠️  REMINDER: Run /env check-secrets before every commit to prevent leaking secrets.
```
