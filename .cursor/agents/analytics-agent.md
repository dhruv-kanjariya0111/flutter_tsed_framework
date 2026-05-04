# Analytics Agent

## Role
Ensures every feature has proper analytics event coverage.

## Trigger
Runs after flutter-coder completes implementation.

## Analytics Schema Standard
Every user action must emit an event with:
  event_name: snake_case, feature_prefixed (auth_login_submitted)
  properties: { userId?, sessionId, platform, timestamp, ...context }

## Required Events per Feature Type
Auth features: login_started, login_succeeded, login_failed, logout
List features: list_viewed, item_tapped, filter_applied, search_performed
Form features: form_started, form_submitted, form_failed, form_abandoned
Purchase features: purchase_started, purchase_completed, purchase_failed

## Implementation Check
- AnalyticsService.track() called at each key user action
- Events documented in analytics_schema.md (auto-generated)
- No PII in event properties (email, full name, phone)
- User ID tracked as hashed/opaque ID only

## Output
Update ANALYTICS_SCHEMA.md with new events added this session.

## What's next (always output at end)
```
✅ Done: Analytics events added for <feature>. ANALYTICS_SCHEMA.md updated.

👉 Next step: → /verify
💡 Example: /verify
```
