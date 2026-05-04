# /jira — Jira Ticket Integration

## Trigger
Developer wants to interact with Jira tickets: fetch details, start work on a ticket, or update ticket status.

## Credentials Check

Before running any sub-command, verify the following environment variables exist in `backend/.env.dev`:

| Variable | Description |
|---|---|
| `JIRA_URL` | Base URL of your Jira instance (e.g. `https://yourcompany.atlassian.net`) |
| `JIRA_EMAIL` | Atlassian account email used to authenticate |
| `JIRA_API_TOKEN` | API token from https://id.atlassian.com/manage-profile/security/api-tokens |
| `JIRA_PROJECT_KEY` | JIRA_PROJECT_KEY — used as a display reference; commands use the ticket-id prefix (e.g. APP-42) directly from user input. |

If any of `JIRA_URL`, `JIRA_EMAIL`, or `JIRA_API_TOKEN` are missing or empty, print:
```
⚠️  Missing Jira credentials. Set JIRA_URL, JIRA_EMAIL, and JIRA_API_TOKEN in backend/.env.dev.
```
and stop.

---

## Sub-commands

### `/jira fetch <ticket-id>`

Fetch and display full details of a Jira ticket.

**Steps:**

1. Read `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` from `backend/.env.dev`.

2. Call the Jira REST API:
   ```
   GET {JIRA_URL}/rest/api/3/issue/{ticket-id}
   Authorization: Basic base64({JIRA_EMAIL}:{JIRA_API_TOKEN})
   Accept: application/json
   ```

   **HTTP error handling:**
   - `404`: Print `⚠️  Ticket {ticket-id} not found. Check the ticket ID and project key.` and stop.
   - `401`: Print `⚠️  Jira auth failed. Check JIRA_EMAIL and JIRA_API_TOKEN in backend/.env.dev.` and stop.
   - Other `5xx`: Print `⚠️  Jira API error ({status}). Try again or check your JIRA_URL.` and stop.

3. Parse the response fields:
   - `fields.summary` → ticket title
   - `fields.status.name` → current status
   - `fields.assignee.displayName` → assignee (or "Unassigned")
   - `fields.priority.name` → priority
   - `fields.description` → ADF (Atlassian Document Format) body. **If `fields.description` is null or empty, print 'No description.' instead of attempting ADF parsing.**
   - `fields.labels` → array of label strings
   - `fields.fixVersions[].name` → fix version(s)

4. Print the ticket summary:
   ```
   ─────────────────────────────────────────
   🎫  {ticket-id}: {summary}
   ─────────────────────────────────────────
   Status:     {status}
   Assignee:   {assignee}
   Priority:   {priority}
   Labels:     {labels or "none"}
   Fix Ver:    {fix versions or "none"}

   Description:
   {plain-text extracted from ADF, or "No description."}
   ─────────────────────────────────────────
   ```

---

### `/jira start <ticket-id>`

Begin work on a Jira ticket: create a Git branch, transition the ticket to "In Progress", and assign it to yourself.

**Steps:**

1. Read `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` from `backend/.env.dev`.

2. Call `/jira fetch <ticket-id>` internally to get the ticket summary. Apply all HTTP error handling as defined in the fetch section above.

   **Build branch name from summary:**
   - Lowercase the summary.
   - Replace spaces and special characters with `-`.
   - Truncate to 50 characters.
   - Strip leading/trailing `-`.
   - If the slugified summary is empty after processing, use the ticket ID alone as the branch name: `feat/{ticket-id}`.
   - Final branch name format: `feat/{ticket-id}-{slugified-summary}`

   **Git state validation (Step 2.5):**
   Run `git status --porcelain`. If the output is non-empty (uncommitted changes exist), warn:
   ```
   ⚠️  You have uncommitted changes. Commit or stash them before starting a new ticket branch.
   ```
   and stop.

3. Confirm with developer:
   ```
   ▶  Ready to start work on {ticket-id}:
      Branch:   feat/{ticket-id}-{slugified-summary}
      Action:   Transition → "In Progress", assign to {JIRA_EMAIL}

   Proceed? [y/N]
   ```
   Wait for confirmation. If not confirmed, stop.

4. Create and checkout the branch:
   ```
   git checkout -b feat/{ticket-id}-{slugified-summary}
   ```

5. Transition the ticket to "In Progress":
   - First, fetch available transitions:
     ```
     GET {JIRA_URL}/rest/api/3/issue/{ticket-id}/transitions
     Authorization: Basic base64({JIRA_EMAIL}:{JIRA_API_TOKEN})
     ```
     **HTTP error handling:**
     - `404`: Print `⚠️  Ticket {ticket-id} not found. Check the ticket ID and project key.` and stop.
     - `401`: Print `⚠️  Jira auth failed. Check JIRA_EMAIL and JIRA_API_TOKEN in backend/.env.dev.` and stop.
     - Other `5xx`: Print `⚠️  Jira API error ({status}). Try again or check your JIRA_URL.` and stop.
   - Find the transition ID whose `name` matches "In Progress" (case-insensitive).
   - POST the transition:
     ```
     POST {JIRA_URL}/rest/api/3/issue/{ticket-id}/transitions
     Authorization: Basic base64({JIRA_EMAIL}:{JIRA_API_TOKEN})
     Content-Type: application/json
     Body: { "transition": { "id": "{transition-id}" } }
     ```
     **HTTP error handling:**
     - `404`: Print `⚠️  Ticket {ticket-id} not found. Check the ticket ID and project key.` and stop.
     - `401`: Print `⚠️  Jira auth failed. Check JIRA_EMAIL and JIRA_API_TOKEN in backend/.env.dev.` and stop.
     - Other `5xx`: Print `⚠️  Jira API error ({status}). Try again or check your JIRA_URL.` and stop.

6. Assign ticket to yourself:
   - Fetch your Jira account ID:
     ```
     GET {JIRA_URL}/rest/api/3/myself
     Authorization: Basic base64({JIRA_EMAIL}:{JIRA_API_TOKEN})
     ```
     **HTTP error handling:**
     - `401`: Print `⚠️  Jira auth failed. Check JIRA_EMAIL and JIRA_API_TOKEN in backend/.env.dev.` and stop.
     - Other `5xx`: Print `⚠️  Jira API error ({status}). Try again or check your JIRA_URL.` and stop.
   - Assign ticket:
     ```
     PUT {JIRA_URL}/rest/api/3/issue/{ticket-id}/assignee
     Authorization: Basic base64({JIRA_EMAIL}:{JIRA_API_TOKEN})
     Content-Type: application/json
     Body: { "accountId": "{your-account-id}" }
     ```
     **HTTP error handling:**
     - `404`: Print `⚠️  Ticket {ticket-id} not found. Check the ticket ID and project key.` and stop.
     - `401`: Print `⚠️  Jira auth failed. Check JIRA_EMAIL and JIRA_API_TOKEN in backend/.env.dev.` and stop.
     - Other `5xx`: Print `⚠️  Jira API error ({status}). Try again or check your JIRA_URL.` and stop.

7. Print success:
   ```
   ✅  Started {ticket-id}
       Branch:     feat/{ticket-id}-{slugified-summary}  ← you are here
       Status:     In Progress
       Assigned:   {JIRA_EMAIL}

   👉  Next: implement, then run /verify before opening a PR.
   ```

---

### `/jira done <ticket-id>`

Mark a Jira ticket as "Done" and open a pull request.

**Steps:**

1. Read `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` from `backend/.env.dev`.

2. Transition ticket to "Done":
   - Fetch available transitions:
     ```
     GET {JIRA_URL}/rest/api/3/issue/{ticket-id}/transitions
     Authorization: Basic base64({JIRA_EMAIL}:{JIRA_API_TOKEN})
     ```
     **HTTP error handling:**
     - `404`: Print `⚠️  Ticket {ticket-id} not found. Check the ticket ID and project key.` and stop.
     - `401`: Print `⚠️  Jira auth failed. Check JIRA_EMAIL and JIRA_API_TOKEN in backend/.env.dev.` and stop.
     - Other `5xx`: Print `⚠️  Jira API error ({status}). Try again or check your JIRA_URL.` and stop.
   - Find the transition whose `name` matches "Done" (case-insensitive).
   - POST the transition with the resolved ID.
     **HTTP error handling:**
     - `404`: Print `⚠️  Ticket {ticket-id} not found. Check the ticket ID and project key.` and stop.
     - `401`: Print `⚠️  Jira auth failed. Check JIRA_EMAIL and JIRA_API_TOKEN in backend/.env.dev.` and stop.
     - Other `5xx`: Print `⚠️  Jira API error ({status}). Try again or check your JIRA_URL.` and stop.

3. Print summary:
   ```
   ✅  {ticket-id} marked as Done.

   👉  Next steps:
       1. Open a PR for your branch.
       2. Reference the ticket in the PR description: Closes {ticket-id}
       3. Run /verify before merging.
   ```

---

## Notes

- All API calls use **Basic Auth**: `base64({JIRA_EMAIL}:{JIRA_API_TOKEN})`.
- The Jira REST API version used is **v3**.
- Never log or print the raw `JIRA_API_TOKEN` value.
- ADF (Atlassian Document Format) description should be converted to plain text for display. Extract text content from `content[].content[].text` nodes recursively. If `fields.description` is null or empty, print 'No description.' instead of attempting ADF parsing.
