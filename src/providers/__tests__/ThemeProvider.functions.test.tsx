/**
 * Unit tests for ThemeProvider function coverage
 *
 * Tests the ThemeProvider internal functions and context methods:
 * - getSystemTheme behavior
 * - setMode function state updates
 * - toggleTheme function for all mode transitions
 * - resolvedTheme derivation
 *
 * Note: AsyncStorage mock verification is limited due to Jest module caching
 * and React 19 cleanup issues. These tests focus on state transitions.
 * @module providers/__tests__/ThemeProvider.functions.test
 */

import { renderHook, act } from "@testing-library/react-native/pure";
import * as React from "react";
import { Appearance, ColorSchemeName } from "react-native";

// Import after mocks
import { ThemeProvider, useTheme } from "../ThemeProvider";

// Mock AsyncStorage
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    // Delegate lazily: the factory runs while this module's consts are still
    // in their temporal dead zone, so referencing mockGetItem/mockSetItem
    // directly would capture `undefined` and the mocks would never be hit.
    getItem: (...args: unknown[]) => mockGetItem(...args),
    setItem: (...args: unknown[]) => mockSetItem(...args),
  },
}));

// Store original Appearance methods
const originalGetColorScheme = Appearance.getColorScheme;
const originalAddChangeListener = Appearance.addChangeListener;

/**
 * Wrapper component for renderHook tests
 * @param root0 - Component props
 * @param root0.children - Child components to wrap with ThemeProvider
 */
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(ThemeProvider, null, children);

describe("ThemeProvider function coverage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);

    // Mock Appearance.getColorScheme to return consistent value
    jest
      .spyOn(Appearance, "getColorScheme")
      .mockReturnValue("dark" as ColorSchemeName);

    // Mock addChangeListener to return a subscription object
    jest.spyOn(Appearance, "addChangeListener").mockReturnValue({
      remove: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Appearance.getColorScheme = originalGetColorScheme;
    Appearance.addChangeListener = originalAddChangeListener;
  });

  describe("getSystemTheme (internal function)", () => {
    it("should default to dark when Appearance returns null", () => {
      jest
        .spyOn(Appearance, "getColorScheme")
        .mockReturnValue(null as unknown as ColorSchemeName);

      const { result } = renderHook(() => useTheme(), { wrapper });

      // When system scheme is null, getSystemTheme returns "dark"
      // So in system mode, resolvedTheme should be "dark"
      expect(result.current.mode).toBe("system");
      expect(result.current.resolvedTheme).toBe("dark");
    });

    it("should return light when Appearance returns light", () => {
      jest
        .spyOn(Appearance, "getColorScheme")
        .mockReturnValue("light" as ColorSchemeName);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.mode).toBe("system");
      expect(result.current.resolvedTheme).toBe("light");
    });

    it("should return dark when Appearance returns dark", () => {
      jest
        .spyOn(Appearance, "getColorScheme")
        .mockReturnValue("dark" as ColorSchemeName);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.mode).toBe("system");
      expect(result.current.resolvedTheme).toBe("dark");
    });
  });

  describe("setMode function", () => {
    it("should update mode to light", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setMode("light");
      });

      expect(result.current.mode).toBe("light");
    });

    it("should update mode to dark", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setMode("dark");
      });

      expect(result.current.mode).toBe("dark");
    });

    it("should update mode to system", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      // First set to dark, then back to system
      act(() => {
        result.current.setMode("dark");
      });
      act(() => {
        result.current.setMode("system");
      });

      expect(result.current.mode).toBe("system");
    });

    it("should update resolvedTheme when mode changes to light", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setMode("light");
      });

      expect(result.current.resolvedTheme).toBe("light");
    });

    it("should update resolvedTheme when mode changes to dark", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setMode("dark");
      });

      expect(result.current.resolvedTheme).toBe("dark");
    });
  });

  describe("toggleTheme function", () => {
    describe("when in system mode", () => {
      it("should switch to light when resolved theme is dark", () => {
        jest
          .spyOn(Appearance, "getColorScheme")
          .mockReturnValue("dark" as ColorSchemeName);

        const { result } = renderHook(() => useTheme(), { wrapper });

        expect(result.current.mode).toBe("system");
        expect(result.current.resolvedTheme).toBe("dark");

        act(() => {
          result.current.toggleTheme();
        });

        expect(result.current.mode).toBe("light");
      });

      it("should switch to dark when resolved theme is light", () => {
        jest
          .spyOn(Appearance, "getColorScheme")
          .mockReturnValue("light" as ColorSchemeName);

        const { result } = renderHook(() => useTheme(), { wrapper });

        expect(result.current.mode).toBe("system");
        expect(result.current.resolvedTheme).toBe("light");

        act(() => {
          result.current.toggleTheme();
        });

        expect(result.current.mode).toBe("dark");
      });
    });

    describe("when in light mode", () => {
      it("should switch to dark mode", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
          result.current.setMode("light");
        });

        expect(result.current.mode).toBe("light");

        act(() => {
          result.current.toggleTheme();
        });

        expect(result.current.mode).toBe("dark");
      });
    });

    describe("when in dark mode", () => {
      it("should switch to light mode", () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
          result.current.setMode("dark");
        });

        expect(result.current.mode).toBe("dark");

        act(() => {
          result.current.toggleTheme();
        });

        expect(result.current.mode).toBe("light");
      });
    });

    it("should cycle through modes correctly", () => {
      jest
        .spyOn(Appearance, "getColorScheme")
        .mockReturnValue("dark" as ColorSchemeName);

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Start at system (resolved dark)
      expect(result.current.mode).toBe("system");
      expect(result.current.resolvedTheme).toBe("dark");

      // Toggle: system (dark) -> light
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.mode).toBe("light");

      // Toggle: light -> dark
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.mode).toBe("dark");

      // Toggle: dark -> light
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.mode).toBe("light");
    });
  });

  describe("resolvedTheme derivation", () => {
    it("should return mode directly when mode is light", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setMode("light");
      });

      expect(result.current.resolvedTheme).toBe("light");
    });

    it("should return mode directly when mode is dark", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setMode("dark");
      });

      expect(result.current.resolvedTheme).toBe("dark");
    });

    it("should return system theme when mode is system (dark)", () => {
      jest
        .spyOn(Appearance, "getColorScheme")
        .mockReturnValue("dark" as ColorSchemeName);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.mode).toBe("system");
      expect(result.current.resolvedTheme).toBe("dark");
    });

    it("should return system theme when mode is system (light)", () => {
      jest
        .spyOn(Appearance, "getColorScheme")
        .mockReturnValue("light" as ColorSchemeName);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.mode).toBe("system");
      expect(result.current.resolvedTheme).toBe("light");
    });

    it("should always be either light or dark, never undefined", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(["light", "dark"]).toContain(result.current.resolvedTheme);

      act(() => {
        result.current.setMode("light");
      });
      expect(["light", "dark"]).toContain(result.current.resolvedTheme);

      act(() => {
        result.current.setMode("dark");
      });
      expect(["light", "dark"]).toContain(result.current.resolvedTheme);

      act(() => {
        result.current.setMode("system");
      });
      expect(["light", "dark"]).toContain(result.current.resolvedTheme);
    });
  });

  describe("system theme change listener", () => {
    it("should register Appearance change listener on mount", () => {
      renderHook(() => useTheme(), { wrapper });

      expect(Appearance.addChangeListener).toHaveBeenCalled();
    });

    it("should clean up listener on unmount", () => {
      const mockRemove = jest.fn();
      jest.spyOn(Appearance, "addChangeListener").mockReturnValue({
        remove: mockRemove,
      });

      const { unmount } = renderHook(() => useTheme(), { wrapper });

      unmount();

      expect(mockRemove).toHaveBeenCalled();
    });
  });

  describe("context value stability", () => {
    it("should maintain setMode function reference stability", () => {
      const { result, rerender } = renderHook(() => useTheme(), { wrapper });

      const initialSetMode = result.current.setMode;

      rerender({});

      expect(result.current.setMode).toBe(initialSetMode);
    });

    it("should maintain toggleTheme function reference stability", () => {
      const { result, rerender } = renderHook(() => useTheme(), { wrapper });

      const initialToggleTheme = result.current.toggleTheme;

      rerender({});

      expect(result.current.toggleTheme).toBe(initialToggleTheme);
    });
  });

  describe("initial state", () => {
    it("should start with system mode by default", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.mode).toBe("system");
    });

    it("should have isLoaded as boolean", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(typeof result.current.isLoaded).toBe("boolean");
    });

    it("should have all required context properties", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current).toHaveProperty("mode");
      expect(result.current).toHaveProperty("resolvedTheme");
      expect(result.current).toHaveProperty("setMode");
      expect(result.current).toHaveProperty("toggleTheme");
      expect(result.current).toHaveProperty("isLoaded");
    });
  });
});
