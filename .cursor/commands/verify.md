# /verify — Full Quality Gate

## Usage
```
/verify                   # all applicable gates
/verify --flutter-only    # skip backend gates (backendAccess: false)
/verify --backend-only    # skip Flutter gates
/verify --pre-release     # flutter + a11y + perf + store-check
/verify --a11y            # accessibility audit only
/verify --perf            # performance budget only
/verify --contract        # API contract sync only
```

## Backend gate skip logic
Read `backendFramework` and `backendAccess` from PROJECT_CONFIG.md:
- `supabase | firebase | none` OR `backendAccess: false` → skip steps 4, 5, 6
- `tsed | node` AND `backendAccess: true` → run all backend gates

---

## Gates (run in order — all must pass for their category)

### Flutter gates (always, unless --backend-only)
1. `dart format --set-exit-if-changed frontend/`
2. `flutter analyze --fatal-infos frontend/`
3. `flutter test --coverage frontend/` — coverage ≥ 85% required

### Backend gates (skipped per logic above)
4. `npm run lint` — zero warnings
5. `npm run test` — all pass
6. `npm run openapi:validate` — openapi.yaml valid

### Contract gate (skipped if backendFramework: supabase/firebase/none)
7. Flutter DTOs ↔ openapi.yaml exact match
   - Read shared/openapi.yaml (source of truth)
   - Diff field names, types, nullability against frontend/lib/**/dtos/
   - If drift found: ask user → update Freezed models → run build_runner
   - Run flutter test test/contract/ to confirm

### Accessibility gate (--pre-release or --a11y)
8. Run `flutter test --tags a11y`
   - All interactive widgets have `Semantics(identifier, label)`
   - Touch targets ≥ 48×48dp on all buttons
   - No hardcoded colors bypassing theme (contrast risk)
   - All images have semanticsLabel or are excluded
   - Form fields have associated labels and error announcements
   Pass / Fail — list missing Semantics, touch target violations, contrast issues

### Performance gate (--pre-release or --perf)
9. `flutter build appbundle --analyze-size --target-platform android-arm64`
   - Total AAB ≤ 25MB (26,214,400 bytes)
   - Run integration test: time_to_first_frame < 2000ms
   - Check anti-patterns: ListView with children:[], missing const, heavy main-isolate work, missing RepaintBoundary

### Offline gate (only if `offlineFirst: true` in PROJECT_CONFIG.md)
10. All repositories implement SyncRepository pattern
    - Hive/Drift initialized before routing
    - All cached entities have TypeAdapters
    - Connectivity detected + offline banner shown
    - Failed mutations queued and retried on reconnect
    - No direct API calls from presentation without cache fallback

### Store compliance gate (--pre-release only)
11. iOS: App icon 1024×1024 no-alpha, Info.plist NSUsageDescription keys, PrivacyInfo.xcprivacy (iOS 17+), no private API
    Android: Adaptive icon, minSdkVersion ≥ 24, targetSdkVersion latest, 64-bit ABI, ProGuard rules verified
    Both: obfuscate + split-debug-info in release builds, privacy policy URL

### Integration tests (if TEST_SPEC.md has Integration-tagged specs)
12. `patrol test integration_test/`
    - List each failing test with the SPEC-XXX it covers

---

## Output
```
PASS ✅  all applicable gates green
FAIL ❌  <each failing gate — exact error and file:line>
```

## What's next
```
✅ Done: all quality gates passed.

👉 Next step: → /review "<feature>"
   Pre-release? → /release patch|minor|major

💡 Examples:
   /review "user authentication"
   /release minor
```
