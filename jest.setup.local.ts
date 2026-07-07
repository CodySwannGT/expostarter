/**
 * Jest Setup - Project-Local Customizations
 *
 * Project-specific jest.mock() calls and test lifecycle hooks.
 * This file is create-only — Lisa will never overwrite it.
 *
 * @module jest.setup.local
 */

// Mock expo/src/winter to prevent lazy-require of polyfills that fail in
// Jest's module system with "import outside of test scope" errors
jest.mock("expo/src/winter", () => {});

// Mock expo-modules-core to prevent "Cannot find native module" errors when
// tests transitively load modules like expo-asset, expo-font, etc.
jest.mock("expo-modules-core", () => {
  const actual = jest.requireActual("expo-modules-core");
  const { EventEmitter, NativeModule, SharedObject } = globalThis.expo;

  return {
    ...actual,
    EventEmitter,
    NativeModule,
    SharedObject,
    requireNativeModule: (name: string) => {
      const mod = actual.requireOptionalNativeModule(name);
      if (mod) return mod;
      const nativeModule = new NativeModule();
      return nativeModule;
    },
    requireOptionalNativeModule: (name: string) => {
      return actual.requireOptionalNativeModule(name) || null;
    },
  };
});

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  return {
    ...Reanimated,
    default: { ...Reanimated.default, call: () => {} },
  };
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

// Mock expo-clipboard — native view manager not available in test environment
jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn().mockResolvedValue(undefined),
  getStringAsync: jest.fn().mockResolvedValue(""),
  hasStringAsync: jest.fn().mockResolvedValue(false),
  addClipboardListener: jest.fn(() => ({ remove: jest.fn() })),
  removeClipboardListener: jest.fn(),
  ClipboardPasteButton: () => null,
}));

// Mock expo-application — native module not available in test environment
jest.mock("expo-application", () => ({
  applicationId: "com.test.app",
  applicationName: "test-app",
  nativeApplicationVersion: "1.0.0",
  nativeBuildVersion: "1",
}));

// Mock expo-updates — native module not available in test environment
jest.mock("expo-updates", () => ({
  isEnabled: false,
  isEmbeddedLaunch: true,
  isUsingEmbeddedAssets: true,
  updateId: null,
  channel: null,
  runtimeVersion: "1.0.0",
  checkForUpdateAsync: jest.fn(() => Promise.resolve({ isAvailable: false })),
  fetchUpdateAsync: jest.fn(() => Promise.resolve({ isNew: false })),
  reloadAsync: jest.fn(() => Promise.resolve()),
}));

// Mock safe area context
jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

// Mock NativeWind
jest.mock("nativewind", () => ({
  styled: (component: unknown) => component,
  // Components register className→style mappings at module scope via
  // cssInterop/remapProps; a passthrough keeps those imports side-effect free.
  cssInterop: (component: unknown) => component,
  remapProps: (component: unknown) => component,
  vars: (variables: Record<string, unknown>) => variables,
  useColorScheme: () => ({
    colorScheme: "light",
    toggleColorScheme: jest.fn(),
  }),
}));

// Mock @sentry/react-native
jest.mock("@sentry/react-native", () => {
  const mockReact = jest.requireActual("react");

  /**
   * Mock ErrorBoundary that simulates Sentry's error boundary behavior.
   * Catches errors in children and renders fallback when an error occurs.
   */
  // eslint-disable-next-line functional/no-classes -- Class required for error boundary mock
  class MockErrorBoundary extends mockReact.Component {
    constructor(props: Record<string, unknown>) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    render() {
      if ((this.state as { hasError: boolean }).hasError) {
        return (this.props as { fallback: unknown }).fallback;
      }
      return (this.props as { children: unknown }).children;
    }
  }

  const mockErrorBoundaryFn = jest.fn((props: Record<string, unknown>) =>
    mockReact.createElement(MockErrorBoundary, props)
  );

  return {
    init: jest.fn(),
    wrap: jest.fn((component: unknown) => component),
    setUser: jest.fn(),
    captureException: jest.fn(),
    captureMessage: jest.fn(),
    addBreadcrumb: jest.fn(),
    setExtra: jest.fn(),
    setTag: jest.fn(),
    withScope: jest.fn(
      (
        callback: (scope: { setExtras: jest.Mock; setExtra: jest.Mock }) => void
      ) =>
        callback({
          setExtras: jest.fn(),
          setExtra: jest.fn(),
        })
    ),
    getClient: jest.fn(() => null),
    ErrorBoundary: mockErrorBoundaryFn,
  };
});

// Mock apollo-link-sentry
jest.mock("apollo-link-sentry", () => {
  const { ApolloLink } = require("@apollo/client");
  return {
    SentryLink: jest.fn(
      () =>
        new ApolloLink(
          (operation: unknown, forward: (op: unknown) => unknown) =>
            forward(operation)
        )
    ),
  };
});

// Silence console warnings in tests for useNativeDriver
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("Animated: `useNativeDriver`")
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

// Use fake timers to prevent open handles from setTimeout/setInterval
jest.useFakeTimers({ advanceTimers: true });

// Clear timers after each test
afterEach(() => {
  jest.clearAllTimers();
});

// Clean up after all tests complete
afterAll(() => {
  console.warn = originalWarn;
  jest.useRealTimers();
});
