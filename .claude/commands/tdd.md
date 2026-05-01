Full TDD cycle for a Flutter feature. Usage: /tdd <feature-name>

## Phases
Phase 1: /plan (orchestrator) → human approval
Phase 2: tester writes failing tests (RED) using TEST_SPEC.md guidance
  - Confirm RED state before proceeding
Phase 3: flutter-coder implements feature (GREEN)
Phase 4: tester verifies coverage ≥85% and all specs pass
Phase 5: analytics-agent adds event tracking
Phase 6: /verify (all 6 quality gates)
Phase 7: reviewer 8-dimension check
  - APPROVE → done
  - WARN → fix warnings, re-verify
  - FAIL → fix failures, restart from Phase 3
