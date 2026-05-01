# store-compliance

Full App Store and Google Play compliance audit.

## iOS Checklist
- [ ] App icon: assets/icons/icon_1024.png exists, no alpha channel
- [ ] Adaptive icon: foreground layer configured in pubspec.yaml
- [ ] Splash: flutter_native_splash config in pubspec.yaml
- [ ] Info.plist: NSCameraUsageDescription (if camera used)
- [ ] Info.plist: NSLocationWhenInUseUsageDescription (if location used)
- [ ] Info.plist: NSPhotoLibraryUsageDescription (if photos used)
- [ ] PrivacyInfo.xcprivacy: present and configured for iOS 17+
- [ ] No NSAllowsArbitraryLoads in production build

## Android Checklist
- [ ] minSdkVersion >= 24
- [ ] targetSdkVersion = latest stable
- [ ] Adaptive icon: mipmap-anydpi-v26/ic_launcher.xml exists
- [ ] All permissions in AndroidManifest.xml with rationale
- [ ] ProGuard rules verified on release APK
- [ ] 64-bit: abiFilters contains arm64-v8a

## Release Build Checklist
- [ ] --obfuscate flag in build command
- [ ] --split-debug-info flag with output path
- [ ] Debug info artifacts archived in Codemagic

## Output
COMPLIANCE SCORE: X/Y checks passing
BLOCKERS: [list — must fix before submission]
WARNINGS: [list — should fix]
