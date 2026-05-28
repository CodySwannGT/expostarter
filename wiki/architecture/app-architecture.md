---
type: architecture
created: 2026-05-28
updated: 2026-05-28
related: ["../projects/thumbwar-frontend.md", "../concepts/tech-stack.md"]
sources: ["../sources/git/2026-05-28-thumbwar-frontend-git.md"]
---

# ThumbWar Frontend — Application Architecture

## Overview
A single Expo/React Native codebase that ships to iOS, Android, and web. Routing is file-based via
Expo Router (`app/`); data access is GraphQL through an Apollo client; presentation is built on the
Gluestack UI primitives. Error/observability is wired through Sentry. Builds and deploys run on EAS
across three environments (dev, staging, production).

## Components
- **Routing layer** — Expo Router (`app/_layout.tsx`, `app/index.tsx`).
- **UI layer** — `components/` (~407 files) on Gluestack UI, Reanimated, Skia, FlashList, bottom-sheet.
- **Data layer** — Apollo GraphQL client in `lib/apollo`; schema types regenerated per environment.
- **Observability** — Sentry (`lib/sentry`, `@sentry/react-native`, `apollo-link-sentry`).
- **Configuration** — `app.config.ts` / `app.json` / `eas.json`; runtime env via `lib/env.ts`.

## Data flow
UI components dispatch GraphQL operations through the Apollo client (`lib/apollo`) against the
environment-specific API; responses hydrate component state. The GraphQL schema is fetched and types
generated per environment before builds. Sentry intercepts errors at both the React Native runtime
and the Apollo link level.

## Constraints & decisions
- Three deploy environments (dev / staging / production) via EAS; web is exported separately
  (`export:web`) and monitored with Lighthouse CI.
- E2E testing uses Playwright (`e2e/`); custom static-analysis rules live under `ast-grep/`.
- The repo is Lisa-governed: CI workflows (`.github/workflows/`) include Lisa-managed automation
  (nightly code-complexity / test-coverage / test-improvement, Claude CI/deploy auto-fix, branch sync).
- Source: sources/git/2026-05-28-thumbwar-frontend-git.md.
