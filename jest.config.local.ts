/**
 * Jest Configuration - Project-Local Customizations
 *
 * Adds project-specific module name mapping, test matching patterns,
 * and path ignore patterns. Setup files are managed by jest.expo.ts.
 *
 * @see https://jestjs.io/docs/configuration
 * @module jest.config.local
 */
import type { Config } from "jest";

const config: Config = {
  // Design-time playground showcase data — rendered only by the prod-gated
  // /playground route; excluded from coverage like the preset excludes
  // *View.tsx. Gallery completeness is enforced by the design-system ESLint
  // plugin (atom-gallery-complete / gallery-manifest-fresh), not by tests.
  collectCoverageFrom: [
    "!**/gallery.tsx",
    "!**/galleryManifest.ts",
    "!**/galleryTypes.ts",
    "!**/galleryOverlayCard.tsx",
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  testMatch: [
    "<rootDir>/src/__tests__/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/src/app/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/src/features/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/src/hooks/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/src/components/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/src/utils/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/src/lib/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/eslint-plugin-*/__tests__/**/*.test.js",
  ],

  testPathIgnorePatterns: ["/node_modules/", "/components/ui/"],
};

export default config;
