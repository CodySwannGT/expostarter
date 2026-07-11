# RFC: The Design Library

**Status:** Ratified (adopted from the reference implementation; this starter
ships it sealed from day one)

This document defines the design library from first principles. It is the
spec — lint configs, skills, and agent rules are derived from it, never the
other way around.

## The core principle

**The wrong thing must be uncompilable, not discouraged.** Every rule below is
backed by a mechanism (theme, type system, or lint), not by review vigilance.

## How the pieces relate

The atomic hierarchy is the skeleton; each level has exactly one
responsibility. GlueStack and NativeWind are **implementation details that
live at specific levels and are invisible above them**:

```text
Pages        src/app/, features/*/screens/  data fetching, global state
  ↓
Templates    components/templates/          layout skeletons, slots
  ↓
Organisms    components/organisms/          distinct UI sections, feature state
  ↓
Molecules    components/molecules/          2–5 atoms, one purpose, UI state only
  ↓
Atoms        components/atoms/              ← PUBLIC API of the design library
  ↓                                         ← GlueStack visible ONLY here
  ↓                                         ← className strings allowed ONLY here
Tokens       tailwind.config + semantic     ← NativeWind compiles this vocabulary
```

Dependencies flow downward only. `className` and GlueStack imports do not
escape the atom layer. Data fetching does not descend below the page layer.

---

## 1. Tokens — the vocabulary

Tokens sit below atoms. They are the only values the rest of the system may
speak in, and the scales are **closed**: NativeWind's JIT compiler only
generates classes for values in the theme, so an off-scale class like
`py-2.5` simply produces no style.

- **Spacing:** 4px grid plus one named 2px step (`micro`) and the 1px
  hairline — defined with `theme.spacing` (replace — NOT `theme.extend`,
  which would inherit Tailwind's full default scale including the fractional
  steps). See `docs/design-system/tokens.md`.
- **Type:** 8 bundled text styles (size + line-height + family/weight as ONE
  token) — `display` (with a size ladder), `title-lg`, `title`, `title-sm`,
  `body`, `body-strong`, `caption`, `micro`.
- **Radius / elevation:** small closed sets.
- **Color: two tiers, only the top tier exported.** Raw palette (CSS-var
  shade families like `typography-500`) → semantic aliases
  (`surface-raised`, `content-muted`, `accent-primary`). App code may only
  reference the semantics. Dark mode is a remap of the semantic tier, free
  of charge.
- **Budget:** 15–25 named semantic color tokens total, plus one closed
  data-viz annex (`chart-*`) — lint-enforced
  (`design-system/semantic-token-budget`).
- Percentage fractions (`w-1/2`, `w-2/3`) are **layout semantics, not
  spacing** — they stay. Fractional *steps* (`p-2.5`) are entropy — they are
  not in the language.

## 2. One styling mechanism — NativeWind, nowhere else

NativeWind className strings are the single styling dialect — but only
**inside the atom layer and the variant definitions (`tva`) that implement
it**. Everywhere else, style is expressed through component props.

Banned in app code (lint-enforced): arbitrary values (`w-[120px]`,
`text-[#007AFF]`), off-manifest classnames, the `UNSAFE_style` escape hatch
(outside atoms), and any second styling library.

## 3. Atoms — the primitives, and where GlueStack hides

**GlueStack is a hidden implementation detail behind our own thin API.** It
is scaffolding we happen to render with, not the system.

- `src/components/atoms/` is the **only** public import surface — and the
  only source of rendering primitives, full stop. App code imports
  `@/components/atoms`, never `@/components/ui`, and never raw
  `View`/`Text`/`Image`/etc. from `react-native` or any third-party UI
  package (lint-enforced via `no-restricted-imports` with `importNames`;
  see §5). If a component isn't in the library, it cannot be rendered.
- Each atom is a thin wrapper that **narrows** the GlueStack component: our
  enum props in, GlueStack's wide surface hidden. Compound-component
  ceremony (`ButtonText`, `ButtonIcon`) is assembled *inside* the atom;
  callers pass data, not trees.
- **Layer direction:** atoms import only `@/components/ui`, react-native,
  lucide-react-native, and sibling atoms — never features, higher component
  layers, providers, or data clients (lint-enforced).
- Atoms are **stateless**. No hooks beyond memo/refs (lint-enforced).
- **The no-margin rule:** no component at any level sets its own `m-*`.
  Parents space children via `Stack space` / `gap`.

## 4. Molecules and organisms — closed APIs, no className

- **No `className` prop above the atom layer.** Molecules and organisms
  expose closed enums (`size`, `tone`, `emphasis`); variants are implemented
  inside with `tva` against the token vocabulary (lint-enforced).
- **Molecules:** 2–5 atoms, one purpose, UI-only state. No data fetching.
- **Organisms:** distinct interface sections composing molecules/atoms;
  feature state and child coordination allowed; data arrives as props.
- **Templates:** layout skeletons with slots; layout state only.
- **Pages:** the only level that touches data clients / global state, in
  `src/app/` (Expo Router) or `features/*/screens/`.
- Feature-specific components mirror the same tiers under
  `features/<feature>/components/` and obey the same rules.
- **One escape hatch, deliberately ugly:** `UNSAFE_style` (a single
  greppable prop accepted by atoms only). Every escape is auditable and
  budgeted — design for zero usage. The path of least resistance must be
  proposing a token, not escaping.

## 5. Enforcement — the compiler is the style guide

Every rule this RFC ratifies maps to at least one enforcing mechanism. All
rules run at **error severity with zero violations** — there is no ratchet,
no waiver ledger, and no file-level exemption machinery in this repo. The
handful of genuinely-irreducible bootstrap sites (e.g. the root
GluestackUIProvider import) carry a tightest-scope line-level suppression
with a `--` justification.

| Mechanism | What it kills |
|---|---|
| Closed `theme.spacing` / `fontSize` / `borderRadius` (replace, not extend) | off-scale classes — they produce no style |
| `tailwindcss/no-arbitrary-value`, `tailwindcss/no-custom-classname` | `text-[#007AFF]`, `w-[120px]`, invented classnames |
| `no-restricted-imports` zones | app code importing `@/components/ui`; atoms importing features/providers/data clients |
| `no-restricted-imports` with `importNames` — rendering primitives allowlisted to atoms only | app code importing `View`, `Text`, `Image`, `Pressable`, … from `react-native`, or third-party UI primitives (`@shopify/flash-list`, `@expo/html-elements`) outside `components/atoms/`. Non-UI RN APIs (`Platform`, `Linking`, `useWindowDimensions`, …) stay importable everywhere |
| `no-restricted-syntax` zone: no `useState`/`useEffect`/data hooks in atom implementations | stateful atoms |
| `no-restricted-syntax`: `UNSAFE_style` JSX attribute banned outside atoms; no `className` prop declared above the atom layer | a second styling dialect; open component APIs |
| `design-system/semantic-token-budget` (local plugin) | the semantic tier drifting past its 15–25 bound; the chart annex reopening |
| `design-system/atom-gallery-complete` (local plugin) | an atom shipping without gallery cases for every Variant/Tone/Size literal |
| `design-system/gallery-manifest-fresh` (local plugin) | the committed gallery manifest drifting from the atoms on disk |

All of this lives in `eslint.config.local.ts`.

## 6. Governance — keeping the system alive

- **The gallery is the source of truth — the in-app `/playground` route**
  (chosen over Storybook: it renders through the exact same Metro +
  NativeWind + provider pipeline as production, opens on all three
  platforms, and is drivable by the existing web e2e harness). It is
  excluded from production builds (`src/app/playground/_layout.tsx`). If it
  isn't in the gallery, it doesn't exist.
- **Gallery entries are data, not ad-hoc JSX.** Each atom ships a
  `gallery.tsx` exporting a `GalleryEntry` (component + named prop
  combinations); `scripts/design-system/generate-gallery-manifest.mjs`
  aggregates them into the committed `galleryManifest.ts` the route renders.
  Variants are closed enums, so "all states" is a finite grid.
- **Amendment must be cheaper than evasion.** "I need a new token / variant"
  is a 5-minute PR (see the `add-design-library-item` skill). If escaping is
  easier than amending, the system dies.
- **Versioning:** the atom API is treated as semver-stable; breaking an
  atom's props requires a codemod or a deprecation cycle.

### Standing constraints

1. **Three platforms, one codebase.** Web (react-native-web via Expo), iOS,
   and Android. Platform divergence is expressed only through the sanctioned
   variants (`web:` / `native:` / `ios:` / `android:`) inside atoms — never
   via `Platform.OS` styling branches in app code.
2. **All breakpoints are first-class.** The responsive variants (base,
   `sm:` … `2xl:`) are part of the token vocabulary.
3. **Visual parity is verified, not assumed.** Design-system changes go
   through the visual-parity-sweep / debug-visual-difference skills.
4. **Test/a11y identity is part of the atom API.** Every atom forwards
   `testID` and accessibility props to its underlying element (on web, atoms
   whose ui family renders raw HTML also emit `data-testid`) — it is exempt
   from the closed-API rule.

## Ratified decisions

1. **GlueStack posture — hidden behind thin atoms.** App code imports only
   `@/components/atoms`; `@/components/ui` is lint-banned elsewhere; any
   future swap is contained to one directory.
2. **Semantic color tier — semantic-only (15–25 named tokens) plus a closed
   data-viz annex (`chart-*`).** Shade families are demoted to raw palette
   feeding the semantics.
3. **Spacing scale — 4px grid + named 2px `micro` + 1px hairline:** 0,
   micro(2), px(1), 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
4. **Text style set — 8 bundled styles:** `display` (size ladder),
   `title-lg`, `title`, `title-sm`, `body`, `body-strong`, `caption`,
   `micro`.
5. **Escape hatch — `UNSAFE_style` (RN style object), atoms only, counted
   budget.** A style object cannot speak the banned className dialect; no
   `UNSAFE_className` exists.
6. **Snap policy — ties round down** when mapping off-scale values onto the
   closed scales; clusters name tokens; one-offs join a neighbor.
7. **Gallery mechanism — in-app `/playground` expo-router route** with
   data-driven entries, excluded from production builds.

## Implementation addenda

1. **Sizing ladder.** The spacing decision governs spacing axes; sizing axes
   (`w/h/size/min/max/basis`, plus `inset`) extend the same ladder upward
   with closed, enumerated larger values — see
   `docs/design-system/tokens.md`.
2. **Atoms accept `className`.** The lint rules ban a className PROP above
   the atom layer; atoms are the sanctioned className surface and the
   vocabulary itself is closed by theme + lint. Variant props are the
   preferred API; className covers layout.
3. **Structured atoms.** Compound GlueStack families (Modal, Select, …) are
   re-exported verbatim through their atom directory — the import-closure
   property holds immediately; per-family narrowing (the Button/Input
   treatment) proceeds opportunistically behind the stable atom paths.
4. **Dynamic-style values.** Runtime-computed values (data-driven colors,
   measured positions, animation) are not design-token decisions: atoms like
   `Icon` take `color`/`fill`/`stroke` props; only truly irreducible cases
   use `UNSAFE_style`.

## Compatibility note

**Migration executed.** This starter now runs on NativeWind 5 (preview) +
Tailwind CSS 4 + GlueStack v5 (vendored under `src/components/ui/`). The
theme config moved out of `tailwind.config.js` (deleted) into CSS-first
`@theme` blocks in `src/global.css`, which is **generated** from the single
source of truth `src/design-system/tokens.ts` by
`scripts/design-system/generate-global-css.mjs` (run `bun run design:css`; the
`design-system/global-css-fresh` lint rule fails on drift). The closed scales,
the raw palette, and the semantic tier survive with identical token NAMES, so
app-code classNames kept compiling. The thin-atom layer contained the GlueStack
v5 component redesign (shadcn-flavored) to `src/components/ui/` plus a small
per-atom remap: a `--primary`/`--destructive`/… component-token bridge in
`global.css` renders the v5 components in-brand, and atoms map their stable
public props onto v5's collapsed variant APIs.

Two governance details changed under Tailwind 4:

- **Spacing** is now a continuous 4px grid at the CSS level (Tailwind 4's
  spacing is `--spacing`-based and NativeWind's `leading-*` needs the base
  `--spacing`, so it cannot be reset to a closed set). The closed spacing
  vocabulary is enforced by the atom `SpaceToken` enum + the no-arbitrary-value
  lint rule instead. Radius stays closed.
- Class linting moved from `eslint-plugin-tailwindcss` (Tailwind 3 only) to
  `eslint-plugin-better-tailwindcss` reading `src/global.css`.
