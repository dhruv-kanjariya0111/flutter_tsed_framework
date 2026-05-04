# /review <feature> — Code Review

## Flow
1. reviewer agent performs 8-dimension review (see reviewer.md)
2. Backend review: controller purity, DTO validation, auth, rate limiting
3. Contract review: openapi.yaml ↔ Flutter models exact match
4. A11y review: all Semantics present
5. Performance review: no budget violations

## Backend Review Branching
Read `backendFramework` from PROJECT_CONFIG.md:
- `tsed`: review Ts.ED controller purity, DTO validation, `@UseBefore` guards, rate limiting
- `node`: review route handler thinness, zod/joi validation, middleware chain, no business logic in routes
- `supabase` or `firebase`: review RLS policies reference (inform developer — cannot be reviewed in code), Flutter service layer only
- `none`: Flutter-only review

## Verdict
APPROVE — merge ready
PASS_WITH_WARNINGS — merge with tracked issues
FAIL — block merge, list required fixes

## Post-Review
1. reviewer agent appends lesson to MEMORY.md
2. test-spec-generator agent runs automatically:
   - Re-reads BUG_PATTERNS.md
   - Overwrites TEST_SPEC.md with updated Given/When/Then specs, test-type tags, and suggested file paths
   - No manual `/analyze-bugs` call needed — this happens after every review

## What's next
```
✅ Done: 8-dimension review complete. Verdict: <APPROVE | PASS_WITH_WARNINGS | FAIL>

👉 APPROVE → /release patch|minor|major
   PASS_WITH_WARNINGS → fix warnings listed above, then /verify again
   FAIL → fix failures listed above, restart from Phase 3 of /tdd

💡 Example:
   /release minor
```
