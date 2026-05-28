---
type: concept
created: 2026-05-28
updated: 2026-05-28
related: ["../architecture/app-architecture.md", "../projects/thumbwar-frontend.md"]
sources: ["../sources/git/2026-05-28-thumbwar-frontend-git.md"]
---

# Tech Stack

## Definition
The set of frameworks, libraries, and tooling the ThumbWar frontend is built on.

## Key points
- **Framework:** Expo + React Native, file-based routing via Expo Router.
- **Data:** Apollo Client over GraphQL; per-environment schema/type generation.
- **UI:** Gluestack UI core/utils; Reanimated, Skia, FlashList, Gorhom bottom-sheet, masked-view,
  React Navigation drawer/elements, Legend Motion.
- **Forms/validation:** React Hook Form with `@hookform/resolvers`.
- **Observability:** Sentry for React Native + Apollo link.
- **Dates:** `date-fns` / `date-fns-tz`.
- **Build/deploy:** EAS (dev / staging / production); web export + Lighthouse.
- **Quality tooling:** Playwright (e2e), ast-grep custom rules, knip, ESLint, semantic-release.
- **Governance:** `@codyswann/lisa` (templates, CI workflows, agents) — kept current via frequent bumps.

## Evidence
- Source: sources/git/2026-05-28-thumbwar-frontend-git.md (commit/PR history).
- Dependencies and scripts observed in `package.json` at HEAD `9d03cec` (v7.6.37).

## Open questions
- See `wiki/open-questions/` for anything not yet captured from the codebase.
