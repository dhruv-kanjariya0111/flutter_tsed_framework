# /verify — Full Quality Gate

## Usage
```
/verify                  # run all applicable gates
/verify --flutter-only   # skip backend gates (useful when backendAccess: false)
/verify --backend-only   # skip Flutter gates
/verify --pre-release    # flutter-only + a11y + perf + store checks
```

## Backend Gate Skip Logic
Read `backendFramework` and `backendAccess` from PROJECT_CONFIG.md:

- `backendFramework: supabase | firebase | none` OR `backendAccess: false`:
  → Skip steps 4, 5, 6 (backend lint, test, openapi validate)
  → Print:
  ```
  ℹ️  Backend gates skipped — backendFramework: supabase/firebase/none or backendAccess: false.
  ```
- `backendFramework: tsed | node` AND `backendAccess: true`:
  → Run all backend gates.

## Steps (all must pass for their category)

### Flutter gates (always run unless --backend-only)
1. `dart format --set-exit-if-changed frontend/`
2. `flutter analyze --fatal-infos frontend/`
3. `flutter test --coverage frontend/` — coverage ≥ 85% required

### Backend gates (skipped per logic above)
4. `npm run lint` — zero warnings
5. `npm run test` — all pass
6. `npm run openapi:validate` — openapi.yaml valid

### Contract gate (skipped if backendFramework: supabase/firebase/none)
7. `/sync-contract` — Flutter models ↔ openapi.yaml exact match

### Quality gates (run on --pre-release or when relevant flags set)
8. `/a11y-check` — WCAG AA — all Semantics present, touch targets ≥ 48x48
9. `/perf-check` — startup < 2s, APK delta ≤ 25MB
10. `/offline-check` — only if `offlineFirst: true` in PROJECT_CONFIG.md
11. `/store-check` — only on --pre-release

## Integration tests
If `backendAccess: true` and TEST_SPEC.md has specs tagged `Test type: Integration`:
- Run: `flutter test integration_test/`
- If integration tests fail: list each failing test with the SPEC-XXX it covers

## Output
```
PASS ✅  all applicable gates green
FAIL ❌  <list each failing gate with exact error and file:line>
```

## What's next
```
✅ Done: All quality gates passed.

👉 Next step: → /review "<feature>"   (8-dimension code review)
   Pre-release? → /release patch|minor|major

💡 Example:
   /review "user authentication"
   /release minor
```
