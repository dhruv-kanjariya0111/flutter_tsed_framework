# perf-audit

Audits Flutter codebase for performance anti-patterns.

## Checks
1. ListView() with dynamic content (must be .builder)
2. Missing const constructors on static widgets
3. Heavy work on main isolate (JSON parsing > 10KB without compute())
4. Missing RepaintBoundary on independently animated widgets
5. Images loaded without size constraints (causes layout jank)
6. StreamSubscriptions not cancelled in dispose()
7. AnimationControllers not disposed
8. setState() called after async gap without mounted check

## Report Format
PERF AUDIT RESULTS
High priority: [list with file:line]
Medium priority: [list]
Low priority: [list]
Estimated impact: [description]
