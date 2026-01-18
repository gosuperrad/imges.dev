# Git Flow Branching Strategy

This project uses **Git Flow** for managing branches and releases.

## Branch Structure

### Main Branches

- **`main`** - Production branch
  - Always contains production-ready code
  - Deployed to: `https://imges.dev` (Railway production)
  - Only updated through merges from `develop` or `hotfix/*` branches
  - **Protected**: No direct commits allowed

- **`develop`** - Integration branch
  - Latest development changes
  - Deployed to: Railway preview environment (on PRs to main)
  - All feature branches merge here first
  - Base branch for all new features

### Supporting Branches

#### Feature Branches
- **Naming**: `feature/<feature-name>`
- **Created from**: `develop`
- **Merged into**: `develop`
- **Purpose**: New features or enhancements

```bash
# Create a feature branch
git checkout develop
git pull origin develop
git checkout -b feature/add-new-filter

# Work on your feature
git add .
git commit -m "Add new blur filter option"

# Push and create PR to develop
git push -u origin feature/add-new-filter
gh pr create --base develop --title "Add new blur filter"
```

#### Release Branches
- **Naming**: `release/<version>`
- **Created from**: `develop`
- **Merged into**: `main` AND `develop`
- **Purpose**: Prepare for production release (version bumps, final testing)

```bash
# Create a release branch
git checkout develop
git pull origin develop
git checkout -b release/1.0.0

# Update version in package.json, final fixes
npm version 1.0.0
git add package.json package-lock.json
git commit -m "Bump version to 1.0.0"

# Merge to main
git checkout main
git pull origin main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/1.0.0
git push origin develop

# Delete release branch
git branch -d release/1.0.0
git push origin --delete release/1.0.0
```

#### Hotfix Branches
- **Naming**: `hotfix/<fix-name>`
- **Created from**: `main`
- **Merged into**: `main` AND `develop`
- **Purpose**: Critical production bug fixes

```bash
# Create a hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/fix-image-crash

# Fix the bug
git add .
git commit -m "Fix crash when generating large images"

# Merge to main
git checkout main
git merge --no-ff hotfix/fix-image-crash
git tag -a v1.0.1 -m "Hotfix: Fix image crash"
git push origin main --tags

# Merge to develop
git checkout develop
git merge --no-ff hotfix/fix-image-crash
git push origin develop

# Delete hotfix branch
git branch -d hotfix/fix-image-crash
git push origin --delete hotfix/fix-image-crash
```

## Workflow Summary

### For New Features
1. Create feature branch from `develop`
2. Develop and commit changes
3. Create PR to merge into `develop`
4. After review, merge to `develop`
5. Delete feature branch

### For Releases
1. Create release branch from `develop`
2. Bump version, final testing
3. Merge to `main` with tag
4. Merge back to `develop`
5. Delete release branch
6. Railway automatically deploys `main` to production

### For Hotfixes
1. Create hotfix branch from `main`
2. Fix the critical bug
3. Merge to `main` with tag
4. Merge to `develop`
5. Delete hotfix branch

## Branch Protection Rules

While GitHub branch protection requires GitHub Pro, here are the **recommended practices**:

### Main Branch
- ✅ No direct commits
- ✅ All changes via Pull Request
- ✅ Require PR reviews before merging
- ✅ Require conversation resolution
- ✅ No force pushes
- ✅ No branch deletion

### Develop Branch
- ✅ No direct commits (use feature branches)
- ✅ All changes via Pull Request
- ✅ Allow force pushes (for rebasing feature branches)

## Railway Deployment Strategy

- **Production**: `main` branch → `https://imges.dev`
- **Preview**: PRs to `main` → Temporary preview URLs
- **Development**: `develop` branch → (optional staging environment)

## Quick Reference

```bash
# Start a new feature
git checkout develop && git pull && git checkout -b feature/my-feature

# Push feature and create PR to develop
git push -u origin feature/my-feature
gh pr create --base develop

# Start a release
git checkout develop && git pull && git checkout -b release/1.1.0

# Start a hotfix
git checkout main && git pull && git checkout -b hotfix/critical-fix

# View all branches
git branch -a

# Delete local branch
git branch -d feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature
```

## Version Numbering

We use **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

Example: `1.2.3` → `1.3.0` (new feature) or `1.2.4` (bug fix)
