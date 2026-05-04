# /tdd <feature> — Full TDD Cycle

## Phases
Phase 1: /plan (orchestrator) → human approval
Phase 2: tester writes failing tests (RED) using TEST_SPEC.md guidance
  - Confirm RED state before proceeding
Phase 2b: Integration test phase (see below)
Phase 3: flutter-coder implements feature (GREEN)
Phase 4: tester verifies coverage ≥85% and all specs pass
Phase 5: analytics-agent adds event tracking
Phase 6: /verify (all applicable quality gates)
Phase 7: reviewer 8-dimension check
  - APPROVE → done
  - WARN → fix warnings, re-verify
  - FAIL → fix failures, restart from Phase 3

## Web Research Gate (mandatory before Phase 3)
Before flutter-coder writes any code, search for:
1. Current pub.dev packages needed for this feature
2. BUG_PATTERNS.md entries relevant to this feature type
3. If a 3rd-party SDK is used: official Flutter integration guide for the current SDK version

Show research summary before proceeding to implementation:
```
🔍 Research summary:
   Package: <name> v<version>
   Pitfall from BUG_PATTERNS: <PATTERN-XXX if applicable>
   Reference: <URL>
```

## Integration Test Phase (Phase 2b — after unit/widget RED)
After writing unit and widget failing tests (Phase 2), the tester agent MUST:
1. Read TEST_SPEC.md
2. Find all specs tagged `Test type: Integration` that apply to this feature
3. Write integration test files for those specs ONLY if `backendAccess: true` in PROJECT_CONFIG.md
4. If `backendAccess: false`:
   ```
   ℹ️  Integration tests skipped — backendAccess: false in PROJECT_CONFIG.md.
      Set backendAccess: true when backend is available to enable them.
   ```
Integration tests target real backend (or emulator) — never mock the HTTP layer.
Integration test files go in: `integration_test/<feature>_integration_test.dart`

## Environment Note
If the feature behaves differently per environment (dev vs prod), add a test variant that reads from `.env.dev`:
```dart
// integration_test/<feature>_integration_test.dart
// Reads baseUrl from DART_DEFINE or env file — never hardcode
```

## What's next
```
✅ Done: Feature implemented, all tests green, analytics events tracked.

👉 Next step: → /verify

💡 Example:
   /verify
   (then if PASS) → /review "<feature>"
```
