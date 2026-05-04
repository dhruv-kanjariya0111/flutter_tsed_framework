# Jira Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Jira connection to `/init` Flow A (same pattern as Supabase/Firebase) and a `/jira` command family (`fetch`, `start`, `done`) so developers can work Jira tickets without leaving the IDE.

**Architecture:** All Jira interaction is defined as agent command prompt files (`.md`). No runtime Node.js code is added — the agent reads credentials from `backend/.env.dev` and makes Jira REST API v3 calls directly. The `/init` command gains a credential step block. Three new command files define `fetch`, `start`, and `done` sub-commands. The `integrate.md` command is updated to support `/integrate jira` for mid-project adoption.

**Tech Stack:** Jira REST API v3, Basic Auth (email:API token Base64), markdown command files, `backend/.env.dev` for credential storage.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `.claude/commands/init.md` | Modify | Add Jira credential step after backend type confirmation |
| `.cursor/commands/init.md` | Modify | Mirror identical Jira step |
| `.claude/commands/jira.md` | Create | `/jira fetch`, `/jira start`, `/jira done` command definitions |
| `.cursor/commands/jira.md` | Create | Mirror identical Jira commands for Cursor |
| `.claude/commands/integrate.md` | Modify | Add jira to supported services list + jira-specific phase block |
| `.cursor/commands/integrate.md` | Modify | Mirror integrate.md changes |
| `PROJECT_CONFIG.md` | Modify | Add `jira` and `jiraProjectKey` fields |
| `AGENTS.md` | Modify | Add `/jira` rows to command reference table |
| `backend/.env.example` | Modify | Add Jira env key placeholders |

---

## Task 1: Update `PROJECT_CONFIG.md` template — add Jira fields

**Files:**
- Modify: `PROJECT_CONFIG.md`

- [ ] **Step 1: Read `PROJECT_CONFIG.md`**

Read the file to find the end — the last section before the closing content.

- [ ] **Step 2: Append the Project Management block**

Add this block at the end of `PROJECT_CONFIG.md`:

```yaml
## Project Management
jira: false                   # true | false
jiraProjectKey:               # Jira project key, e.g. APP, MOB, TASK
```

- [ ] **Step 3: Commit**

```bash
git add PROJECT_CONFIG.md
git commit -m "feat: add jira fields to PROJECT_CONFIG.md template"
```

---

## Task 2: Update `backend/.env.example` — add Jira placeholders

**Files:**
- Modify: `backend/.env.example` (create if it doesn't exist)

- [ ] **Step 1: Check if `backend/.env.example` exists**

```bash
ls backend/.env.example 2>/dev/null && echo "exists" || echo "missing"
```

- [ ] **Step 2: Add Jira keys**

If the file exists, append to it. If it doesn't exist, create it with this content:

```bash
# Jira Integration (optional — set jira: true in PROJECT_CONFIG.md to enable)
JIRA_URL=
JIRA_EMAIL=
JIRA_API_TOKEN=
JIRA_PROJECT_KEY=
```

- [ ] **Step 3: Commit**

```bash
git add backend/.env.example
git commit -m "feat: add Jira env key placeholders to backend/.env.example"
```

---

## Task 3: Update `.claude/commands/init.md` — add Jira step

**Files:**
- Modify: `.claude/commands/init.md`

The Jira step slots in after backend type is confirmed and its manual step block is shown. Before git branching setup (Step 7 in the current flow).

- [ ] **Step 1: Read `.claude/commands/init.md`**

Read the file. Find the git branching step — it looks like:

```markdown
7. Set up Git branching (if new repo or no branches exist):
```

- [ ] **Step 2: Insert Jira step before the git branching step**

Find:
```markdown
7. Set up Git branching (if new repo or no branches exist):
```

Insert this block immediately before it (renumber git branching to step 8, scaffold to 9, analyze-bugs to 10):

```markdown
7. Ask: "Do you use Jira for project management? (yes / no)"

   **If yes:**
   ```
   ⚠️  MANUAL STEP REQUIRED — Jira setup:
   1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
   2. Click "Create API token" → give it a label → copy the token
   3. Add these to backend/.env.dev:
      JIRA_URL=https://yourcompany.atlassian.net
      JIRA_EMAIL=you@company.com
      JIRA_API_TOKEN=your-token-here
      JIRA_PROJECT_KEY=APP

   4. The following keys (no values) are already in backend/.env.example:
      JIRA_URL=
      JIRA_EMAIL=
      JIRA_API_TOKEN=
      JIRA_PROJECT_KEY=

   Tell me when done, or type "skip" to continue without Jira.
   ```

   After confirmation or skip:
   - Write `jira: true` and `jiraProjectKey: <key>` to `PROJECT_CONFIG.md`

   **If no / skip:**
   - Write `jira: false` to `PROJECT_CONFIG.md`
   - Do not add env keys

   **If Jira was already parsed from a PRD in Step 0:** skip this prompt entirely — values are already confirmed.

```

- [ ] **Step 3: Verify insertion**

```bash
grep -n "Jira" .claude/commands/init.md | head -10
```

Expected: multiple lines showing Jira prompt and credential block.

- [ ] **Step 4: Commit**

```bash
git add .claude/commands/init.md
git commit -m "feat: add Jira credential step to /init Flow A (.claude)"
```

---

## Task 4: Mirror Jira step to `.cursor/commands/init.md`

**Files:**
- Modify: `.cursor/commands/init.md`

- [ ] **Step 1: Read `.cursor/commands/init.md`**

Read the file. Confirm it has the same step-numbered structure as `.claude/commands/init.md`.

- [ ] **Step 2: Apply identical Jira step insertion**

Apply the exact same block from Task 3 Step 2 to `.cursor/commands/init.md`. Word-for-word identical content.

- [ ] **Step 3: Verify**

```bash
grep -n "Jira" .cursor/commands/init.md | head -10
```

Expected: same lines as in `.claude/commands/init.md`.

- [ ] **Step 4: Commit**

```bash
git add .cursor/commands/init.md
git commit -m "feat: add Jira credential step to /init Flow A (.cursor)"
```

---

## Task 5: Create `.claude/commands/jira.md`

**Files:**
- Create: `.claude/commands/jira.md`

- [ ] **Step 1: Create the file**

Create `.claude/commands/jira.md` with this exact content:

```markdown
# /jira — Jira Ticket Workflow

## Credential check (run before every sub-command)

Read `backend/.env.dev`. If any of `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY` is missing or empty, stop and print:

```
⚠️  Jira not configured. Run /integrate jira to set it up.
```

Do not proceed with any API call.

Auth header for all API calls:
- Encode `JIRA_EMAIL:JIRA_API_TOKEN` as Base64
- Header: `Authorization: Basic <base64>`
- Header: `Content-Type: application/json`
- Base URL: `JIRA_URL/rest/api/3`

---

## /jira fetch <ticket-id>

**Purpose:** Display a Jira ticket with its description and acceptance criteria.

**API call:**
```
GET {JIRA_URL}/rest/api/3/issue/{ticket-id}
```

**Fields to extract from response:**
- `fields.summary` → ticket title
- `fields.priority.name` → priority
- `fields.status.name` → current status
- `fields.assignee.displayName` → assignee (or "Unassigned" if null)
- `fields.description` → description body (Atlassian Document Format — extract plain text from `content[].content[].text` nodes)

**Acceptance criteria extraction:**
Look for a heading with text "Acceptance criteria" (case-insensitive) in the description ADF structure. Extract the bullet list items beneath it. If not found, omit that section silently.

**Output format:**
```
🎫 {ticket-id} — {summary}
   Priority:   {priority}
   Status:     {status}
   Assignee:   {assignee}

   Description:
   {plain text description, max 300 chars, truncated with "..." if longer}

   Acceptance criteria:
   - [ ] {criterion 1}
   - [ ] {criterion 2}

👉 Ready to start? → /jira start {ticket-id}
```

---

## /jira start <ticket-id>

**Purpose:** Fetch the ticket, create a git branch from `develop`, transition ticket to In Progress.

**Step 1 — Fetch ticket:**
```
GET {JIRA_URL}/rest/api/3/issue/{ticket-id}
```
Extract `fields.summary`.

**Step 2 — Build branch name:**
- Format: `feat/{ticket-id}-{slugified-summary}`
- Slugify: lowercase, replace spaces and special chars with hyphens, strip consecutive hyphens, max 50 chars total including prefix
- Example: `feat/APP-42-add-user-login-screen`

**Step 3 — Confirm with developer:**
```
I will run: git checkout -b feat/{ticket-id}-{slug}
Shall I proceed? (yes / no)
```
Wait for response. If no, stop.

**Step 4 — Create branch:**
Run: `git checkout -b feat/{ticket-id}-{slug}`

**Step 5 — Transition to In Progress:**
First get available transitions:
```
GET {JIRA_URL}/rest/api/3/issue/{ticket-id}/transitions
```
Find the transition whose `name` matches "In Progress" (case-insensitive). Use its `id`.

Then transition:
```
POST {JIRA_URL}/rest/api/3/issue/{ticket-id}/transitions
Body: { "transition": { "id": "<transition-id>" } }
```

**Output:**
```
✅ Branch created: feat/{ticket-id}-{slug}
   Jira status → In Progress

👉 Next: /plan "{ticket summary}"
   Or jump straight to: /tdd "{ticket summary}"
```

**Error handling:**
- If "In Progress" transition not found: print `⚠️  Could not find "In Progress" transition for {ticket-id}. Update it manually in Jira.` — still show the branch success message.
- If git branch already exists: print `⚠️  Branch feat/{ticket-id}-{slug} already exists. Switching to it.` and run `git checkout feat/{ticket-id}-{slug}`.

---

## /jira done <ticket-id>

**Purpose:** Transition ticket to Done and prompt the developer to open a PR.

**Step 1 — Get current branch:**
Run: `git branch --show-current`
Store as `{current-branch}`.

**Step 2 — Get available transitions:**
```
GET {JIRA_URL}/rest/api/3/issue/{ticket-id}/transitions
```
Find the transition whose `name` matches "Done" (case-insensitive). Use its `id`.

**Step 3 — Transition to Done:**
```
POST {JIRA_URL}/rest/api/3/issue/{ticket-id}/transitions
Body: { "transition": { "id": "<transition-id>" } }
```

**Output:**
```
✅ {ticket-id} → Done

👉 Open a PR from {current-branch} → develop:
   /git-branch finish {current-branch}
```

**Error handling:**
- If "Done" transition not found: print `⚠️  Could not find "Done" transition for {ticket-id}. Update it manually in Jira.`
- Always print the PR prompt regardless of transition success.
```

- [ ] **Step 2: Verify the file exists**

```bash
grep -n "## /jira" .claude/commands/jira.md
```

Expected:
```
## /jira fetch <ticket-id>
## /jira start <ticket-id>
## /jira done <ticket-id>
```

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/jira.md
git commit -m "feat: add /jira command (fetch, start, done) for Claude Code"
```

---

## Task 6: Mirror `.cursor/commands/jira.md`

**Files:**
- Create: `.cursor/commands/jira.md`

- [ ] **Step 1: Copy the file**

```bash
cp .claude/commands/jira.md .cursor/commands/jira.md
```

- [ ] **Step 2: Verify**

```bash
diff .claude/commands/jira.md .cursor/commands/jira.md
```

Expected: no output (files are identical).

- [ ] **Step 3: Commit**

```bash
git add .cursor/commands/jira.md
git commit -m "feat: add /jira command (fetch, start, done) for Cursor"
```

---

## Task 7: Update `integrate.md` — add `/integrate jira`

**Files:**
- Modify: `.claude/commands/integrate.md`
- Modify: `.cursor/commands/integrate.md`

- [ ] **Step 1: Read `.claude/commands/integrate.md`**

Read the file to find the trigger line listing supported services.

- [ ] **Step 2: Add jira to the trigger service list**

Find the line listing supported services in the `## Trigger` section (it mentions Firebase Auth, Supabase Auth, Google Sign-In, etc.). Add `Jira` to that list.

- [ ] **Step 3: Add Jira-specific phase block**

At the end of `.claude/commands/integrate.md`, before the `## What's next` section, add:

```markdown
---

## Jira-specific integration notes

When `<service>` is `jira`:

**Phase 1:** No web research needed — Jira REST API v3 is stable.

**Phase 2 — Manual steps:**
```
⚠️  MANUAL STEPS REQUIRED — Jira setup:
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token" → give it a label → copy the token
3. Add these to backend/.env.dev:
   JIRA_URL=https://yourcompany.atlassian.net
   JIRA_EMAIL=you@company.com
   JIRA_API_TOKEN=your-token-here
   JIRA_PROJECT_KEY=APP

4. Add keys (no values) to backend/.env.example:
   JIRA_URL=
   JIRA_EMAIL=
   JIRA_API_TOKEN=
   JIRA_PROJECT_KEY=

Tell me when done.
```

**Phase 3 — Environment setup:** Already covered by the manual step above.

**Phase 4 — Config update:**
Update `PROJECT_CONFIG.md`:
```yaml
jira: true
jiraProjectKey: APP
```

**Phase 5:** Not applicable — no Flutter or backend code changes required.

**Phase 6 — Verify:**
Test with: `/jira fetch <any-ticket-id>`
Expected: ticket details printed. If you see a credential error, re-check `backend/.env.dev`.
```

- [ ] **Step 4: Apply identical changes to `.cursor/commands/integrate.md`**

Read `.cursor/commands/integrate.md`. Apply the same trigger list addition and Jira-specific block.

- [ ] **Step 5: Commit**

```bash
git add .claude/commands/integrate.md .cursor/commands/integrate.md
git commit -m "feat: add /integrate jira support to integrate command"
```

---

## Task 8: Update `AGENTS.md` — add `/jira` to command reference

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Find the command reference table**

In `AGENTS.md`, find the `## Command Reference` table.

- [ ] **Step 2: Add three `/jira` rows**

After the `/integrate` row, add:

```markdown
| `/jira fetch <id>` | Fetch and display a Jira ticket with description and acceptance criteria |
| `/jira start <id>` | Fetch ticket → create git branch → mark In Progress in Jira |
| `/jira done <id>` | Mark ticket Done in Jira → prompt to open PR |
```

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add /jira commands to AGENTS.md command reference"
```

---

## Task 9: Smoke test — trace a complete developer workflow

This task manually traces the full developer Jira workflow through the command files to verify correctness before shipping.

- [ ] **Step 1: Trace `/init` Jira step**

Read `.claude/commands/init.md`. Verify:
- Jira step appears after backend confirmation
- Credential block lists all 4 env keys (`JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY`)
- `jira: true/false` gets written to `PROJECT_CONFIG.md`
- PRD pre-answer skips the prompt

- [ ] **Step 2: Trace `/jira fetch APP-42`**

Read `.claude/commands/jira.md`. Verify the fetch flow:
1. Credential check reads `backend/.env.dev` ✓
2. GET `/rest/api/3/issue/APP-42` ✓
3. Extracts summary, priority, status, assignee, description, acceptance criteria ✓
4. Prints output with `👉 /jira start APP-42` prompt ✓

- [ ] **Step 3: Trace `/jira start APP-42`**

Verify the start flow in `.claude/commands/jira.md`:
1. Fetch ticket summary ✓
2. Slugify: "Add user login screen" → `add-user-login-screen` → branch `feat/APP-42-add-user-login-screen` ✓
3. Shows confirmation prompt before running git ✓
4. GET transitions → find "In Progress" id → POST transition ✓
5. Prints `👉 /plan` or `/tdd` prompt ✓

- [ ] **Step 4: Trace `/jira done APP-42`**

Verify the done flow:
1. `git branch --show-current` ✓
2. GET transitions → find "Done" id → POST transition ✓
3. Prints branch name + `/git-branch finish` prompt ✓

- [ ] **Step 5: Verify error paths**

Check that `.claude/commands/jira.md` handles:
- Missing credentials → `⚠️  Jira not configured` message ✓
- "In Progress" transition not found → warning + continue ✓
- "Done" transition not found → warning + still show PR prompt ✓
- Branch already exists on `/jira start` → switch instead of error ✓

- [ ] **Step 6: Final commit — version bump**

```bash
git add .
git status
```

Confirm all files are committed. Then:

```bash
git log --oneline -10
```

Verify clean commit history matching each task.

---

## Self-Review Checklist

After all tasks are complete:

- [ ] `PROJECT_CONFIG.md` has `jira` and `jiraProjectKey` fields
- [ ] `backend/.env.example` has all 4 Jira key placeholders
- [ ] `.claude/commands/init.md` has Jira step after backend confirmation, before git branching
- [ ] `.cursor/commands/init.md` mirrors identical Jira step
- [ ] `.claude/commands/jira.md` exists with `fetch`, `start`, `done` sub-commands
- [ ] `.cursor/commands/jira.md` is identical copy
- [ ] Both `integrate.md` files list jira as a supported service with its own phase block
- [ ] `AGENTS.md` has 3 `/jira` rows in command reference table
- [ ] Credential check runs before every sub-command
- [ ] All 4 error paths are handled in `jira.md`
- [ ] PRD-parsed Jira values skip the `/init` Jira prompt (no double-ask)
