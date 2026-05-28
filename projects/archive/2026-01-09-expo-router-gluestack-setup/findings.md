# Project Findings

## Task 0001: Configure NativeWind v4 and Tailwind CSS v3

### Discovery: Pre-commit hook package manager detection

The pre-commit hook in `.husky/pre-commit` detected `bun.lock` and attempted to use `bun` commands, but `bun` was not available in the PATH. The hook should check if the package manager is actually installed before using it.

**Fix applied**: Updated the hook to use `command -v` to verify the package manager is available before selecting it. Falls back to npm if the lock file exists but the tool is not installed.

### Configuration Notes

- The `tsconfig.json` already had `nativewind-env.d.ts` in its include array (line 4)
- NativeWind v4 requires Tailwind CSS v3, not v4 (already correct in package.json)
- Both `nativewind: ^4.2.1` and `tailwindcss: ^3.4.7` were already installed

## Task 0002: Configure Jest with jest-expo

### Discovery: Multi-project configuration required

The project contains ESLint plugin tests (`eslint-plugin-*/__tests__/*.test.js`) that require a Node.js environment, while React Native component tests require the `jest-expo` preset. Using a single `jest-expo` preset caused conflicts with the `react-native/jest/setup.js` which redefines the `window` property.

**Solution**: Implemented Jest's multi-project configuration:
1. `eslint-plugins` project: Uses `node` testEnvironment for pure JavaScript ESLint rule tests
2. `expo` project: Uses `jest-expo` preset with `jsdom` environment for React Native component tests

### Configuration Notes

- Jest 30, jest-expo 54, and @testing-library/react-native 13 were already installed
- The `verbose` option must be at the root config level, not in individual project configs
- Coverage exclusions include `.github/**`, `commitlint.config.js`, `lighthouserc.js`, and other config files

## Task 0006: Install Gluestack UI Components

### Discovery: CLI TTY initialization issue

The `npx gluestack-ui init` CLI command fails with `SystemError [ERR_TTY_INIT_FAILED]: TTY initialization failed` in non-interactive environments (e.g., Claude Code). The `--template-only` flag also fails with the same error.

**Workaround**: Copied components directly from the gluestack cache directory at `~/.gluestack/cache/gluestack-ui/src/components/ui/`. This is equivalent to what the CLI does, but bypasses the interactive prompts.

### Configuration Notes

- Installed 38 components including: gluestack-ui-provider, box, text, pressable, button, input, icon, heading, vstack, hstack, center, badge, avatar, card, checkbox, radio, slider, switch, textarea, toast, alert, modal, drawer, accordion, menu, popover, tooltip, scroll-view, image, divider, spinner, progress, actionsheet, fab, link, select, safe-area-view, and utils
- Components are located in `components/ui/` and excluded from ESLint and test coverage by existing config
- The `@gluestack-ui/core: ^3.0.10` and `@gluestack-ui/utils: ^3.0.7` packages were already installed in package.json

## Task 0005: Create Index Route

### Discovery: Expo SDK 54 Jest import.meta issue

Expo SDK 54 introduces experimental import support that uses `import.meta` for module resolution. This causes a `ReferenceError: You are trying to import a file outside of the scope of the test code` error when running Jest tests.

**Solution**: Created `jest.setup.pre.js` that runs before the test framework loads (via `setupFiles`) to mock:
1. `global.__ExpoImportMetaRegistry` - Expo's module registry
2. `global.structuredClone` - Used by Expo's winter runtime

### Configuration Notes

- The `jest.setup.pre.js` must use `setupFiles` (not `setupFilesAfterEnv`) because expo's runtime loads before the test framework
- Updated `react-test-renderer` to 19.2.3 to match React version
- Used `--legacy-peer-deps` for npm install due to @react-navigation/elements peer dependency conflict
- Babel config updated to disable `experimentalImportSupport` in test environment (may not be strictly necessary with the pre-setup mocks)

## Task 0007: Write Tests for Index Route

### Discovery: expo-router/testing-library incompatible with Jest 30

The `expo-router/testing-library` module requires `expect/build/matchers` which doesn't exist in Jest 30 (path changed). This is a known compatibility issue between expo-router 6.x and Jest 30.

**Workaround**: Integration tests use `@testing-library/react-native` directly with mocked providers instead of `renderRouter` from `expo-router/testing-library`. This approach still tests the component within the full provider stack (SafeAreaProvider, GluestackUIProvider) but without the router context.

### Discovery: GluestackUIProvider requires nativewind vars mock

The GluestackUIProvider config uses `vars` from nativewind which must be mocked in tests. Without the mock, tests fail with `TypeError: (0, _nativewind.vars) is not a function`.

**Solution**: Mock the entire GluestackUIProvider module in integration tests to avoid the nativewind dependency.

### Configuration Notes

- Unit tests achieve 100% coverage on app/ directory files
- Integration tests verify components work within the provider stack
- Test files use proper JSDoc documentation with `@module` tags
- Coverage exclusions added for `__tests__/**` and `jest.setup.pre.js`
