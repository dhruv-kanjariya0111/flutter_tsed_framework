# /widgetbook — Widgetbook Component Catalogue

## Prerequisite
Read `widgetbook` field from PROJECT_CONFIG.md.

If `widgetbook: false` or field is absent:
```
ℹ️  Widgetbook is disabled for this project.
    Set widgetbook: true in PROJECT_CONFIG.md to enable.
```
Stop.

## Step 1: Verify dependency

Check `frontend/pubspec.yaml` for a `widgetbook` entry under `dev_dependencies`.

If missing, print:
```
⚠️  widgetbook package not found in pubspec.yaml.

Add to dev_dependencies:
  widgetbook: ^3.x.x
  widgetbook_annotation: ^3.x.x

Then run: cd frontend && flutter pub get
```
Stop until the developer adds it and re-runs `/widgetbook`.

## Step 2: Scan for widgets

Find all non-generated widget files:
```
frontend/lib/features/**/presentation/widgets/**/*.dart
```
Exclude: `*.g.dart`, `*.freezed.dart`, `*_test.dart`

For each file, identify classes that `extends StatelessWidget` or `extends StatefulWidget`.

## Step 3: Generate missing stories

For each widget class that has **no** corresponding story file at:
```
frontend/widgetbook/<feature>/<WidgetName>_stories.dart
```

Generate the story file with this structure:
```dart
import 'package:widgetbook/widgetbook.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' show UseCase;
import 'package:frontend/<feature>/presentation/widgets/<widget_file>.dart';

@UseCase(name: 'Default', type: <WidgetName>)
Widget default<WidgetName>(BuildContext context) {
  return <WidgetName>(
    // Use knobs for all required constructor parameters:
    // String params:  context.knobs.string(label: 'param', initialValue: '')
    // bool params:    context.knobs.boolean(label: 'param', initialValue: false)
    // int params:     context.knobs.int.input(label: 'param', initialValue: 0)
    // Callback params: () {}
  );
}

// Add error/empty state UseCase if the widget has an isError or isEmpty parameter
```

## Step 4: Ensure widgetbook entry point exists

Check for `frontend/widgetbook/main.dart`. If absent, create:
```dart
import 'package:flutter/material.dart';
import 'package:widgetbook/widgetbook.dart';

// Import all story files here — re-run /widgetbook after adding new features
// import '<feature>/<widget>_stories.dart';

void main() {
  runApp(const WidgetbookApp());
}

class WidgetbookApp extends StatelessWidget {
  const WidgetbookApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Widgetbook.material(
      directories: [
        // Add WidgetbookCategory entries per feature
      ],
      addons: [
        DeviceFrameAddon(devices: [Devices.ios.iPhone13, Devices.android.samsungGalaxyS20]),
        TextScaleAddon(min: 1.0, max: 2.0),
        ThemeAddon(themes: [
          WidgetbookTheme(name: 'Light', data: ThemeData.light()),
          WidgetbookTheme(name: 'Dark', data: ThemeData.dark()),
        ]),
      ],
    );
  }
}
```

## Step 5: Run Widgetbook

```
cd frontend && flutter run -t widgetbook/main.dart -d chrome
```

## Output
```
✅ Widgetbook ready
Stories generated: <N> new, <M> already existed
Entry point: frontend/widgetbook/main.dart
Running at: http://localhost:<port>
```
