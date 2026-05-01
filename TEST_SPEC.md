# Test Specification

<!-- Extend when BUG_PATTERNS.md grows. Run /analyze-bugs to reconcile. -->
<!-- Last updated: 2026-05-01 -->

## Specification Catalogue

### SPEC-001 [PATTERN-001]: State Reset on Navigation

- **Test type**: Unit + Widget
- **Scenario**: Navigate to feature → back → re-navigate
- **Expected**: State container is fresh; loading shown, not cached result

### SPEC-002 [PATTERN-002]: Double-Tap Submit Prevention

- **Test type**: Widget
- **Expected**: Second tap ignored; single API call; button disabled during loading

### SPEC-003 [PATTERN-003]: Token Refresh on 401

- **Test type**: Unit (repository)
- **Expected**: Repository returns correct data; auth failure NOT emitted

### SPEC-004 [PATTERN-004]: Empty State Display

- **Test type**: Widget
- **Expected**: EmptyStateWidget visible; CTA button present and tappable

### SPEC-009 [PATTERN-009]: Screen Reader Accessibility

- **Test type**: Widget (a11y)
- **Expected**: All interactive widgets have Semantics label and hint

### SPEC-010 [PATTERN-010]: Startup Performance

- **Test type**: Integration
- **Expected**: First meaningful paint < 2000ms on reference device

### SPEC-011 [PATTERN-011]: Refresh Without Data Loss or Generic Error

- **Test type**: Widget + Integration
- **Scenario**: Pull-to-refresh on tab with existing data; simulate API failure
- **Expected**: Prior data retained or explicit error state; not blank list + generic message only; sibling tabs use consistent refresh affordance when applicable

### SPEC-012 [PATTERN-012]: Native Audio TTS Initialization

- **Test type**: Integration (device)
- **Expected**: TTS/speak completes after init; permission denial surfaces Failure not crash

### SPEC-013 [PATTERN-013]: Editor Safe Area and Keyboard

- **Test type**: Widget
- **Expected**: Edit screen scrolls; focused field not hidden by keyboard; SafeArea respected

### SPEC-014 [PATTERN-014]: Loading Inside Primary Button

- **Test type**: Widget
- **Expected**: When loading, button shows inline indicator and is disabled; no duplicate submit

### SPEC-015 [PATTERN-015]: OAuth Cancel and Success Paths

- **Test type**: Integration (manual / Patrol where available)
- **Expected**: User-cancel does not show error snackbar; successful sign-in completes session; first-time vs returning branches respected

### SPEC-016 [PATTERN-021]: Auth Stack Cleared on Logout

- **Test type**: Widget + Integration
- **Expected**: After logout, auth routes do not show stale multi-step UI; back stack predictable

### SPEC-017 [PATTERN-029]: Nested Back Returns Correct Parent

- **Test type**: Integration
- **Expected**: From nested flow (e.g. shift detail), back lands on schedule/tab parent not shell home unless designed

### SPEC-018 [PATTERN-031]: Media Position Sync Notification vs App

- **Test type**: Integration (device)
- **Expected**: Pause/seek from notification updates in-app position and vice versa; no jump to zero incorrectly

### SPEC-019 [PATTERN-032]: Chat Send Disabled for Whitespace

- **Test type**: Widget
- **Expected**: `"   "` does not enable send; trim applied before validation

### SPEC-020 [PATTERN-033]: Unread Badge Clears After Read

- **Test type**: Unit + Widget
- **Expected**: After mark-read API success, thread badge/count updates in list

### SPEC-021 [PATTERN-036]: Save Disabled When No Dirty Changes

- **Test type**: Widget
- **Expected**: Save disabled when form equals initial model; success snackbar when save occurs

### SPEC-022 [PATTERN-038]: Validation Visible in Dark Theme

- **Test type**: Widget (golden optional)
- **Expected**: Error text meets contrast against surface using ColorScheme.error

### SPEC-023 [PATTERN-039]: Notifications Scoped Across Auth

- **Test type**: Unit / Integration
- **Expected**: Login/logout does not unintentionally cancel unrelated reminder channels; no duplicate registration IDs per event

### SPEC-024 [PATTERN-040]: Push Tap Routes With Payload Id

- **Test type**: Integration
- **Expected**: Notification open navigates to correct entity (profile/post) with args; cold start handled

### SPEC-025 [PATTERN-041]: Session Persists Cold Start

- **Test type**: Integration
- **Expected**: Kill app and relaunch; valid refresh token yields authenticated state without login screen

### SPEC-026 [PATTERN-042]: Entitlement Gates Match Server

- **Test type**: Unit (mapper) + Integration
- **Expected**: When server denies feature, UI shows paywall/trial message consistent with API; not silent blank

### SPEC-027 [PATTERN-043]: Mutation Invalidates Dependent Lists

- **Test type**: Unit (notifier) + Widget
- **Expected**: After block/favorite/save, home/search lists refresh or optimistic remove without manual pull-to-refresh

### SPEC-028 [PATTERN-044]: Filter Query Matches Contract

- **Test type**: Contract + Unit
- **Expected**: Query serialization matches OpenAPI; non-empty server data returns rows when filters match

### SPEC-029 [PATTERN-045]: Destructive Flow Confirmation and Loading

- **Test type**: Widget
- **Expected**: Logout/delete requires confirm; dialog stays loading until async completes then navigates

### SPEC-030 [PATTERN-046]: User-Facing Errors Are Sealed Failures

- **Test type**: Unit
- **Expected**: HTTP 404/400 map to typed Failure messages; no raw SQL or stack strings in UI layer tests

### SPEC-031 [PATTERN-047]: Optional Fields Omitted Not Empty String

- **Test type**: Unit (dto serialization)
- **Expected**: Null optional fields omitted from JSON; date validation client-side before submit

### SPEC-032 [PATTERN-048]: Document List Refreshes After Upload

- **Test type**: Integration
- **Expected**: Replace/upload succeeds → list shows new doc without app restart

### SPEC-033 [PATTERN-050]: Focus Cleared On Navigation

- **Test type**: Widget
- **Expected**: Pop route or change tab unfocuses primary focus (keyboard dismisses)

### SPEC-034 [PATTERN-052]: Shift Lists Sync After Resume

- **Test type**: Integration
- **Expected**: Returning to app or switching tab refetches shifts; completed tab consistent with server

### SPEC-035 [PATTERN-053]: Incident Validation Fully Visible

- **Test type**: Widget
- **Expected**: Validation messages not truncated; duplicate upload prevented when policy requires

### SPEC-036 [PATTERN-054]: Subscription Purchase Error Mapping

- **Test type**: Unit + Integration (sandbox)
- **Expected**: Billing errors become Failure types; loading state during purchase

### SPEC-037 [PATTERN-055]: History Default Sort Order

- **Test type**: Unit
- **Expected**: Repository requests DESC (or documented) sort for journals/insights history

### SPEC-038 [PATTERN-056]: Catalog Item Present When API Returns SKU

- **Test type**: Contract + Integration
- **Expected**: Item returned by catalog API appears in client list or explicit empty-state if filtered out

---

## Manual / golden (visual tokens)

Patterns **PATTERN-016, 017, 018, 022, 024–028** are primarily design-token and layout consistency — cover with **Widgetbook/golden** or QA checklist ([BUG_PATTERNS.md](BUG_PATTERNS.md) regression sections), not blocking unit tests unless golden snapshots exist.
