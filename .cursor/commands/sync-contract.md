# /sync-contract — API Contract Sync

## Backend Type Skip Logic
Read `backendFramework` from PROJECT_CONFIG.md:
- `supabase` | `firebase` | `none`:
  ```
  ℹ️  /sync-contract skipped — no openapi.yaml contract used with Supabase/Firebase/none backend.
     Flutter models are sourced directly from the SDK or kept as local types.
  ```
- `tsed` | `node`: run full contract sync below.

## Flow (tsed / node only)
1. Read shared/openapi.yaml (source of truth)
2. Read all Flutter DTOs in frontend/lib/src/**/dtos/
3. Diff: field names, types, nullability, required/optional
4. Report mismatches
5. If mismatches found:
   - Ask user: update Flutter models to match openapi.yaml?
   - If yes: update Freezed models + run build_runner
6. Run flutter test test/contract/ to confirm sync

## What's next
```
✅ Done: Flutter models and openapi.yaml are in sync.

👉 Next step: → /verify

💡 Example:
   /verify
```
