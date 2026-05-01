Bug pattern analysis and TEST_SPEC.md regeneration. Run after adding new patterns to BUG_PATTERNS.md.

## Flow
1. Read full BUG_PATTERNS.md
2. Group patterns by category
3. Delegate to test-spec-generator agent
4. Agent generates/updates TEST_SPEC.md
5. Report:
   - N patterns analyzed
   - N new specs generated
   - N regression tests missing (no test file yet)
   - Suggested /tdd calls for missing coverage
