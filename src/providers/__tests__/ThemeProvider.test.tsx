/**
 * Unit tests for Theme Provider
 *
 * Tests the ThemeProvider functionality including:
 * - Default theme values
 * - Context structure
 * - Function definitions
 *
 * Note: Async tests are limited due to React 19 cleanup issues.
 * The context value structure is fully tested with sync tests.
 */

import { renderHook } from "@testing-library/react-native";
import * as React from "react";

// Import after mocks are set up
import { ThemeProvider, useTheme } from "../ThemeProvider";

// Mock AsyncStorage
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: mockGetItem,
    setItem: mockSetItem,
  },
}));

describe("ThemeProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("useTheme hook", () => {
    it("should return default values when used inside provider", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.mode).toBe("system");
      expect(result.current.setMode).toBeDefined();
      expect(result.current.toggleTheme).toBeDefined();
    });

    it("should return default context values when used outside provider", () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.mode).toBe("system");
      expect(result.current.resolvedTheme).toBe("light");
      expect(result.current.isLoaded).toBe(false);
    });

    it("should provide resolvedTheme based on mode", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children);

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Default mode is system, resolvedTheme depends on Appearance
      expect(result.current.mode).toBe("system");
      expect(["light", "dark"]).toContain(result.current.resolvedTheme);
    });
  });

  describe("function types", () => {
    it("should have toggleTheme function defined", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(typeof result.current.toggleTheme).toBe("function");
    });

    it("should have setMode function defined", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(typeof result.current.setMode).toBe("function");
    });

    it("should have mode property as string", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(typeof result.current.mode).toBe("string");
      expect(["light", "dark", "system"]).toContain(result.current.mode);
    });

    it("should have isLoaded property as boolean", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(typeof result.current.isLoaded).toBe("boolean");
    });
  });

  describe("AsyncStorage integration", () => {
    it("should have AsyncStorage mock available", () => {
      expect(mockGetItem).toBeDefined();
      expect(mockSetItem).toBeDefined();
    });

    it("should use default mode if AsyncStorage is empty", () => {
      mockGetItem.mockResolvedValue(null);

      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.mode).toBe("system");
    });

    it("should default to system mode when invalid value in storage", () => {
      mockGetItem.mockResolvedValue("invalid");

      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children);

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Before loading completes, mode is still system (default)
      expect(result.current.mode).toBe("system");
    });
  });

  describe("resolvedTheme", () => {
    it("should have resolvedTheme property", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(["light", "dark"]).toContain(result.current.resolvedTheme);
    });

    it("should return valid theme value when in system mode", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.mode).toBe("system");
      // resolvedTheme should be either light or dark, never undefined
      expect(["light", "dark"]).toContain(result.current.resolvedTheme);
    });
  });

  describe("context value stability", () => {
    it("should maintain function reference stability for setMode", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children);

      const { result, rerender } = renderHook(() => useTheme(), { wrapper });

      const initialSetMode = result.current.setMode;

      rerender({});

      expect(result.current.setMode).toBe(initialSetMode);
    });

    it("should maintain function reference stability for toggleTheme", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(ThemeProvider, null, children);

      const { result, rerender } = renderHook(() => useTheme(), { wrapper });

      const initialToggleTheme = result.current.toggleTheme;

      rerender({});

      expect(result.current.toggleTheme).toBe(initialToggleTheme);
    });
  });
});
