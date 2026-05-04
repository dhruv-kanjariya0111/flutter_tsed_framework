#!/bin/bash
# Warn on common performance anti-patterns.
FILE="$1"
if [[ "$FILE" == *.dart ]] && [[ "$FILE" != *.g.dart ]] && [[ "$FILE" != *_test.dart ]]; then
  if grep -qE "ListView\(" "$FILE" 2>/dev/null; then
    if ! grep -qE "ListView\.builder|ListView\.separated|SliverList" "$FILE" 2>/dev/null; then
      echo "PERF WARNING: $FILE uses ListView() — use ListView.builder() for dynamic content."
    fi
  fi
fi
