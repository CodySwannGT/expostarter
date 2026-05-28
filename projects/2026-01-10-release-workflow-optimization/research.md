---
date: 2026-01-10T12:00:00-05:00
status: complete
last_updated: 2026-01-10
---

# Research: Release Workflow Optimization

## Summary

This research documents the current GitHub Actions workflow infrastructure for the Expo frontend application and identifies the changes needed to implement a new branch/environment promotion model. The current system deploys automatically based on branch pushes (main, staging, dev), while the target model requires tag-based deployments for staging and production with automatic dev deployments from the dev branch.

## Current System Architecture

### Workflow Files Overview

The repository contains 11 workflow files in `.github/workflows/`:

| File | Purpose | Trigger |
|------|---------|---------|
| `deploy.yml` | Main release and deployment orchestrator | Push to main/staging/dev, workflow_dispatch |
| `release.yml` | Reusable workflow for version management and release creation | workflow_call |
| `build.yml` | EAS native app builds | Push to branches (when app.config.ts changes), workflow_call/dispatch |
| `ci.yml` | Pull request quality checks | pull_request |
| `quality.yml` | Comprehensive quality checks (lint, test, security) | workflow_call |
| `lighthouse.yml` | Performance budget checks | workflow_call |
| `load-test.yml` | K6 load testing | workflow_call |
| `create-sentry-issue-on-failure.yml` | Failure notification to Sentry | workflow_call |
| `create-github-issue-on-failure.yml` | Failure notification to GitHub Issues | workflow_call |
| `create-jira-issue-on-failure.yml` | Failure notification to Jira | workflow_call |
| `claude.yml` | Claude Code AI assistant integration | issue_comment, PR comments |

### Detailed Findings

### deploy.yml - Current Deployment Workflow

**Location:** `.github/workflows/deploy.yml`

**Current Triggers:**
```yaml
on:
  push:
    branches:
      - main
      - staging
      - dev
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options:
          - main
          - staging
          - dev
```

**Job Structure:**
1. `determine_environment` - Maps branch name or input to environment
2. `release` - Calls `release.yml` for version bumping and changelog
3. `check_eas_setup` - Validates EXPO_TOKEN secret exists
4. `check_app_config_changes` - Detects if native build is needed
5. `trigger_eas_build` - Conditional EAS build if app.config.ts changed
6. `deploy` - EAS Update deployment to environment channel
7. `create_sentry_issue_on_failure` - Error notification

**Environment Mapping (lines 166-174):**
- `main` maps to `production` for .env file selection
- `dev` maps to `development` for .env file selection
- `staging` maps to `staging` for .env file selection

**EAS Update Command Pattern (line 189):**
```bash
eas update --auto --channel=$CHANNEL --message="Update to v$VERSION"
```

### release.yml - Enterprise Release Workflow

**Location:** `.github/workflows/release.yml`

**Key Features:**
- Supports multiple versioning strategies: `standard-version`, `semantic`, `calendar`, `custom`
- Promotion detection (skips version bump when merging between environment branches)
- Blackout period enforcement (weekends, late nights, holidays)
- Optional approval gates via GitHub Environments
- SBOM generation (CycloneDX format)
- Release signing with GPG
- SLSA provenance attestation
- GitHub Release creation
- Sentry and Jira release integration
- SOC2, ISO27001, HIPAA, PCI-DSS compliance validation

**Version Management (lines 500-545):**
- Uses `npx standard-version --dry-run` to determine next version
- Supports prerelease labels (alpha, beta, rc)
- Commits changelog with `[skip ci]` to prevent recursive triggers

**SSH Deploy Key Pattern (line 399):**
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
    ssh-key: ${{ secrets.DEPLOY_KEY }}
```

### build.yml - EAS Build Workflow

**Location:** `.github/workflows/build.yml`

**Current Triggers:**
```yaml
on:
  workflow_dispatch:
  workflow_call:
  push:
    branches:
      - dev
      - staging
      - main
    paths:
      - app.config.ts
```

**Build Profiles:**
- `dev`: Dev client with internal distribution
- `dev-preview`: Production-like build for internal testing
- `staging`: Staging build with auto-submit
- `production`: Production build with auto-submit

### EAS Configuration

**Location:** `eas.json`

**Channel Structure:**
| Profile | Channel | Distribution |
|---------|---------|--------------|
| dev | dev | internal |
| dev-preview | dev | internal |
| staging | staging | internal (draft) |
| production | production | production |

**Key Observation:** EAS channels are independent of git branches. Updates can be pushed to any channel from any git ref.

### Version Configuration

**Location:** `.versionrc`

```json
{
  "types": [
    { "type": "feat", "section": "Features" },
    { "type": "fix", "section": "Bug Fixes" },
    { "type": "chore", "hidden": true },
    { "type": "docs", "section": "Documentation" },
    { "type": "refactor", "section": "Code Refactoring" },
    { "type": "perf", "section": "Performance Improvements" },
    { "type": "test", "hidden": true }
  ],
  "bumpFiles": [{ "filename": "package.json", "type": "json" }]
}
```

**Current Version:** `7.5.2` (from package.json)

### Branch Structure

**Active Branches:**
- `main` - Production branch
- `dev` - Development/integration branch (not currently present but referenced)
- Various feature branches

**Existing Tags:**
- `template-base` - Only existing tag

**Observation:** No staging branch exists in the repository. The current workflow references staging but the branch may not be actively used.

## Target Model Requirements (from brief.md)

### Branch and Environment Mapping

| Environment | Trigger | Deployment Source |
|-------------|---------|-------------------|
| Dev | Push to `dev` branch | HEAD of `dev` |
| Staging | Push of RC tag | Exact RC tag commit |
| Production | Manual promotion of RC tag | Exact RC tag commit |

### RC Tag Format

Pattern: `vMAJOR.MINOR.PATCH-rc.N`

Examples:
- `v1.4.0-rc.1`
- `v1.4.0-rc.2`
- `v2.0.0-rc.1`

### RC Tag Creation Rules

1. Manual trigger with base version input (e.g., `v1.4.0`)
2. System computes next RC number by finding highest existing `vX.Y.Z-rc.*`
3. Tag always points to current HEAD of `dev`
4. No manual tag name entry allowed

### Production Promotion Rules

1. Manual trigger with RC tag input (e.g., `v1.4.0-rc.3`)
2. Deploy uses exact RC tag commit
3. After successful deploy, `main` is fast-forwarded to RC tag commit
4. Fails if fast-forward is not possible

## Code References

### Primary Files to Modify

- `.github/workflows/deploy.yml:14-30` - Trigger configuration needs tag pattern support
- `.github/workflows/deploy.yml:46-53` - Environment determination logic needs RC tag parsing
- `.github/workflows/deploy.yml:127-194` - Deploy job needs tag-aware checkout
- `.github/workflows/build.yml:23-29` - Build triggers need tag pattern support

### Reusable Components

- `.github/workflows/release.yml:500-545` - Version determination logic
- `.github/workflows/release.yml:621-625` - Git push patterns with SSH key
- `.github/workflows/quality.yml` - Quality checks (reusable as-is)

### Environment Files

- `.env.development` - Dev environment variables
- `.env.staging` - Staging environment variables
- `.env.production` - Production environment variables

## Architecture Documentation

### Current Flow

```
Feature PR → dev branch → deploy.yml → release.yml → EAS Update (dev)
                                ↓
                          staging branch → deploy.yml → release.yml → EAS Update (staging)
                                ↓
                          main branch → deploy.yml → release.yml → EAS Update (production)
```

### Target Flow

```
Feature PR → dev branch → deploy.yml → EAS Update (dev)
                ↓
         RC Tag Creation (manual) → tag vX.Y.Z-rc.N on dev HEAD
                ↓
         Tag Push → deploy.yml → EAS Update (staging)
                ↓
         Production Promotion (manual) → deploy.yml → EAS Update (production)
                                              ↓
                                       main fast-forward to RC tag
```

### Key Technical Considerations

1. **Tag Pattern Matching in GitHub Actions:**
   ```yaml
   on:
     push:
       tags:
         - 'v*.*.*-rc.*'
   ```

2. **Fast-Forward Main Branch:**
   ```bash
   git fetch origin main
   git checkout main
   git merge --ff-only $RC_TAG
   git push origin main
   ```

3. **RC Number Computation:**
   ```bash
   git tag --list "v${BASE_VERSION}-rc.*" | sort -V | tail -1
   ```

4. **SSH Deploy Key Requirement:** The existing `DEPLOY_KEY` secret is already configured for pushing to protected branches.

## E2E Test Impact

### Existing Tests

- `.maestro/flows/` - Maestro mobile E2E test flows (smoke tests)
- `playwright.config.ts` - Playwright web E2E configuration

### Tests Requiring Modification

No test modifications are required for this workflow change. E2E tests are triggered by quality checks in CI, which remain unchanged.

### Tests to Remove

None - workflow changes do not affect test infrastructure.

### New Tests Needed

- **Workflow Tests:** Consider adding manual verification steps for:
  - RC tag creation produces correct tag name
  - Staging deployment uses exact tag commit
  - Production promotion fast-forwards main correctly
  - Fast-forward fails gracefully when not possible

## Open Questions

1. **Staging Branch Removal:** The current workflow references a staging branch. Should this branch be removed or repurposed after migration?

2. **Existing Workflow Compatibility:** The deploy.yml calls release.yml which includes version bumping. Should version bumping occur during RC creation or remain in the staging deploy step?

3. **Build Trigger Strategy:** Should EAS native builds be triggered on RC tag creation, or should they continue to trigger only when app.config.ts changes?

4. **Rollback Strategy:** If production promotion fails after fast-forwarding main, what is the recovery process?

5. **Branch Protection:** Does main branch protection need to allow the workflow's SSH deploy key for force-push scenarios (though fast-forward should not require force)?

6. **Quality Gate Timing:** Should quality checks run on RC tag creation, or rely on dev branch CI having already validated the code?
