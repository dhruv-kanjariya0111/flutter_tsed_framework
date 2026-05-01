Full TDD cycle for a Ts.ED backend feature. Usage: /tdd-backend <feature-name>

## Phases
Phase 1: /api-design (api-designer) → human approval
Phase 2: tester writes failing Jest + Supertest tests (RED)
Phase 3: tsed-backend-coder implements Ts.ED module (GREEN)
Phase 4: tester verifies all tests pass + coverage ≥85%
Phase 5: /sync-contract (openapi.yaml ↔ implementation)
Phase 6: reviewer backend review
