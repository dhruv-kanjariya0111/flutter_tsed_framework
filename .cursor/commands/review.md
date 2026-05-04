# /review <feature> — 8-Dimension Code Review

## Role
Delegate to reviewer agent. 8-dimension check. Verdict: APPROVE | PASS_WITH_WARNINGS | FAIL.

## Review dimensions
1. Architecture — layer violations, cross-feature imports
2. State management — PATTERN-001 (stale state), disposal, autoDispose
3. Error handling — all Failure types, UI error/loading/empty states
4. Testing — coverage ≥ 85%, all relevant BUG_PATTERNS covered
5. Security — auth guards, secret handling, ProGuard
6. Performance — const usage, ListView.builder, compute(), RepaintBoundary
7. Accessibility — Semantics on all interactive widgets, 48×48 touch targets, contrast
8. API contract — Flutter models match openapi.yaml exactly

## Backend review additions
- Controller purity (no business logic)
- DTO validation completeness
- Auth guard on protected endpoints
- Rate limiting on public endpoints
- No raw Prisma types in responses

## Verdict options
- APPROVE — all dimensions pass
- PASS_WITH_WARNINGS — minor issues; can merge with tracking
- FAIL — must fix before merge

## Post-review: MEMORY.md update (mandatory)
Always append to MEMORY.md ## Review Lessons:
```
[DATE] LESSON: <what was found> | FEATURE: <name> | DIMENSION: <which>
```

## Post-review: Bug pattern sync (automatic)
After every review, check if any new failure mode was identified that is not already in BUG_PATTERNS.md.
- If new pattern found → append to BUG_PATTERNS.md, then regenerate TEST_SPEC.md
- If no new patterns → skip silently
- To suppress: `/review <feature> --skip-regen`

This replaces the need for a separate `/analyze-bugs` command. The review loop is now self-sealing: every review that finds a new issue automatically closes the gap in test coverage.

## What's next
```
✅ Done: Review complete.

APPROVE → /release patch|minor|major (if this was the last feature before release)
WARN    → fix warnings, re-run /verify, then merge
FAIL    → fix failures, restart from /tdd Phase 3

💡 Example:
   /release minor
```
