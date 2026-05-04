#!/bin/bash
# Warn if interactive widget patterns lack Semantics wrapper.
FILE="$1"
if [[ "$FILE" == *.dart ]] && [[ "$FILE" != *.g.dart ]] && [[ "$FILE" != *_test.dart ]]; then
  if grep -qE "GestureDetector|IconButton|ElevatedButton|TextButton|InkWell" "$FILE" 2>/dev/null; then
    if ! grep -q "Semantics" "$FILE" 2>/dev/null; then
      echo "A11Y WARNING: $FILE has interactive widgets but no Semantics wrapper."
      echo "Add Semantics(identifier:, label:, hint:) around interactive elements."
    fi
  fi
fi
