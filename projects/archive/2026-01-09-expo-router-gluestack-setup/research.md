---
date: 2026-01-09T14:45:00-06:00
status: complete
last_updated: 2026-01-09
---

# Research

## Summary

This research documents the current state of the codebase and identifies the configuration requirements for setting up a basic Expo app with Expo Router, Jest with 98% coverage threshold, and Gluestack UI v3. The project has dependencies already installed but is missing the core configuration files and `app/` directory structure needed for Expo Router.

## Detailed Findings

### Current Project State

The project is an Expo/React Native application with dependencies pre-installed but missing critical configuration files.

#### Files That Exist

| File | Purpose |
|------|---------|
| `/Users/cody/workspace/thumbwar/frontend/package.json` | Dependencies and scripts configured |
| `/Users/cody/workspace/thumbwar/frontend/app.json` | Expo configuration with `expo-router` plugin |
| `/Users/cody/workspace/thumbwar/frontend/app.config.ts` | Dynamic Expo configuration |
| `/Users/cody/workspace/thumbwar/frontend/tsconfig.json` | TypeScript configuration with path aliases |
| `/Users/cody/workspace/thumbwar/frontend/eslint.config.mjs` | ESLint flat config |

#### Files That Do NOT Exist (Need Creation)

| File | Purpose |
|------|---------|
| `app/` directory | Expo Router file-based routes |
| `babel.config.js` | Babel configuration for NativeWind |
| `metro.config.js` | Metro bundler configuration for NativeWind |
| `tailwind.config.js` | Tailwind CSS configuration |
| `global.css` | Tailwind CSS directives |
| `jest.config.js` | Jest configuration with coverage thresholds |
| `jest.setup.js` | Jest setup file |
| `nativewind-env.d.ts` | TypeScript support for NativeWind |
| `components/ui/` | Gluestack UI components |

### Installed Dependencies

The project has these relevant dependencies already in `package.json`:

#### Core Dependencies
- `expo: ~54.0.31`
- `expo-router: ~6.0.21`
- `react: 19.2.3`
- `react-native: 0.81.4`

#### Gluestack UI v3
- `@gluestack-ui/core: ^3.0.10`
- `@gluestack-ui/utils: ^3.0.7`

#### NativeWind/Tailwind
- `nativewind: ^4.2.1`
- `tailwindcss: ^3.4.7`

#### Testing
- `jest: ^30.0.0`
- `jest-expo: ^54.0.12`
- `@testing-library/react-native: ^13.0.0`
- `@types/jest: ^30.0.0`

### Expo Router Configuration

#### Core Concepts (from Expo Documentation)

1. **All routes are files in `app/` directory** - Every file inside `app/` with a default export defines a page
2. **All pages have a URL** - File location maps to URL path for universal deep-linking
3. **First `index.tsx` is the initial route** - The `/` URL maps to `app/index.tsx`
4. **Root `_layout.tsx` replaces App.jsx** - Initialization code goes here (fonts, splash screen, providers)
5. **Non-navigation components live outside `app/`** - Components, hooks, utilities go in other directories
6. **Built on React Navigation** - Same options and styling as React Navigation

#### Required package.json Entry Point

```json
{
  "main": "expo-router/entry"
}
```

#### app.json Configuration (Already Present)

The `app.json` already has:
- `"bundler": "metro"` for web
- `"expo-router"` in plugins array

### NativeWind v4 Configuration

#### babel.config.js

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

#### metro.config.js

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```

#### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
```

#### global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### nativewind-env.d.ts

```typescript
/// <reference types="nativewind/types" />
```

**Note:** NativeWind v4 only supports Tailwind CSS v3, not v4.

### Jest-Expo Setup with 98% Coverage

#### Overview

`jest-expo` is the official Jest preset for Expo projects. It provides:
- Pre-configured transformations for React Native and Expo modules
- Platform-specific test environments (iOS, Android, Web)
- Proper handling of native module mocks

#### jest.config.js

```javascript
/**
 * Jest configuration for Expo project with 98% coverage threshold.
 * Uses jest-expo preset for React Native/Expo compatibility.
 * @see https://docs.expo.dev/develop/unit-testing
 */
module.exports = {
  // Use jest-expo preset for Expo/React Native compatibility
  preset: "jest-expo",

  // Test environment
  testEnvironment: "jsdom",

  // Transform ignore patterns - transpile these node_modules
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|nativewind|@gluestack-ui/.*|@legendapp/motion|lucide-react-native)",
  ],

  // Module path aliases (must match tsconfig.json paths)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx,js,jsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/metro.config.js",
    "!**/tailwind.config.js",
    "!**/jest.config.js",
    "!**/jest.setup.js",
    "!**/expo-env.d.ts",
    "!**/nativewind-env.d.ts",
    "!**/.expo/**",
    "!**/app.config.ts",
    "!**/eslint.config.mjs",
    "!**/eslint-plugin-*/**",
    "!**/components/ui/**", // Gluestack UI generated components
  ],

  // 98% coverage threshold on all metrics
  coverageThreshold: {
    global: {
      branches: 98,
      functions: 98,
      lines: 98,
      statements: 98,
    },
  },

  // Test file patterns
  testMatch: [
    "**/__tests__/**/*.(test|spec).[jt]s?(x)",
    "**/?(*.)+(test|spec).[jt]s?(x)",
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    "/node_modules/",
    "/components/ui/", // Gluestack UI generated components
  ],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,
};
```

#### jest.setup.js

```javascript
/**
 * Jest setup file for Expo project.
 * Configures testing-library, mocks native modules, and extends expect.
 * @see https://docs.expo.dev/develop/unit-testing
 */

// Import testing-library matchers
import "@testing-library/react-native/extend-expect";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
  useSegments: () => [],
  usePathname: () => "/",
  Link: ({ children }) => children,
  Redirect: () => null,
  Stack: {
    Screen: () => null,
  },
  Tabs: {
    Screen: () => null,
  },
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-font
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
  useFonts: jest.fn(() => [true, null]),
}));

// Mock expo-splash-screen
jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
  hideAsync: jest.fn(() => Promise.resolve()),
}));

// Mock expo-constants
jest.mock("expo-constants", () => ({
  expoConfig: {
    name: "test-app",
    slug: "test-app",
  },
}));

// Mock safe area context
jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

// Mock NativeWind
jest.mock("nativewind", () => ({
  styled: (component) => component,
  useColorScheme: () => ({ colorScheme: "light", toggleColorScheme: jest.fn() }),
}));

// Silence console warnings in tests (optional)
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("Animated: `useNativeDriver`")
  ) {
    return;
  }
  originalWarn.apply(console, args);
};
```

#### Expo Router Testing Utilities

From `expo-router/testing-library` (for integration tests):

```javascript
import { renderRouter, screen } from "expo-router/testing-library";

describe("Router Integration", () => {
  it("renders index route", async () => {
    renderRouter(
      {
        index: () => <Text>Hello, World!</Text>,
      },
      {
        initialUrl: "/",
      }
    );

    expect(screen).toHavePathname("/");
  });
});
```

Available matchers:
- `toHavePathname()` - Assert current pathname
- `toHavePathnameWithParams()` - Assert pathname with query params
- `toHaveSegments()` - Assert route segments
- `useLocalSearchParams()` - Mock local search params
- `useGlobalSearchParams()` - Mock global search params
- `toHaveRouterState()` - Assert router state

**Important:** Test files should NOT be placed in the `app/` directory. Use `__tests__/` directories inside each component directory.

### Gluestack UI v3 Setup

#### Installation via CLI

```bash
npx gluestack-ui init
npx gluestack-ui add box text pressable
```

The CLI automatically:
- Adds GluestackUIProvider component
- Installs essential overlay and toast components
- Adds Icon component
- Sets up NativeWind integration

#### Architecture

Gluestack v3 uses a source-to-destination architecture with packages:
- `@gluestack-ui/core` - Core component creators
- `@gluestack-ui/utils` - Utility functions including NativeWind utilities

#### Component Pattern

From the project's `/Users/cody/workspace/thumbwar/frontend/.claude/skills/gluestack-nativewind/SKILL.md`:

| React Native | Gluestack Equivalent |
|--------------|---------------------|
| `View` | `Box` from `@/components/ui/box` |
| `Text` | `Text` from `@/components/ui/text` |
| `TouchableOpacity` | `Pressable` from `@/components/ui/pressable` |
| `ScrollView` | `ScrollView` from `@/components/ui/scroll-view` |
| `Image` | `Image` from `@/components/ui/image` |
| `TextInput` | `Input`, `InputField` from `@/components/ui/input` |

### Existing Test Scripts

From `package.json`:
- `test` - `NODE_ENV=test jest --forceExit --passWithNoTests`
- `test:unit` - Runs unit tests (excludes `.integration.test.*`)
- `test:integration` - Runs only integration tests
- `test:watch` - Watch mode
- `test:cov` - Coverage mode

## Code References

- `/Users/cody/workspace/thumbwar/frontend/package.json` - Dependencies and npm scripts
- `/Users/cody/workspace/thumbwar/frontend/app.json:41-44` - Web bundler set to metro
- `/Users/cody/workspace/thumbwar/frontend/app.json:73` - expo-router plugin configured
- `/Users/cody/workspace/thumbwar/frontend/tsconfig.json:4` - References `nativewind-env.d.ts`
- `/Users/cody/workspace/thumbwar/frontend/app.config.ts` - Dynamic Expo config with versioning
- `/Users/cody/workspace/thumbwar/frontend/.claude/skills/gluestack-nativewind/SKILL.md` - Gluestack styling patterns

## Architecture Documentation

### Framework: Expo SDK 54

The project uses:
- **Expo SDK 54** with managed workflow
- **Expo Router 6** for file-based routing (built on React Navigation)
- **NativeWind v4** for Tailwind CSS styling (requires Tailwind v3)
- **Gluestack UI v3** for component library
- **Jest 30** with `jest-expo` preset for testing
- **React 19** and **React Native 0.81**

### Directory Structure Convention

Based on `tsconfig.json` path aliases, the expected structure is:

```
frontend/
  app/                    # Expo Router routes
    _layout.tsx          # Root layout
    index.tsx            # Home route (/)
  components/
    ui/                  # Gluestack UI components
  features/              # Feature modules
  hooks/                 # Custom hooks
  utils/                 # Utility functions
  providers/             # Context providers
  assets/                # Static assets
  types/                 # TypeScript types
  config/                # Configuration files
  stores/                # State management
  constants/             # Constants
  __tests__/             # Test files (NOT in app/)
```

## E2E Test Impact

### Existing Tests

No existing test files found in the project (excluding `node_modules`).

### Tests Requiring Modification

N/A - No existing tests.

### Tests to Remove

N/A - No existing tests.

### New Tests Needed

1. **Unit test for `app/index.tsx`** - Verify "Hello, World!" renders correctly
2. **Integration test with Expo Router** - Verify route renders at `/`

Example test structure:
```typescript
// __tests__/app/index.test.tsx
import { render } from "@testing-library/react-native";
import Index from "@/app/index";

describe("Index Route", () => {
  it("renders Hello, World! text", () => {
    const { getByText } = render(<Index />);
    expect(getByText("Hello, World!")).toBeTruthy();
  });
});
```

## Resolved Questions

1. **GluestackUIProvider Setup** - GluestackUIProvider wraps all routes in `app/_layout.tsx`

2. **Test File Location** - Tests use `__tests__/` directories inside each component directory

3. **Components to Install** - Install all Gluestack UI components (full installation)

4. **Root Layout Providers** - Based on Expo best practices, the root layout should include:
   - `GluestackUIProvider` - Gluestack theming and styling
   - `SafeAreaProvider` - Safe area insets for notches/dynamic islands
   - React Navigation containers are handled automatically by Expo Router

## Open Questions

None - all questions resolved.

## External Resources

- [Expo Router Installation](https://docs.expo.dev/router/installation)
- [Expo Router Core Concepts](https://docs.expo.dev/router/basics/core-concepts)
- [Expo Router Testing](https://docs.expo.dev/router/reference/testing)
- [Unit Testing with Jest (Expo)](https://docs.expo.dev/develop/unit-testing)
- [NativeWind Installation](https://www.nativewind.dev/docs/getting-started/installation)
- [Gluestack UI Installation](https://gluestack.io/ui/docs/home/getting-started/installation)
- [Gluestack v3 Migration Guide](https://gluestack.io/ui/docs/guides/more/upgrade-to-v3)
- [Jest Coverage Configuration](https://jestjs.io/docs/configuration#coveragethreshold-object)
