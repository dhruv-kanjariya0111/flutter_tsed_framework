# /sync-contract — API Contract Sync

## Flow
1. Read shared/openapi.yaml (source of truth)
2. Read all Flutter DTOs in frontend/lib/src/**/dtos/
3. Diff: field names, types, nullability, required/optional
4. Report mismatches
5. If mismatches found:
   - Ask user: update Flutter models to match openapi.yaml?
   - If yes: update Freezed models + run build_runner
6. Run flutter test test/contract/ to confirm sync
