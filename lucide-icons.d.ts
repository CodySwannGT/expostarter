/**
 * Per-icon module declarations for lucide-react-native.
 *
 * lucide-react-native's package.json `exports` map only exposes the barrel
 * entry points (`.` and `./icons`), which re-export all ~1,600 icons. Metro
 * cannot tree-shake ESM barrels, so importing ONE icon from the barrel puts
 * every icon (~1.1MB minified) into each bundle. Importing the per-icon
 * dist module keeps only the icons actually used.
 *
 * Metro resolves the `dist/esm/icons/*` file paths fine (it falls back to
 * file resolution for subpaths missing from `exports`), but TypeScript's
 * `moduleResolution: "bundler"` enforces the exports map strictly — this
 * ambient declaration supplies the types for those deep imports.
 *
 * (The file is deliberately NOT named `lucide-react-native.d.ts`: with
 * `baseUrl: "./"` TypeScript would resolve the bare `lucide-react-native`
 * specifier to that root file instead of the real package.)
 */
declare module "lucide-react-native/dist/esm/icons/*" {
  import type { LucideIcon } from "lucide-react-native";

  const Icon: LucideIcon;
  export default Icon;
}
