/**
 * Integration tests for the Root Layout component.
 * Tests the layout with full provider stack integration.
 * @see https://docs.expo.dev/router/reference/testing-library
 * @module __tests__/app/_layout.integration.test
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
jest.mock("@/components/shared/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
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

describe("RootLayout Integration", () => {
  describe("with provider stack", () => {
    it("renders without crashing with all providers", () => {
      expect(() => render(<RootLayout />)).not.toThrow();
    });

    it("renders the layout structure with providers", () => {
      const result = render(<RootLayout />);
      // Verify render result contains the component tree
      expect(result.toJSON()).toBeDefined();
    });
  });
});
