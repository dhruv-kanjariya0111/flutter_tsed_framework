# release-notes

Generates release notes and CHANGELOG.md from Conventional Commits.

## Steps
1. Get last git tag: git describe --tags --abbrev=0
2. Get commits since last tag: git log <tag>..HEAD --format='%s %b'
3. Group by type:
   feat: → Added
   fix: → Fixed
   perf: → Performance
   refactor: → Changed
   BREAKING CHANGE: → Breaking Changes
4. Filter out: docs:, style:, chore:, test: (internal only)
5. Append new section to CHANGELOG.md
6. Output human-readable release summary

## CHANGELOG.md Format
## [X.Y.Z] — YYYY-MM-DD

### Breaking Changes
- feat!: description [BREAKING: migration steps]

### Added
- feat: description

### Fixed
- fix: description

### Performance
- perf: description
