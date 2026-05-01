# /perf-check — Performance Budget Check

## Steps
1. flutter build appbundle --analyze-size --target-platform android-arm64
2. Check apk-analysis.json: total size <= 26214400 bytes (25MB)
3. Run integration test: measure time_to_first_frame
4. Verify time_to_first_frame < 2000ms
5. Check for common perf anti-patterns:
   - ListView with children:[] (must be .builder)
   - Missing const constructors
   - Heavy work on main isolate (missing compute())
   - Missing RepaintBoundary on animated widgets

## Fail Criteria
- APK > 25MB
- First meaningful paint > 2000ms
- Any ListView with > 5 items not using .builder
