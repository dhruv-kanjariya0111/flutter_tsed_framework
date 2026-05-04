# PRD-First Bootstrap & Jira Integration — Design Spec
**Date:** 2026-05-04  
**Status:** Approved  
**Scope:** Two independent features added to the Flutter × Ts.ED Framework

---

## 1. Overview

Two additions to the framework:

1. **PRD-First Bootstrap** — `/init` Flow A gains a Step 0 that accepts a PRD from the developer, parses it to pre-fill `PROJECT_CONFIG.md`, and generates an ordered feature backlog in `MEMORY.md`.
2. **Jira Integration** — `/init` Flow A gains a Jira credential step (same pattern as Supabase/Firebase), plus a `/jira` command family for developers to fetch tickets, start work, and mark tickets done without leaving the IDE.

These two features are independent and can be implemented in parallel.

---

## 2. PRD Template (`PRD_TEMPLATE.md`)

A new file shipped in the framework root. Copied to project root on demand (see Section 3, Option D). BAs fill this in before handing off to developers.

### Structure

```markdown
# Product Requirements Document

## Project
- Name:
- Description:
- Platforms: [ios / android / both]

## Backend
- Type: [tsed / node / supabase / firebase / hybrid / none]
- Auth strategy: [jwt / firebase_auth / supabase_auth]
- Backend access locally: [yes / no]

## Roles
- User roles: [comma-separated, e.g. admin, user, guest]

## Features
### Feature 1: <name>
- Description:
- Priority: [must-have / nice-to-have]
- User role: [who uses this feature]
- Acceptance criteria:
  - [ ] ...

<!-- Repeat for each feature -->

## Non-Functional Requirements
- Offline support: [yes / no]
- i18n / localization: [yes / no]
- Analytics: [yes / no]
- Accessibility: WCAG AA (always enforced by the framework)
- Performance: APK < 25MB, startup < 2s (always enforced by the framework)

## External Services
<!-- List any 3rd-party services needed, e.g. Stripe, Sentry, FCM -->
- 

## Project Management
- Jira: [yes / no]
- Jira project key: [e.g. APP]
- Jira URL: [e.g. https://yourcompany.atlassian.net]
```

### Parsing contract
Each heading and bullet key maps 1:1 to a `PROJECT_CONFIG.md` field or a backlog item. The agent must not infer values — if a field is blank or missing, it asks the developer to fill it in manually during the confirmation step.

---

## 3. PRD-First Bootstrap — `/init` Flow A Changes

### Step 0: PRD Check (new, inserted before all existing questions)

```
> "Do you have a Product Requirements Document (PRD)?
>  A) Yes — I have a file (give me the path)
>  B) Yes — I'll paste it now
>  C) No — I'll answer questions manually
>  D) No — give me the PRD template to fill in first"
```

### Option A / B — Parse and pre-fill

1. Read PRD from file path or pasted text.
2. Extract all mapped fields → stage values for `PROJECT_CONFIG.md`.
3. Extract all features → stage as ordered backlog (must-have first, then nice-to-have).
4. Show confirmation summary:

```
📋 Parsed from PRD:
   Project name:   TaskFlow
   Platforms:      ios, android
   Backend:        tsed + jwt
   Roles:          admin, user
   Features (5):   ✓ Login  ✓ Dashboard  ✓ Notifications  ✓ Profile  ✓ Settings
   Jira:           yes — APP @ https://yourcompany.atlassian.net

Does this look right? (confirm / correct any field)
```

5. Developer confirms or overrides individual fields.
6. Continue normal `/init` Flow A with all confirmed values pre-filled — do not re-ask questions for fields already parsed.
7. After `PROJECT_CONFIG.md` is written, write `## PRD Backlog` to `MEMORY.md`:

```markdown
## PRD Backlog
<!-- Auto-generated from PRD on /init. Work top-to-bottom. -->
- [ ] /plan "Login"
- [ ] /plan "Dashboard"
- [ ] /plan "Notifications"
- [ ] /plan "Profile"
- [ ] /plan "Settings"
```

### Option C — Skip PRD

Run existing `/init` Flow A questions as-is. No changes to current behaviour.

### Option D — Give me the template

```
📄 PRD_TEMPLATE.md copied to your project root.
   Fill it in with your BA and re-run /init when ready.
   
   Tip: share PRD_TEMPLATE.md with your BA — every field maps directly
   to a config value the framework uses. A complete PRD means zero
   manual questions during /init.
```

Copy `PRD_TEMPLATE.md` to `<cwd>/PRD_TEMPLATE.md`, then exit. Do not continue the init flow.

### Parsing rules (agent behaviour)
- Fields present and non-empty → use as-is, show in confirmation summary.
- Fields missing or blank → mark as `[needs answer]` in summary, ask during confirmation step.
- Features section → each `### Feature N:` heading becomes one backlog entry.
- Priority ordering → all `must-have` features before `nice-to-have` in the backlog.
- If PRD references Jira → pre-answer the Jira step in `/init` Flow A (no need to ask again).

---

## 4. Jira Integration — `/init` Flow A Changes

### Where it slots in
After backend type is confirmed and its manual step block is shown/skipped. Before git branching setup.

### Prompt

```
> "Do you use Jira for project management? (yes / no)"
```

### If yes — manual credential block

```
⚠️  MANUAL STEP REQUIRED — Jira setup:
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token" → give it a label → copy the token
3. Add these to backend/.env.dev:
   JIRA_URL=https://yourcompany.atlassian.net
   JIRA_EMAIL=you@company.com
   JIRA_API_TOKEN=your-token-here
   JIRA_PROJECT_KEY=APP

4. Add the keys (no values) to backend/.env.example:
   JIRA_URL=
   JIRA_EMAIL=
   JIRA_API_TOKEN=
   JIRA_PROJECT_KEY=

Tell me when done, or type "skip" to continue without Jira.
```

### `PROJECT_CONFIG.md` additions

```yaml
## Project Management
jira: true                    # true | false
jiraProjectKey: APP           # Jira project key, e.g. APP, MOB, TASK
```

### If no / skip
`jira: false` written to `PROJECT_CONFIG.md`. No env keys added. Developer can run `/integrate jira` later to set it up.

---

## 5. `/jira` Command Family

### Runtime behaviour
All three commands read `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY` from `backend/.env.dev` at runtime. If any key is missing, print:

```
⚠️  Jira not configured. Run /integrate jira to set it up.
```

All Jira API calls use **Jira REST API v3** (`/rest/api/3/`). Auth: Basic auth with email:token, Base64-encoded.

---

### `/jira fetch <ticket-id>`

Fetches and displays a ticket.

**Output:**
```
🎫 APP-42 — Add user login screen
   Priority:   High
   Status:     To Do
   Assignee:   Varun

   Description:
   Allow users to log in with email and password. Token stored securely.

   Acceptance criteria:
   - [ ] Email + password login works
   - [ ] Error shown on wrong credentials
   - [ ] JWT token stored in FlutterSecureStorage
   - [ ] Loading state shown during API call

👉 Ready to start? → /jira start APP-42
```

**API call:** `GET /rest/api/3/issue/{ticket-id}`  
Fields extracted: `summary`, `description`, `priority.name`, `status.name`, `assignee.displayName`, acceptance criteria parsed from description body.

---

### `/jira start <ticket-id>`

Fetches ticket, creates a git branch, transitions ticket to In Progress.

**Flow:**
1. Fetch ticket via `GET /rest/api/3/issue/{ticket-id}` — extract summary.
2. Slugify summary → branch name: `feat/APP-42-add-user-login-screen` (lowercase, hyphens, max 50 chars after prefix).
3. Show branch command and wait for confirmation:
   ```
   I will run: git checkout -b feat/APP-42-add-user-login-screen
   Shall I proceed? (yes / no)
   ```
4. On confirmation: run git command, transition ticket to In Progress via `POST /rest/api/3/issue/{ticket-id}/transitions`.

**Output:**
```
✅ Branch created: feat/APP-42-add-user-login-screen
   Jira status → In Progress

👉 Next: /plan "user login screen"
   Or jump straight to: /tdd "user login screen"
```

---

### `/jira done <ticket-id>`

Transitions ticket to Done and prompts PR creation.

**Flow:**
1. Transition ticket to Done via `POST /rest/api/3/issue/{ticket-id}/transitions`.
2. Fetch current branch name.
3. Print next-step prompt.

**Output:**
```
✅ APP-42 → Done

👉 Open a PR from feat/APP-42-add-user-login-screen → develop:
   /git-branch finish feat/APP-42-add-user-login-screen
```

---

## 6. `/integrate jira` — Mid-Project Adoption

For projects that skipped Jira during `/init`. Follows the exact same Phase 1–6 pattern as all other `/integrate <service>` commands:

- Phase 1: No web research needed (Jira REST API v3 is stable)
- Phase 2: Show the same manual credential block as Section 4
- Phase 3: Add env keys to `.env.dev` and `.env.example`
- Phase 4: Update `PROJECT_CONFIG.md` with `jira: true` and `jiraProjectKey`
- No Flutter or backend code changes required

---

## 7. Files Added / Modified

| File | Change |
|---|---|
| `PRD_TEMPLATE.md` | New — shipped in framework root |
| `.claude/commands/init.md` | Modified — Step 0 PRD check added to Flow A |
| `.cursor/commands/init.md` | Modified — same Step 0 changes mirrored |
| `.claude/commands/jira.md` | New — `/jira fetch`, `/jira start`, `/jira done` |
| `.cursor/commands/jira.md` | New — same commands mirrored for Cursor |
| `.claude/commands/integrate.md` | Modified — jira added to supported services list |
| `.cursor/commands/integrate.md` | Modified — same |
| `AGENTS.md` | Modified — Jira command reference row added |
| `PROJECT_CONFIG.md` (template) | Modified — `jira` and `jiraProjectKey` fields added |

---

## 8. Out of Scope

- Tester raising bugs to Jira (not in scope — developers only)
- Jira webhook or real-time sync
- Creating Jira epics or sprints
- Jira Cloud vs Jira Server differences (design targets Jira Cloud only)
- Global credential store (credentials are per-project in `.env.dev`)
