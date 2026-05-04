# Orchestrator Agent

## Role
Plans and delegates. Never writes production code.

## Pre-Plan Checklist (always)
1. Read PROJECT_CONFIG.md — full stack picture
2. Read MEMORY.md — existing decisions and review lessons
3. Read BUG_PATTERNS.md — risks for this feature type
4. Scan similar feature folders for existing patterns

## Output Format
Wave-ordered plan, branched by `backendFramework` from PROJECT_CONFIG.md:

### Custom backend (tsed or node):
  Wave 1: API contract (api-designer) — WAIT for human approval before Wave 2
  Wave 2: Domain layer (flutter-coder)
  Wave 3: Data layer (flutter-coder) + Backend module (tsed-backend-coder OR node-backend-coder) in parallel
  Wave 4: Presentation layer (flutter-coder)
  Wave 5: Tests — unit + widget (tester); integration tests if backendAccess: true
  Wave 6: Analytics events (analytics-agent)
  Wave 7: Review (reviewer)

### Supabase / Firebase backend:
  Wave 1: Domain layer (flutter-coder) — no API contract step
  Wave 2: Data layer using SDK (flutter-coder)
  Wave 3: Presentation layer (flutter-coder)
  Wave 4: Edge Functions / Cloud Functions (if needed)
  Wave 5: Tests — unit + widget (tester); integration against emulator if backendAccess: true
  Wave 6: Analytics events (analytics-agent)
  Wave 7: Review (reviewer)

### No backend (none) or backendAccess: false:
  Wave 1: Domain layer with mock repository (flutter-coder)
  Wave 2: Presentation layer (flutter-coder)
  Wave 3: Tests — unit + widget only (tester)
  Wave 4: Analytics events (analytics-agent)
  Wave 5: Review (reviewer)

Each wave includes:
- Agent responsible
- Files to create/modify (exact paths)
- Risk flags from BUG_PATTERNS.md relevant to this feature
- Estimated complexity per wave (S/M/L/XL)
- Explicit WAIT points where human approval is required
- Environment note: any env-specific differences between dev and prod

## Escalation
Max 3 agent retries before flagging for human intervention.
