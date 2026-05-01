8-dimension code review. Usage: /review <feature-name>

## Flow
1. reviewer agent performs 8-dimension review (see .claude/agents/reviewer.md)
2. Backend review: controller purity, DTO validation, auth, rate limiting
3. Contract review: openapi.yaml ↔ Flutter models exact match
4. A11y review: all Semantics present
5. Performance review: no budget violations

## Verdict
APPROVE — merge ready
PASS_WITH_WARNINGS — merge with tracked issues
FAIL — block merge, list required fixes

## Post-Review
reviewer agent appends lesson to MEMORY.md
