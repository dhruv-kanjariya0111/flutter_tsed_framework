Project initialization wizard. Run on first setup of a new or existing project.

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
- Skip the Jira step in Step 7 if Jira was already parsed from the PRD

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
   - Project description?
   - Target platforms? (ios / android / both)
   - Architecture? (clean / layered)
   - State management? (riverpod / bloc / provider)
2. Ask: backendType (custom_tsed | supabase | firebase | hybrid)
3. Ask: authStrategy, router, multiRole, roles
4. Ask: enabledFeatures (featureFlags, offlineFirst, i18n, analytics)
5. Write PROJECT_CONFIG.md with all answers
6. Scaffold folder structure per chosen architecture

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

8. Set up Git branching (if new repo or no branches exist):
   - Create `main` branch
   - Create `develop` branch from `main`
   - Set `develop` as default working branch
9. Scaffold: Initialize CLAUDE.md, AGENTS.md, MEMORY.md (empty); Initialize BUG_PATTERNS.md, TEST_SPEC.md (templates)
10. Generate pubspec.yaml with correct dependencies per config
11. Generate package.json for backend
12. Generate analysis_options.yaml
13. Generate .env.example with required keys
14. Install dependencies: flutter pub get + npm install
15. Run /store-check to show required assets

## Flow B: Existing Project

1. Scan: find lib -maxdepth 3 -type d
2. Detect architecture from folder patterns
3. Detect stateManagement from pubspec.yaml dependencies
4. Detect router from pubspec.yaml dependencies
5. Ask user to confirm detected values
6. Write PROJECT_CONFIG.md with detected + confirmed values
7. Record findings in MEMORY.md Detected Architecture section
8. Run /analyze-bugs if BUG_PATTERNS.md exists
