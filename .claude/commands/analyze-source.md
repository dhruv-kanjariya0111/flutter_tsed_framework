Migration source analysis. Usage: /analyze-source <path>

Scans a source project to produce a MIGRATION_MAP.md before starting /migrate.

## Flow
1. Scan source project at <path>
2. Detect: framework (React/RN/Android/iOS), state management, navigation
3. Catalog: all screens, components, API calls, native features
4. Generate MIGRATION_MAP.md:
   - Source file → Flutter equivalent mapping
   - Complexity per screen (S/M/L/XL)
   - Native features requiring Flutter plugins
   - Estimated wave timeline
5. Present MIGRATION_MAP.md for review
