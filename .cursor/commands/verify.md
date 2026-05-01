# /verify — Full Quality Gate

## Steps (all must pass)
1. dart format --set-exit-if-changed frontend/
2. flutter analyze --fatal-infos frontend/
3. flutter test --coverage frontend/ (≥85% required)
4. npm run lint (backend — zero warnings)
5. npm run test (backend — all pass)
6. npm run openapi:validate (openapi.yaml valid)
7. /verify-contract (Flutter models ↔ openapi.yaml match)
8. /a11y-check (WCAG AA — accessibility pass)
9. /perf-check (startup < 2s, size within budget)

## Output
PASS: all gates green
FAIL: list each failing gate with specific error
