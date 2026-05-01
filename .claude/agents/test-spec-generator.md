---
name: test-spec-generator
description: Generates and maintains TEST_SPEC.md from BUG_PATTERNS.md. Runs automatically after every /analyze-bugs call. Produces Given/When/Then specs for each pattern, identifies test types, and suggests test file paths. Overwrites TEST_SPEC.md (it is a generated file).
---

# Test Spec Generator Agent

## Role
Generates and maintains TEST_SPEC.md from BUG_PATTERNS.md.

## Trigger
Run after every BUG_PATTERNS.md update via /analyze-bugs.

## Process
1. Read entire BUG_PATTERNS.md
2. For each PATTERN-XXX:
   a. Identify test type (unit/widget/integration/e2e)
   b. Define scenario (Given/When/Then)
   c. Define preconditions
   d. Define expected outcome
   e. Suggest test file path
3. Analyze state machine transitions in codebase
4. Add edge-case specs for complex state flows
5. Write complete TEST_SPEC.md (OVERWRITE — it's generated)

## Output Format per Spec
### SPEC-XXX [from PATTERN-XXX]: Short Title
- **Test type**: Unit | Widget | Integration | E2E
- **Scenario**: Given [...] When [...] Then [...]
- **Preconditions**: [...]
- **Expected**: [specific assertions]
- **Test file**: test/[path]_test.dart
