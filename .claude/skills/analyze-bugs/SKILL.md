# analyze-bugs

Reads BUG_PATTERNS.md and generates TEST_SPEC.md.

## Steps
1. Read full BUG_PATTERNS.md
2. Group patterns by category:
   - State Management (PATTERN-001, etc.)
   - Async / Action Restriction
   - Network / Auth
   - UI/UX
   - Navigation
   - Performance
   - Accessibility
   - Release Build
3. Delegate to test-spec-generator agent
4. Agent generates TEST_SPEC.md
5. Scan test/ directory for existing spec coverage
6. Report missing test files

## Report Format
ANALYSIS COMPLETE
Patterns analyzed: N
New specs generated: N
Test files missing: N
  → Run /tdd for each missing:
  /tdd "regression: [pattern description]"
