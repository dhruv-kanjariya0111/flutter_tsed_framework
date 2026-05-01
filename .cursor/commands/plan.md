# /plan <feature> — Feature Planning

## Flow
1. Delegate to orchestrator agent
2. Orchestrator reads PROJECT_CONFIG, MEMORY, BUG_PATTERNS
3. Produces wave-ordered plan (see orchestrator.md format)
4. Highlights: risk flags, complexity estimate, BUG_PATTERNS to watch
5. Present plan to user for approval
6. After approval: save to MEMORY.md as planned feature
