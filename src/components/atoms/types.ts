/**
 * @file types.ts
 * @description Shared vocabulary for the atom layer (design library).
 * Atoms are the ONLY public source of rendering primitives: app code imports
 * from `@/components/atoms`, never `@/components/ui` or react-native UI
 * primitives. Atoms are the only components that accept `className`, and the
 * className vocabulary itself is closed by the Tailwind theme + lint.
 * See docs/design-system-rfc.md and docs/design-system/tokens.md.
 * @module components/atoms/types
 */

/** Ratified spacing steps (decision #3) — 4px grid + 2px micro + 1px hairline. */
export type SpaceToken =
  | "0"
  | "micro"
  | "px"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "8"
  | "10"
  | "12"
  | "16";

/**
 * Ratified text styles (decision #4) — 8 styles; `display` is one style with
 * a bundled size ladder. Each bundles size + line-height + family/weight.
 */
export type TextVariant =
  | "micro"
  | "caption"
  | "body"
  | "body-strong"
  | "title-sm"
  | "title"
  | "title-lg"
  | "display-sm"
  | "display-md"
  | "display-lg"
  | "display-xl"
  | "display-2xl";

/**
 * The single sanctioned escape hatch (ratified decision #5): an RN style
 * object accepted by atoms only, greppable, counted in CI with a single-digit
 * budget. A style object cannot speak the banned className dialect.
 * Each atom types it as `WithUnsafeStyle<StyleOfWrappedComponent>`.
 */
export type WithUnsafeStyle<S> = {
  /** Escape hatch — counted in CI (budget ≤ 9 repo-wide). Prefer a token PR. */
  UNSAFE_style?: S;
};

/** className → gap class per spacing token (Stack space prop). */
export const GAP_CLASS: Record<SpaceToken, string> = {
  "0": "gap-0",
  micro: "gap-micro",
  px: "gap-px",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "8": "gap-8",
  "10": "gap-10",
  "12": "gap-12",
  "16": "gap-16",
};

/**
 * className bundle per text variant. Size+line-height come from the fontSize
 * token; family/weight is bundled here. The starter ships the platform system
 * font stack (tailwind.config.js `fontFamily`), so weight is expressed with
 * the standard weight utilities; a brand-font project swaps the `heading`/
 * `body` families in tailwind.config.js without touching the variant names.
 */
export const TEXT_VARIANT_CLASS: Record<TextVariant, string> = {
  micro: "text-micro font-body",
  caption: "text-caption font-body",
  body: "text-body font-body",
  "body-strong": "text-body font-body font-medium",
  "title-sm": "text-title-sm font-heading font-bold",
  title: "text-title font-heading font-bold",
  "title-lg": "text-title-lg font-heading font-bold",
  "display-sm": "text-display-sm font-heading font-bold",
  "display-md": "text-display-md font-heading font-bold",
  "display-lg": "text-display-lg font-heading font-bold",
  "display-xl": "text-display-xl font-heading font-bold",
  "display-2xl": "text-display-2xl font-heading font-bold",
};
