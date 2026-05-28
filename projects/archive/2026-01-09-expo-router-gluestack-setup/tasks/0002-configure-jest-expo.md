# Task: Configure Jest with jest-expo and 98% Coverage Thresholds

## Applicable Skills

Invoke these skills before writing implementation code:

- `/coding-philosophy` - Always required for all code
- `/testing-library` - This task configures the testing infrastructure

## Implementation Details

This task creates the Jest configuration files for testing Expo applications with 98% coverage thresholds on all metrics.

### Files to Create

1. **jest.config.js** - Jest configuration with coverage thresholds
2. **jest.setup.js** - Jest setup file with mocks and testing-library extensions

### Configuration Details

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

### Important Notes

- The project uses `bun` as the package manager
- Jest 30, jest-expo 54, and @testing-library/react-native 13 are already installed
- Existing test scripts in package.json: `test`, `test:unit`, `test:integration`, `test:watch`, `test:cov`
- Test files should NOT be placed in the `app/` directory - use `__tests__/` directories
- Gluestack UI components in `components/ui/` are excluded from coverage

## Implementation Steps

### Step 0: Setup Tracking
Use TodoWrite to create task tracking todos:
- Invoke skills
- Write failing tests
- Write implementation
- Update documentation
- Commit changes

**CRITICAL**: DO NOT STOP until all todos are marked completed.

### Step 1: Invoke Skills
Mark "Invoke skills" as in_progress.

1. Mark this task as "in progress" in the corresponding `progress.md` file
2. **Invoke each skill listed in "Applicable Skills" above using the Skill tool** (e.g., run `/coding-philosophy`, then `/testing-library`)

Mark "Invoke skills" as completed.

### Step 2: Write Failing Tests
Mark "Write failing tests" as in_progress.

Configuration files do not require unit tests. Skip to implementation.

Mark "Write failing tests" as completed.

### Step 3: Write Implementation
Mark "Write implementation" as in_progress.

Create the following files with the configurations specified above:
1. `/Users/cody/workspace/thumbwar/frontend/jest.config.js`
2. `/Users/cody/workspace/thumbwar/frontend/jest.setup.js`

Verify the configuration works by running:
```bash
bun run test
```

Mark "Write implementation" as completed.

### Step 4: Update Documentation
Mark "Update documentation" as in_progress.

Add JSDoc comments to each file explaining:
- Purpose of the file
- Key configuration options
- Links to relevant documentation

Mark "Update documentation" as completed.

### Step 5: Commit Changes
Mark "Commit changes" as in_progress.

1. run /git:commit
2. Fix any errors that blocked the commit
3. Mark this task as "completed" in the corresponding `progress.md` file
4. Write any findings you learned about the project to the `findings.md` file

Mark "Commit changes" as completed.

## Implementation Rules

### Always

- Follow TDD
- figure out the Package manager the project uses: bun
- read @package.json
- create clear documentation preambles with JSDoc for new code
- update preambles when updating or modifying code

### Never

- Partially implement code or leave something as a "note" or "TODO" for later.
- skip any git hooks even if you think they're unrelated
- skip or disable any tests or quality checks.
- add .skip to a test unless explicitly asked to
- directly modify a file in node_modules/
- use --no-verify with git commands.
- make assumptions about whether something worked. Test it empirically to confirm.
- cover up bugs or issues. Always fix them properly.
- write functions or methods unless they are needed.
- say "not related to our changes" or "not relevant to this task". Always provide a solution.
- create functions or variables with versioned names (processV2, handleNew, ClientOld)
- write unhelpful comments like "removed code"
- disable a lint rule unless absolutely necessary
