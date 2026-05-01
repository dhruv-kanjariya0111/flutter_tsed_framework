#!/bin/bash
# Warn if store assets are missing after editing asset configs.
FILE="$1"
if [[ "$FILE" == *"pubspec.yaml"* ]] || [[ "$FILE" == *"android/app"* ]] || [[ "$FILE" == *"ios/Runner"* ]]; then
  if [ ! -f "frontend/assets/icons/icon_1024.png" ]; then
    echo "WARNING: iOS app icon (assets/icons/icon_1024.png) not found."
    echo "Run: flutter pub run flutter_launcher_icons"
  fi
  if [ ! -f "frontend/android/app/src/main/res/mipmap-hdpi/ic_launcher.png" ]; then
    echo "WARNING: Android launcher icon not found."
    echo "Run: flutter pub run flutter_launcher_icons"
  fi
fi
