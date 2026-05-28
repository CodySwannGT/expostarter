---
type: project
created: 2026-05-28
updated: 2026-05-28
related: ["../architecture/app-architecture.md", "../concepts/tech-stack.md"]
sources: ["../sources/git/2026-05-28-thumbwar-frontend-git.md"]
---

# ThumbWar Frontend

## Repository
| Field | Value |
|---|---|
| Local path | `/Users/cody/workspace/thumbwar/frontend` |
| Remote | `gunnertech/thumbwar-frontend` |
| Default branch | `main` |
| Package | `frontend` (`Frontend Platform`), version `7.6.37` |
| HEAD at ingest | `9d03cec` (release 7.6.37) |

## Technology signals
- **Expo / React Native** cross-platform app targeting iOS, Android, and web (Expo Router under `app/`).
- **Apollo GraphQL** client (`lib/apollo`), with generated types fetched per environment
  (`fetch:graphql:schema:{dev,staging,production}`).
- **Gluestack UI** component system (`@gluestack-ui/core`, `@gluestack-ui/utils`) plus Reanimated,
  Skia, FlashList, and bottom-sheet libraries; ~407 files under `components/`.
- **Sentry** error monitoring (`@sentry/react-native`, `apollo-link-sentry`, `lib/sentry`).
- **EAS** build & deploy across `dev`, `staging`, and `production` environments.

## Structure signals
- `app/` — Expo Router routes (`_layout.tsx`, `index.tsx`).
- `components/` — UI components (large surface, ~407 files).
- `lib/` — `apollo/`, `sentry/`, `env.ts`, build helpers.
- `hooks/`, `e2e/` (Playwright), `ast-grep/` lint rules, `specs/` (work specs consumed by `/plan`).
- `projects/` — per-initiative plan archives.

## Notes & evidence
- Governed by Lisa (`@codyswann/lisa`); the git history is dominated by routine `@codyswann/lisa`
  version bumps and semantic-release version commits. Latest merged PR at ingest: #116
  "chore: update @codyswann/lisa to 2.62.1".
- Source: sources/git/2026-05-28-thumbwar-frontend-git.md (317 commits on HEAD, 20 recent PRs).
