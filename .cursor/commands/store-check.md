# /store-check — Store Compliance Checklist

## Checks
iOS:
  [ ] App icon: 1024x1024 PNG, no alpha
  [ ] Splash: flutter_native_splash configured
  [ ] Info.plist: all NSUsageDescription keys present
  [ ] PrivacyInfo.xcprivacy configured (iOS 17+)
  [ ] No private API usage
  [ ] Obfuscation flags in build command

Android:
  [ ] Adaptive icon: foreground + background layers
  [ ] minSdkVersion >= 24
  [ ] targetSdkVersion = latest stable
  [ ] 64-bit: arm64-v8a ABI split enabled
  [ ] ProGuard rules: verified on release APK
  [ ] All permissions in AndroidManifest.xml

Both:
  [ ] Obfuscate + split-debug-info in release builds
  [ ] Privacy policy URL in store listing
  [ ] Age rating completed

## What's next
```
✅ Done: Store compliance checklist complete.

👉 All checked → proceed to /release
   Items unchecked → resolve each, then re-run /store-check

⚠️  MANUAL STEPS that cannot be automated:
   - Privacy policy URL in App Store Connect / Google Play Console
   - Age rating questionnaire in App Store Connect
   - Screenshot upload (5.5" iPhone, 6.5" iPhone, 12.9" iPad if universal)
```
