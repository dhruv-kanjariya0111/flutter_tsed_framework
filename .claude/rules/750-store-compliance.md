# Store Compliance

## App Icons
- iOS: 1024x1024 PNG, no alpha, no rounded corners (OS applies mask).
- Android: adaptive icon — foreground layer (108x108dp safe zone 72x72dp) + background layer.
- flutter_launcher_icons package. Config in pubspec.yaml.

## Splash Screen
- flutter_native_splash package. No white flash on startup.
- Match brand primary color as background.

## iOS Requirements
- Info.plist: NSUsageDescription for EVERY requested permission.
- Missing description = automatic App Store rejection.
- PrivacyInfo.xcprivacy for iOS 17+ API usage tracking.
- No private APIs. No reflection bypassing App Review.

## Android Requirements
- minSdkVersion: >= 24 (Android 7.0).
- targetSdkVersion + compileSdkVersion: always latest stable.
- 64-bit support: arm64-v8a required. Use --split-per-abi.
- All permissions declared in AndroidManifest.xml with rationale.

## Release Build
- Obfuscation: --obfuscate --split-debug-info=build/debug-info (ALWAYS).
- Verify ProGuard rules on release APK before submission.
- AAB for Play Store, IPA for App Store.
