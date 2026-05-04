# /plan <feature> — Feature Planning

## Flow
1. Delegate to orchestrator agent
2. Orchestrator reads PROJECT_CONFIG, MEMORY, BUG_PATTERNS
3. Produces wave-ordered plan (see orchestrator.md format)
4. Highlights: risk flags, complexity estimate, BUG_PATTERNS to watch
5. Present plan to user for approval
6. After approval: save to MEMORY.md as planned feature

## Web Research Gate (mandatory before generating any plan)
Before producing any wave plan, search for:
1. Current best-practice Flutter packages for this feature type (pub.dev)
2. Known pitfalls for this feature type (check BUG_PATTERNS.md first, then web)
3. If a 3rd-party service is involved: official Flutter integration guide

Report findings in the plan output as:
```
🔍 Research findings:
   Best package: <name> v<version> — <why chosen>
   Key pitfall: <from BUG_PATTERNS or web>
   Reference: <official doc URL>
```
Only proceed to wave planning after research is shown.

## Figma / Design Note
Figma or screenshot is optional. If `figmaAvailable: true` in PROJECT_CONFIG.md or a screenshot/URL is attached, the figma-to-screen skill activates automatically.
If not provided:
```
ℹ️  No design reference detected. Proceeding with text-only specification.
   To add a design: attach a screenshot or add --figma <url> to this command.
```

## Environment Note
Plan must account for any env-specific differences (e.g., different API base URL in dev vs prod). Flag these in the plan as:
```
🌍 Env note: <feature> uses different config per environment — see frontend/.env.dev and frontend/.env.prod
```

## What's next
```
✅ Done: Wave plan produced and saved to MEMORY.md.

👉 Next step:
   Custom backend (tsed/node): → /api-design "<feature>"  (design endpoints before any code)
   Supabase / Firebase:        → /tdd "<feature>"          (start implementation directly)

💡 Example:
   /api-design "user profile update"
   /tdd "user profile screen"
```
