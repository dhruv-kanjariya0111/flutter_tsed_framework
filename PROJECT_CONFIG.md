# Project Configuration
<!-- Fill this in during /init wizard -->

## Project
name: __PROJECT_NAME__
description: __DESCRIPTION__
platforms: [ios, android]
type: new       # new | existing
prdFile:        # path to PRD if one was used during /init, e.g. PRD_TEMPLATE.md
figmaAvailable: false    # true | false — set true if Figma MCP or screenshot is provided

## Environments
environments: [dev, prod]          # active environment tiers
defaultEnv: dev                    # dev | prod
devEnvFile: frontend/.env.dev      # Flutter --dart-define-from-file target (dev)
prodEnvFile: frontend/.env.prod    # Flutter --dart-define-from-file target (prod)

## Git Branching
gitBranchingStrategy: gitflow     # gitflow | trunk | custom
mainBranch: main                  # production branch
developBranch: develop            # integration branch
featureBranchPrefix: feat/        # e.g. feat/login
bugfixBranchPrefix: fix/          # e.g. fix/cart-total
releaseBranchPrefix: release/     # e.g. release/1.2.0
hotfixBranchPrefix: hotfix/       # e.g. hotfix/crash-on-launch
requirePRForMain: true            # never push directly to main

## Frontend
architecture: feature_first_clean
stateManagement: riverpod   # riverpod | getx | bloc | provider
router: go_router
mockFramework: mocktail
coverageTarget: 85
usesFreezed: true
usesJsonSerializable: true
hasDesignSystem: true
frontendPath: frontend/

## Backend
backendFramework: tsed   # tsed | node | none
backendPath: ../client-api/
database: postgres
orm: prisma
backendPort: 3000
apiContractFile: shared/openapi.yaml
backendAccess: true      # true | false — set false if you cannot run backend locally

## Auth
authStrategy: jwt             # jwt | firebase_auth | supabase_auth | hybrid

## Backend Type
backendType: custom           # custom | supabase | firebase | hybrid

## Deployment
cicd: codemagic
appStoreConnect: true
googlePlay: true

## Roles
multiRole: false
roles: [user]

## Testing
contractTesting: true
e2eFramework: patrol          # patrol | maestro | both
bugPatternsFile: BUG_PATTERNS.md
testSpecFile: TEST_SPEC.md

## Gestures
gestureCount: 6

## New Capabilities
accessibility: true           # WCAG AA enforcement
performanceBudgets: true      # APK < 25MB, startup < 2s, 60fps
i18n: true                    # flutter_localizations + ARB workflow
featureFlags: true            # Firebase Remote Config
offlineFirst: false           # Hive/Drift local persistence
observability: true           # Structured analytics events
widgetbook: true              # Component catalogue
releaseAutomation: true       # semantic-release + CHANGELOG

## Analytics
analyticsProvider: firebase   # firebase | amplitude | mixpanel | custom

## Feature Flags
featureFlagProvider: firebase_rc  # firebase_rc | launchdarkly | custom

## Project Management
jira: false                   # true | false
jiraProjectKey:               # Jira project key, e.g. APP, MOB, TASK
