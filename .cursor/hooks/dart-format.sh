#!/bin/bash
# Auto-format changed Dart files. Skips generated files.
set -e
FILE="$1"
if [[ "$FILE" == *.dart ]] && [[ "$FILE" != *.g.dart ]] && [[ "$FILE" != *.freezed.dart ]]; then
  dart format --set-exit-if-changed "$FILE" 2>/dev/null || true
fi
