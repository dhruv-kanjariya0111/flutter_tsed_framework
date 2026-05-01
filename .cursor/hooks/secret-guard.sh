#!/bin/bash
# Block sensitive files from AI context. Fails closed.
set -e
FILE="$1"
SENSITIVE_PATTERNS=(".env" ".env.dev" ".env.staging" ".env.prod" ".pem" ".key" "google-services.json" "GoogleService-Info.plist" "keystore.jks" ".p12" ".mobileprovision")
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
  if [[ "$FILE" == *"$pattern"* ]]; then
    echo "BLOCKED: $FILE contains sensitive data and cannot be read by AI context."
    exit 1
  fi
done
