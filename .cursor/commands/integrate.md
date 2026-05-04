# /integrate <service> — 3rd-Party Integration

## Trigger
Developer wants to add a 3rd-party service: Firebase Auth, Supabase Auth, Google Sign-In, Apple Sign-In, push notifications (FCM/APNs), Stripe, RevenueCat, Sentry, Mixpanel, Intercom, etc.

## Flow

### Phase 1: Web Research (mandatory)
Search for:
1. Official Flutter integration guide for `<service>` — current version
2. Required native setup steps (iOS entitlements, Android manifest, google-services.json, etc.)
3. Known compatibility issues with current Flutter version from `frontend/pubspec.yaml`
4. Current pub.dev package version

Show research summary:
```
🔍 Integration research: <service>
   Official guide: <URL>
   Flutter package: <package_name> v<version>
   Native steps required: <yes/no + summary>
   Compatibility notes: <any known issues>
```

### Phase 2: Manual steps (always shown before any code)
List all steps the developer must do manually — in order:
```
⚠️  MANUAL STEPS REQUIRED before I write any code:

  [1] <exact step with where to navigate>
      Example: Firebase Console → Project Settings → Add iOS app → Download GoogleService-Info.plist
               Place it at: ios/Runner/GoogleService-Info.plist

  [2] <next step>

  [3] <next step>

Tell me when all steps are complete, or tell me which ones you've already done.
```
**Wait for developer confirmation before writing any implementation code.**

### Phase 3: Environment setup
Before writing any code, identify environment-specific config:
```
📋 Environment config needed:
   frontend/.env.dev:
     SERVICE_API_KEY=<your-dev-key>
   frontend/.env.prod:
     SERVICE_API_KEY=<your-prod-key>
   frontend/.env.example:
     SERVICE_API_KEY=  # get from <service dashboard URL>
```
Update `.env.example` with the new keys. Never put real values in committed files.

### Phase 4: Implement
After confirmation:
1. Add package to `frontend/pubspec.yaml` (run `flutter pub get`)
2. Add any required native config (AndroidManifest.xml, Info.plist, Podfile entries)
3. Implement the Flutter service/repository layer
4. Write unit tests for the service layer (mock the SDK)
5. Run `/verify --flutter-only`

### Phase 5: Backend wiring (if applicable)
If the service requires backend verification (e.g., Firebase ID token verification on the backend):
- `backendFramework: tsed` → add verification middleware to Ts.ED module
- `backendFramework: node` → add verification middleware to Express route
- `backendFramework: supabase | firebase` → handled by the platform — no code needed
- `backendAccess: false` → document the required backend change in a `TODO` comment:
  ```dart
  // TODO: backend must verify <service> token at POST /auth/verify
  // See: <official guide URL>
  ```

### Phase 6: Error handling
For any error that looks like a configuration or credential problem:
```
⚠️  CONFIGURATION ERROR — this is not a code bug:
   Error: <exact error message>
   Likely cause: <what is misconfigured>
   Fix: <exact step to resolve it>
   Do NOT retry with different code — fix the configuration first.
```

## What's next
```
✅ Done: <service> integrated. Tests pass.

👉 Next step: → /verify
   Then test manually on a real device — <service> integrations often behave differently on simulator vs device.

⚠️  REMINDER: Test on both iOS and Android physical devices before releasing.
```
