# figma-to-screen

Converts Figma node to Flutter screen + state container.

## Steps
1. Receive Figma node URL from user
2. Call Figma MCP: get_design_context(nodeId)
3. Extract: layout structure, components, colors, typography, spacing
4. Map Figma tokens → project AppColors/AppTypography/AppSpacing
5. Generate Flutter view file (feature/presentation/views/<name>_view.dart)
6. Generate state container (providers/<name>_notifier.dart)
7. Generate widget tests
8. Generate golden test for visual regression
9. Run: flutter analyze on generated files

## Token Mapping Rules
Figma color name → AppColors token
Figma text style → AppTypography token
Figma spacing value → AppSpacing.sN (nearest match)
Figma border radius → AppRadius token

## Output Files
lib/src/features/<feature>/presentation/views/<screen>_view.dart
lib/src/features/<feature>/presentation/providers/<screen>_notifier.dart
test/widget/features/<feature>/views/<screen>_view_test.dart
test/golden/features/<feature>/<screen>_view_golden_test.dart
