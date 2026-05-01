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
