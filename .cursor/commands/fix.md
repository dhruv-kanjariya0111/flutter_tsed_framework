# /fix <description> — Bug Fix Cycle

## Trigger
Developer describes a bug. Use this instead of ad-hoc code changes.

## Flow

### Phase 1: Web Research (mandatory — no vibe coding)
1. Search for the bug pattern in `BUG_PATTERNS.md` first.
   If a matching PATTERN-XXX exists: read the `## Fix` section — that is the known solution.
2. If not in BUG_PATTERNS: search the web for:
   - The exact error message (if there is one)
   - `flutter <symptom> fix site:stackoverflow.com OR github.com/flutter`
   - Current package version issues if a 3rd-party package is involved
3. Show research summary:
   ```
   🔍 Research findings:
      Matched pattern: PATTERN-XXX (if found)  OR  No matching pattern
      Root cause hypothesis: <what you believe is causing this>
      Proposed fix: <specific change>
      Reference: <URL if from web>
   ```
4. Ask developer to confirm hypothesis before writing any code:
   > "Does this match what you're seeing? Shall I proceed with this fix?"

### Phase 2: Write failing test first (RED)
1. Find or create the test file for the affected module.
2. Write a test that reproduces the bug exactly — it must FAIL before the fix.
3. Run it to confirm RED state:
   ```
   flutter test test/path/to/test_file.dart --name "test name" -v
   Expected: FAIL
   ```

### Phase 3: Implement fix (GREEN)
1. Apply the minimal change that makes the failing test pass.
2. Do not refactor surrounding code — that is `/refactor`, not `/fix`.
3. Run the full test file to confirm no regressions.

### Phase 4: 3rd-party or configuration errors
If the bug is caused by a missing configuration, wrong key, or external service setup:
```
⚠️  CONFIGURATION REQUIRED — cannot fix by code alone:
   Issue: <describe the config problem>
   Action needed: <exact manual step with where to find it>
   Example: Add GOOGLE_CLIENT_ID to frontend/.env.dev — get it from Google Cloud Console → OAuth Credentials
   Tell me when done and I will continue.
```
**Never guess config values. Always stop and ask the developer.**

### Phase 5: Verify
Run `/verify --flutter-only` (or `--backend-only` if backend bug).

### Phase 6: Branch hygiene
If you are not on a fix branch:
```
ℹ️  This fix should be committed on a branch named: fix/<short-description>
   From develop: git checkout -b fix/<short-description>
   Or if it's urgent (production): git checkout -b hotfix/<short-description> main
```

## What's next
```
✅ Done: Bug fixed. Test added. /verify passed.

👉 Next step: → /review "<module>"   (optional — recommended if the fix touched core logic)
   Add to BUG_PATTERNS? → tell me to add it so future projects benefit

   Then merge:
     git checkout develop
     git merge --no-ff fix/<short-description>
     git branch -d fix/<short-description>

💡 Example:
   /review "auth module"
```
