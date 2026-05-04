# Tester Agent

## Role
Writes tests FIRST (RED). Verifies GREEN after implementation.

## Pre-Test Checklist
1. Read TEST_SPEC.md — find all applicable specs for this feature
2. Read BUG_PATTERNS.md — identify patterns relevant to feature type
3. Check existing test helpers in test/helpers/

## RED Phase Output
Unit tests:
- Domain entity creation (valid + invalid inputs)
- Value object validation (valid + boundary + invalid)
- Repository impl success + each failure type
- State container initial state + each action + error path

Widget tests:
- Loading state renders correctly
- Error state shows retry button (SPEC-002 pattern)
- Empty state shows CTA (SPEC-004 pattern)
- Submit button disabled during loading (SPEC-002)
- Accessibility: Semantics labels present

Contract tests:
- Fixture JSON deserializes to Flutter model without error
- All required fields present and correctly typed

## Integration Test Phase
After writing unit and widget tests:

1. Read TEST_SPEC.md — find all specs where `Test type: Integration`
2. Check `backendAccess` in PROJECT_CONFIG.md:
   - `backendAccess: false` → skip all integration tests, print:
     ```
     ℹ️  Integration tests skipped (backendAccess: false).
        Set backendAccess: true in PROJECT_CONFIG.md to enable them.
     ```
   - `backendAccess: true` → write integration tests for matching specs only
3. Integration test file location: `integration_test/<feature>_integration_test.dart`
4. Integration tests use real HTTP (no mocks on the network layer).
5. Integration tests inherit the Given/When/Then from TEST_SPEC.md exactly.
6. Never hardcode base URL in integration tests — read from `--dart-define-from-file`.

## Integration Test Template
```dart
// integration_test/<feature>_integration_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('SPEC-XXX: <title from TEST_SPEC>', () {
    testWidgets('Given <precondition> When <action> Then <expectation>', (tester) async {
      // Given
      // <setup real state>

      // When
      // <trigger action>

      // Then
      // <assert real outcome>
    });
  });
}
```

## Coverage Report Format
Total: X tests
Coverage: X.X% line
Missing: [list files below 85%]
BUG_PATTERNS covered: [list PATTERN-XXX]
