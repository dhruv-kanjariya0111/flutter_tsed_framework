#!/bin/bash
# Block destructive shell commands.
set -e
COMMAND="$1"
BLOCKED_PATTERNS=("rm -rf /" "curl.*|.*sh" "wget.*|.*sh" ":(){ :|:& };:" "dd if=/dev/zero" "mkfs" "fdisk" "parted")
for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "BLOCKED: Potentially destructive command detected: $COMMAND"
    exit 1
  fi
done
