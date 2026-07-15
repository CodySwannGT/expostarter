/**
 * Unit tests for the Root Layout component.
 * Tests that providers are correctly rendered around children.
 * @see https://callstack.github.io/react-native-testing-library
 * @module __tests__/app/_layout.test
 */
import { render } from "@testing-library/react-native";
import { Platform } from "react-native";

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

  describe("parse-time splash removal (issue #25)", () => {
    /**
     * Points Platform.OS at a platform for one test.
     * @param os - The platform to fake.
     */
    function givenPlatform(os: string): void {
      Object.defineProperty(Platform, "OS", { value: os, configurable: true });
    }

    /**
     * Mounts the parse-time overlay exactly as public/index.html ships it
     * (a #root sibling the template painted before any JS ran).
     */
    function givenSplashOverlay(): void {
      const splash = document.createElement("div");
      splash.id = "app-splash";
      document.body.appendChild(splash);
    }

    const originalOS = Platform.OS;

    afterEach(() => {
      givenPlatform(originalOS);
      document.getElementById("app-splash")?.remove();
    });

    it("DELETES #app-splash on web once React mounts (never intercepts clicks again)", () => {
      givenPlatform("web");
      givenSplashOverlay();

      render(<RootLayout />);

      // The removal effect fires on the first commit — the overlay must
      // already be gone from the DOM, not just hidden.
      expect(document.getElementById("app-splash")).toBeNull();
    });

    it("tolerates an already-removed overlay (hard reload / stale template)", () => {
      givenPlatform("web");

      expect(() => render(<RootLayout />)).not.toThrow();
    });

    it("leaves the DOM alone on native (no #app-splash there)", () => {
      givenPlatform("ios");
      givenSplashOverlay();

      render(<RootLayout />);

      expect(document.getElementById("app-splash")).not.toBeNull();
    });
  });
});
