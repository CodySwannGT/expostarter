# Token specification

Ratified vocabulary for the design library. Names are the public language;
values live in `tailwind.config.js` (scales) and
`src/components/ui/gluestack-ui-provider/config.ts` (raw-palette CSS vars,
light AND dark). Source RFC: `docs/design-system-rfc.md`.

## Spacing scale (ratified decision #3)

Axes: `p* m* gap space inset top/bottom/left/right translate`.

| token | px |
|---|---|
| `0` | 0 |
| `micro` | 2 |
| `px` | 1 |
| `1` | 4 |
| `2` | 8 |
| `3` | 12 |
| `4` | 16 |
| `5` | 20 |
| `6` | 24 |
| `8` | 32 |
| `10` | 40 |
| `12` | 48 |
| `16` | 64 |

## Sizing ladder (addendum #1)

Axes: `w h size min-w min-h max-w max-h basis` (and `inset` for anchored
overlays). Spacing steps plus `7`(28) `9`(36) `11`(44) `14`(56) `20`(80)
`24`(96) `28`(112) `32`(128) `40`(160) `44`(176) `48`(192) `52`(208)
`56`(224) `64`(256) `72`(288) `80`(320) `96`(384), plus the non-numeric
layout values (`full auto screen fit min max` and percentage fractions —
fractions are completed on the min/max axes in `tailwind.config.js`).

## Text styles (ratified decision #4 — 8 styles)

A style bundles size + line-height + family/weight. The `text-<style>`
fontSize token carries size+line-height; the `Text`/`Heading` atoms' `variant`
prop applies the full bundle (`TEXT_VARIANT_CLASS` in
`src/components/atoms/types.ts`). `display` is one style with a bundled size
ladder (same shape as a Button having `sm/md/lg`).

| style | px / line-height | family/weight (starter) |
|---|---|---|
| `micro` | 10 / 14 | body (system) |
| `caption` | 12 / 16 | body (system) |
| `body` | 14 / 20 | body (system) |
| `body-strong` | 14 / 20 | body (system) medium |
| `title-sm` | 16 / 24 | heading (system) bold |
| `title` | 18 / 28 | heading (system) bold |
| `title-lg` | 20 / 28 | heading (system) bold |
| `display` (sm 24/32 · md 30/36 · lg 36/40 · xl 48 · 2xl 60) | — | heading (system) bold |

The starter ships the platform system font stack (`fontFamily.heading` /
`fontFamily.body` in `tailwind.config.js` via `platformSelect`). A brand-font
project swaps those families (and, if the brand ships weight-specific
families, moves the weight into the family inside `TEXT_VARIANT_CLASS`) — the
style NAMES stay stable.

## Semantic color tier (ratified decision #2 — 24 tokens + chart annex)

Anchored on the raw-palette CSS vars in
`src/components/ui/gluestack-ui-provider/config.ts` — each token renders in
both modes for free. The tier's size is lint-bound to 15–25
(`design-system/semantic-token-budget`).

### content (text/icon)

`content-primary` (typography-900) · `content-secondary` (typography-700) ·
`content-muted` (typography-500) · `content-subtle` (typography-400) ·
`content-disabled` (typography-200) · `content-inverse` (typography-0) ·
`content-on-accent` (#FFFFFF)

### surface

`surface-base` (background-0) · `surface-raised` (background-50) ·
`surface-subtle` (background-100) · `surface-muted` (background-200) ·
`surface-strong` (background-300) · `surface-inverse` (background-950) ·
`surface-action` (#2C2C2E)

### border

Semantic border names live inside the `outline` family so classes read
`border-outline-subtle` (avoids a `border-border-*` stutter). The four names
are lint-enforced as a closed set:

`outline-subtle` (outline-100) · `outline-default` (outline-200) ·
`outline-strong` (outline-300) · `outline-emphasis` (outline-700)

### accent + status

`accent-primary` (var `--color-accent-primary`) · `status-error` (+
`-surface`) · `status-success` (+ `-surface`) · `status-warning` (+
`-surface`) · `status-info` (+ `-surface`, `-strong`)

### chart annex (closed categorical palette — ratified decision #2)

`chart-player` · `chart-other` · `chart-line` · `chart-horizontalLine` ·
`chart-up` · `chart-down`. The key set is closed and lint-enforced; growing
it is a ratification conversation.

Component-scoped palettes (e.g. `toast.*` from `src/config/colors.ts`) are
**atom-internal raw palette** — used only inside the owning atom's variants,
never by app code.

## Radius (closed)

`none`(0) · `sm`(4) · `md`(8) · `lg`(12) · `xl`(20) · `full`. Snap policy
(ties round down) when mapping legacy values: 2→`none`, 4→`sm`, 6→`sm`,
8→`md`, 16→`lg`, 24→`xl`.

## Elevation

The custom shadow set (`hard-1..5`, `soft-1..4`) is closed and tokenized.

## Breakpoints & variants (first-class, Tailwind defaults)

`sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`, plus `web: native:
ios: android: dark:` and GlueStack `data-[…]:` state selectors (atom-internal
only).
