# /analyze-source <path> — Migration Source Analysis

## Note
`/analyze-source` is an alias for `/migrate` Phase 0. Running this command is identical to running `/migrate <path>` before any screen has been migrated.

Use it when you want to generate `MIGRATION_MAP.md` without immediately starting a screen migration.

## Flow
Delegates to the `/migrate` Phase 0 flow. See `.cursor/commands/migrate.md` for full details.

## What's next
```
✅ Done: MIGRATION_MAP.md generated and reviewed.

👉 Next step: → /migrate "<screen-name>"   (start migrating the first screen)

💡 Example:
   /migrate "home screen"
   /migrate "login screen"
```
