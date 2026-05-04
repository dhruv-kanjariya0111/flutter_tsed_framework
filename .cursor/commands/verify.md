# /verify — Full Quality Gate

## Usage
```
/verify                  # run all applicable gates
/verify --flutter-only   # skip backend gates (useful when backendAccess: false)
/verify --backend-only   # skip Flutter gates
/verify --pre-release    # run all release gates sequentially (blocks on first failure)
/verify --a11y           # run only the WCAG AA accessibility check
/verify --perf           # run only the performance budget check
/verify --contract       # run only the openapi.yaml ↔ Flutter models contract check
/verify --offline        # run only the offline-first audit (requires offlineFirst: true)
/verify --store          # run only the store compliance check
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
7. Flutter model fields ↔ openapi.yaml exact match:
   - Read `shared/openapi.yaml`
   - Compare every response DTO field name, type, and nullability against Freezed models
   - FAIL if any field is renamed, added, removed, or has mismatched nullability

### Analytics gate (skipped if --backend-only or analyticsProvider: none)
7a. Validate analytics event coverage:
    - Read ANALYTICS_SCHEMA.md if it exists
    - Grep for `AnalyticsService.track(` in all feature provider files touched in this session
    - WARN (not fail) if a new feature provider has zero `track()` calls
    - FAIL if ANALYTICS_SCHEMA.md exists but a newly added event key is absent from it

### Quality gates (run on --pre-release or when the corresponding flag is set)
8. **A11y** (`--a11y` or `--pre-release`):
   - Scan all widget files changed in this session for interactive widgets missing `Semantics(identifier:, label:)`
   - Check touch target sizes: every GestureDetector / InkWell / IconButton must be ≥ 48×48 logical px
   - Verify no color-only meaning (icon or text must accompany color indicators)
   - FAIL on any missing Semantics identifier on an interactive element

9. **Perf** (`--perf` or `--pre-release`):
   - Run `flutter build appbundle --analyze-size --target-platform android-arm64`
   - Read `apk-analysis.json` total_size — FAIL if > 26214400 bytes (25 MB)
   - Check startup: no blocking `await` before `WidgetsBinding.instance.addPostFrameCallback`
   - WARN if any `ListView(children:[...])` found with > 5 children

10. **Offline** (`--offline` or `--pre-release`, only if `offlineFirst: true` in PROJECT_CONFIG.md):
    - Verify every repository has a local Hive/Drift read before any remote call
    - Check `SyncStatusWidget` is present in the main scaffold
    - Verify `connectivity_plus` subscription is cancelled in `dispose()`
    - FAIL if any data-fetching repository has no local cache path

11. **Store** (`--store` or `--pre-release`):
    - iOS: every `NS*UsageDescription` key present in Info.plist for requested permissions
    - iOS: `PrivacyInfo.xcprivacy` present if any iOS 17+ APIs used
    - Android: `minSdkVersion ≥ 24`, `targetSdkVersion` = latest stable
    - Android: `arm64-v8a` in abiFilters or `--split-per-abi` in release build script
    - App icons: iOS 1024×1024 no-alpha PNG; Android adaptive icon with safe zone
    - Splash: `flutter_native_splash` configured, no white flash
    - FAIL on any missing required item

## Integration tests
Always run if TEST_SPEC.md has specs tagged `Test type: Integration`:
- Run: `patrol test integration_test/`
- Tool: Patrol (default for all mobile integration tests)
- If integration tests fail: list each failing test with the SPEC-XXX it covers

### Pre-release gate (--pre-release flag only)
Runs ALL gates sequentially. Any failure stops immediately with a RELEASE BLOCKED verdict.

Gate order:
  1. Contract check — openapi.yaml ↔ Flutter models exact match
  2. Store check — icons, splash, NSUsageDescription, AndroidManifest permissions
  3. flutter test --coverage ≥ 85%
  4. Perf check — APK ≤ 25MB, startup < 2s, 60fps budget
  5. A11y check — WCAG AA compliance
  6. Version consistency check:
     - Read version from pubspec.yaml
     - Read version from package.json (if present)
     - Read latest version header from CHANGELOG.md
     - All three must match. If any differ: RELEASE BLOCKED.
  7. CHANGELOG.md has a dated entry for the current version (not just [Unreleased])

Output:
  RELEASE READY ✅   — all 7 gates passed
  RELEASE BLOCKED ❌  <gate number> <gate name>: <reason>

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
