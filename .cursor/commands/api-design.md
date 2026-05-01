# /api-design <feature> — API Contract Design

## Trigger
Before any feature implementation. Always first step.

## Flow
1. Delegate to api-designer agent
2. Agent drafts endpoint schemas in shared/openapi.yaml
3. Validate with: npm run openapi:validate
4. Present diff to user for review
5. WAIT for explicit approval
6. Only after approval: proceed to /plan
