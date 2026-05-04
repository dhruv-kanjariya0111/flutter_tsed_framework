# /analyze-bugs — Bug Pattern Analysis

## Flow
1. Read full BUG_PATTERNS.md
2. Group patterns by category
3. Delegate to test-spec-generator agent
4. Agent generates/updates TEST_SPEC.md
5. Report:
   - N patterns analyzed
   - N new specs generated
   - N regression tests missing (no test file yet)
   - Suggested /tdd calls for missing coverage

## Test Type Assignment Rules
When the test-spec-generator writes TEST_SPEC.md, each SPEC must be tagged with exactly one test type using these rules:

| Test type | When to use |
|---|---|
| `Unit` | Pure logic — entity creation, value object validation, repository failure paths |
| `Widget` | UI state — loading/error/empty renders, button disabled during loading, Semantics labels |
| `Integration` | Cross-layer — real HTTP call, real auth flow, real DB write, deep link routing |
| `E2E` | Full user journey spanning multiple screens — login → dashboard → action → result |

Integration tests are only written when `backendAccess: true` in PROJECT_CONFIG.md.
E2E tests are only written when explicitly requested — they are expensive and slow.

## What's next
```
✅ Done: BUG_PATTERNS.md analyzed. TEST_SPEC.md regenerated with <N> specs.

👉 Next step:
   Fix a known bug?     → /fix "<bug description>"
   Build a new feature? → /plan "<feature>"  (tester will pick up specs automatically)
   Just explore?        → /explore "<question>"

💡 Example:
   /fix "cart total is wrong when discount applied"
   /plan "order history screen"
```
