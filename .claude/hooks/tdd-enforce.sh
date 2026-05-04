#!/bin/bash
# Warn when a source file has no matching test file.
FILE="$1"
if [[ "$FILE" == frontend/lib/src/**/*.dart ]] && [[ "$FILE" != *.g.dart ]] && [[ "$FILE" != *.freezed.dart ]]; then
  TEST_FILE="${FILE/frontend\/lib\/src/frontend\/test\/unit}"
  TEST_FILE="${TEST_FILE/.dart/_test.dart}"
  if [ ! -f "$TEST_FILE" ]; then
    echo "WARNING: No test file found for $FILE"
    echo "Expected: $TEST_FILE"
  fi
fi
if [[ "$FILE" == backend/src/**/*.ts ]] && [[ "$FILE" != *.spec.ts ]]; then
  SPEC_FILE="${FILE/.ts/.spec.ts}"
  if [ ! -f "$SPEC_FILE" ]; then
    echo "WARNING: No spec file found for $FILE"
    echo "Expected: $SPEC_FILE"
  fi
fi
