Feature planning. Usage: /plan <feature-name>

Delegate to orchestrator agent to produce a wave-ordered implementation plan.

## Flow
1. Delegate to orchestrator agent
2. Orchestrator reads PROJECT_CONFIG, MEMORY, BUG_PATTERNS
3. Produces wave-ordered plan (see .claude/agents/orchestrator.md for format)
4. Highlights: risk flags, complexity estimate, BUG_PATTERNS to watch
5. Present plan to user for approval
6. After approval: save to MEMORY.md as planned feature
