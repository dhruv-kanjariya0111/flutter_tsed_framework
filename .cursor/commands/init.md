# /init — Project Initialization Wizard

## Trigger
First command to run on any project — new, existing, migrating, or partial adoption.

## Step 0: Detect entry point
Ask the developer ONE question before doing anything:
> "How are you starting? Pick the closest match:
> A) Brand new project (empty repo)
> B) Existing Flutter project (already has lib/ code)
> C) Migrating from another platform (React, React Native, Android, iOS, web)
> D) Adding this framework to a project already in progress
>
> Type A, B, C, or D."

Route to the matching flow below.

---

## Flow A: New Project

1. Ask (one at a time):
   - Project name?
   - Target platforms? (ios / android / both)
   - Backend setup? → `tsed` | `node` | `supabase` | `firebase` | `hybrid` | `none`
   - Do you have backend access locally? (yes/no) — only ask if backend != none
   - Do you have a Figma link or design image? (yes/no)

2. For `backendType: supabase`:
   ```
   ⚠️  MANUAL STEP REQUIRED — Supabase setup (no CLI needed):
   1. Create a project at https://supabase.com
   2. Copy your Project URL and anon key from Settings → API
   3. Add them to frontend/.env.dev:
      SUPABASE_URL=https://xxxx.supabase.co
      SUPABASE_ANON_KEY=your-anon-key
   Tell me when done, or skip to continue without a live backend.
   ```

3. For `backendType: firebase`:
   ```
   ⚠️  MANUAL STEP REQUIRED — Firebase setup:
   1. Create a project at https://console.firebase.google.com
   2. Download google-services.json → place at android/app/google-services.json
   3. Download GoogleService-Info.plist → place at ios/Runner/GoogleService-Info.plist
   4. Copy your Web API key from Project Settings → General
   Tell me when done, or skip to continue without a live backend.
   ```

4. For `backendAccess: false`:
   ```
   ℹ️  No backend access noted. All API calls will use mock data in tests.
      Integration tests will be skipped until backendAccess is set to true.
      You can update this anytime in PROJECT_CONFIG.md.
   ```

5. Write PROJECT_CONFIG.md with all collected values including:
   - `environments: [dev, prod]`
   - `devEnvFile: frontend/.env.dev`
   - `prodEnvFile: frontend/.env.prod`
   - `gitBranchingStrategy: gitflow`
   - `mainBranch: main`
   - `developBranch: develop`

6. Create environment files:
   - `frontend/.env.dev` — with dev defaults + placeholder keys
   - `frontend/.env.prod` — with prod placeholders (NEVER commit real values)
   - `frontend/.env.example` — committed reference with all keys, no values
   - `backend/.env.dev` — backend dev config (if backendFramework != none)
   - `backend/.env.prod` — backend prod config placeholders
   - `backend/.env.example` — backend committed reference

7. Set up Git branching (if new repo or no branches exist):
   ```
   ⚠️  BRANCHING SETUP — I will create the following branches:
      main    — production-ready code only
      develop — integration branch (all features merge here first)
   Shall I run: git checkout -b develop && git push -u origin develop? (yes/no)
   ```
   Wait for confirmation before running any git commands.

8. Scaffold folder structure matching `backendType`.
9. Run `/analyze-bugs` if `BUG_PATTERNS.md` already exists.

---

## Flow B: Existing Flutter Project

1. Scan: `find lib -maxdepth 3 -type d`
2. Detect architecture from folder patterns (feature-first / layer-first / mixed)
3. Detect stateManagement from pubspec.yaml dependencies
4. Detect router from pubspec.yaml dependencies
5. Detect backendFramework from pubspec.yaml (supabase_flutter, firebase_core, http, dio)
6. Check for existing .env files — note what's already set up
7. Present findings:
   ```
   🔍 Detected:
      Architecture: feature-first
      State: riverpod
      Router: go_router
      Backend hint: supabase_flutter found → backendType=supabase
      Env files: .env.dev found, .env.prod missing
   Does this look right? (confirm / correct any field)
   ```
8. Write PROJECT_CONFIG.md with confirmed values.
9. Create any missing environment files.
10. Record in MEMORY.md `## Detected Architecture` section.
11. Run `/analyze-bugs` if `BUG_PATTERNS.md` exists.

---

## Flow C: Migration

```
ℹ️  For migrations, use:
   /analyze-source <path-to-source-project>   ← analyzes the source codebase
   /migrate <screen-name>                      ← migrates one screen at a time
   /verify                                     ← run after every wave

Start with: /analyze-source ./path/to/old-project
```

Set `type: existing` in PROJECT_CONFIG.md and run Flow B first to set up config.

---

## Flow D: Mid-Project Integration

1. Run Flow B (existing project scan).
2. After confirming PROJECT_CONFIG.md, tell the developer:
   ```
   ✅ Framework configured for your existing project.

   Recommended next steps:
   • /explore "how is auth currently handled?" — understand what's there before changing anything
   • /analyze-bugs — generate TEST_SPEC.md so we know what to protect
   • /refactor <module> — optional: clean one module at a time (tests must pass before and after)
   • /plan <new-feature> — add new features using framework standards
   • /fix <bug-description> — fix bugs with proper research and testing
   • /git-branch — set up / verify your Git branching strategy
   • /env — manage dev and prod environment files

   You do NOT need to refactor everything at once. Start with one module or one new feature.
   ```

---

## What's next (always shown after /init completes)

```
✅ Done: Project initialized. PROJECT_CONFIG.md written. Environment files created.

👉 What to do next depends on your goal:

  Adding a new feature?
    → /api-design "<feature>"   (if you have a custom backend)
    → /plan "<feature>"         (if backend is Supabase/Firebase — skips API design)

  Migrating from another platform?
    → /analyze-source <path>

  Fixing a bug?
    → /fix "<describe the bug>"

  Exploring existing code?
    → /explore "<question about the codebase>"

  Setting up Git branching?
    → /git-branch

  Managing dev/prod environments?
    → /env

💡 Example:
   /plan "user login with email and password"
   /fix "login button stays disabled after correct credentials"
   /analyze-source ./old-react-native-app
   /git-branch
```
