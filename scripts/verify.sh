#!/bin/bash
# Full quality gate — mirrors /verify command.
set -e

echo "=== Running Full Quality Gate ==="

echo ""
echo "1/9 — dart format..."
cd frontend && dart format --set-exit-if-changed . && echo "✓ Formatted"

echo ""
echo "2/9 — flutter analyze..."
flutter analyze --fatal-infos && echo "✓ No analysis issues"

echo ""
echo "3/9 — flutter test + coverage..."
flutter test --coverage
COVERAGE=$(lcov --summary coverage/lcov.info 2>&1 | grep "lines" | grep -oP '\d+\.\d+(?=%)')
echo "Coverage: $COVERAGE%"
if (( $(echo "$COVERAGE < 85" | bc -l) )); then
  echo "FAIL: Coverage $COVERAGE% is below 85%"
  exit 1
fi
echo "✓ Coverage $COVERAGE%"
cd ..

echo ""
echo "4/9 — backend lint..."
cd backend && npm run lint && echo "✓ No lint errors"

echo ""
echo "5/9 — backend tests..."
npm run test && echo "✓ All tests pass"

echo ""
echo "6/9 — OpenAPI validate..."
npm run openapi:validate && echo "✓ OpenAPI schema valid"
cd ..

echo ""
echo "7-9: Run /verify-contract, /a11y-check, /perf-check in Cursor/Claude Code"
echo ""
echo "=== Quality Gate: PASSED ==="
