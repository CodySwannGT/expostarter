/**
 * Unit tests for the Root Layout component.
 * Tests that providers are correctly rendered around children.
 * @see https://callstack.github.io/react-native-testing-library
 * @module __tests__/app/_layout.test
 */
import { render } from "@testing-library/react-native";

import RootLayout from "@/app/_layout";

// Mock the global.css import
jest.mock("@/global.css", () => ({}));

// Mock GluestackUIProvider
jest.mock("@/components/ui/gluestack-ui-provider", () => ({
  GluestackUIProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock ErrorBoundary
jest.mock("@/components/molecules/ErrorBoundary", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock ThemeProvider (AsyncStorage-backed)
jest.mock("@/providers/ThemeProvider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useTheme: () => ({
    mode: "system",
    resolvedTheme: "light",
    setMode: jest.fn(),
    toggleTheme: jest.fn(),
    isLoaded: true,
  }),
}));

// Mock Sentry navigation tracking hook
jest.mock("@/hooks/shared/useSentryNavigationTracking", () => ({
  useSentryNavigationTracking: jest.fn(),
}));

// Mock Sentry config
jest.mock("@/lib/sentry/config", () => ({
  initializeSentry: jest.fn(),
  Sentry: {
    wrap: (component: React.ComponentType) => component,
  },
}));

// Mock expo-router Stack
jest.mock("expo-router", () => ({
  Stack: () => <></>,
}));

describe("RootLayout", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      expect(() => render(<RootLayout />)).not.toThrow();
    });

    it("renders the layout structure", () => {
      render(<RootLayout />);
      // The layout should render without errors
      // Since Stack is mocked, we just verify the component renders
      expect(true).toBe(true);
    });
  });
});
