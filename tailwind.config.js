const { platformSelect } = require("nativewind/theme");

const customColors = require("./src/config/colors");

/**
 * Tailwind CSS Configuration — two-tier design-token system (NativeWind v4).
 *
 * Tier 1 (raw palette): CSS-variable-driven shade families (primary, error,
 * typography, outline, background, …) defined in
 * src/components/ui/gluestack-ui-provider/config.ts per theme mode. These are
 * atom/ui-internal only.
 * Tier 2 (semantic): the closed vocabulary app code may use —
 * content/surface/accent/status/outline aliases plus the closed spacing,
 * radius, and text scales. The tier's size is lint-enforced
 * (design-system/semantic-token-budget in eslint.config.local.ts).
 *
 * @remarks NativeWind v4 only supports Tailwind CSS v3, NOT v4.
 * @see https://www.nativewind.dev/v4/getting-started/expo-router
 * @type {import('tailwindcss').Config}
 * @module tailwind.config
 */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/features/**/*.{tsx,jsx,ts,js}",
    "./src/components/**/*.{tsx,jsx,ts,js}",
  ],
  presets: [require("nativewind/preset")],
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background|indicator|chart)-(0|50|100|200|300|400|500|600|700|800|900|950|white|gray|black|error|warning|muted|success|info|light|dark|player|other|horizontalLine)/,
    },
  ],
  theme: {
    /* CLOSED spacing scale (ratified decision #3 — replace, not extend):
     * 4px grid + named 2px micro + 1px hairline. Off-scale spacing classes
     * (py-2.5 and every fractional step) compile to NOTHING by construction.
     * Sizing axes extend the ladder upward below (Phase-0 sizing addendum).
     * NOTE for the Tailwind-4 migration: keep this block self-contained —
     * it ports mechanically to CSS @theme. */
    spacing: {
      0: "0px",
      micro: "2px",
      px: "1px",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      8: "32px",
      10: "40px",
      12: "48px",
      16: "64px",
    },
    /* CLOSED radius scale (docs/design-system/tokens.md). */
    borderRadius: {
      none: "0px",
      sm: "4px",
      md: "8px",
      lg: "12px",
      /* xl(20px) — e.g. bottom-sheet top-corner radius. Closed + enumerated
       * per the design-system RFC; consume via rounded-xl (or the per-corner
       * variants), never an arbitrary value. */
      xl: "20px",
      full: "9999px",
    },
    extend: {
      /* Sizing ladder (Phase-0 addendum): w/h/size/min/max/basis genuinely
       * need larger layout values than the spacing scale — closed,
       * enumerated, discovered from the inventory. */
      ...(() => {
        const sizing = {
          7: "28px",
          9: "36px",
          11: "44px",
          14: "56px",
          20: "80px",
          24: "96px",
          28: "112px",
          32: "128px",
          40: "160px",
          44: "176px",
          48: "192px",
          52: "208px",
          56: "224px",
          64: "256px",
          72: "288px",
          80: "320px",
          96: "384px",
        };
        /* Percentage fractions are layout semantics (RFC §1) — Tailwind's
         * width/height scales include them but the min/max axes do NOT, so
         * snapped classes like min-w-1/2 were dead. Complete the axes. */
        const fractions = {
          "1/4": "25%",
          "1/3": "33.333333%",
          "2/5": "40%",
          "1/2": "50%",
          "3/5": "60%",
          "2/3": "66.666667%",
          "3/4": "75%",
          "4/5": "80%",
        };
        return {
          width: sizing,
          height: sizing,
          size: sizing,
          minWidth: { ...sizing, ...fractions },
          minHeight: { ...sizing, ...fractions },
          maxWidth: { ...sizing, ...fractions },
          maxHeight: { ...sizing, ...fractions },
          flexBasis: sizing,
          /* Inset (top/right/bottom/left) defaults to the spacing scale, but
           * floating overlays anchored above chrome (e.g. a FAB above a
           * bottom nav) need a few larger, enumerated offsets. Reuse the
           * closed sizing ladder so the inset axis stays a closed vocabulary
           * rather than admitting arbitrary values. */
          inset: sizing,
        };
      })(),
      colors: {
        primary: {
          0: "rgb(var(--color-primary-0)/<alpha-value>)",
          50: "rgb(var(--color-primary-50)/<alpha-value>)",
          100: "rgb(var(--color-primary-100)/<alpha-value>)",
          200: "rgb(var(--color-primary-200)/<alpha-value>)",
          300: "rgb(var(--color-primary-300)/<alpha-value>)",
          400: "rgb(var(--color-primary-400)/<alpha-value>)",
          500: "rgb(var(--color-primary-500)/<alpha-value>)",
          600: "rgb(var(--color-primary-600)/<alpha-value>)",
          700: "rgb(var(--color-primary-700)/<alpha-value>)",
          800: "rgb(var(--color-primary-800)/<alpha-value>)",
          900: "rgb(var(--color-primary-900)/<alpha-value>)",
          950: "rgb(var(--color-primary-950)/<alpha-value>)",
        },
        secondary: {
          0: "rgb(var(--color-secondary-0)/<alpha-value>)",
          50: "rgb(var(--color-secondary-50)/<alpha-value>)",
          100: "rgb(var(--color-secondary-100)/<alpha-value>)",
          200: "rgb(var(--color-secondary-200)/<alpha-value>)",
          300: "rgb(var(--color-secondary-300)/<alpha-value>)",
          400: "rgb(var(--color-secondary-400)/<alpha-value>)",
          500: "rgb(var(--color-secondary-500)/<alpha-value>)",
          600: "rgb(var(--color-secondary-600)/<alpha-value>)",
          700: "rgb(var(--color-secondary-700)/<alpha-value>)",
          800: "rgb(var(--color-secondary-800)/<alpha-value>)",
          900: "rgb(var(--color-secondary-900)/<alpha-value>)",
          950: "rgb(var(--color-secondary-950)/<alpha-value>)",
        },
        tertiary: {
          50: "rgb(var(--color-tertiary-50)/<alpha-value>)",
          100: "rgb(var(--color-tertiary-100)/<alpha-value>)",
          200: "rgb(var(--color-tertiary-200)/<alpha-value>)",
          300: "rgb(var(--color-tertiary-300)/<alpha-value>)",
          400: "rgb(var(--color-tertiary-400)/<alpha-value>)",
          500: "rgb(var(--color-tertiary-500)/<alpha-value>)",
          600: "rgb(var(--color-tertiary-600)/<alpha-value>)",
          700: "rgb(var(--color-tertiary-700)/<alpha-value>)",
          800: "rgb(var(--color-tertiary-800)/<alpha-value>)",
          900: "rgb(var(--color-tertiary-900)/<alpha-value>)",
          950: "rgb(var(--color-tertiary-950)/<alpha-value>)",
        },
        error: {
          0: "rgb(var(--color-error-0)/<alpha-value>)",
          50: "rgb(var(--color-error-50)/<alpha-value>)",
          100: "rgb(var(--color-error-100)/<alpha-value>)",
          200: "rgb(var(--color-error-200)/<alpha-value>)",
          300: "rgb(var(--color-error-300)/<alpha-value>)",
          400: "rgb(var(--color-error-400)/<alpha-value>)",
          500: "rgb(var(--color-error-500)/<alpha-value>)",
          600: "rgb(var(--color-error-600)/<alpha-value>)",
          700: "rgb(var(--color-error-700)/<alpha-value>)",
          800: "rgb(var(--color-error-800)/<alpha-value>)",
          900: "rgb(var(--color-error-900)/<alpha-value>)",
          950: "rgb(var(--color-error-950)/<alpha-value>)",
        },
        success: {
          0: "rgb(var(--color-success-0)/<alpha-value>)",
          50: "rgb(var(--color-success-50)/<alpha-value>)",
          100: "rgb(var(--color-success-100)/<alpha-value>)",
          200: "rgb(var(--color-success-200)/<alpha-value>)",
          300: "rgb(var(--color-success-300)/<alpha-value>)",
          400: "rgb(var(--color-success-400)/<alpha-value>)",
          500: "rgb(var(--color-success-500)/<alpha-value>)",
          600: "rgb(var(--color-success-600)/<alpha-value>)",
          700: "rgb(var(--color-success-700)/<alpha-value>)",
          800: "rgb(var(--color-success-800)/<alpha-value>)",
          900: "rgb(var(--color-success-900)/<alpha-value>)",
          950: "rgb(var(--color-success-950)/<alpha-value>)",
        },
        warning: {
          0: "rgb(var(--color-warning-0)/<alpha-value>)",
          50: "rgb(var(--color-warning-50)/<alpha-value>)",
          100: "rgb(var(--color-warning-100)/<alpha-value>)",
          200: "rgb(var(--color-warning-200)/<alpha-value>)",
          300: "rgb(var(--color-warning-300)/<alpha-value>)",
          400: "rgb(var(--color-warning-400)/<alpha-value>)",
          500: "rgb(var(--color-warning-500)/<alpha-value>)",
          600: "rgb(var(--color-warning-600)/<alpha-value>)",
          700: "rgb(var(--color-warning-700)/<alpha-value>)",
          800: "rgb(var(--color-warning-800)/<alpha-value>)",
          900: "rgb(var(--color-warning-900)/<alpha-value>)",
          950: "rgb(var(--color-warning-950)/<alpha-value>)",
        },
        info: {
          0: "rgb(var(--color-info-0)/<alpha-value>)",
          50: "rgb(var(--color-info-50)/<alpha-value>)",
          100: "rgb(var(--color-info-100)/<alpha-value>)",
          200: "rgb(var(--color-info-200)/<alpha-value>)",
          300: "rgb(var(--color-info-300)/<alpha-value>)",
          400: "rgb(var(--color-info-400)/<alpha-value>)",
          500: "rgb(var(--color-info-500)/<alpha-value>)",
          600: "rgb(var(--color-info-600)/<alpha-value>)",
          700: "rgb(var(--color-info-700)/<alpha-value>)",
          800: "rgb(var(--color-info-800)/<alpha-value>)",
          900: "rgb(var(--color-info-900)/<alpha-value>)",
          950: "rgb(var(--color-info-950)/<alpha-value>)",
        },
        typography: {
          0: "rgb(var(--color-typography-0)/<alpha-value>)",
          50: "rgb(var(--color-typography-50)/<alpha-value>)",
          100: "rgb(var(--color-typography-100)/<alpha-value>)",
          200: "rgb(var(--color-typography-200)/<alpha-value>)",
          300: "rgb(var(--color-typography-300)/<alpha-value>)",
          400: "rgb(var(--color-typography-400)/<alpha-value>)",
          500: "rgb(var(--color-typography-500)/<alpha-value>)",
          600: "rgb(var(--color-typography-600)/<alpha-value>)",
          700: "rgb(var(--color-typography-700)/<alpha-value>)",
          800: "rgb(var(--color-typography-800)/<alpha-value>)",
          900: "rgb(var(--color-typography-900)/<alpha-value>)",
          950: "rgb(var(--color-typography-950)/<alpha-value>)",
          white: "#FFFFFF",
          gray: "#D4D4D4",
          black: "#181718",
        },
        outline: {
          /* semantic border tier (design library) */
          subtle: "rgb(var(--color-outline-100)/<alpha-value>)",
          default: "rgb(var(--color-outline-200)/<alpha-value>)",
          strong: "rgb(var(--color-outline-300)/<alpha-value>)",
          emphasis: "rgb(var(--color-outline-700)/<alpha-value>)",
          0: "rgb(var(--color-outline-0)/<alpha-value>)",
          50: "rgb(var(--color-outline-50)/<alpha-value>)",
          100: "rgb(var(--color-outline-100)/<alpha-value>)",
          200: "rgb(var(--color-outline-200)/<alpha-value>)",
          300: "rgb(var(--color-outline-300)/<alpha-value>)",
          400: "rgb(var(--color-outline-400)/<alpha-value>)",
          500: "rgb(var(--color-outline-500)/<alpha-value>)",
          600: "rgb(var(--color-outline-600)/<alpha-value>)",
          700: "rgb(var(--color-outline-700)/<alpha-value>)",
          800: "rgb(var(--color-outline-800)/<alpha-value>)",
          900: "rgb(var(--color-outline-900)/<alpha-value>)",
          950: "rgb(var(--color-outline-950)/<alpha-value>)",
        },
        background: {
          0: "rgb(var(--color-background-0)/<alpha-value>)",
          50: "rgb(var(--color-background-50)/<alpha-value>)",
          100: "rgb(var(--color-background-100)/<alpha-value>)",
          200: "rgb(var(--color-background-200)/<alpha-value>)",
          300: "rgb(var(--color-background-300)/<alpha-value>)",
          400: "rgb(var(--color-background-400)/<alpha-value>)",
          500: "rgb(var(--color-background-500)/<alpha-value>)",
          600: "rgb(var(--color-background-600)/<alpha-value>)",
          700: "rgb(var(--color-background-700)/<alpha-value>)",
          800: "rgb(var(--color-background-800)/<alpha-value>)",
          900: "rgb(var(--color-background-900)/<alpha-value>)",
          950: "rgb(var(--color-background-950)/<alpha-value>)",
          error: "rgb(var(--color-background-error)/<alpha-value>)",
          warning: "rgb(var(--color-background-warning)/<alpha-value>)",
          muted: "rgb(var(--color-background-muted)/<alpha-value>)",
          success: "rgb(var(--color-background-success)/<alpha-value>)",
          info: "rgb(var(--color-background-info)/<alpha-value>)",
          light: "#FFFFFF",
          dark: "#181719",
          gray: "#1C1C1E",
          button: "#2C2C2E",
        },
        indicator: {
          primary: "rgb(var(--color-indicator-primary)/<alpha-value>)",
          info: "rgb(var(--color-indicator-info)/<alpha-value>)",
          error: "rgb(var(--color-indicator-error)/<alpha-value>)",
        },
        chart: {
          player: "#0DA6F2",
          other: "#a855f7",
          horizontalLine: "#a2a3a3",
          // chart annex aliases (design library — docs/design-system/tokens.md)
          line: "#a2a3a3",
          up: "#66B584",
          down: "#E77828",
        },
        /* Semantic tier (design library — docs/design-system/tokens.md).
         * App code may only use these names; the shade families above are
         * the raw palette tier that feeds them (atom-internal only). */
        content: {
          primary: "rgb(var(--color-typography-900)/<alpha-value>)",
          secondary: "rgb(var(--color-typography-700)/<alpha-value>)",
          muted: "rgb(var(--color-typography-500)/<alpha-value>)",
          subtle: "rgb(var(--color-typography-400)/<alpha-value>)",
          disabled: "rgb(var(--color-typography-200)/<alpha-value>)",
          inverse: "rgb(var(--color-typography-0)/<alpha-value>)",
          "on-accent": "#FFFFFF",
        },
        surface: {
          base: "rgb(var(--color-background-0)/<alpha-value>)",
          raised: "rgb(var(--color-background-50)/<alpha-value>)",
          subtle: "rgb(var(--color-background-100)/<alpha-value>)",
          muted: "rgb(var(--color-background-200)/<alpha-value>)",
          strong: "rgb(var(--color-background-300)/<alpha-value>)",
          inverse: "rgb(var(--color-background-950)/<alpha-value>)",
          action: "#2C2C2E",
        },
        accent: {
          primary: "rgb(var(--color-accent-primary)/<alpha-value>)",
        },
        status: {
          error: "rgb(var(--color-error-500)/<alpha-value>)",
          "error-surface": "rgb(var(--color-background-error)/<alpha-value>)",
          success: "rgb(var(--color-success-500)/<alpha-value>)",
          "success-surface":
            "rgb(var(--color-background-success)/<alpha-value>)",
          warning: "rgb(var(--color-warning-500)/<alpha-value>)",
          "warning-surface":
            "rgb(var(--color-background-warning)/<alpha-value>)",
          info: "rgb(var(--color-info-500)/<alpha-value>)",
          "info-surface": "rgb(var(--color-background-info)/<alpha-value>)",
          "info-strong": "rgb(var(--color-info-800)/<alpha-value>)",
        },
        ...customColors,
      },
      /* Platform system font stack (starter default — no brand fonts).
       * A project adopting brand fonts swaps these families (and, if the
       * brand ships weight-specific families, adjusts TEXT_VARIANT_CLASS in
       * src/components/atoms/types.ts) — the token NAMES stay stable. */
      fontFamily: {
        heading: platformSelect({
          ios: "System",
          android: "sans-serif",
          default: "ui-sans-serif, system-ui, sans-serif",
        }),
        body: platformSelect({
          ios: "System",
          android: "sans-serif",
          default: "ui-sans-serif, system-ui, sans-serif",
        }),
      },
      fontSize: {
        "2xs": "10px",
        /* Ratified text styles (design library — docs/design-system/tokens.md).
         * Values alias today's Tailwind sizes exactly; the Text atom bundles
         * family/weight on top. */
        micro: "10px",
        caption: ["12px", { lineHeight: "16px" }],
        body: ["14px", { lineHeight: "20px" }],
        "title-sm": ["16px", { lineHeight: "24px" }],
        title: ["18px", { lineHeight: "28px" }],
        "title-lg": ["20px", { lineHeight: "28px" }],
        "display-sm": ["24px", { lineHeight: "32px" }],
        "display-md": ["30px", { lineHeight: "36px" }],
        "display-lg": ["36px", { lineHeight: "40px" }],
        "display-xl": ["48px", { lineHeight: "48px" }],
        "display-2xl": ["60px", { lineHeight: "60px" }],
      },
      spacing: {
        /* named 2px step (ratified decision #3) — a name, not a fraction */
        micro: "2px",
      },
      boxShadow: {
        "hard-1": "-2px 2px 8px 0px rgba(38, 38, 38, 0.20)",
        "hard-2": "0px 3px 10px 0px rgba(38, 38, 38, 0.20)",
        "hard-3": "2px 2px 8px 0px rgba(38, 38, 38, 0.20)",
        "hard-4": "0px -3px 10px 0px rgba(38, 38, 38, 0.20)",
        "hard-5": "0px 2px 10px 0px rgba(38, 38, 38, 0.10)",
        "soft-1": "0px 0px 10px rgba(38, 38, 38, 0.1)",
        "soft-2": "0px 0px 20px rgba(38, 38, 38, 0.2)",
        "soft-3": "0px 0px 30px rgba(38, 38, 38, 0.1)",
        "soft-4": "0px 0px 40px rgba(38, 38, 38, 0.1)",
      },
    },
  },
  plugins: [],
};
