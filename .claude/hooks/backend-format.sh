#!/bin/bash
# Auto-format changed TypeScript files with Prettier.
set -e
FILE="$1"
if [[ "$FILE" == backend/**/*.ts ]] || [[ "$FILE" == backend/src/**/*.ts ]]; then
  cd backend && npx prettier --write "${FILE#backend/}" 2>/dev/null || true
fi
