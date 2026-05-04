# PRD-First Bootstrap — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a PRD Step 0 to `/init` Flow A that parses a BA-authored PRD, pre-fills `PROJECT_CONFIG.md`, and generates an ordered feature backlog in `MEMORY.md`.

**Architecture:** `PRD_TEMPLATE.md` is a structured markdown file shipped in the framework root. The `/init` command (both `.claude` and `.cursor` versions) gains a Step 0 block that reads/pastes the PRD, calls a parsing algorithm (regex over structured headings), shows a confirmation summary, then hands pre-filled values forward so subsequent `/init` questions are skipped for already-known fields.

**Tech Stack:** Markdown, regex parsing in agent instructions (no runtime code — these are AI command prompt files), git for commits.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `PRD_TEMPLATE.md` | Create | BA-facing template; every field maps to a `PROJECT_CONFIG.md` key |
| `.claude/commands/init.md` | Modify | Insert Step 0 PRD block before existing Flow A questions |
| `.cursor/commands/init.md` | Modify | Mirror identical Step 0 changes for Cursor |
| `PROJECT_CONFIG.md` | Modify | Add `## PRD` section with `prdFile` field |
| `AGENTS.md` | Modify | No new agent needed; add note that `/init` now accepts PRD |

---

## Task 1: Create `PRD_TEMPLATE.md`

**Files:**
- Create: `PRD_TEMPLATE.md`

- [ ] **Step 1: Create the template file**

Create `PRD_TEMPLATE.md` in the repo root with this exact content:

```markdown
# Product Requirements Document

> Fill this in with your BA before running /init.
> Every field maps directly to a PROJECT_CONFIG.md value — a complete PRD means zero manual questions during setup.

---

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
<!-- Add one ### block per feature. Priority determines build order. -->

### Feature 1: <name>
- Description:
- Priority: [must-have / nice-to-have]
- User role: [who uses this feature]
- Acceptance criteria:
  - [ ] ...

### Feature 2: <name>
- Description:
- Priority: [must-have / nice-to-have]
- User role: [who uses this feature]
- Acceptance criteria:
  - [ ] ...

## Non-Functional Requirements
- Offline support: [yes / no]
- i18n / localization: [yes / no]
- Analytics: [yes / no]
- Accessibility: WCAG AA (always enforced — do not change)
- Performance: APK < 25MB, startup < 2s (always enforced — do not change)

## External Services
<!-- List any 3rd-party integrations needed, e.g. Stripe, Sentry, FCM -->
- 

## Project Management
- Jira: [yes / no]
- Jira project key: [e.g. APP]
- Jira URL: [e.g. https://yourcompany.atlassian.net]
```

- [ ] **Step 2: Verify the file exists**

```bash
cat PRD_TEMPLATE.md | head -5
```

Expected output:
```
# Product Requirements Document
```

- [ ] **Step 3: Commit**

```bash
git add PRD_TEMPLATE.md
git commit -m "feat: add PRD_TEMPLATE.md for BA-authored project requirements"
```

---

## Task 2: Update `PROJECT_CONFIG.md` template

**Files:**
- Modify: `PROJECT_CONFIG.md`

- [ ] **Step 1: Read the current file**

Read `PROJECT_CONFIG.md` to find the right insertion point (after the `## Project` block).

- [ ] **Step 2: Add `prdFile` field to the Project block**

In `PROJECT_CONFIG.md`, find:
```
## Project
name: __PROJECT_NAME__
description: __DESCRIPTION__
platforms: [ios, android]
type: new       # new | existing
```

Replace with:
```
## Project
name: __PROJECT_NAME__
description: __DESCRIPTION__
platforms: [ios, android]
type: new       # new | existing
prdFile:        # path to PRD if one was used during /init, e.g. PRD_TEMPLATE.md
```

- [ ] **Step 3: Commit**

```bash
git add PROJECT_CONFIG.md
git commit -m "feat: add prdFile field to PROJECT_CONFIG.md template"
```

---

## Task 3: Update `.claude/commands/init.md` — insert PRD Step 0

**Files:**
- Modify: `.claude/commands/init.md`

This is the most important task. The agent instruction file for `/init` must be updated so Claude knows to run the PRD step before any other Flow A question.

- [ ] **Step 1: Read the current file**

Read `.claude/commands/init.md` in full to understand the current Flow A structure.

- [ ] **Step 2: Insert Step 0 block at the top of Flow A**

Find this section in `.claude/commands/init.md`:
```markdown
## Flow A: New Project

1. Ask (one at a time):
   - Project name?
```

Replace with:
```markdown
## Flow A: New Project

### Step 0: PRD Check (always first — before any other question)

Ask the developer:
> "Do you have a Product Requirements Document (PRD)?
>  A) Yes — I have a file (give me the path)
>  B) Yes — I'll paste it now
>  C) No — I'll answer questions manually
>  D) No — give me the PRD template to fill in first"

**Option A:** Read the file at the given path. Parse it using the PRD Parsing Rules below.

**Option B:** Accept pasted text. Parse it using the PRD Parsing Rules below.

**Option C:** Skip to Step 1. Ask all questions manually as before.

**Option D:**
```
📄 PRD_TEMPLATE.md copied to your project root.
   Fill it in with your BA and re-run /init when ready.

   Tip: every field maps directly to a config value the framework uses.
   A complete PRD means zero manual questions during /init.
```
Copy `PRD_TEMPLATE.md` from the framework package to `<cwd>/PRD_TEMPLATE.md`. Stop. Do not continue the init flow.

---

### PRD Parsing Rules

Parse the PRD markdown using these exact mappings:

| PRD field | PROJECT_CONFIG.md field |
|---|---|
| `## Project > Name` | `name` |
| `## Project > Description` | `description` |
| `## Project > Platforms` | `platforms` |
| `## Backend > Type` | `backendFramework` |
| `## Backend > Auth strategy` | `authStrategy` |
| `## Backend > Backend access locally` | `backendAccess` |
| `## Roles > User roles` | `roles`, `multiRole` (true if >1 role) |
| `## Non-Functional Requirements > Offline support` | `offlineFirst` |
| `## Non-Functional Requirements > i18n` | `i18n` |
| `## Non-Functional Requirements > Analytics` | `observability` |
| `## Project Management > Jira` | `jira` |
| `## Project Management > Jira project key` | `jiraProjectKey` |
| `## Project Management > Jira URL` | stored in `backend/.env.dev` as `JIRA_URL` |

Rules:
- Field present and non-empty → use value as-is
- Field missing or blank or still shows placeholder text (e.g. `[ios / android / both]`) → mark as `[needs answer]`
- Features → each `### Feature N: <name>` heading becomes one backlog entry. `must-have` features go first, then `nice-to-have`.

---

### PRD Confirmation Summary

After parsing, show:
```
📋 Parsed from PRD:
   Project name:   <value or [needs answer]>
   Platforms:      <value or [needs answer]>
   Backend:        <backendFramework> + <authStrategy>
   Roles:          <comma list or [needs answer]>
   Features (<N>): ✓ <name1>  ✓ <name2>  ...
   Jira:           <yes — KEY @ URL | no | [needs answer]>

Does this look right? (confirm / correct any field)
```

Wait for developer response. Accept corrections field by field. Once confirmed:
- Pre-fill all confirmed values into `PROJECT_CONFIG.md` — **do not re-ask questions for fields already confirmed**
- Skip the Jira step in Step 4 if Jira was already parsed from the PRD

---

### PRD Backlog

After `PROJECT_CONFIG.md` is written, append to `MEMORY.md`:

```markdown
## PRD Backlog
<!-- Auto-generated from PRD on /init. Check off features as you /plan them. -->
- [ ] /plan "<must-have feature 1>"
- [ ] /plan "<must-have feature 2>"
- [ ] /plan "<nice-to-have feature 1>"
```

(Replace with actual feature names parsed from the PRD, must-have first.)

---

### Step 1: Ask remaining questions (one at a time)

Only ask about fields that were **not** already confirmed from the PRD.

1. Ask (one at a time):
   - Project name?
```

- [ ] **Step 3: Verify the section appears correctly**

```bash
grep -n "Step 0" .claude/commands/init.md
```

Expected: line number with `### Step 0: PRD Check`

- [ ] **Step 4: Commit**

```bash
git add .claude/commands/init.md
git commit -m "feat: add PRD Step 0 to /init Flow A (.claude)"
```

---

## Task 4: Mirror changes to `.cursor/commands/init.md`

**Files:**
- Modify: `.cursor/commands/init.md`

- [ ] **Step 1: Read `.cursor/commands/init.md`**

Read the file. Confirm it has the same `## Flow A: New Project` structure.

- [ ] **Step 2: Apply the identical Step 0 block**

Apply the exact same insertion from Task 3 Step 2 to `.cursor/commands/init.md`. The content is word-for-word identical — the PRD parsing rules, confirmation summary format, and backlog template are the same for both Claude and Cursor.

- [ ] **Step 3: Verify**

```bash
grep -n "Step 0" .cursor/commands/init.md
```

Expected: line number with `### Step 0: PRD Check`

- [ ] **Step 4: Commit**

```bash
git add .cursor/commands/init.md
git commit -m "feat: add PRD Step 0 to /init Flow A (.cursor)"
```

---

## Task 5: Update `AGENTS.md` — document PRD capability

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Find the `/init` row in the Command Reference table**

In `AGENTS.md`, find:
```
| `/init` | Project setup wizard (new / existing / migrating / mid-project) |
```

Replace with:
```
| `/init` | Project setup wizard — accepts PRD to auto-fill config and generate feature backlog (new / existing / migrating / mid-project) |
```

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: document PRD support in /init command reference"
```

---

## Task 6: Smoke test the full flow

This task verifies the changes work end-to-end by reading through the modified files and confirming the agent will behave correctly given a sample PRD.

- [ ] **Step 1: Create a sample PRD for testing**

Create `docs/superpowers/test-fixtures/sample-prd.md`:

```markdown
# Product Requirements Document

## Project
- Name: TaskFlow
- Description: A task management app for small teams
- Platforms: both

## Backend
- Type: tsed
- Auth strategy: jwt
- Backend access locally: yes

## Roles
- User roles: admin, user

## Features

### Feature 1: User Login
- Description: Email and password login with JWT
- Priority: must-have
- User role: admin, user
- Acceptance criteria:
  - [ ] Login with email + password
  - [ ] JWT stored in FlutterSecureStorage
  - [ ] Error shown on wrong credentials

### Feature 2: Task Dashboard
- Description: List of tasks assigned to the user
- Priority: must-have
- User role: user
- Acceptance criteria:
  - [ ] Shows open tasks
  - [ ] Shows completed tasks

### Feature 3: Dark Mode
- Description: System-level dark mode toggle
- Priority: nice-to-have
- User role: admin, user
- Acceptance criteria:
  - [ ] Follows system setting

## Non-Functional Requirements
- Offline support: no
- i18n / localization: yes
- Analytics: yes

## External Services
- Sentry

## Project Management
- Jira: yes
- Jira project key: TASK
- Jira URL: https://taskflow.atlassian.net
```

- [ ] **Step 2: Manually trace the parsing rules against the sample PRD**

Check each mapping from the PRD Parsing Rules table in Task 3:

| PRD field | Expected value |
|---|---|
| Project Name | TaskFlow |
| Platforms | both → `[ios, android]` |
| Backend Type | tsed |
| Auth strategy | jwt |
| Backend access | yes → `true` |
| User roles | admin, user → `multiRole: true`, `roles: [admin, user]` |
| Offline support | no → `offlineFirst: false` |
| i18n | yes → `i18n: true` |
| Analytics | yes → `observability: true` |
| Jira | yes → `jira: true` |
| Jira project key | TASK |
| Jira URL | https://taskflow.atlassian.net |

Features (must-have first):
1. User Login
2. Task Dashboard
3. Dark Mode (nice-to-have, goes last)

Expected backlog in `MEMORY.md`:
```markdown
## PRD Backlog
- [ ] /plan "User Login"
- [ ] /plan "Task Dashboard"
- [ ] /plan "Dark Mode"
```

- [ ] **Step 3: Verify confirmation summary format**

Expected output from the agent given the sample PRD:
```
📋 Parsed from PRD:
   Project name:   TaskFlow
   Platforms:      ios, android
   Backend:        tsed + jwt
   Roles:          admin, user
   Features (3):   ✓ User Login  ✓ Task Dashboard  ✓ Dark Mode
   Jira:           yes — TASK @ https://taskflow.atlassian.net

Does this look right? (confirm / correct any field)
```

Confirm this matches the format defined in `.claude/commands/init.md`.

- [ ] **Step 4: Commit the test fixture**

```bash
git add docs/superpowers/test-fixtures/sample-prd.md
git commit -m "test: add sample PRD fixture for /init smoke test"
```

---

## Self-Review Checklist

After all tasks are complete:

- [ ] `PRD_TEMPLATE.md` exists in repo root with all required sections
- [ ] `.claude/commands/init.md` has Step 0 before Step 1 in Flow A
- [ ] `.cursor/commands/init.md` has identical Step 0
- [ ] PRD parsing rules table covers all `PROJECT_CONFIG.md` fields
- [ ] Option D exits cleanly without continuing init flow
- [ ] Jira fields in PRD pre-answer the Jira step (no double-ask)
- [ ] `MEMORY.md` backlog uses must-have before nice-to-have ordering
- [ ] `AGENTS.md` command reference updated
- [ ] Sample PRD fixture exists for manual verification
