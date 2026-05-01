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

## Coverage Report Format
Total: X tests
Coverage: X.X% line
Missing: [list files below 85%]
BUG_PATTERNS covered: [list PATTERN-XXX]
