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
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  testMatch: [
    "<rootDir>/__tests__/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/app/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/features/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/hooks/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/components/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/utils/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/lib/**/*.(test|spec).[jt]s?(x)",
    "<rootDir>/eslint-plugin-*/__tests__/**/*.test.js",
  ],

  testPathIgnorePatterns: ["/node_modules/", "/components/ui/"],
};

export default config;
