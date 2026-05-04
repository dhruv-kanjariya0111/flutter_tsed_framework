#!/bin/bash
# Desktop notification on task completion (macOS).
if command -v osascript &> /dev/null; then
  osascript -e 'display notification "Agent task completed" with title "Flutter Framework"'
fi
echo "Task completed at $(date '+%H:%M:%S')"
