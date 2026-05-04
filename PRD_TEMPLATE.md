# Product Requirements Document

> Fill this in with your BA before running /init.
> Every field maps directly to a PROJECT_CONFIG.md value — a complete PRD means zero manual questions during setup.

---

## Project
- Name:
- Description:
- Platforms: [ios / android / both]

## Backend
- Type: [tsed / node / supabase / firebase / hybrid / none]
- Auth strategy: [jwt / firebase_auth / supabase_auth]
- Backend access locally: [yes / no]

## Roles
- User roles: [comma-separated, e.g. admin, user, guest]

## Features
<!-- Add one ### block per feature. Priority determines build order. -->

### Feature 1: <name>
- Description:
- Priority: [must-have / nice-to-have]
- User role: [who uses this feature]
- Acceptance criteria:
  - [ ] ...

### Feature 2: <name>
- Description:
- Priority: [must-have / nice-to-have]
- User role: [who uses this feature]
- Acceptance criteria:
  - [ ] ...

## Non-Functional Requirements
- Offline support: [yes / no]
- i18n / localization: [yes / no]
- Analytics: [yes / no]
- Accessibility: WCAG AA (always enforced — do not change)
- Performance: APK < 25MB, startup < 2s (always enforced — do not change)

## External Services
<!-- List any 3rd-party integrations needed, e.g. Stripe, Sentry, FCM -->
- 

## Project Management
- Jira: [yes / no]
- Jira project key: [e.g. APP]
- Jira URL: [e.g. https://yourcompany.atlassian.net]
