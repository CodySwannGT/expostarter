/**
 * ESLint 9 Flat Config - Project-Local Customizations
 *
 * Add project-specific ESLint rules here. This file is create-only,
 * meaning Lisa will create it but never overwrite your customizations.
 *
 * This starter ships the design-system enforcement layer (rendering
 * primitives are allowlisted to atoms, the styling dialect is closed by the
 * Tailwind theme, and aggregate invariants run as a local ESLint plugin).
 * See docs/design-system-rfc.md for the ratified rules.
 *
 * Flat-config gotcha: a rule entry for matching files REPLACES earlier
 * entries (it does not merge), so any block that re-configures
 * `no-restricted-syntax` must re-state the base bans it would otherwise
 * clobber (see NO_PROCESS_ENV / NO_UNSAFE_STYLE below).
 * @see https://eslint.org/docs/latest/use/configure/configuration-files-new
 * @module eslint.config.local
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import betterTailwind from "eslint-plugin-better-tailwindcss";

import { SEMANTIC_COLORS, CHART_COLORS } from "./src/design-system/tokens";

const REPO_ROOT = path.dirname(fileURLToPath(import.meta.url));
/** Tailwind 4 is CSS-first; the design tokens live in global.css, generated from tokens.ts. */
const GLOBAL_CSS_PATH = path.join(REPO_ROOT, "src", "global.css");
/**
 * Whitespace-normalized short hash — mirrors
 * scripts/design-system/generate-global-css.mjs so global-css-fresh can verify
 * global.css was regenerated from tokens.ts.
 * @param source The text to hash (whitespace is stripped first).
 * @returns The first 16 hex chars of the sha256 digest.
 */
const normHash = (source: string): string =>
  createHash("sha256")
    .update(source.replace(/\s+/g, ""))
    .digest("hex")
    .slice(0, 16);

/** Ban UNSAFE_style JSX attribute in app code — use closed-token className on an atom instead. */
const NO_UNSAFE_STYLE = [
  {
    selector: "JSXAttribute[name.name='UNSAFE_style']",
    message:
      "UNSAFE_style is banned in app code — use a closed-token className on an atom instead (docs/design-system-rfc.md §5). For genuinely-irreducible runtime-computed styles, add an eslint-disable-next-line comment with a one-line justification.",
  },
];

/** Re-stated base process.env ban (a flat-config rule entry replaces earlier entries for matching files). */
const NO_PROCESS_ENV = [
  {
    selector: "MemberExpression[object.name='process'][property.name='env']",
    message:
      "Direct process.env access is forbidden. Import { env } from '@/lib/env' instead for type-safe, validated environment variables.",
  },
];

/**
 * ── Design-system aggregate invariants (local ESLint plugin) ────────────────
 * Whole-repo invariants that a per-file linter can't express directly are
 * enforced here as a local plugin so they run wherever ESLint already runs
 * (pre-commit lint-staged, the CI Lint job, pre-push lint:slow) and support
 * per-site disable exceptions.
 *
 * Exceptions:
 *  - semantic-token-budget: the tier is a closed set; to grow it, bump
 *    MAX_SEMANTIC_TOKENS below in a reviewed PR (a line-level disable would
 *    hide the count, so it is the wrong lever). The tier resolves in
 *    tailwind.config.js (loaded via jiti by the rule), but that file is
 *    eslint-ignored, so the rule is anchored on the atoms barrel
 *    (src/components/atoms/index.ts) — the design library's public surface —
 *    which is always present and linted.
 *  - atom-gallery-complete: reported per-atom on each atom's index.tsx, so a
 *    genuinely gallery-less atom carries a local, single-line ESLint disable
 *    comment for design-system/atom-gallery-complete (with a "-- reason").
 */
const ATOMS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "src",
  "components",
  "atoms"
);
const MIN_SEMANTIC_TOKENS = 15;
const MAX_SEMANTIC_TOKENS = 25;
const ALLOWED_CHART_KEYS = [
  "player",
  "other",
  "horizontalLine",
  "line",
  "up",
  "down",
];
const SEMANTIC_OUTLINE = ["subtle", "default", "strong", "emphasis"];

/**
 * Atom directories (sorted) that ship a gallery.tsx — mirrors the generator.
 * @returns Sorted atom directory names that contain a gallery.tsx.
 */
function listGalleryAtoms(): string[] {
  return readdirSync(ATOMS_DIR)
    .filter(name => name !== "__tests__")
    .filter(name => {
      try {
        return statSync(path.join(ATOMS_DIR, name)).isDirectory();
      } catch {
        return false;
      }
    })
    .filter(name => existsSync(path.join(ATOMS_DIR, name, "gallery.tsx")))
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** Minimal shape of the ESLint rule context used by the design-system rules. */
interface DesignRuleContext {
  readonly filename: string;
  readonly sourceCode: { getText(): string };
  report(descriptor: { node: unknown; message: string }): void;
}

const designSystemPlugin = {
  rules: {
    "semantic-token-budget": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Semantic color tier stays within its closed bound; chart annex stays closed.",
        },
        schema: [],
      },
      create(context: DesignRuleContext) {
        return {
          Program(node: unknown) {
            // Tokens now resolve from src/design-system/tokens.ts (the source
            // of truth global.css is generated from) — tailwind.config.js is
            // gone under Tailwind 4. The rule anchors on src/components/atoms/
            // index.ts, so a static import can't fail (no jiti / null branch).
            const size = (obj: Record<string, unknown>): number =>
              Object.keys(obj).length;
            const status = Object.keys(SEMANTIC_COLORS.status).filter(
              key => !key.endsWith("-surface")
            ).length;
            const outlineKeys = Object.keys(SEMANTIC_COLORS.outline);
            const outline = SEMANTIC_OUTLINE.filter(key =>
              outlineKeys.includes(key)
            );
            const extraOutline = outlineKeys.filter(
              key => !SEMANTIC_OUTLINE.includes(key)
            );
            const total =
              size(SEMANTIC_COLORS.content) +
              size(SEMANTIC_COLORS.surface) +
              size(SEMANTIC_COLORS.accent) +
              status +
              outline.length;
            if (total < MIN_SEMANTIC_TOKENS || total > MAX_SEMANTIC_TOKENS) {
              context.report({
                node,
                message: `design-system: semantic color tier out of bounds — ${total} tokens (must be ${MIN_SEMANTIC_TOKENS}–${MAX_SEMANTIC_TOKENS}). The tier is intentionally small (docs/design-system/tokens.md, RFC §5). To grow it, bump MAX_SEMANTIC_TOKENS in eslint.config.local.ts in a reviewed PR — do not add tokens ad hoc.`,
              });
            }
            if (outline.length !== SEMANTIC_OUTLINE.length) {
              context.report({
                node,
                message: `design-system: semantic outline names missing from SEMANTIC_COLORS.outline in tokens.ts — expected ${SEMANTIC_OUTLINE.join(", ")}, found ${outline.join(", ") || "none"}.`,
              });
            }
            if (extraOutline.length > 0) {
              context.report({
                node,
                message: `design-system: semantic outline family has unexpected key(s): ${extraOutline.join(", ")}. Allowed: ${SEMANTIC_OUTLINE.join(", ")} (docs/design-system/tokens.md, RFC §5).`,
              });
            }
            const offenders = Object.keys(CHART_COLORS).filter(
              key => !ALLOWED_CHART_KEYS.includes(key)
            );
            if (offenders.length > 0) {
              context.report({
                node,
                message: `design-system: chart annex is a closed palette — unexpected key(s) ${offenders.join(", ")}. Allowed: ${ALLOWED_CHART_KEYS.join(", ")} (docs/design-system/tokens.md, decision #2).`,
              });
            }
          },
        };
      },
    },
    "global-css-fresh": {
      meta: {
        type: "problem",
        docs: {
          description:
            "src/global.css is regenerated from tokens.ts (no drift).",
        },
        schema: [],
      },
      create(context: DesignRuleContext) {
        return {
          Program(node: unknown) {
            // Anchored on src/design-system/tokens.ts. Verifies the generated
            // global.css header hashes still match tokens.ts + the css body.
            const css = existsSync(GLOBAL_CSS_PATH)
              ? readFileSync(GLOBAL_CSS_PATH, "utf8")
              : null;
            if (css === null) {
              context.report({
                node,
                message:
                  "design-system: src/global.css is missing — run `bun run design:css`.",
              });
              return;
            }
            const tokensHash = /tokens-hash:\s*([0-9a-f]+)/.exec(css)?.[1];
            const bodyHash = /body-hash:\s*([0-9a-f]+)/.exec(css)?.[1];
            const headerEnd = css.indexOf("*/");
            const body = headerEnd >= 0 ? css.slice(headerEnd + 2) : css;
            if (
              tokensHash !== normHash(context.sourceCode.getText()) ||
              bodyHash !== normHash(body)
            ) {
              context.report({
                node,
                message:
                  "design-system: src/global.css is stale relative to src/design-system/tokens.ts — run `bun run design:css` and commit the result.",
              });
            }
          },
        };
      },
    },
    "atom-gallery-complete": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Every atom ships a gallery.tsx and covers its Variant/Tone/Size literals.",
        },
        schema: [],
      },
      create(context: DesignRuleContext) {
        return {
          Program(node: unknown) {
            const filename = context.filename.replace(/\\/g, "/");
            const match = /\/src\/components\/atoms\/([^/]+)\/index\.tsx$/.exec(
              filename
            );
            if (!match) {
              return;
            }
            const name = match[1];
            const galleryPath = path.join(ATOMS_DIR, name, "gallery.tsx");
            if (!existsSync(galleryPath)) {
              context.report({
                node,
                message: `design-system: atom "${name}" has no gallery.tsx — every atom must ship gallery cases (RFC §6). If this atom is intentionally gallery-less, add a one-line ESLint disable comment for design-system/atom-gallery-complete with a "-- <reason>" note.`,
              });
              return;
            }
            const indexSource: string = context.sourceCode.getText();
            const gallerySource = readFileSync(galleryPath, "utf8");
            const typePattern =
              /export\s+type\s+(\w*(?:Variant|Tone|Size))\s*=([^;]*);/g;
            for (const typeMatch of indexSource.matchAll(typePattern)) {
              const typeName = typeMatch[1];
              const literals = [
                ...typeMatch[2].matchAll(/(["'])([^"']+)\1/g),
              ].map(literalMatch => literalMatch[2]);
              const uncovered = literals.filter(
                literal => !gallerySource.includes(literal)
              );
              if (uncovered.length > 0) {
                const quoted = uncovered.map(value => `"${value}"`).join(", ");
                context.report({
                  node,
                  message: `design-system: atom "${name}" gallery.tsx is missing cases for ${typeName} value(s): ${quoted}.`,
                });
              }
            }
          },
        };
      },
    },
    "gallery-manifest-fresh": {
      meta: {
        type: "problem",
        docs: {
          description:
            "galleryManifest.ts lists exactly the atoms that ship a gallery.tsx.",
        },
        schema: [],
      },
      create(context: DesignRuleContext) {
        return {
          Program(node: unknown) {
            const manifestText: string = context.sourceCode.getText();
            const imported = [
              ...manifestText.matchAll(/from "\.\/([^/"]+)\/gallery"/g),
            ]
              .map(entry => entry[1])
              .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
            const expected = listGalleryAtoms();
            const missing = expected.filter(name => !imported.includes(name));
            const extra = imported.filter(name => !expected.includes(name));
            if (missing.length > 0 || extra.length > 0) {
              context.report({
                node,
                message: `design-system: galleryManifest.ts is out of sync — missing ${missing.join(", ") || "none"}; unexpected ${extra.join(", ") || "none"}. Run: node scripts/design-system/generate-gallery-manifest.mjs and commit the result.`,
              });
            }
          },
        };
      },
    },
  },
};

const ATOM_IMPORT_MESSAGE =
  "Import rendering primitives from @/components/atoms — the design library's public surface (docs/design-system-rfc.md §3)";

const LUCIDE_BARREL_MESSAGE =
  "Import icons per-icon (lucide-react-native/dist/esm/icons/<name>) — the barrel bundles every icon (~1.1MB minified) because Metro cannot tree-shake it (docs/performance.md)";

export default [
  /**
   * Tailwind 4 migration: the Lisa base config (getExpoConfig) enables
   * eslint-plugin-tailwindcss (Tailwind 3 only), which can no longer resolve a
   * config under Tailwind 4 ("Cannot resolve default tailwindcss config
   * path"). Those rules are superseded by the eslint-plugin-better-tailwindcss
   * block below (no-unknown-classes / no-restricted-classes), so turn the
   * legacy plugin's rules off repo-wide to silence it and avoid double-linting.
   */
  {
    rules: {
      "tailwindcss/classnames-order": "off",
      "tailwindcss/enforces-negative-arbitrary-values": "off",
      "tailwindcss/enforces-shorthand": "off",
      "tailwindcss/migration-from-tailwind-2": "off",
      "tailwindcss/no-arbitrary-value": "off",
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/no-contradicting-classname": "off",
      "tailwindcss/no-unnecessary-arbitrary-value": "off",
    },
  },
  {
    files: ["**/*.tsx", "**/*.ts"],
    rules: {
      "sonarjs/no-nested-template-literals": "warn",
      "sonarjs/prefer-immediate-return": "warn",
      "sonarjs/prefer-single-boolean-return": "warn",
      "sonarjs/no-collapsible-if": "warn",
      "sonarjs/prefer-read-only-props": "warn",
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-nested-functions": "warn",
      "react-perf/jsx-no-new-object-as-prop": "warn",
      "react-perf/jsx-no-new-array-as-prop": "warn",
      "react-perf/jsx-no-new-function-as-prop": "error",

      // §5 — UNSAFE_style is banned in app code (atoms re-state this rule
      // below to drop the ban — atoms are the sanctioned escape hatch).
      // NO_PROCESS_ENV re-states the base config's process.env ban, which
      // this entry would otherwise REPLACE (flat-config semantics).
      "no-restricted-syntax": ["error", ...NO_PROCESS_ENV, ...NO_UNSAFE_STYLE],
    },
  },
  /**
   * Design library atom layer (docs/design-system-rfc.md, ratified).
   * Atoms follow the RFC's own structure (index.tsx with named exports,
   * shared types.ts, gallery.tsx manifest entries, co-located tests) — not
   * the Container/View generator pattern, which targets feature components.
   * Atoms are stateless thin wrappers; a Container would be an empty shell.
   */
  {
    files: ["src/components/atoms/**"],
    rules: {
      "component-structure/enforce-component-structure": "off",
    },
  },
  /**
   * ── Design-library enforcement layer (docs/design-system-rfc.md §5) ──
   * The closed styling dialect is enforced at ERROR with NO waiver or
   * ratchet machinery — this is a greenfield starter, sealed from day one.
   */
  /**
   * §5 — eslint-plugin-better-tailwindcss (Tailwind 4 / CSS-first): kills
   * off-manifest classnames and arbitrary values. `no-unknown-classes` reads
   * the real generated theme from src/global.css, so the semantic tier
   * (content/surface/accent/status/outline/chart) and every raw family are
   * recognized as first-class tokens — no whitelist needed (they were custom
   * additions under Tailwind 3). `no-restricted-classes` bans any `[...]`
   * arbitrary value. Gluestack `data-[...]`/`group-[...]` state selectors live
   * only in src/components/ui/** (ignored below).
   */
  {
    files: ["src/**/*.tsx"],
    ignores: ["src/components/ui/**"],
    plugins: { "better-tailwindcss": betterTailwind },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/global.css",
        tsconfig: "tsconfig.json",
      },
    },
    rules: {
      "better-tailwindcss/no-unknown-classes": "error",
      "better-tailwindcss/no-restricted-classes": [
        "error",
        { restrict: ["\\[.*\\]"] },
      ],
    },
  },
  /**
   * §5 — rendering primitives are allowlisted to atoms only. App code
   * imports the design library's public surface (@/components/atoms),
   * never @/components/ui (Gluestack internals), raw react-native UI
   * primitives, or third-party UI primitives.
   * Non-UI react-native APIs (Platform, Animated, Keyboard, Linking,
   * useWindowDimensions, …) stay importable everywhere — only the named
   * rendering components below are restricted. ERROR for clean files.
   */
  {
    files: ["src/**"],
    ignores: ["src/components/atoms/**", "src/components/ui/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/components/ui",
              message: ATOM_IMPORT_MESSAGE,
            },
            {
              name: "react-native",
              importNames: [
                "View",
                "Text",
                "Image",
                "ImageBackground",
                "Pressable",
                "TouchableOpacity",
                "TouchableHighlight",
                "TouchableWithoutFeedback",
                "ScrollView",
                "FlatList",
                "SectionList",
                "VirtualizedList",
                "TextInput",
                "Modal",
                "ActivityIndicator",
                "RefreshControl",
                "KeyboardAvoidingView",
                "StatusBar",
                "SafeAreaView",
                "Switch",
                "Button",
              ],
              message: ATOM_IMPORT_MESSAGE,
            },
          ],
          patterns: [
            {
              group: ["@/components/ui/*"],
              message: ATOM_IMPORT_MESSAGE,
            },
            {
              group: ["@shopify/flash-list"],
              message: ATOM_IMPORT_MESSAGE,
            },
            {
              group: ["@expo/html-elements"],
              message: ATOM_IMPORT_MESSAGE,
            },
            {
              // Regex (not gitignore-style group): ban ONLY the barrel entry
              // points — per-icon dist/esm/icons/* imports stay allowed.
              regex: "^lucide-react-native(/icons)?$",
              message: LUCIDE_BARREL_MESSAGE,
            },
          ],
        },
      ],
    },
  },
  /**
   * §5 — layer direction: atoms sit at the bottom of the dependency graph.
   * They may import only @/components/ui, react-native, lucide, and local
   * files — never features, higher component layers, providers, or data
   * clients. ERROR (not warn): zero current violations, sealed from day one.
   * The `regex` form expresses "@/components/!(ui|atoms)*" — extglob
   * negation is not supported by no-restricted-imports' gitignore matcher.
   */
  {
    files: ["src/components/atoms/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*"],
              message:
                "Atoms must not import from features — layer direction is atoms → ui only (docs/design-system-rfc.md §3)",
            },
            {
              regex: "^@/components/(?!ui($|/)|atoms($|/))",
              message:
                "Atoms may only import @/components/ui or other atoms — never higher component layers (docs/design-system-rfc.md §3)",
            },
            {
              group: ["@/providers/*"],
              message:
                "Atoms must not import providers (docs/design-system-rfc.md §3)",
            },
            {
              group: ["@apollo/*"],
              message:
                "Atoms must not touch data clients — data fetching lives above the design library (docs/design-system-rfc.md §3)",
            },
            {
              // Regex (not gitignore-style group): ban ONLY the barrel entry
              // points — per-icon dist/esm/icons/* imports stay allowed.
              regex: "^lucide-react-native(/icons)?$",
              message: LUCIDE_BARREL_MESSAGE,
            },
          ],
        },
      ],
    },
  },
  /**
   * §5 — stateless atoms: no state/effect/context/data hooks in atom
   * implementations. ERROR (zero current violations).
   */
  {
    files: ["src/components/atoms/**/index.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        // Re-states the base config's process.env ban — a flat-config rule
        // entry REPLACES (not merges with) earlier entries for matching files.
        ...NO_PROCESS_ENV,
        {
          selector:
            "CallExpression[callee.name=/^(useState|useEffect|useReducer|useContext|useQuery|useMutation)$/]",
          message: "Atoms are stateless (RFC §3)",
        },
      ],
    },
  },
  /**
   * §4 — no className prop above the atom layer: molecules/organisms/
   * templates (and feature-component mirrors) expose closed enum props;
   * atoms are the sanctioned className surface. ERROR.
   */
  {
    files: [
      "src/components/molecules/**",
      "src/components/organisms/**",
      "src/components/templates/**",
      "src/features/*/components/**",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        // Re-states the base config's process.env ban + the UNSAFE_style ban —
        // a flat-config rule entry REPLACES (not merges with) earlier entries
        // for matching files, so both must be carried here.
        ...NO_PROCESS_ENV,
        ...NO_UNSAFE_STYLE,
        {
          selector:
            "TSPropertySignature[key.name='className'], TSPropertySignature[key.value='className']",
          message:
            "No className prop above the atom layer — expose closed enum props instead (docs/design-system-rfc.md §4)",
        },
      ],
    },
  },
  /**
   * Design-system aggregate invariants (local plugin). See the
   * designSystemPlugin definition above.
   */
  {
    // Anchored on the atoms barrel — always present and linted. The rule
    // imports SEMANTIC_COLORS/CHART_COLORS from src/design-system/tokens.ts.
    files: ["src/components/atoms/index.ts"],
    plugins: { "design-system": designSystemPlugin },
    rules: { "design-system/semantic-token-budget": "error" },
  },
  {
    files: ["src/components/atoms/*/index.tsx"],
    plugins: { "design-system": designSystemPlugin },
    rules: { "design-system/atom-gallery-complete": "error" },
  },
  {
    files: ["src/components/atoms/galleryManifest.ts"],
    plugins: { "design-system": designSystemPlugin },
    rules: { "design-system/gallery-manifest-fresh": "error" },
  },
  {
    // Anchored on the token source of truth — verifies src/global.css is a
    // fresh render of tokens.ts (mirrors gallery-manifest-fresh). max-lines is
    // off here: it is a data module (full light/dark palette + closed scales),
    // intentionally long, and the single source global.css is generated from.
    files: ["src/design-system/tokens.ts"],
    plugins: { "design-system": designSystemPlugin },
    rules: {
      "design-system/global-css-fresh": "error",
      "max-lines": "off",
    },
  },
  /**
   * ── Re-stated base exemptions ──
   * The first block above re-configures `no-restricted-syntax` for every
   * ts/tsx file, which REPLACES the base config's per-file exemptions for
   * the env module and config files. Re-state them here (after the
   * design-system blocks) so they win for their files again.
   */
  {
    files: ["src/lib/env.ts", "lib/env.ts", "lib/__tests__/env.test.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
  {
    files: ["**/*config.*", "lighthouserc.js", "codegen.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
  /**
   * ── NO FILE-LEVEL WAIVERS ──
   * The §5 rules above are ERROR repo-wide with NO file-level exemptions and
   * NO ratchet/allowlist machinery. The handful of genuinely-irreducible
   * bootstrap sites (e.g. the root GluestackUIProvider import in
   * src/app/_layout.tsx) carry a tightest-scope line-level rule suppression
   * at the exact import — never a whole-file waiver.
   */
  /**
   * ── Test-file scoping ──
   * The design-system rules govern SHIPPED app code. Test files legitimately
   * use raw className strings and @/components/ui / react-native primitive
   * imports in mocks and markup for assertions, and they render arbitrary
   * Tailwind classes to exercise styling paths. This override turns those
   * shipped-UI rules OFF for tests only — it is standard rule-scoping, NOT a
   * suppression of any shipped-UI violation.
   */
  {
    files: ["**/__tests__/**", "**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "no-restricted-syntax": "off",
      "better-tailwindcss/no-unknown-classes": "off",
      "better-tailwindcss/no-restricted-classes": "off",
      "no-restricted-imports": "off",
    },
  },
  /**
   * This file carries the inline design-system ESLint plugin (mirroring the
   * reference project's structure — the plugin lives with the rules that
   * mount it, so it runs everywhere ESLint runs with zero wiring). It is
   * lint infrastructure, not app code, so the app max-lines budget does not
   * apply to it.
   */
  {
    files: ["eslint.config.local.ts"],
    rules: {
      "max-lines": "off",
    },
  },
];
