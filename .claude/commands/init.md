Project initialization wizard. Run on first setup of a new or existing project.

## New Project Flow
1. Ask: project name, description, platforms, architecture, stateManagement
2. Ask: backendType (custom_tsed | supabase | firebase | hybrid)
3. Ask: authStrategy, router, multiRole, roles
4. Ask: enabledFeatures (featureFlags, offlineFirst, i18n, analytics)
5. Write PROJECT_CONFIG.md with all answers
6. Scaffold folder structure per chosen architecture
7. Initialize CLAUDE.md, AGENTS.md, MEMORY.md (empty)
8. Initialize BUG_PATTERNS.md, TEST_SPEC.md (templates)
9. Generate pubspec.yaml with correct dependencies per config
10. Generate package.json for backend
11. Generate analysis_options.yaml
12. Generate .env.example with required keys
13. Install dependencies: flutter pub get + npm install
14. Run /store-check to show required assets

## Existing Project Flow
1. Scan: find lib -maxdepth 3 -type d
2. Detect architecture from folder patterns
3. Detect stateManagement from pubspec.yaml dependencies
4. Detect router from pubspec.yaml dependencies
5. Ask user to confirm detected values
6. Write PROJECT_CONFIG.md with detected + confirmed values
7. Record findings in MEMORY.md Detected Architecture section
8. Run /analyze-bugs if BUG_PATTERNS.md exists
