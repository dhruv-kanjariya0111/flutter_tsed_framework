# /git-branch — GitHub Branching Strategy Manager

## Purpose
Set up, verify, or enforce the Git branching strategy for this project. Reads `gitBranchingStrategy` from PROJECT_CONFIG.md.

## Usage
```
/git-branch             # show current branch status and what to do next
/git-branch setup       # create branch structure if it doesn't exist
/git-branch new feat/<name>     # create a new feature branch from develop
/git-branch new fix/<name>      # create a fix branch from develop
/git-branch new hotfix/<name>   # create a hotfix branch from main (urgent prod fixes)
/git-branch new release/<ver>   # create a release branch from develop
/git-branch finish feat/<name>  # merge feature into develop + delete branch
/git-branch finish fix/<name>   # merge fix into develop + delete branch
/git-branch finish hotfix/<name>  # merge hotfix into main AND develop
/git-branch finish release/<ver>  # merge release into main + tag + merge back to develop
/git-branch status      # show all branches and their status vs main/develop
```

## Strategy: Gitflow (default)

### Branch types
| Branch | Base | Merges into | Purpose |
|---|---|---|---|
| `main` | — | — | Production-ready code only. Tagged at every release. |
| `develop` | main | main (via release) | Integration branch. All features merge here. |
| `feat/<name>` | develop | develop | New features. One branch per feature. |
| `fix/<name>` | develop | develop | Bug fixes (non-urgent). |
| `hotfix/<name>` | main | main + develop | Urgent production fixes. |
| `release/<ver>` | develop | main + develop | Stabilization before release. Only bug fixes allowed. |

### Rules (enforced)
1. **Never push directly to main** — all changes via PR
2. **Never push directly to develop** — all changes via PR (for teams) or explicit merge
3. Feature branches branch from `develop`, not `main`
4. Hotfixes branch from `main`, then merge into BOTH `main` and `develop`
5. Release branches only receive bug fixes — no new features

## /git-branch setup
Creates the following if they don't exist:
```
⚠️  BRANCH SETUP — the following commands will be run:
   git checkout -b develop
   git push -u origin develop
   (main already exists)
Shall I proceed? (yes/no)
```
Wait for confirmation. Then run only after approval.

## /git-branch new <type>/<name>
```
Creating branch: feat/user-auth from develop
Commands to run:
  git checkout develop
  git pull origin develop
  git checkout -b feat/user-auth
  git push -u origin feat/user-auth

⚠️  This will be run. Confirm? (yes/no)
```

## /git-branch finish feat/<name>
```
Merging feat/<name> into develop:
Commands to run:
  git checkout develop
  git pull origin develop
  git merge --no-ff feat/<name>
  git push origin develop
  git branch -d feat/<name>
  git push origin --delete feat/<name>

⚠️  This will be run. Confirm? (yes/no)
```

## /git-branch finish hotfix/<name>
```
Merging hotfix/<name> into BOTH main and develop:
Commands to run:
  git checkout main
  git merge --no-ff hotfix/<name>
  git tag -a v<bump> -m "hotfix: <name>"
  git push origin main --tags
  git checkout develop
  git merge --no-ff hotfix/<name>
  git push origin develop
  git branch -d hotfix/<name>
  git push origin --delete hotfix/<name>

⚠️  This will be run. Confirm? (yes/no)
```

## /git-branch finish release/<ver>
```
Finalizing release/<ver>:
Commands to run:
  git checkout main
  git merge --no-ff release/<ver>
  git tag -a v<ver> -m "release: <ver>"
  git push origin main --tags
  git checkout develop
  git merge --no-ff release/<ver>
  git push origin develop
  git branch -d release/<ver>
  git push origin --delete release/<ver>

⚠️  This will be run. Confirm? (yes/no)
```

## /git-branch status
Shows:
```
📊 Branch Status
   main:    ← last release tag
   develop: N commits ahead of main
   Open feature branches: [list with age]
   Open fix branches: [list with age]
   Stale branches (> 2 weeks old): [list — consider deleting or merging]
```

## PR Requirements (for team projects)
When `requirePRForMain: true` in PROJECT_CONFIG.md:
- All merges to `main` must go through a GitHub Pull Request
- Use: `gh pr create --base main --head release/<ver> --title "Release v<ver>"`
- PR must be reviewed before merge — never use `git push --force` on main

## What's next
```
✅ Done: Branching action complete.

👉 Working on a feature? → start coding on your feat/<name> branch
   Ready to release?     → /git-branch finish release/<ver>, then /release <patch|minor|major>
   Production bug?       → /git-branch new hotfix/<name>
```
