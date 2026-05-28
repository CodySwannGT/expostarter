# GitHub Actions Security Refactor Specification

This document outlines security vulnerabilities and missing safety measures identified in the GitHub Actions workflows, along with recommended fixes.

## Executive Summary

**Analysis Date**: 2026-01-10
**Workflows Analyzed**: 11
**Critical Issues**: 4
**High Severity Issues**: 8
**Medium Severity Issues**: 16+

## Critical Severity Issues

These issues require immediate remediation due to supply chain attack risk.

### 1. Mutable Branch References in Third-Party Actions

**Risk**: Maintainers can push malicious code to `master`/`main` branches at any time, which would immediately execute in workflows.

| Workflow | Action | Location |
|----------|--------|----------|
| `deploy.yml` | `canastro/copy-file-action@master` | Lines 165, 172 |
| `quality.yml` | `snyk/actions/node@master` | Line 971 |
| `quality.yml` | `GitGuardian/ggshield-action@master` | Line 1017 |
| `quality.yml` | `fossas/fossa-action@main` | Line 1053 |

**Recommended Fix**: Pin to specific commit SHA.

```yaml
# deploy.yml - Lines 165, 172
# Before:
- uses: canastro/copy-file-action@master

# After (get current SHA from the action's repository):
- uses: canastro/copy-file-action@c71c3c9ca1c8844d0bc3b5e9748eec7c68bb57a6 # master

# quality.yml - Line 971
# Before:
- uses: snyk/actions/node@master

# After:
- uses: snyk/actions/node@a]1346e4eaf761d462da22c34c681dc06849b6851 # master

# quality.yml - Line 1017
# Before:
- uses: GitGuardian/ggshield-action@master

# After:
- uses: GitGuardian/ggshield-action@46f6c89a4bea87e31b8b5a6b3e1b68e809da4f81 # master

# quality.yml - Line 1053
# Before:
- uses: fossas/fossa-action@main

# After:
- uses: fossas/fossa-action@3ebcea1862c6ffbd5cf1b4d0a1cc678877f7e05a # main
```

## High Severity Issues

### 2. Unpinned Action Version Tags

**Risk**: Version tags like `@v4` are mutable. Maintainers can update what a tag points to, potentially introducing malicious code.

**Affected**: All 11 workflow files use version tags instead of SHA commits.

**Examples**:
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `expo/expo-github-action@v8`
- `oven-sh/setup-bun@v2`

**Recommended Fix**: Pin all actions to SHA commits with version comment.

```yaml
# Before:
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: expo/expo-github-action@v8

# After:
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
- uses: actions/setup-node@60edb5dd545a775178f52524783378180af0d1f8 # v4.0.2
- uses: expo/expo-github-action@f7f58062a61f9cfb51af76e88b0c77d790f09196 # v8.0.0
```

**Implementation Notes**:
- Use `gh api repos/{owner}/{repo}/git/refs/tags/{tag}` to get SHA for a tag
- Add comment with human-readable version for maintainability
- Consider using Dependabot to automate SHA updates

### 3. Script Injection via Untrusted Inputs

**Risk**: GitHub context variables containing user-controlled content can inject arbitrary commands when used directly in shell scripts.

#### 3a. create-github-issue-on-failure.yml (Lines 84-97)

**Current Code**:
```yaml
script: |
  const workflowName = '${{ inputs.workflow_name }}';
  const failedJob = '${{ inputs.failed_job }}' || 'Unknown';
```

**Risk**: If `workflow_name` contains `'; malicious_code; '`, it breaks out of the string.

**Recommended Fix**: Use environment variables instead of direct interpolation.

```yaml
- uses: actions/github-script@v7
  env:
    WORKFLOW_NAME: ${{ inputs.workflow_name }}
    FAILED_JOB: ${{ inputs.failed_job }}
  with:
    script: |
      const workflowName = process.env.WORKFLOW_NAME;
      const failedJob = process.env.FAILED_JOB || 'Unknown';
```

#### 3b. create-sentry-issue-on-failure.yml (Line 106)

**Current Code**:
```yaml
- run: |
    COMMIT_MESSAGE="${{ github.event.head_commit.message || 'N/A' }}"
```

**Risk**: Commit messages with backticks or `$()` can execute arbitrary commands.

**Recommended Fix**: Use heredoc with quoted delimiter to prevent expansion.

```yaml
- run: |
    COMMIT_MESSAGE=$(cat <<'HEREDOC_EOF'
    ${{ github.event.head_commit.message || 'N/A' }}
    HEREDOC_EOF
    )
```

#### 3c. create-jira-issue-on-failure.yml (Line 106)

Same issue and fix as 3b above.

#### 3d. release.yml (Lines 202-208, 230-238)

**Current Code**:
```yaml
COMMIT_MSG=$(git log -1 --pretty=%B)
echo "$COMMIT_MSG" | head -5 >> $GITHUB_STEP_SUMMARY
```

**Risk**: Commit messages can contain markdown injection for GITHUB_STEP_SUMMARY.

**Recommended Fix**: Escape markdown special characters.

```yaml
COMMIT_MSG=$(git log -1 --pretty=%B)
# Escape markdown special characters
ESCAPED_MSG=$(echo "$COMMIT_MSG" | sed 's/[`*_{}[\]()#+\-.!]/\\&/g')
echo "$ESCAPED_MSG" | head -5 >> $GITHUB_STEP_SUMMARY
```

## Medium Severity Issues

### 4. Missing Explicit Permissions Block

**Risk**: Without explicit permissions, workflows inherit default token permissions which may be broader than necessary (principle of least privilege violation).

**Affected Workflows** (9 of 11):
- `ci.yml`
- `deploy.yml`
- `build.yml`
- `quality.yml`
- `lighthouse.yml`
- `load-test.yml`
- `create-github-issue-on-failure.yml`
- `create-sentry-issue-on-failure.yml`
- `create-jira-issue-on-failure.yml`

**Recommended Fix**: Add explicit permissions block to each workflow.

```yaml
# ci.yml
permissions:
  contents: read
  actions: read

# deploy.yml
permissions:
  contents: read
  id-token: write  # For OIDC if used

# build.yml
permissions:
  contents: read

# quality.yml
permissions:
  contents: read
  security-events: write  # For code scanning
  actions: read

# lighthouse.yml
permissions:
  contents: read

# load-test.yml
permissions:
  contents: read
  pull-requests: write  # For PR comments

# create-github-issue-on-failure.yml
permissions:
  issues: write  # To create issues

# create-sentry-issue-on-failure.yml
permissions: {}  # No GitHub permissions needed

# create-jira-issue-on-failure.yml
permissions: {}  # No GitHub permissions needed
```

### 5. Missing Timeout Configuration

**Risk**: Jobs without timeouts can run indefinitely, consuming resources and potentially masking hung processes.

**Affected Jobs**:

| Workflow | Job(s) Missing Timeout |
|----------|------------------------|
| `release.yml` | Most jobs |
| `deploy.yml` | `build_and_deploy` |
| `load-test.yml` | `k6_test` |
| `build.yml` | `build` |
| `claude.yml` | `claude` |

**Recommended Fix**: Add appropriate timeout-minutes to each job.

```yaml
# release.yml
jobs:
  version:
    timeout-minutes: 10
  build-android:
    timeout-minutes: 45
  build-ios:
    timeout-minutes: 60
  submit:
    timeout-minutes: 30

# deploy.yml
jobs:
  build_and_deploy:
    timeout-minutes: 30

# load-test.yml
jobs:
  k6_test:
    timeout-minutes: 30

# build.yml
jobs:
  build:
    timeout-minutes: 20

# claude.yml
jobs:
  claude:
    timeout-minutes: 30
```

### 6. Overly Broad Secret Inheritance

**Risk**: `secrets: inherit` passes all repository secrets to reusable workflows, violating principle of least privilege.

**Affected**:
- `ci.yml` (Lines 16, 45)
- `deploy.yml` (if using reusable workflows)

**Recommended Fix**: Pass only required secrets explicitly.

```yaml
# Before:
jobs:
  quality:
    uses: ./.github/workflows/quality.yml
    secrets: inherit

# After:
jobs:
  quality:
    uses: ./.github/workflows/quality.yml
    secrets:
      SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### 7. GPG Key Written to Disk

**Location**: `release.yml` (Lines 716-725)

**Current Code**:
```yaml
- run: |
    echo "${{ secrets.RELEASE_SIGNING_KEY }}" | base64 -d > signing.key
    gpg --import signing.key
    rm -f signing.key
```

**Risk**: If workflow fails between write and delete, key remains on disk.

**Recommended Fix**: Use process substitution to avoid writing to disk.

```yaml
- run: |
    echo "${{ secrets.RELEASE_SIGNING_KEY }}" | base64 -d | gpg --import
```

### 8. Direct Push to Protected Branches

**Location**: `build.yml` (Lines 23-27)

**Current Code**:
```yaml
push:
  branches:
    - dev
    - staging
    - main
```

**Risk**: If branch protection is misconfigured, direct pushes bypass PR review.

**Recommended Fix**: Ensure branch protection rules are configured in repository settings:
- Require pull request reviews before merging
- Require status checks to pass
- Require branches to be up to date
- Include administrators in restrictions

## Low Severity Issues

### 9. Partial Secret Exposure in Debug Output

**Location**: `create-sentry-issue-on-failure.yml` (Line 191)

**Current Code**:
```yaml
echo "Debug: Found DSN: ${DSN:0:50}..."
```

**Risk**: Partial credential exposure in logs.

**Recommended Fix**: Remove debug output or mask completely.

```yaml
# Option 1: Remove debug line
# Option 2: Only confirm presence
echo "Debug: DSN is configured: $([ -n "$DSN" ] && echo 'yes' || echo 'no')"
```

### 10. Claude Workflow Trigger Surface

**Location**: `claude.yml` (Lines 16-19)

**Risk**: Any user with comment access can trigger Claude by mentioning `@claude`.

**Recommended Fix**: Consider restricting to specific users or requiring approval.

```yaml
if: |
  (github.event_name == 'issue_comment' &&
   contains(github.event.comment.body, '@claude') &&
   github.event.comment.author_association == 'MEMBER') ||
```

## Implementation Priority

### Phase 1: Critical (Immediate)
1. Pin mutable branch references to SHA commits
2. Add explicit permissions to all workflows

### Phase 2: High (This Sprint)
3. Pin all action version tags to SHA commits
4. Fix script injection vulnerabilities
5. Add timeout-minutes to all jobs

### Phase 3: Medium (Next Sprint)
6. Replace `secrets: inherit` with explicit secrets
7. Fix GPG key disk write
8. Verify branch protection configuration

### Phase 4: Low (Backlog)
9. Remove debug secret output
10. Consider Claude trigger restrictions

## Tooling Recommendations

### Automated SHA Pinning
Consider using [pin-github-action](https://github.com/mheap/pin-github-action) or [Dependabot](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot) to automate action pinning and updates.

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Security Scanning
Enable GitHub's built-in security features:
- **Secret scanning**: Detect accidentally committed secrets
- **Code scanning**: Static analysis for security vulnerabilities
- **Dependency review**: Block PRs that introduce vulnerabilities

## References

- [GitHub Actions Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [OWASP CI/CD Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html)
- [StepSecurity Harden Runner](https://github.com/step-security/harden-runner)
