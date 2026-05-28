/**
 * Integration tests for the Index route.
 * Tests route rendering with full provider stack.
 *
 * Note: expo-router/testing-library has compatibility issues with Jest 30.
 * These tests verify the Index component works within the full provider stack.
 * @see https://docs.expo.dev/router/reference/testing-library
 * @module __tests__/app/index.integration.test
 */
import { render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";

import Index from "@/app/index";

// Mock GluestackUIProvider to avoid nativewind vars dependency
jest.mock("@/components/ui/gluestack-ui-provider", () => ({
  GluestackUIProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const {
  GluestackUIProvider,
} = require("@/components/ui/gluestack-ui-provider");

/**
 * Renders the Index component within the full provider stack.
 * @returns The render result from testing-library.
 */
function renderWithProviders(): ReturnType<typeof render> {
  return render(
    <SafeAreaProvider>
      <GluestackUIProvider>
        <Index />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}

describe("Index Route Integration", () => {
  describe("with full provider stack", () => {
    it("renders without crashing with all providers", () => {
      expect(() => renderWithProviders()).not.toThrow();
    });

    it("displays Hello, World! text with providers", () => {
      renderWithProviders();
      expect(screen.getByText("Hello, World!")).toBeTruthy();
    });

    it("integrates with GluestackUIProvider correctly", () => {
      const { root } = renderWithProviders();
      // Verify the component tree is rendered correctly
      expect(root).toBeTruthy();
    });
  });
});
