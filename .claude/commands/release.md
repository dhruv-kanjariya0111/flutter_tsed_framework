Release automation with semantic versioning. Usage: /release <patch|minor|major>

## Flow
1. Validate: all tests passing, /verify green
2. Delegate to release-agent
3. Agent reads git log since last tag
4. Auto-determines bump from Conventional Commits (if no arg given)
5. Bumps pubspec.yaml + package.json version
6. Generates CHANGELOG.md section
7. Creates annotated git tag vX.Y.Z
8. Pushes tag → Codemagic production workflow auto-triggers
9. Prints release summary

## Output
Release summary:
  Version: vX.Y.Z
  Type: patch | minor | major
  Changes: N commits included
  Codemagic: Build #XYZ triggered
