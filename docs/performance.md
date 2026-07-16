# Web Performance Budgets

This document records the measured web-bundle baseline, explains every number
in `lighthouserc-config.json`, and lists the rules that keep the entry bundle
lean. Budgets exist to **catch regressions from the measured baseline** — they
are not aspirations. When a deliberate change moves the baseline (new feature,
new dependency), re-measure and update both the budget and this document in
the same PR.

## How to measure

```bash
bun run export:web                      # expo export --platform web --source-maps → ./dist
bun run lighthouse:check                # Lighthouse CI against ./dist (5 runs)
# Bundle composition (what is IN the bundle):
cd dist/_expo/static/js/web && bunx source-map-explorer entry-*.js entry-*.js.map --no-border-checks
```

Two different sizes matter:

- **Raw (uncompressed) size** — what source-map-explorer reports and what the
  browser must parse/execute. Drives TTI/bootup.
- **Transfer size** — what Lighthouse's `resource-summary:script:size` and
  `total-byte-weight` assert. Lighthouse CI's static server serves gzip, so
  transfer is ~4x smaller than raw for JS.

## Measured baseline (2026-07-07, Expo SDK 57)

Home page (`/`), production web export, after the fixes below:

| Metric                       | Measured        | Budget (`lighthouserc-config.json`) | Headroom |
| ---------------------------- | --------------- | ----------------------------------- | -------- |
| Script transfer (gzip)       | 595 KB          | `scriptSize: 750000`                | +26%     |
| Total byte weight (gzip)     | 655 KB          | `totalByteWeight: 850000`           | +30%     |
| Time to interactive          | 4.9 s (local)   | `interactive: 6500`                 | +33%     |
| First contentful paint       | 1.05 s          | `firstContentfulPaint: 1500`        | +43%     |
| Performance score            | 0.80–0.82       | `performance: 0.55` (min)           | large    |

TTI gets a full +33% (not the +26–30% of the byte budgets) because it is the
only hardware-sensitive number in the table: CI runners are slower than a dev
laptop, and TTI is the assertion that flaked first historically.

Raw script served to the home page: ~2.29 MB across 6 chunks
(entry 1,085 KB + `__common` 1,041 KB + root `_layout` 148 KB + home route
11 KB + runtime 5 KB). This is the honest floor of the stack — roughly:
expo-router 435 KB, Sentry ~730 KB (core + react-native + browser + react +
feedback), react-native-web 275 KB, react-dom 175 KB, react-aria 126 KB
(pulled by the GlueStack overlay/toast providers), app + vendored ui
components ~100 KB, plus interop/runtime overhead.

### Where the 5.35 MB regression came from (and went)

The pre-fix entry bundle was a single 5.35 MB file:

| Contributor                              | Raw cost | Fix                                                                 |
| ---------------------------------------- | -------- | ------------------------------------------------------------------- |
| `lucide-react-native` barrel imports     | 1,164 KB | Per-icon deep imports (see below)                                    |
| `@apollo/client` + `graphql` + deps      | ~476 KB  | `makeVar` for one store → hand-rolled reactive var                   |
| `zod` in `src/lib/env.ts`                | ~368 KB  | Hand-rolled validation for 4 env vars                                |
| `@sentry-internal/replay(+canvas)`       | ~136 KB  | `includeWebReplay: false` in `metro.config.js`                       |
| Playground route + galleries in entry    | ~180 KB  | expo-router async routes on web (route-level code splitting)         |

## Rules that keep the bundle lean

Metro does **not** tree-shake. Any module reachable from a static import chain
ships in full. Consequences:

1. **Icons: per-icon imports only.**
   `import Star from "lucide-react-native/dist/esm/icons/star"` — never
   `import { Star } from "lucide-react-native"`. The barrel re-exports ~1,600
   icons (~1.1 MB minified). Lint-enforced via `no-restricted-imports`
   (`eslint.config.local.ts`); TypeScript types come from `lucide-icons.d.ts`
   at the repo root.
2. **No heavy client libraries in leaf modules.** `stores/safeAreaInsets.ts`
   once imported Apollo's `makeVar` — one line that chained ~476 KB of
   Apollo + graphql into every bundle. Shared stores/hooks/utils that every
   route reaches must not import data clients, validators, or animation
   libraries. Apollo stays the sanctioned GraphQL client — inside data-layer
   modules that only data-fetching screens import.
3. **Startup env validation is dependency-free.** `src/lib/env.ts` validates
   four strings; zod cost ~368 KB there. Use zod inside features (forms,
   API parsing), not in modules the entry must load.
4. **The playground ships as a split chunk.** `asyncRoutes: { "web": true }`
   in `app.json` (expo-router plugin) gives every route its own web chunk, so
   the design-library gallery (which grows with every atom) never taxes the
   home page. Native behavior is unchanged.
5. **Sentry web replay is excluded at the resolver.**
   `getSentryExpoConfig(..., { includeWebReplay: false })` stubs
   `@sentry-internal/replay*` on web. If Session Replay is ever adopted,
   remove the flag and re-baseline.

## Parse-time web splash (`public/index.html`)

In SPA export mode (`web.output: "single"`, the default) Expo builds
`index.html` from `public/index.html`. Without it the shipped body is empty,
so First Contentful Paint waits for the entire JS bundle to download, execute,
and mount React. The template ships an inline `#app-splash` overlay (base64
logo + CSS spinner, system font, zero network dependencies) that paints at
HTML-parse time, so FCP fires before any JS runs
([issue #25](https://github.com/CodySwannGT/expostarter/issues/25); measured
downstream: geminisportsai/frontend-v2 FCP 2,555ms → 1,204ms, TunnlAI/frontend
FCP → 753ms). TTI is unaffected — this is a paint-path win only.

How it works:

- `public/index.html` — the overlay, a sibling of `#root`. Respects
  `prefers-color-scheme` (colors mirror the `background-0` / `primary-500`
  tokens) and `prefers-reduced-motion`; a head-level `<noscript>` hides it
  for JS-disabled visitors.
- `src/app/_layout.tsx` — a web-only effect `.remove()`s the overlay once
  React mounts, so it can never intercept clicks. If your app adds custom
  fonts, gate the removal on a fonts-ready signal that always settles
  (`loaded || error !== null` from `useFonts`).

When instantiating the template, re-brand the logo/colors — the regeneration
one-liner and token mapping are documented in the header comment of
`public/index.html`.

Caveat: the inline HTML adds ~50ms (×4 under Lighthouse CPU throttle) to
`bootup-time`'s numericValue — harmless, but it can flip the binary-scored
`bootup-time` audit if your value sits near the ~1,282ms cliff.

## Known remaining weight (accepted for now)

- **Sentry on web (~730 KB raw)** — the price of shipping error monitoring in
  the entry; `@sentry-internal/feedback` (~48 KB) could also be
  resolver-stubbed if needed.
- **CSS is ~1 MB raw (~60 KB gzip)** — dominated by the `safelist` regex in
  `tailwind.config.js`, which force-generates every raw-palette
  `{bg,border,text,stroke,fill}-{family}-{shade}` class. Worth revisiting;
  gzip makes it survivable today, but it is the single largest non-JS asset.
- **react-aria (~126 KB raw)** — statically pulled by the GlueStack
  overlay/toast creators used in `gluestack-ui-provider`.

## When a budget assertion fails in CI

1. Reproduce locally: `bun run export:web && bun run lighthouse:check`.
2. Diff the composition against this document with source-map-explorer.
3. Fix the import chain (or split the route) rather than raising the budget.
4. Raise a budget only for a deliberate, understood baseline move — update the
   table above in the same PR.
