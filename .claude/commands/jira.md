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
