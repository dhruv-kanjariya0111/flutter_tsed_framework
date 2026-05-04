# /release <patch|minor|major> — Release Automation

## Git Branching Rules (enforced before release)
Before running the release, verify:
1. Current branch is `main` (or the configured `mainBranch` in PROJECT_CONFIG.md)
2. If not on main:
   ```
   ⚠️  You are not on the main branch.
      Release should only be cut from main after merging your develop/release branch.
      Run: git checkout main && git merge --no-ff release/<version>
      Then re-run /release.
   ```
3. Confirm all feature branches have been merged to develop, and develop merged to main.

## Flow
1. Validate: all tests passing, /verify green
2. Confirm branch is main (see above)
3. Delegate to release-agent
4. Agent reads git log since last tag
5. Auto-determines bump from Conventional Commits (if no arg given)
6. Bumps pubspec.yaml + package.json version
7. Generates CHANGELOG.md section
8. Creates annotated git tag vX.Y.Z
9. Pushes tag → Codemagic production workflow auto-triggers
10. Prints release summary

## Output
Release summary:
  Version: vX.Y.Z
  Type: patch | minor | major
  Changes: N commits included
  Codemagic: Build #XYZ triggered

## What's next
```
✅ Done: v<X.Y.Z> released. CHANGELOG.md updated. Git tag pushed. CI triggered.

👉 Monitor CI pipeline (Codemagic / GitHub Actions).
   Next feature? → start a new cycle:
     git checkout develop
     git checkout -b feat/<next-feature>
     /plan "<next-feature>"

💡 Example:
   /plan "user notifications"
```
