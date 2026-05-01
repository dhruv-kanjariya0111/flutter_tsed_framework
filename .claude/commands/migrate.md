Platform migration from React/RN/Android/iOS to Flutter. Usage: /migrate <target>

## Targets
all              — run all waves in sequence
design-system    — Wave 1: tokens
components       — Wave 2: shared widgets
navigation       — Wave 3: routing
screen:<name>    — Wave 4: single screen
feature:<name>   — Wave 5: feature group
native-features  — Wave 6: camera/push/maps/biometrics

## Rules
- reference-first: open source → extract intent → write Flutter
- NEVER translate syntax
- Run /verify after each wave
- Golden test for each migrated screen
