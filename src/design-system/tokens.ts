/**
 * Design tokens — the single source of truth for the closed styling dialect.
 *
 * `src/global.css` is GENERATED from this module by
 * `scripts/design-system/generate-global-css.mjs` (Tailwind-4 CSS-first
 * `@theme`). Do NOT hand-edit global.css: a content-hash header plus the
 * `design-system/global-css-fresh` ESLint rule fail the build on drift.
 *
 * The `design-system/semantic-token-budget` ESLint rule imports
 * {@link SEMANTIC_COLORS} + {@link CHART_COLORS} from here to keep the closed
 * semantic tier's budget real (it used to jiti-load tailwind.config.js, which
 * no longer exists under Tailwind 4).
 *
 * Two color tiers survive the Tailwind-3 → Tailwind-4 migration with identical
 * NAMES so app-code classNames keep compiling:
 *   1. Raw palette (atom/ui-internal): {@link RAW_PALETTE} per-mode RGB triplets
 *      exposed as `bg-primary-500`/`text-typography-900`/… utilities via
 *      {@link RAW_COLOR_UTILITIES}.
 *   2. Semantic tier (the vocabulary app code speaks): content/surface/accent/
 *      status/outline aliases in {@link SEMANTIC_COLORS}.
 *
 * @see docs/design-system/tokens.md
 * @see docs/design-system-rfc.md
 * @module design-system/tokens
 */

/** A semantic value: either a reference to a raw palette var (mode-switching) or a literal color. */
export type SemanticValue = { readonly ref: string } | string;

/**
 * Raw palette — RGB triplets ("R G B") per theme mode. Atom/ui-internal tier.
 * These become the runtime CSS variables in `@layer theme` (light `:root`,
 * dark `@media`, and `:root.dark`/`:root.light` web overrides).
 */
export const RAW_PALETTE = {
  light: {
    "primary-0": "179 179 179",
    "primary-50": "153 153 153",
    "primary-100": "128 128 128",
    "primary-200": "115 115 115",
    "primary-300": "102 102 102",
    "primary-400": "82 82 82",
    "primary-500": "51 51 51",
    "primary-600": "41 41 41",
    "primary-700": "31 31 31",
    "primary-800": "13 13 13",
    "primary-900": "10 10 10",
    "primary-950": "8 8 8",
    "secondary-0": "254 255 255",
    "secondary-50": "241 242 242",
    "secondary-100": "231 232 232",
    "secondary-200": "219 219 219",
    "secondary-300": "175 176 176",
    "secondary-400": "114 115 115",
    "secondary-500": "94 95 95",
    "secondary-600": "81 82 82",
    "secondary-700": "63 64 64",
    "secondary-800": "39 38 38",
    "secondary-900": "24 23 23",
    "secondary-950": "11 12 12",
    "tertiary-0": "255 250 245",
    "tertiary-50": "255 242 229",
    "tertiary-100": "255 233 213",
    "tertiary-200": "254 209 170",
    "tertiary-300": "253 180 116",
    "tertiary-400": "251 157 75",
    "tertiary-500": "231 129 40",
    "tertiary-600": "215 117 31",
    "tertiary-700": "180 98 26",
    "tertiary-800": "130 73 23",
    "tertiary-900": "108 61 19",
    "tertiary-950": "84 49 18",
    "error-0": "254 233 233",
    "error-50": "254 226 226",
    "error-100": "254 202 202",
    "error-200": "252 165 165",
    "error-300": "248 113 113",
    "error-400": "239 68 68",
    "error-500": "230 53 53",
    "error-600": "220 38 38",
    "error-700": "185 28 28",
    "error-800": "153 27 27",
    "error-900": "127 29 29",
    "error-950": "83 19 19",
    "success-0": "228 255 244",
    "success-50": "202 255 232",
    "success-100": "162 241 192",
    "success-200": "132 211 162",
    "success-300": "102 181 132",
    "success-400": "72 151 102",
    "success-500": "52 131 82",
    "success-600": "42 121 72",
    "success-700": "32 111 62",
    "success-800": "22 101 52",
    "success-900": "20 83 45",
    "success-950": "27 50 36",
    "warning-0": "255 253 251",
    "warning-50": "255 249 245",
    "warning-100": "255 231 213",
    "warning-200": "254 205 170",
    "warning-300": "253 173 116",
    "warning-400": "251 149 75",
    "warning-500": "231 120 40",
    "warning-600": "215 108 31",
    "warning-700": "180 90 26",
    "warning-800": "130 68 23",
    "warning-900": "108 56 19",
    "warning-950": "84 45 18",
    "info-0": "236 248 254",
    "info-50": "199 235 252",
    "info-100": "162 221 250",
    "info-200": "124 207 248",
    "info-300": "87 194 246",
    "info-400": "50 180 244",
    "info-500": "13 166 242",
    "info-600": "11 141 205",
    "info-700": "9 115 168",
    "info-800": "7 90 131",
    "info-900": "5 64 93",
    "info-950": "3 38 56",
    "typography-0": "254 254 255",
    "typography-50": "245 245 245",
    "typography-100": "229 229 229",
    "typography-200": "219 219 220",
    "typography-300": "212 212 212",
    "typography-400": "163 163 163",
    "typography-500": "140 140 140",
    "typography-600": "115 115 115",
    "typography-700": "82 82 82",
    "typography-800": "64 64 64",
    "typography-900": "38 38 39",
    "typography-950": "23 23 23",
    "outline-0": "253 254 254",
    "outline-50": "243 243 243",
    "outline-100": "230 230 230",
    "outline-200": "221 220 219",
    "outline-300": "211 211 211",
    "outline-400": "165 163 163",
    "outline-500": "140 141 141",
    "outline-600": "115 116 116",
    "outline-700": "83 82 82",
    "outline-800": "65 65 65",
    "outline-900": "39 38 36",
    "outline-950": "26 23 23",
    "background-0": "255 255 255",
    "background-50": "246 246 246",
    "background-100": "242 241 241",
    "background-200": "220 219 219",
    "background-300": "213 212 212",
    "background-400": "162 163 163",
    "background-500": "142 142 142",
    "background-600": "116 116 116",
    "background-700": "83 82 82",
    "background-800": "65 64 64",
    "background-900": "39 38 37",
    "background-950": "24 23 24",
    "background-error": "254 241 241",
    "background-warning": "255 244 235",
    "background-success": "237 252 242",
    "background-muted": "247 248 247",
    "background-info": "235 248 254",
    "indicator-primary": "55 55 55",
    "indicator-info": "83 153 236",
    "indicator-error": "185 28 28",
    "accent-primary": "0 122 255",
    "content-50": "252 252 252",
    "shade-0": "38 38 38",
  },
  dark: {
    "primary-0": "130 130 130",
    "primary-50": "148 148 148",
    "primary-100": "158 158 158",
    "primary-200": "179 179 179",
    "primary-300": "199 199 199",
    "primary-400": "230 230 230",
    "primary-500": "240 240 240",
    "primary-600": "250 250 250",
    "primary-700": "252 252 252",
    "primary-800": "253 253 253",
    "primary-900": "253 252 252",
    "primary-950": "253 252 252",
    "secondary-0": "11 12 12",
    "secondary-50": "24 23 23",
    "secondary-100": "39 38 38",
    "secondary-200": "63 64 64",
    "secondary-300": "81 82 82",
    "secondary-400": "94 95 95",
    "secondary-500": "114 115 115",
    "secondary-600": "175 176 176",
    "secondary-700": "219 219 219",
    "secondary-800": "231 232 232",
    "secondary-900": "241 242 242",
    "secondary-950": "254 255 255",
    "tertiary-0": "84 49 18",
    "tertiary-50": "108 61 19",
    "tertiary-100": "130 73 23",
    "tertiary-200": "180 98 26",
    "tertiary-300": "215 117 31",
    "tertiary-400": "231 129 40",
    "tertiary-500": "251 157 75",
    "tertiary-600": "253 180 116",
    "tertiary-700": "254 209 170",
    "tertiary-800": "255 233 213",
    "tertiary-900": "255 242 229",
    "tertiary-950": "255 250 245",
    "error-0": "83 19 19",
    "error-50": "127 29 29",
    "error-100": "153 27 27",
    "error-200": "185 28 28",
    "error-300": "220 38 38",
    "error-400": "230 53 53",
    "error-500": "239 68 68",
    "error-600": "248 113 113",
    "error-700": "252 165 165",
    "error-800": "254 202 202",
    "error-900": "254 226 226",
    "error-950": "254 233 233",
    "success-0": "27 50 36",
    "success-50": "20 83 45",
    "success-100": "22 101 52",
    "success-200": "32 111 62",
    "success-300": "42 121 72",
    "success-400": "52 131 82",
    "success-500": "72 151 102",
    "success-600": "102 181 132",
    "success-700": "132 211 162",
    "success-800": "162 241 192",
    "success-900": "202 255 232",
    "success-950": "228 255 244",
    "warning-0": "84 45 18",
    "warning-50": "108 56 19",
    "warning-100": "130 68 23",
    "warning-200": "180 90 26",
    "warning-300": "215 108 31",
    "warning-400": "231 120 40",
    "warning-500": "251 149 75",
    "warning-600": "253 173 116",
    "warning-700": "254 205 170",
    "warning-800": "255 231 213",
    "warning-900": "255 249 245",
    "warning-950": "255 253 251",
    "info-0": "3 38 56",
    "info-50": "5 64 93",
    "info-100": "7 90 131",
    "info-200": "9 115 168",
    "info-300": "11 141 205",
    "info-400": "13 166 242",
    "info-500": "50 180 244",
    "info-600": "87 194 246",
    "info-700": "124 207 248",
    "info-800": "162 221 250",
    "info-900": "199 235 252",
    "info-950": "236 248 254",
    "typography-0": "23 23 23",
    "typography-50": "38 38 39",
    "typography-100": "64 64 64",
    "typography-200": "82 82 82",
    "typography-300": "115 115 115",
    "typography-400": "140 140 140",
    "typography-500": "163 163 163",
    "typography-600": "212 212 212",
    "typography-700": "219 219 220",
    "typography-800": "229 229 229",
    "typography-900": "245 245 245",
    "typography-950": "254 254 255",
    "outline-0": "26 23 23",
    "outline-50": "39 38 36",
    "outline-100": "65 65 65",
    "outline-200": "83 82 82",
    "outline-300": "115 116 116",
    "outline-400": "140 141 141",
    "outline-500": "165 163 163",
    "outline-600": "211 211 211",
    "outline-700": "221 220 219",
    "outline-800": "230 230 230",
    "outline-900": "243 243 243",
    "outline-950": "253 254 254",
    "background-0": "18 18 18",
    "background-50": "39 38 37",
    "background-100": "65 64 64",
    "background-200": "83 82 82",
    "background-300": "116 116 116",
    "background-400": "142 142 142",
    "background-500": "162 163 163",
    "background-600": "213 212 212",
    "background-700": "220 219 219",
    "background-800": "242 241 241",
    "background-900": "246 246 246",
    "background-950": "254 254 254",
    "background-error": "66 43 43",
    "background-warning": "65 47 35",
    "background-success": "28 43 33",
    "background-muted": "51 51 51",
    "background-info": "26 40 46",
    "indicator-primary": "247 247 247",
    "indicator-info": "161 199 245",
    "indicator-error": "232 70 69",
    "accent-primary": "10 132 255",
    "content-50": "219 219 219",
    "shade-0": "64 64 64",
  },
} as const;

/**
 * Which shade keys each raw family exposes as color utilities (`bg-<family>-<key>`).
 * Matches the old `tailwind.config.js` color map so no app className breaks.
 */
export const RAW_COLOR_UTILITIES = {
  primary: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  secondary: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  tertiary: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  error: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  success: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  warning: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  info: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  typography: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  outline: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  background: [
    0,
    50,
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    950,
    "error",
    "warning",
    "muted",
    "success",
    "info",
  ],
  indicator: ["primary", "info", "error"],
} as const;

/** Mode-independent literal colors within raw families (e.g. `bg-background-light`). */
export const FIXED_COLORS = {
  "typography-white": "#FFFFFF",
  "typography-gray": "#D4D4D4",
  "typography-black": "#181718",
  "background-light": "#FFFFFF",
  "background-dark": "#181719",
  "background-gray": "#1C1C1E",
  "background-button": "#2C2C2E",
} as const;

/**
 * Chart annex — a CLOSED palette (design library, decision #2). The
 * `design-system/semantic-token-budget` rule asserts these are the only keys.
 */
export const CHART_COLORS = {
  player: "#0DA6F2",
  other: "#a855f7",
  horizontalLine: "#a2a3a3",
  line: "#a2a3a3",
  up: "#66B584",
  down: "#E77828",
} as const;

/** Toast palette — app-specific raw family (was `src/config/colors.ts`). */
export const TOAST_COLORS = {
  normal: "#032A3E",
  danger: "#A84A4A",
  success: "#032A3E",
  warning: "#032A3E",
  icon: "#FFFFFF",
  text: "#FFFFFF",
} as const;

/**
 * Semantic color tier — the closed vocabulary app code may use. Values are
 * either `{ ref }` (points at a raw palette var, so it switches with the mode)
 * or a literal hex. The tier size is lint-enforced (15–25) by
 * `design-system/semantic-token-budget`.
 */
export const SEMANTIC_COLORS: {
  readonly content: Readonly<Record<string, SemanticValue>>;
  readonly surface: Readonly<Record<string, SemanticValue>>;
  readonly accent: Readonly<Record<string, SemanticValue>>;
  readonly status: Readonly<Record<string, SemanticValue>>;
  readonly outline: Readonly<Record<string, SemanticValue>>;
} = {
  content: {
    primary: { ref: "typography-900" },
    secondary: { ref: "typography-700" },
    muted: { ref: "typography-500" },
    subtle: { ref: "typography-400" },
    disabled: { ref: "typography-200" },
    inverse: { ref: "typography-0" },
    "on-accent": "#FFFFFF",
  },
  surface: {
    base: { ref: "background-0" },
    raised: { ref: "background-50" },
    subtle: { ref: "background-100" },
    muted: { ref: "background-200" },
    strong: { ref: "background-300" },
    inverse: { ref: "background-950" },
    action: "#2C2C2E",
  },
  accent: {
    primary: { ref: "accent-primary" },
  },
  status: {
    error: { ref: "error-500" },
    "error-surface": { ref: "background-error" },
    success: { ref: "success-500" },
    "success-surface": { ref: "background-success" },
    warning: { ref: "warning-500" },
    "warning-surface": { ref: "background-warning" },
    info: { ref: "info-500" },
    "info-surface": { ref: "background-info" },
    "info-strong": { ref: "info-800" },
  },
  outline: {
    subtle: { ref: "outline-100" },
    default: { ref: "outline-200" },
    strong: { ref: "outline-300" },
    emphasis: { ref: "outline-700" },
  },
};

/**
 * Gluestack v5 component-token bridge — the shadcn vocabulary the v5 vendored
 * components speak internally (`bg-primary` / `bg-destructive` /
 * `text-muted-foreground` / `border-input` / `ring-ring` …).
 *
 * This tier exists SOLELY so the vendored v5 components in `src/components/ui/**`
 * render in-brand; it is **not** part of the ratified design vocabulary. App
 * and atom code must never use these classes — they are lint-banned outside
 * `src/components/ui/**` (`better-tailwindcss/no-restricted-classes` in
 * eslint.config.local.ts). The set is CLOSED: it must equal the enumerated
 * `ALLOWED_BRIDGE_KEYS` list in the `design-system/semantic-token-budget` rule
 * (asserted there, like the chart annex), and it is EXEMPT from the
 * semantic-token budget count. Each value maps to a
 * raw palette var so it mode-switches with light/dark, exactly like the v3
 * provider fed the equivalent shades.
 */
export const BRIDGE_COLORS: Readonly<Record<string, SemanticValue>> = {
  background: { ref: "background-0" },
  foreground: { ref: "typography-900" },
  card: { ref: "background-0" },
  "card-foreground": { ref: "typography-900" },
  popover: { ref: "background-0" },
  "popover-foreground": { ref: "typography-900" },
  primary: { ref: "primary-500" },
  "primary-foreground": { ref: "typography-0" },
  secondary: { ref: "background-100" },
  "secondary-foreground": { ref: "typography-900" },
  muted: { ref: "background-100" },
  "muted-foreground": { ref: "typography-500" },
  accent: { ref: "background-50" },
  "accent-foreground": { ref: "typography-900" },
  destructive: { ref: "error-500" },
  "destructive-foreground": { ref: "typography-0" },
  border: { ref: "outline-200" },
  input: { ref: "outline-200" },
  ring: { ref: "outline-300" },
};

/**
 * Spacing scale (ratified decision #3): 4px grid + named 2px micro + 1px
 * hairline, plus the Phase-0 sizing ladder (all on the 4px grid) so
 * `w-7`/`h-11`/`size-14` keep resolving. Under Tailwind 4 the width/height axes
 * share the `--spacing-*` namespace. NOTE: unlike the v3 `theme.spacing`
 * replacement, the base `--spacing` variable is NOT reset (NativeWind's
 * `@utility leading-*` needs `var(--spacing)`), so spacing is a continuous 4px
 * grid at the CSS level; the CLOSED spacing vocabulary is enforced by the atom
 * SpaceToken enum + the no-arbitrary-value lint rule. Percentage fractions are
 * native Tailwind-4 utilities.
 */
export const SPACING = {
  "0": "0px",
  micro: "2px",
  px: "1px",
  "1": "4px",
  "2": "8px",
  "3": "12px",
  "4": "16px",
  "5": "20px",
  "6": "24px",
  "7": "28px",
  "8": "32px",
  "9": "36px",
  "10": "40px",
  "11": "44px",
  "12": "48px",
  "14": "56px",
  "16": "64px",
  "20": "80px",
  "24": "96px",
  "28": "112px",
  "32": "128px",
  "40": "160px",
  "44": "176px",
  "48": "192px",
  "52": "208px",
  "56": "224px",
  "64": "256px",
  "72": "288px",
  "80": "320px",
  "96": "384px",
} as const;

/** CLOSED radius scale (docs/design-system/tokens.md). Generator resets `--radius-*: initial`. */
export const RADIUS = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "20px",
  full: "9999px",
} as const;

/**
 * Ratified text styles. `[size]` or `[size, lineHeight]`. The Text atom bundles
 * family/weight on top (src/components/atoms/types.ts TEXT_VARIANT_CLASS).
 */
export const FONT_SIZE: Readonly<
  Record<string, readonly [string] | readonly [string, string]>
> = {
  "2xs": ["10px"],
  micro: ["10px"],
  caption: ["12px", "16px"],
  body: ["14px", "20px"],
  "title-sm": ["16px", "24px"],
  title: ["18px", "28px"],
  "title-lg": ["20px", "28px"],
  "display-sm": ["24px", "32px"],
  "display-md": ["30px", "36px"],
  "display-lg": ["36px", "40px"],
  "display-xl": ["48px", "48px"],
  "display-2xl": ["60px", "60px"],
};

/**
 * Platform system font stack (starter default — no brand fonts). The token
 * NAMES (heading/body) stay stable; a brand-font project swaps the values.
 * Under NativeWind the native side maps `System`/`sans-serif`; the web build
 * uses the CSS stack below.
 */
export const FONT_FAMILY = {
  heading: "ui-sans-serif, system-ui, sans-serif",
  body: "ui-sans-serif, system-ui, sans-serif",
} as const;

/** Custom elevation tokens (shadow-hard-*, shadow-soft-*). */
export const SHADOW = {
  "hard-1": "-2px 2px 8px 0px rgba(38, 38, 38, 0.20)",
  "hard-2": "0px 3px 10px 0px rgba(38, 38, 38, 0.20)",
  "hard-3": "2px 2px 8px 0px rgba(38, 38, 38, 0.20)",
  "hard-4": "0px -3px 10px 0px rgba(38, 38, 38, 0.20)",
  "hard-5": "0px 2px 10px 0px rgba(38, 38, 38, 0.10)",
  "soft-1": "0px 0px 10px rgba(38, 38, 38, 0.1)",
  "soft-2": "0px 0px 20px rgba(38, 38, 38, 0.2)",
  "soft-3": "0px 0px 30px rgba(38, 38, 38, 0.1)",
  "soft-4": "0px 0px 40px rgba(38, 38, 38, 0.1)",
} as const;

/**
 * Breakpoints — Tailwind's default screens (nativewind/preset used to supply
 * these). Consumed by src/components/ui/utils/use-break-point-value.ts, which
 * can no longer read them from tailwind.config.js under Tailwind 4.
 */
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;
