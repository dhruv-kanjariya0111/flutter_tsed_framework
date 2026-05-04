# /refactor <module> — Incremental Refactoring

## Rules
- One focus area per session (never combine)
- Run full test suite first, record baseline
- Make changes, run tests after each file change
- Never proceed if tests break

## Common Focus Areas
refactor design-tokens    — apply theme tokens, remove hardcoded values
refactor a11y             — add missing Semantics to interactive widgets
refactor error-handling   — ensure all error paths handled with Failure types
refactor const            — add missing const constructors
refactor imports          — fix any cross-feature imports

## What's next
```
✅ Done: Refactor complete. Tests pass before and after.

👉 Next step: → /verify   (confirm no regressions)
   Then:      → /review "<module>"   (optional: full review if module was significantly restructured)

💡 Example:
   /verify
```
