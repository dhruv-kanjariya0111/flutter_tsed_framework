# Bug Patterns Registry

<!-- Add every production bug here after postmortem. Run /analyze-bugs to update TEST_SPEC.md -->

## Registry structure

- **Core patterns (PATTERN-001–010)** — Framework defaults that apply to every app in this repo (navigation, auth interceptors, empty states, a11y, performance).
- **Cross-cutting patterns (PATTERN-011+)** — Root-cause failure modes consolidated from multi-product QA (wellness, jobs, shifts, commerce, auth). One pattern per failure mode, not per screen.
- **Examples** — Optional bullets under each pattern: concrete symptoms; suffix `(Domain: …)` when the same anti-pattern appeared on different products.

---

## Core patterns

### PATTERN-001: State Not Reset on Navigation Pop

- **Category**: State Management
- **Trigger**: User navigates back, returns to screen with stale state.
- **Root Cause**: State container not disposed; keepAlive on wrong provider.
- **Fix**: Verify autoDispose on feature providers. Use ref.invalidate() on back navigation.

### PATTERN-002: Race Condition on Double-Tap Submit

- **Category**: Async / Action Restriction
- **Trigger**: User taps submit twice; duplicate API call made.
- **Fix**: Set isLoading = true before async call. Disable button when isLoading.

### PATTERN-003: Auth Token Expired Mid-Session

- **Category**: Network / Auth
- **Trigger**: Token expires; next API call returns 401.
- **Fix**: Implement refresh + retry in AuthInterceptor.

### PATTERN-004: Empty State Not Shown on Empty API Response

- **Category**: UI/UX
- **Fix**: AsyncValue.when data: check list.isEmpty → show EmptyStateWidget.

### PATTERN-005: Image Load Failure Shows Broken Icon

- **Category**: UI/UX
- **Fix**: Always provide errorWidget in CachedNetworkImage.

### PATTERN-006: Deep Link Opens Wrong Screen After Auth

- **Category**: Navigation
- **Fix**: Preserve deep link path in auth state; redirect to it post-login.

### PATTERN-007: Keyboard Overlaps Bottom Input Fields

- **Category**: UI/UX / Responsive
- **Fix**: resizeToAvoidBottomInset: true + SingleChildScrollView wrapper.

### PATTERN-008: ProGuard Strips Reflection Classes

- **Category**: Release Build
- **Fix**: Add keep rules to proguard-rules.pro.

### PATTERN-009: Screen Reader Skips Interactive Widgets

- **Category**: Accessibility
- **Fix**: Add Semantics(label:, hint:) to all interactive widgets.

### PATTERN-010: App Startup Jank on Low-End Devices

- **Category**: Performance
- **Fix**: Defer heavy init to post-first-frame. Use compute() for heavy work.

---

## Cross-cutting patterns

### PATTERN-011: Refresh Tab Reload and Generic Error Surfacing

- **Category**: Async / Network / UI
- **Trigger**: Pull-to-refresh or tab reload replaces prior data with error state; sibling tab missing refresh affordance.
- **Fix**: Use AsyncValue with explicit empty vs error; retry mapping; consistent RefreshIndicator / scroll physics per tab; avoid wiping cache before success.
- **Examples**: Discover posts disappear + “Something went wrong”; Connections tab without refresh indicator; generic errors without correlation id (Domain: Community).

### PATTERN-012: Native Audio and Text-to-Speech Integration

- **Category**: Platform / Media
- **Trigger**: TTS or playback APIs fail silently or after OS upgrade.
- **Fix**: Initialize engines after permissions; handle platform channels; test iOS/Android speech settings.
- **Examples**: Audio text-to-speech not working (Domain: Wellness).

### PATTERN-013: Safe Area and Editor Layouts

- **Category**: UI/UX / Responsive
- **Trigger**: Keyboard or scaffold omits insets on edit surfaces.
- **Fix**: SafeArea; resizeToAvoidBottomInset; padding from theme tokens on form editors.
- **Examples**: No padding on “Edit Your Message” / journal editor (Domain: Wellness).

### PATTERN-014: Async Button Loading Placement

- **Category**: UI/UX / Async
- **Trigger**: Loading shown outside primary button or missing disabled state.
- **Fix**: Drive `isLoading` on button; place small `CircularProgressIndicator` inside button label; disable duplicates (with PATTERN-002).
- **Examples**: Loading outside buttons; Google sign-in without loader; logout/delete dialog closes before navigation completes (Domain: Auth).

### PATTERN-015: OAuth Apple and Google

- **Category**: Auth / Platform
- **Trigger**: Misconfigured provider, redirect, or capability; user-cancel treated as failure.
- **Fix**: Align Apple Services ID / Firebase or backend callbacks; handle `AuthorizationException` / cancel without surfacing error; branch first-time signup vs returning user.
- **Examples**: Apple authentication fails; unable to continue with Apple/Google; closing Google picker must not error; first-time Google skips registration (Domain: Auth).

### PATTERN-016: Design Tokens Instead of Hardcoded Chrome

- **Category**: Design System
- **Trigger**: Per-screen colors, elevation, radii, borders, typography weights, icon sizes.
- **Fix**: Theme extensions; InputDecorationTheme; ButtonStyle elevation 0 when design says flat; CardTheme; DividerTheme; StatusBar via AppBarTheme / SystemChrome per route.
- **Examples**: Primary button drop shadow; green outline text fields; cart/search typography “light”; orange wrong background; icon sizing (Domain: Commerce, Jobs, Shifts).

### PATTERN-017: Scaffold and Screen Padding Consistency

- **Category**: Layout
- **Trigger**: Inconsistent top/safe padding across routes.
- **Fix**: Shared screen scaffold or route-level padding tokens; SafeArea policy documented.
- **Examples**: Landing, Home, Shop, Forgot Password top padding; subscription thank-you spacing; virtual balance circle vs wisdom text spacing (Domain: Commerce, Wellness).

### PATTERN-018: AppBar, Headers, and System UI Alignment

- **Category**: UI / Navigation
- **Trigger**: Title spacing, transitions, or status bar color diverges from app bar.
- **Fix**: Central AppBar factory; matched `SystemUiOverlayStyle` with `ColorScheme.surface`/`primary`; consistent transition API (e.g. GoRouter custom transitions).
- **Examples**: Incorrect animation/header; extra gap title vs header; status bar blue ≠ dashboard app bar; search title not centered (Domain: Jobs, Commerce).

### PATTERN-019: Geo Confirm Location Flow

- **Category**: Navigation / Permissions
- **Trigger**: “Use my location” skips confirmation route or uses wrong push/go.
- **Fix**: Dedicated confirm-location route; await permission; pass coords as typed args.
- **Examples**: Location shortcut does not open confirm screen (Domain: Commerce).

### PATTERN-020: Address Model and Delivery Context

- **Category**: Domain / Forms
- **Trigger**: Single-line address omits fields; delivery note missing when address captured.
- **Fix**: Structured address (city, postal, region); formatter joins with commas; show delivery note field when address valid.
- **Examples**: Missing city/postal after comma; missing delivery note (Domain: Commerce).

### PATTERN-021: Password Recovery and Auth Stack Hygiene

- **Category**: Auth / Navigation
- **Trigger**: Forgot-password errors unclear; back stack broken after logout; stale routes.
- **Fix**: Map failures to sealed errors; explicit back on nested auth; clear navigator/auth shell on logout.
- **Examples**: Forgot password submit/error text; missing back buttons; gray screen with duplicate email fields after logout (Domain: Auth).

### PATTERN-022: Form Control Alignment

- **Category**: UI/UX
- **Trigger**: Radio / checkbox rows misaligned with labels; validation text clipped.
- **Fix**: Consistent `contentPadding`, `visualDensity`, or custom row; sufficient `errorMaxLines` / layout width on small screens.
- **Examples**: Radio vs label alignment; staff/client truncated validation messages (Domain: Commerce, Shifts).

### PATTERN-023: Commerce Feature Parity and Category Assets

- **Category**: Product / UI
- **Trigger**: CMS sections missing; wrong category artwork; shipping/threshold copy wrong format.
- **Fix**: Feature flags + CMS; icon map per category key; currency and threshold strings from formatter + entitlement state.
- **Examples**: Missing “Boxes” section; same fish icon for beef/fish; free shipping bar shows “$0 to go” vs “free delivery”; shipping price format (Domain: Commerce).

### PATTERN-024: Cart and Checkout UX Consistency

- **Category**: UI/UX / Commerce
- **Trigger**: Empty states, quantity controls, snackbars, dividers diverge from tokens.
- **Fix**: Themed SnackBar; quantity `IconButton` alignment; swipe/delete pattern; disabled button colors from theme.
- **Examples**: Empty cart illustration size; redundant cart label counts; minus icon not centered; divider/disabled colors; snackbar styling (Domain: Commerce).

### PATTERN-025: Scheduling and Date-Time Pickers

- **Category**: UI / Validation
- **Trigger**: Calendar “today” not highlighted; CTA enabled with no selection; wrong screen background.
- **Fix**: Theme day builder; validate selection before enable; delivery/select-time screens use scaffold background token.
- **Examples**: Select time with nothing selected still enabled; today border missing; month/header spacing; delivery date screen background (Domain: Commerce).

### PATTERN-026: Search Shell Template Consistency

- **Category**: UI / UX
- **Trigger**: Search variants diverge (padding, row height, bg, exit affordance).
- **Fix**: Single SearchScaffold + shared list tile; shared exit label and keyword button states; empty history row component.
- **Examples**: All-search-side bugs: background, row height, title centering, font weight, exit text, icon sizes, side padding, missing “no history” (Domain: Commerce).

### PATTERN-027: Multi-Select and Bulk Selection

- **Category**: State / Forms
- **Trigger**: Single-select only where multi expected; no “select all”.
- **Fix**: Maintain `Set<String>` of ids in notifier; optional select-all for hierarchical filters.
- **Examples**: Shop preferences multi-select; job filter categories select-all (Domain: Commerce, Jobs).

### PATTERN-028: Fixed CTA and Bottom Bars

- **Category**: Layout
- **Trigger**: Primary action wrong vertical position; sticky commerce/job CTAs inconsistent.
- **Fix**: SafeArea + BottomAppBar / pinned footer using elevation/shadow tokens; consistent button vertical padding.
- **Examples**: Commerce shop CTA too high; job filter button sticky-right layout (Domain: Commerce, Jobs).

### PATTERN-029: Nested Navigation and Back Targets

- **Category**: Navigation
- **Trigger**: Back pops to shell default (home) instead of parent tab or prior flow.
- **Fix**: Nested Navigator / `parentNavigatorKey`; explicit `pop` vs `go`; shell route index discipline (relates to PATTERN-006).
- **Examples**: Available shift back → home vs My Schedule; progress/meditation/companion → home; report submit does not navigate back (Domain: Shifts, Wellness).

### PATTERN-030: Copy, Localization, and Legal Surface

- **Category**: Content / Compliance
- **Trigger**: Onboarding punctuation inconsistent; wrong CTA strings; legal line scope.
- **Fix**: Centralize strings (ARB); grammar pass; terms/footer governed by feature flag/product decision.
- **Examples**: Remove terms footer (product); onboarding grammar; “Continue with Google & Apple” punctuation; exit search label; spelling consistency e.g. “Behavioral” (Domain: Multi).

### PATTERN-031: Media Session and OS Notification Desync

- **Category**: Platform / Media
- **Trigger**: Playback position not synced between service and notification controls.
- **Fix**: Single source of truth in audio_service / AudioHandler; sync MediaItem position on seek/pause; debounce progress updates.
- **Examples**: Pause from notification resets UI to 0; pause from app shows 0 on notification; seek not reflected; toggle causes time flicker (Domain: Wellness).

### PATTERN-032: Input Validation Whitespace and Empty Messages

- **Category**: Forms / Chat
- **Trigger**: Send enabled for whitespace-only content.
- **Fix**: Trim input; require `trim().isNotEmpty`; disable send until valid.
- **Examples**: Companion chat enabled after single space (Domain: Wellness).

### PATTERN-033: Chat Unread Counts and Read State

- **Category**: Realtime / State
- **Trigger**: Badge not cleared after read; thread list stale.
- **Fix**: Invalidate threads on mark-read; reconcile with server ack / websocket events.
- **Examples**: Messaging count not updating; badge remains after read (Domain: Wellness, Jobs chat).

### PATTERN-034: Chat History Reload Resets Conversation

- **Category**: State Management
- **Trigger**: Opening history drawer/tab recreates provider or refetches destructively.
- **Fix**: Preserve chat controller; avoid disposing conversation on secondary navigation.
- **Examples**: Companion AI refreshes entire chat when tapping history (Domain: Wellness).

### PATTERN-035: Hit Testing and Overlay Blocking Actions

- **Category**: UI / Gestures
- **Trigger**: Stack/modal absorbs taps; toggle overlays intercept.
- **Fix**: Audit AbsorbPointer/ModalBarrier; hitTestBehavior on overlays; elevation ordering.
- **Examples**: Journal toggle/Done/Continue not tappable (Domain: Wellness).

### PATTERN-036: Dirty State and Silent Saves

- **Category**: Forms / UX
- **Trigger**: Save enabled with no changes; success without feedback.
- **Fix**: Deep equality `hasChanges`; disable save when unchanged; SnackBar/toast on success and failure.
- **Examples**: Profile save with no changes; edit job preferences persists without SnackBar (Domain: Wellness, Jobs).

### PATTERN-037: Image Pick Crop and Display Pipeline

- **Category**: Platform / Media
- **Trigger**: Wrong path/MIME; web blob not shown; permission denied silently.
- **Fix**: Unified image provider; verify preview after pick; handle platform-specific URI (Domain: Wellness, Jobs profile).

### PATTERN-038: Theme-Aware Validation and System Chrome

- **Category**: Theming / Accessibility
- **Trigger**: Error text invisible in dark mode; status bar mismatch.
- **Fix**: `InputDecoration.errorStyle` from `ColorScheme.error`; `Theme.of(context)`; AppBar + SystemUiOverlayStyle per route.
- **Examples**: Sign-in validation poor contrast in dark mode; dashboard status bar vs app bar color (Domain: Auth, Jobs).

### PATTERN-039: Scheduled Notifications vs Auth Lifecycle

- **Category**: Notifications
- **Trigger**: Cancelling all notifications on login/logout; duplicate schedules.
- **Fix**: Scope notification IDs per user; avoid wiping reminder channels unless intentional; dedupe FCM handlers.
- **Examples**: Reminders removed on login/logout; duplicate push notifications (Domain: Wellness).

### PATTERN-040: Push Notification and Deep Link Routing

- **Category**: Navigation / Notifications
- **Trigger**: Payload missing ids; cold start vs resume handled differently.
- **Fix**: Single router entry for notification taps; idempotent navigation; pass profile/post ids explicitly.
- **Examples**: Cannot open profile from push; “reflect” wrong route from push (Domain: Multi).

### PATTERN-041: Session Persistence and Cold Start

- **Category**: Auth / Storage
- **Trigger**: Token not read after restart; refresh fails → forced logout.
- **Fix**: FlutterSecureStorage + refresh interceptor; integration test kill/restart.
- **Examples**: Logged out after app restart (Domain: Multi).

### PATTERN-042: Entitlements and Paywall Server Truth

- **Category**: Product / Backend
- **Trigger**: Client assumes trial access; server denies — UI inconsistent.
- **Fix**: Single entitlement endpoint; gate Community/Posts/Connections from server flags.
- **Examples**: Posts/Community blocked during trial; connections blocked after trial ends (Domain: Community).

### PATTERN-043: Mutation and List Cache Invalidation

- **Category**: State / Cache
- **Trigger**: Block/save/favorite does not invalidate remote lists until manual refresh.
- **Fix**: Invalidate queries (Riverpod/Bloc) or optimistic removal with rollback.
- **Examples**: Blocked job still in Most Popular / All Jobs until pull-to-refresh; saved job from search not on home until refresh (Domain: Jobs).

### PATTERN-044: Filter and Search Query Contract

- **Category**: API / Contract
- **Trigger**: Client query params mismatch backend; empty results always.
- **Fix**: Contract tests against OpenAPI; log query hash on failure; Connections/job search parity.
- **Examples**: Filters always “no jobs”; Connections search broken (Domain: Jobs, Community).

### PATTERN-045: Destructive Action Confirmation and Loading

- **Category**: UX / Async
- **Trigger**: Logout/delete/report without confirmation or loading until completion.
- **Fix**: Confirm modal; keep dialog in loading state until auth/sign-out completes; then navigate.
- **Examples**: Request confirmation pop-ups for logout; logout/delete closes instantly then stalls on profile (Domain: Multi).

### PATTERN-046: API Error Mapping and User-Facing Copy

- **Category**: Network / Domain
- **Trigger**: Raw HTTP status / SQL fragments shown to user.
- **Fix**: Sealed Failure hierarchy; map field errors; never leak Prisma/DB messages.
- **Examples**: Delete account 404; submit application failed; long “Incorrect date format” from backend (Domain: Jobs).

### PATTERN-047: Nullable vs Required and Default Values

- **Category**: API / Forms
- **Trigger**: Empty string sent for optional DB columns; missing description defaults.
- **Fix**: Omit null keys in JSON; client validate dates before submit; align with OpenAPI required fields.
- **Examples**: Work experience/education/rewards errors when optional fields empty (Domain: Jobs).

### PATTERN-048: Documents Files Replace and Cache

- **Category**: Files / Network
- **Trigger**: Presigned URL stale; list not refreshed after upload; viewer MIME wrong.
- **Fix**: Refetch document list after mutation; consistent download/open helpers for chat attachments and verification modals.
- **Examples**: Profile/verification docs not replacing in UI; download failures; chat attachment preview missing (Domain: Jobs).

### PATTERN-049: Horizontal Lists and Async Placeholders

- **Category**: Performance / UI
- **Trigger**: Category rails load without skeleton; layout jump while scrolling.
- **Fix**: Shimmer/skeleton placeholders; pagination; CachedNetworkImage placeholders (with PATTERN-005).
- **Examples**: Most popular category slow without loader (Domain: Jobs).

### PATTERN-050: Calendar Widgets and Keyboard Focus Scope

- **Category**: UI / Input
- **Trigger**: Keyboard stays open across tabs/back; calendar overflows (arrows, headers).
- **Fix**: `FocusManager.instance.primaryFocus?.unfocus()` on route/tab change; test custom day/week builders.
- **Examples**: Shift flows keyboard persists; next arrow overlaps calendar; month header vs week grid overlap (Domain: Shifts).

### PATTERN-051: Rich Text and Markdown Rendering

- **Category**: UI / Content
- **Trigger**: Bold/italic stripped or escaped incorrectly.
- **Fix**: Use `flutter_markdown` or sanctioned HTML renderer with style sheet from tokens.
- **Examples**: Shift details bold/italic not showing (Domain: Shifts).

### PATTERN-052: Shift Lifecycle and Tab Sync

- **Category**: Domain / Cache
- **Trigger**: Completed shifts missing; new data only after kill — not refresh.
- **Fix**: Invalidate shift queries on resume; reconcile ordering with server; polling/WebSocket if required.
- **Examples**: Shift not under Completed; new shift after kill but not refresh (Domain: Shifts).

### PATTERN-053: Incident Forms Validation and Duplicates

- **Category**: Forms / UX
- **Trigger**: Validation messages truncated; duplicate uploads allowed.
- **Fix**: Increase error display lines/wrap; dedupe uploads by hash/name policy.
- **Examples**: Report incident validation clipped; duplicate named uploads; unable to submit incident (Domain: Shifts).

### PATTERN-054: In-App Purchase and Subscription Flow

- **Category**: Commerce / Platform
- **Trigger**: StoreKit/Play billing misconfiguration; pending purchase not finished.
- **Fix**: RevenueCat or IAP rules; map billing errors to Failure; loading state (with PATTERN-014).
- **Examples**: Subscription purchase fails with error; premium thank-you layout issues (Domain: Commerce, Wellness).

### PATTERN-055: History Sort Order Contract

- **Category**: API / UX
- **Trigger**: Journals/insights/history lists ascending when product expects descending.
- **Fix**: Explicit `sort` query param or sort client-side with documented default.
- **Examples**: Journals and Insights should be descending on History (Domain: Wellness).

### PATTERN-056: Catalog and Inventory Sync

- **Category**: Data / Backend
- **Trigger**: SKU visible on web but missing client mapping or stale cache.
- **Fix**: Versioned catalog sync; invalidate on segment change; separate from UI parity (PATTERN-023).
- **Examples**: Item missing in app while inventory exists (Domain: Commerce).

---

## Regression checklist (by domain)

_Use during release QA; map failures back to patterns above._

### Auth and onboarding

- [ ] OAuth Apple/Google success and cancel paths (PATTERN-015)
- [ ] Dark-mode validation readable (PATTERN-038)
- [ ] Session survives restart (PATTERN-041)
- [ ] Forgot-password and auth stack after logout (PATTERN-021)
- [ ] Native splash / theme — **product decision** (see Scope notes in plan; not a defect until specified)

### Wellness (media, journal, companion)

- [ ] Notification vs in-app playback position (PATTERN-031)
- [ ] TTS (PATTERN-012)
- [ ] Chat send validation — no whitespace-only (PATTERN-032)
- [ ] Unread counts and history navigation (PATTERN-033, PATTERN-034)
- [ ] Journal toggles and Done/Continue hit targets (PATTERN-035)
- [ ] History sort for journals/insights (PATTERN-055)
- [ ] Reminders vs login lifecycle (PATTERN-039)
- [ ] Subscription purchase and premium UI (PATTERN-054, PATTERN-017)

### Jobs and chat (dashboard, profile, documents)

- [ ] Filters and search results contract (PATTERN-044)
- [ ] Block/save invalidates lists (PATTERN-043)
- [ ] Job detail empty placeholders and company/address lines (PATTERN-016, PATTERN-046)
- [ ] Review/submit application errors mapped (PATTERN-046)
- [ ] Documents upload/replace/list refresh (PATTERN-048)
- [ ] Social links open externally; blank removes link (PATTERN-047)
- [ ] Chat tiles: company image, reschedule, read badges (PATTERN-005, PATTERN-033)

### Shifts and incidents

- [ ] Calendar views day/week/month parity (PATTERN-050, PATTERN-052)
- [ ] Keyboard dismissed on back/tab (PATTERN-050)
- [ ] Confirm shift / filter validation enabled state (PATTERN-025, PATTERN-044)
- [ ] Markdown in shift details (PATTERN-051)
- [ ] Incident report submit and validation display (PATTERN-053)

### Commerce and community

- [ ] Discover/Connections refresh behavior (PATTERN-011)
- [ ] Cart, shipping, search shell (PATTERN-024, PATTERN-023, PATTERN-026)
- [ ] Location confirm (PATTERN-019), address formatting (PATTERN-020)
- [ ] Entitlements trial/community (PATTERN-042)
- [ ] Catalog missing SKU (PATTERN-056)

---

## Open questions (product / UX)

Track outside defect patterns until decided:

- **Adaptive native splash** to match device theme vs branded splash — requirement TBD.
- **Terms of service** removal — legal/product approval before hiding footer globally.
