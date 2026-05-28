We'd like to alter our current deployment workflow that's defined in @.github/workflows to the one below with as few new files as possible. We want the migration to be simple


# Branch and Environment Promotion Spec

## Branches

### `dev`

`dev` is the integration branch.

All feature work merges into `dev` via PR.

### `main`

`main` is the production branch.

`main` always represents what is currently running in production.

---

## Environments

### Dev environment

Dev environment deploys automatically on every push to `dev`.

There is no manual step to deploy dev.

### Staging environment

Staging environment deploys only from Release Candidate tags.

Staging is never deployed directly from a branch.

### Production environment

Production environment deploys only from the same Release Candidate tag that was deployed to staging.

Production is never deployed directly from a branch.

---

# Release Candidate Versioning Rules

## Semantic versioning format

All RC tags use semantic versioning with an RC pre-release label.

Tag format is:

`vMAJOR.MINOR.PATCH-rc.N`

Examples:

* `v1.4.0-rc.1`
* `v1.4.0-rc.2`
* `v1.4.1-rc.1`
* `v2.0.0-rc.1`

No other RC tag formats are allowed.

---

## Automatic RC tag creation

RC tags are created automatically on demand via a single manual trigger.

The manual trigger does not accept a tag name.

The tag name is always computed.

### Required input to RC creation

The only allowed input is the base version `vMAJOR.MINOR.PATCH`.

Example input:

* `v1.4.0`

### How the RC number is computed

When RC creation is triggered for a given base version `vMAJOR.MINOR.PATCH`:

1. The system finds the highest existing RC tag that matches `vMAJOR.MINOR.PATCH-rc.*`.
2. The new tag uses the next integer:

   * If no matching RC tags exist, the first RC tag is `vMAJOR.MINOR.PATCH-rc.1`.
   * If the highest is `vMAJOR.MINOR.PATCH-rc.3`, the next is `vMAJOR.MINOR.PATCH-rc.4`.

The RC tag always points to the current HEAD of `dev` at the time the RC creation trigger runs.

---

# Deployment Rules

## Dev deploy

Every push to `dev` triggers a dev environment deployment.

This deployment is fully automatic.

---

## Staging deploy

Every push of an RC tag triggers a staging deployment.

Staging deploy uses the exact commit referenced by the RC tag.

No branch reference is used for staging deploy.

---

## Production promotion

Production promotion is a manual trigger that accepts a single input:

* the RC tag to promote, for example `v1.4.0-rc.3`.

Production deploy uses the exact commit referenced by that RC tag.

No branch reference is used for production deploy.

After a successful production deploy, `main` must be fast-forwarded to the RC tag commit so `main` matches production.

---

# Change Management Rules

## Fixes after staging validation or UAT feedback

When fixes are needed:

1. Developer makes changes and merges them into `dev` via PR.
2. Dev auto-deploy runs as usual.
3. A new RC tag is created for the same base version, producing the next `-rc.N` tag.
4. That new RC tag deploys to staging.

Staging is never “patched” without a new RC tag.

---

# Repository Policy Rules

## Allowed deployments by ref

* Dev environment: `dev` branch only
* Staging environment: `vMAJOR.MINOR.PATCH-rc.N` tags only
* Production environment: `vMAJOR.MINOR.PATCH-rc.N` tags only

---

## Prohibited actions

* Deploying staging from `dev`, `main`, or any branch is not allowed.
* Deploying production from `main` or any branch is not allowed.
* Manually creating RC tag names is not allowed. The system generates them.
* Moving `main` forward without a successful production promotion is not allowed.

---

# Acceptance Criteria

## Branch behavior

1. A PR merged into `dev` triggers an automatic dev deployment.
2. No action on `dev` directly triggers a staging or production deployment.

## RC tag behavior

3. Triggering RC creation with input `vX.Y.Z` creates the tag `vX.Y.Z-rc.N` where `N` is computed as the next available RC number for that base version.
4. The RC tag created always points to the current HEAD commit of `dev` at the time of tag creation.
5. Pushing an RC tag triggers a staging deployment using the RC tag commit.

## Production promotion behavior

6. Triggering production promotion with a specific RC tag deploys production using that RC tag commit.
7. After a successful production deploy, `main` is fast-forwarded to the RC tag commit.
8. If `main` cannot be fast-forwarded to the RC tag commit, the production promotion workflow fails and does not modify `main`.

## Ref restrictions

9. Staging deployment fails if the triggering ref is not an RC tag matching `vMAJOR.MINOR.PATCH-rc.N`.
10. Production deployment fails if the provided ref is not an RC tag matching `vMAJOR.MINOR.PATCH-rc.N`.

