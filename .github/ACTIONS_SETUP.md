# GitHub Actions Setup

## Current Status

The CI/CD workflows have been created and simplified, but are currently failing due to repository permissions.

## Required Configuration

To fix the workflow failures, you need to configure the repository settings:

### 1. Enable GitHub Actions Permissions

1. Go to: https://github.com/gosuperrad/imges.dev/settings/actions
2. Under "Actions permissions", ensure Actions are enabled
3. Under "Workflow permissions", select:
   - ✅ **"Read and write permissions"**
   - ✅ **"Allow GitHub Actions to create and approve pull requests"**
4. Click "Save"

### 2. Verify Repository Visibility

For private repositories, some GitHub Actions features require additional permissions or may have limitations.

## Current Workflows

### Active Workflows

1. **CI** (`.github/workflows/ci.yml`)
   - Runs on push/PR to main/develop
   - Single job: Build & Test
   - Steps: TypeScript check, ESLint, Build, Security audit
   - Simple and streamlined

2. **PR Checks** (`.github/workflows/pr-checks.yml`)
   - Runs on PRs
   - Adds size labels (xs, s, m, l, xl)

### Disabled Workflows

The following workflows are disabled (renamed with `.disabled` extension) because they require GitHub Advanced Security (not available on free private repos):

1. **CodeQL** (`codeql.yml.disabled`) - Security scanning
2. **Dependency Review** (`dependency-review.yml.disabled`) - Dependency vulnerability checking  
3. **Dependabot Auto-merge** (`dependabot-auto-merge.yml.disabled`) - Auto-merge safe updates

You can re-enable these if you upgrade to GitHub Advanced Security or make the repo public.

## Dependabot Configuration

Dependabot is still configured in `.github/dependabot.yml` and will work for creating PRs with dependency updates. Only the auto-merge workflow is disabled.

## Next Steps

1. Configure the workflow permissions as described above
2. Re-run the failed workflows from the Actions tab
3. If workflows still fail, check the logs for specific error messages
4. Consider making the repo public if you want full GitHub Actions features

## Re-enabling Advanced Workflows

To re-enable the disabled workflows:

```bash
cd .github/workflows
mv codeql.yml.disabled codeql.yml
mv dependency-review.yml.disabled dependency-review.yml
mv dependabot-auto-merge.yml.disabled dependabot-auto-merge.yml
```

Then commit and push the changes.
