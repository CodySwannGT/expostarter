/**
 * Type declarations for ESLint plugins that lack TypeScript definitions.
 *
 * This file provides ambient module declarations for ESLint plugins used in
 * the project's ESLint configuration that don't ship with or have available
 * @types packages.
 */

declare module "@eslint-community/eslint-plugin-eslint-comments" {
  import type { ESLint, Linter } from "eslint";

  /** ESLint plugin for eslint-comments rules. */
  interface EslintCommentsPlugin {
    /** Plugin metadata. */
    meta: {
      name: string;
      version: string;
    };
    /** Available rules. */
    rules: Record<string, ESLint.RuleModule>;
    /** Pre-configured rule sets. */
    configs: {
      recommended: {
        rules: Linter.RulesRecord;
      };
    };
  }

  const plugin: EslintCommentsPlugin;
  export default plugin;
}
