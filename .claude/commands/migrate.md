# /migrate <target> — Platform Migration

## Phase 0: Source Analysis (runs automatically on first /migrate call)
If `MIGRATION_MAP.md` does not exist yet, run source analysis first:
1. Scan source project at the path provided
2. Detect: framework (React/RN/Android/iOS/web), state management, navigation, auth pattern
3. Catalog: all screens, components, API calls, native features used
4. Ask developer to confirm backend situation:
   - Does the existing backend remain unchanged? (yes/no)
   - Is the backend Supabase, Firebase, or custom REST?
5. Generate `MIGRATION_MAP.md`:
   - Source file → Flutter equivalent mapping
   - Complexity per screen (S/M/L/XL)
   - Native features requiring Flutter plugins
   - Backend type noted
   - Estimated wave timeline
6. Present MIGRATION_MAP.md for developer review and approval before any Flutter code is written.

If `MIGRATION_MAP.md` already exists, skip to the wave targets below.

## Targets
all              — run all waves in sequence
design-system    — Wave 1: tokens
components       — Wave 2: shared widgets
navigation       — Wave 3: routing
screen:<name>    — Wave 4: single screen
feature:<name>   — Wave 5: feature group
native-features  — Wave 6: camera/push/maps/biometrics

## Rules
- reference-first: open source → extract intent → write Flutter (NEVER translate syntax)
- Run /verify after each wave
- Golden test for each migrated screen

## Backend Awareness During Migration
Read `backendFramework` from PROJECT_CONFIG.md:
- `tsed` or `node`: `/sync-contract` after each wave to align Flutter models with existing API
- `supabase` or `firebase`: Use SDK methods — no openapi.yaml needed
- `none` / unknown: Mock all API calls; flag for developer to fill in later

## Environment Note
During migration, environment files should be created for both dev and prod:
- Copy any `.env` from source project as reference
- Map source env vars to Flutter's `--dart-define-from-file` pattern
- Create `frontend/.env.dev` and `frontend/.env.prod`

## What's next
```
✅ Done: Wave <N> migrated. /verify run.

👉 Next step:
   More screens to migrate? → /migrate "<next-screen-name>"
   All screens done?        → /review "<feature-set>"
   Backend to align?        → /sync-contract

💡 Example:
   /migrate "profile screen"
   /sync-contract
```
