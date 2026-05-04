#!/bin/bash
# Append edited file to MEMORY.md session log.
FILE="$1"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
echo "[$TIMESTAMP] Modified: $FILE" >> MEMORY.md
