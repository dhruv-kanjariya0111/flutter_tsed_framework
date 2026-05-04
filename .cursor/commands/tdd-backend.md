# /tdd-backend <feature> — Backend TDD Cycle

## Phases
Phase 1: /api-design (api-designer) → human approval
Phase 2: tester writes failing Jest + Supertest tests (RED)
Phase 3: backend-coder implements module (GREEN) — see branching below
Phase 4: tester verifies all tests pass + coverage ≥85%
Phase 5: /verify-contract (openapi.yaml ↔ implementation)
Phase 6: reviewer backend review

## Backend Framework Branching
Read `backendFramework` from PROJECT_CONFIG.md before Phase 3:

- `tsed`  → delegate Phase 3 to `tsed-backend-coder` agent (existing behavior)
- `node`  → delegate Phase 3 to `node-backend-coder` agent
- `supabase` → no backend code written; use Supabase Edge Functions at `supabase/functions/<feature>/`
- `firebase` → no backend code written; use Firebase Functions at `functions/src/<feature>.ts`
- `none`  → skip this command entirely; tell developer:
  ```
  ℹ️  backendFramework: none — no backend to implement.
     All API calls will be mocked in Flutter tests.
  ```

## Web Research Gate (mandatory before Phase 3)
Before any implementation, search for:
1. Current best-practice Node/Ts.ED patterns for this endpoint type
2. Security considerations (OWASP) for this data type
3. Known breaking changes in the current version of the backend framework

Show research summary before implementation begins.

## Environment Handling in Backend
- Dev environment: reads from `backend/.env.dev`
- Prod environment: reads from `backend/.env.prod`
- Test environment: reads from `backend/.env.test` (create if missing)
- Never hardcode connection strings, API keys, or secrets
- Document all required env vars in `backend/.env.example`

## What's next
```
✅ Done: Backend module implemented, tests green.

👉 Next step: → /sync-contract  (align Flutter models with openapi.yaml)
   Then:      → /verify --backend-only

💡 Example:
   /sync-contract
   /verify --backend-only
```
