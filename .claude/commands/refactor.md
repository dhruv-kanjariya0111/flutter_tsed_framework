Incremental, behavior-neutral refactoring. Usage: /refactor <module> [focus-area]

## Rules
- One focus area per session (never combine)
- Run full test suite first, record baseline
- Make changes, run tests after each file change
- Never proceed if tests break

## Focus Areas
refactor design-tokens    — apply theme tokens, remove hardcoded values
refactor a11y             — add missing Semantics to interactive widgets
refactor error-handling   — ensure all error paths handled with Failure types
refactor const            — add missing const constructors
refactor imports          — fix any cross-feature imports
