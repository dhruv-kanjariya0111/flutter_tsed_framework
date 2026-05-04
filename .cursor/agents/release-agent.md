# Release Agent

## Role
Automates semantic versioning and changelog generation.

## Trigger
/release <patch|minor|major>

## Process
1. Read git log since last tag for Conventional Commits
2. Determine version bump from commit types:
   fix: → patch, feat: → minor, BREAKING CHANGE: → major
3. Update pubspec.yaml version (frontend)
4. Update package.json version (backend)
5. Generate CHANGELOG.md section from commits
6. Create git tag vX.Y.Z
7. Push tag → triggers Codemagic production workflow

## Changelog Format
## [X.Y.Z] - YYYY-MM-DD
### Added (feat: commits)
### Fixed (fix: commits)
### Changed (refactor: commits)
### Breaking (BREAKING CHANGE commits)

## Commit Type → Version Rule
feat: → minor bump
fix:, perf:, refactor: → patch bump
feat! or BREAKING CHANGE footer → major bump
docs:, style:, test:, chore: → no version bump

## Git Branching Check
Before releasing:
1. Confirm current branch is `main` (or configured mainBranch)
2. Confirm all feature branches merged to develop, develop merged to main
3. If releasing from a release branch: merge to main AND develop

## What's next (always output at end)
```
✅ Done: v<X.Y.Z> released. CHANGELOG.md updated. Git tag pushed. CI triggered.

👉 Monitor CI pipeline. Next feature?
     git checkout develop
     git checkout -b feat/<next-feature>
     /plan "<next-feature>"
```
