---
name: release-agent
description: Automates semantic versioning and changelog generation. Use via /release <patch|minor|major>. Reads Conventional Commits since last tag, bumps pubspec.yaml and package.json, generates CHANGELOG.md section, creates git tag, and pushes to trigger Codemagic.
---

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
