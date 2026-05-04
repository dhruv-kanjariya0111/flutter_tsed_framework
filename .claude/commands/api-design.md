# /api-design <feature> — API Contract Design

## Trigger
Before any feature implementation with a custom backend. Always first step for tsed/node backends.

## Backend Type Skip Logic
Read `backendFramework` from PROJECT_CONFIG.md:

- `supabase` or `firebase`:
  ```
  ℹ️  backendFramework: supabase/firebase — no custom API contract needed.
     Supabase/Firebase handle the API layer. Skipping /api-design.
     → Run /plan "<feature>" directly.
  ```
- `none`:
  ```
  ℹ️  backendFramework: none — no backend available. Skipping /api-design.
     → Run /plan "<feature>" directly; API calls will be mocked.
  ```
- `tsed` or `node`: proceed with full API contract design flow below.

## Flow (tsed / node only)
1. Delegate to api-designer agent
2. Agent drafts endpoint schemas in shared/openapi.yaml
3. Validate with: npm run openapi:validate
4. Present diff to user for review
5. WAIT for explicit approval
6. Only after approval: proceed to /plan

## Figma Note
No Figma required for API design. If a screenshot is attached, extract the data shapes from the UI to inform request/response schemas.

## Environment Note
Note any endpoints that behave differently per environment (dev vs prod feature flags, mock vs real payment processor) in the openapi.yaml `x-env` extension field.

## What's next
```
✅ Done: openapi.yaml updated with new endpoint schemas. Validated with spectral.
⏸️  WAITING: Review the endpoint schemas above and approve before any code is written.

👉 After approval: → /plan "<feature>"

💡 Example:
   /plan "user profile update"
```
