// Generates src/global.css (Tailwind-4 CSS-first @theme) from the single
// source of truth src/design-system/tokens.ts. Do NOT hand-edit global.css;
// the design-system/global-css-fresh ESLint rule fails the build on drift.
//
// Usage: node scripts/design-system/generate-global-css.mjs        (writes)
//        node scripts/design-system/generate-global-css.mjs --check (CI: nonzero on drift)
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.GLOBAL_CSS_ROOT || path.resolve(HERE, "..", "..");
const TOKENS_TS = path.join(ROOT, "src", "design-system", "tokens.ts");
const GLOBAL_CSS = path.join(ROOT, "src", "global.css");

const require = createRequire(import.meta.url);
const jiti = require("jiti")(fileURLToPath(import.meta.url), {
  interopDefault: true,
});
const T = jiti(TOKENS_TS);

// Hash whitespace-normalized content so Prettier reformatting can't break the
// freshness check (design-system/global-css-fresh applies the same normalization).
const norm = s => s.replace(/\s+/g, "");
const sha = s =>
  createHash("sha256").update(norm(s)).digest("hex").slice(0, 16);

/** Emit `--<prefix><key>: <value>;` lines, indented. */
const lines = (obj, fn, indent = "  ") =>
  Object.entries(obj)
    .map(([k, v]) => `${indent}${fn(k, v)}`)
    .join("\n");

// ── @layer theme: runtime raw-palette vars (mode-switching) ────────────────
const rawVars = mode =>
  lines(T.RAW_PALETTE[mode], (k, v) => `--${k}: ${v};`, "    ");

// ── @theme inline: color utilities referencing the runtime vars ────────────
function colorTokens() {
  const out = [];
  for (const [family, keys] of Object.entries(T.RAW_COLOR_UTILITIES)) {
    for (const key of keys) {
      out.push(`  --color-${family}-${key}: rgb(var(--${family}-${key}));`);
    }
  }
  for (const [k, hex] of Object.entries(T.FIXED_COLORS)) {
    out.push(`  --color-${k}: ${hex};`);
  }
  for (const [group, entries] of Object.entries(T.SEMANTIC_COLORS)) {
    for (const [key, val] of Object.entries(entries)) {
      const css = typeof val === "string" ? val : `rgb(var(--${val.ref}))`;
      out.push(`  --color-${group}-${key}: ${css};`);
    }
  }
  for (const [k, hex] of Object.entries(T.CHART_COLORS))
    out.push(`  --color-chart-${k}: ${hex};`);
  for (const [k, hex] of Object.entries(T.TOAST_COLORS))
    out.push(`  --color-toast-${k}: ${hex};`);
  // Gluestack v5 component-token bridge (shadcn vocabulary → our palette vars).
  for (const [name, val] of Object.entries(T.BRIDGE_COLORS)) {
    const css = typeof val === "string" ? val : `rgb(var(--${val.ref}))`;
    out.push(`  --color-${name}: ${css};`);
  }
  return out.join("\n");
}

// ── @theme: closed scales (static) ─────────────────────────────────────────
function scaleTokens() {
  const spacing = lines(T.SPACING, (k, v) => `--spacing-${k}: ${v};`);
  const radius = lines(T.RADIUS, (k, v) => `--radius-${k}: ${v};`);
  const text = Object.entries(T.FONT_SIZE)
    .map(([k, tuple]) => {
      const size = `  --text-${k}: ${tuple[0]};`;
      return tuple.length > 1
        ? `${size}\n  --text-${k}--line-height: ${tuple[1]};`
        : size;
    })
    .join("\n");
  const font = `  --font-heading: ${T.FONT_FAMILY.heading};\n  --font-body: ${T.FONT_FAMILY.body};`;
  const shadow = lines(T.SHADOW, (k, v) => `--shadow-${k}: ${v};`);
  const bp = lines(T.BREAKPOINTS, (k, v) => `--breakpoint-${k}: ${v};`);
  return { spacing, radius, text, font, shadow, bp };
}

const S = scaleTokens();

const body = `@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
@import "nativewind/theme";

/* ─── Raw palette (light / dark) ──────────────────────────────────────────
   Three selectors, two purposes (see the gluestack-ui v5 upgrade):
   1. :root                     — light defaults (all platforms)
   2. @media dark :root         — dark defaults; NativeWind maps this to
                                   Appearance.getColorScheme() on native.
   3. :root.dark / :root.light  — specificity (0,2,0) beats the media query
                                   (0,1,0) so GluestackUIProvider's class-based
                                   web toggle always wins. Ignored on native. */
@layer theme {
  :root {
${rawVars("light")}
  }

  @media (prefers-color-scheme: dark) {
    :root {
${rawVars("dark")}
    }
  }

  :root.dark {
${rawVars("dark")}
  }

  :root.light {
${rawVars("light")}
  }
}

/* ─── Color utilities → runtime vars (bg-primary-500, text-content-primary…) ─
   Two tiers, identical names to the Tailwind-3 config: raw families
   (atom/ui-internal) + the closed semantic tier app code speaks. */
@theme inline {
${colorTokens()}
}

/* ─── Scales (spacing / radius / text / font / shadow / breakpoints) ─────────
   The named spacing tokens (micro/px + the 4px-grid ladder) are declared
   explicitly, but the base \`--spacing\` variable is intentionally NOT reset:
   Tailwind 4's spacing scale is \`--spacing\`-based and NativeWind's
   \`@utility leading-*\` (nativewind/theme.css) calls \`var(--spacing)\`, so
   \`--spacing-*: initial\` breaks the build. Spacing therefore stays a continuous
   4px grid at the CSS level; the CLOSED spacing vocabulary is instead enforced
   by the atom \`SpaceToken\` enum + the no-arbitrary-value lint rule.
   \`--radius-*: initial\` DOES keep the radius scale closed (radius has no such
   base-function dependency). */
@theme {
${S.spacing}

  --radius-*: initial;
${S.radius}

${S.text}

${S.font}

${S.shadow}

${S.bp}
}
`;

// Format the body with the project's Prettier FIRST, then hash the formatted
// body, so the file matches what the lint-staged `prettier --write` produces
// (global.css is not in the Lisa-managed .prettierignore) and global-css-fresh
// stays valid — Prettier normalizes CSS (e.g. lowercases hex), so hashing the
// pre-format body would drift. The hashes are also whitespace-normalized.
const prettier = require("prettier");
const options = await prettier.resolveConfig(GLOBAL_CSS);
const formattedBody = await prettier.format(body, {
  ...options,
  parser: "css",
});

// Hash the PRETTIER-FORMATTED tokens.ts, because lint-staged runs
// `prettier --write` on tokens.ts before the global-css-fresh rule reads it;
// hashing the raw file would drift after that reformat. Prettier is idempotent,
// so this equals what lands on disk.
const tokensSource = await prettier.format(readFileSync(TOKENS_TS, "utf8"), {
  ...options,
  parser: "typescript",
});
const tokensHash = sha(tokensSource);
const bodyHash = sha(formattedBody);
const header = `/* AUTO-GENERATED — DO NOT EDIT.
 * Source of truth: src/design-system/tokens.ts
 * Regenerate:      bun run design:css
 * Enforced by:     design-system/global-css-fresh (ESLint)
 * tokens-hash: ${tokensHash}
 * body-hash: ${bodyHash}
 */
`;
const full = header + "\n" + formattedBody;

const check = process.argv.includes("--check");
if (check) {
  const current = readFileSync(GLOBAL_CSS, "utf8");
  if (current !== full) {
    console.error("global.css is stale — run: bun run design:css");
    process.exit(1);
  }
  console.log("global.css is fresh");
} else {
  writeFileSync(GLOBAL_CSS, full);
  console.log(
    `wrote ${GLOBAL_CSS} (tokens-hash ${tokensHash}, body-hash ${bodyHash})`
  );
}
