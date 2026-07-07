---
name: add-design-library-item
description: Add a new item (atom, variant, or token) to the design pattern library BEFORE using it in product code. Use whenever a needed rendering primitive, component variant, or design token does not already exist in @/components/atoms or the Tailwind semantic tier. Covers creating the atom, its gallery entry, tests, barrel export, playground wiring, and verification — then consuming it from product code.
---

# Add a Design Library Item

The design library (`docs/design-system-rfc.md`) is the ONLY public source of
rendering primitives: app code imports from `@/components/atoms`, never
`@/components/ui` (vendored Gluestack) or react-native UI primitives — those
are lint errors. **If the thing you need doesn't exist in the library, you add
it to the library first, wire it into the playground, verify, and only then
use it in product code.** Never work around the library with a waiver, a
ledger entry, or a raw primitive.

## Step 0 — Confirm it doesn't already exist

```bash
grep -n "export" src/components/atoms/index.ts          # barrel = public surface
ls src/components/atoms/                                # one dir per atom
grep -n "<token-or-variant>" tailwind.config.js docs/design-system/tokens.md
```

Also check whether an EXISTING atom + variant + closed className tokens can
express the need. The answer is usually yes — adding a new item is the last
resort, not the first move.

## Step 1 — Classify what you're adding

| Need | What to add | Go to |
|---|---|---|
| New rendering primitive (wraps a Gluestack family or sanctioned 3rd-party) | **Atom** | Step 2 |
| New visual option on an existing atom (size/tone/style) | **Variant** | Step 3 |
| New color / spacing / radius / text-style value | **Token** | Step 4 |
| New composite of existing atoms | **Molecule/Organism** — NOT this skill; build it under `components/{molecules,organisms}` (Container/View pattern) consuming atoms only | — |

## Step 2 — New atom

Decide the shape:
- **Narrowed atom** (preferred for simple, high-traffic primitives — see
  `Button/`, `Input/`, `Text/`): closed enum props, compound ceremony
  assembled inside, callers pass data not trees.
- **Structured atom** (for compound families — see `Modal/`, `Select/`):
  re-export ALL named exports of the ui family verbatim. Inspect the ui
  index for the exact export list — some export `UI*` creator intermediates
  and constants; don't guess.

Create `src/components/atoms/<Name>/index.tsx`. Non-negotiable conventions
(read `src/components/atoms/Stack/index.tsx` and `Button/index.tsx` as
exemplars first):

1. File-header JSDoc (`@file` / `@description` / `@module`); JSDoc with
   description, `@param`, `@returns` on any plain function.
2. **Stateless** — no state/effect/data hooks (lint enforces at error).
3. Public `style` prop is removed; expose the escape hatch typed FROM the
   wrapped component: `WithUnsafeStyle<UIProps["style"]>` from `../types`
   (CI budget ≤ 9 — design for zero usage).
4. **testID + accessibility props forward** (part of the atom API). If the
   wrapped ui family has an `index.web.tsx` rendering raw HTML (div/span),
   ALSO emit `{...(testID ? { "data-testid": testID } : {})}` — raw HTML
   gets a bare `testid` attribute otherwise and Playwright selectors break.
5. **Union-type trap:** if the wrapped component's props are a TS union,
   `Omit<>` collapses it (keyof-intersection) and silently drops member keys
   — declare the atom's props explicitly instead (see `Icon/index.tsx`).
6. Layer direction: atoms import only `@/components/ui`, react-native,
   lucide-react-native, and sibling atoms — never features/providers/Apollo
   (lint error).

## Step 3 — New variant on an existing atom

1. Add the literal to the exported union (`ButtonTone`, `TextVariant`, …)
   and implement it (tva variant or class bundle in `../types.ts` maps).
2. If it's a text style: size+line-height belong in `tailwind.config.js`
   `fontSize` AND the new class name must be registered in tailwind-merge's
   font-size class group (if the project ships a
   `patches/@gluestack-ui+utils*.patch` for this, extend it) — otherwise
   tailwind-merge classifies it as a COLOR and silently drops it whenever a
   color class follows (this shipped a real bug once).
3. The gallery completeness check WILL fail until every union literal
   appears in the atom's `gallery.tsx` — that's by design.

## Step 4 — New token

Tokens are an amendment, not a workaround — a 5-minute change, by design:

1. `tailwind.config.js`: semantic colors alias existing CSS vars
   (`"rgb(var(--color-…)/<alpha-value>)"`) for free dark-mode; genuinely new
   colors add a var to BOTH light and dark blocks of
   `src/components/ui/gluestack-ui-provider/config.ts`. Spacing/sizing/radius
   values go in the closed scales (spacing is REPLACED, sizing axes are
   per-axis extensions — keep the ladder enumerated).
2. Document it in `docs/design-system/tokens.md` with exact anchors.
3. Budgets: the semantic color tier is lint-bound to 15–25 tokens and the
   chart annex is a closed set (`design-system/semantic-token-budget` in
   `eslint.config.local.ts`) — if your addition crosses the bound, that's a
   ratification conversation (bump the bound in a reviewed PR), not a config
   edit.
4. Verify the class actually compiles (start the app once, then
   `grep "<class>" node_modules/.cache/nativewind/global.css`).

## Step 5 — Gallery (mandatory for atoms and variants)

Create/update `src/components/atoms/<Name>/gallery.tsx` exporting
`gallery: GalleryEntry` (`{ name, Component, cases }`, types from
`../galleryTypes`):

- **Every exported enum value must appear in at least one case** — the
  `design-system/atom-gallery-complete` lint rule enforces this by string
  match.
- Static atoms: cases via `props`/`children`. Composition needed → the
  `render?: () => ReactNode` escape. **Never `useState` in gallery files.**
- **Overlay compound families: do NOT render `*Content`/`*Item` parts bare**
  — they read the parent's style context and crash the whole route
  (`useStyleContext` destructure of undefined). Use the shared
  `OverlayGalleryCard` (`../galleryOverlayCard`) descriptor instead.
- Cast: `Component: <Name> as unknown as React.ComponentType<never>`.

Then regenerate + verify the manifest (also wires the /playground route —
it renders the generated manifest, no route edits needed):

```bash
bun run design:manifest   # node scripts/design-system/generate-gallery-manifest.mjs
```

(The `design-system/gallery-manifest-fresh` lint rule fails the build if the
committed manifest drifts from the atoms on disk.)

## Step 6 — Tests

`src/components/atoms/<Name>/__tests__/<Name>.test.tsx` with
@testing-library/react-native:

- **Exactly ONE `render()` per `it()`** (css-interop teardown crashes on
  multiple mounted trees).
- Assert: renders, testID forwards, and the atom-specific contract (variant
  accepted, onPress fires, label renders, …). For structured re-exports an
  export-shape assertion is acceptable. Known env quirks: placeholder
  queries may not match newer RN hosts (use `UNSAFE_getByProps`), some
  wrappers duplicate testID onto inner SVGs (use `getAllByTestId`).

## Step 7 — Barrel + verification battery

1. Add `export * from "./<Name>";` to `src/components/atoms/index.ts`
   (keep alphabetical).
2. Run the full battery — all must pass before product usage:

```bash
bun run typecheck
bun run test src/components/atoms
bun run lint            # includes the design-system lint rules
bun run design:manifest
```

3. Eyeball it: the `/playground` route (dev builds; local:
   `bun run playwright:build && npx serve dist -l 8082 -s`, open
   `http://localhost:8082/playground`) — your entry must render in both
   themes via the page's theme toggle, with no "failed to render" card.

## Step 8 — NOW use it in product code

- Import from `@/components/atoms` (or `@/components/atoms/<Name>`), never
  the ui path — lint enforces this.
- Style with closed tokens only: spacing `0 micro px 1 2 3 4 5 6 8 10 12 16`,
  the sizing ladder, `rounded-none/sm/md/lg/full`, semantic colors
  (`content-* surface-* outline-* accent-primary status-* chart-*`), text
  styles via `variant`. No arbitrary `[...]` values, no fractional steps,
  no margins where a parent Stack `space`/gap can own the spacing.
- Dynamic, data-driven values (chart colors, measured geometry) are not
  design tokens: atoms like `Icon` take `color`/`fill`/`stroke` props; only
  truly irreducible cases use `UNSAFE_style` (budget-counted) — prefer a
  token amendment first.

## Hard rules

- Never add product code that imports `@/components/ui` or RN rendering
  primitives instead of doing this skill's work — and never "fix" that with
  a file-level lint waiver (there is no waiver machinery in this repo by
  design; only tightest-scope line-level suppressions with a `--` reason).
- Never ship an atom without gallery + tests + barrel — the design-system
  lint rules and this skill are the gate.
- Zero-visual-change discipline applies when an addition replaces existing
  ad-hoc styling: snap off-scale values to the nearest closed token (ties
  round down).
