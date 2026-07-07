/**
 * Unit tests for ThemeProvider persistence and system-event coverage
 *
 * Complements ThemeProvider.functions.test.tsx (kept separate for the
 * max-lines lint budget) with:
 * - Appearance change-listener re-resolution (light/dark/null events)
 * - Persisted theme loading (valid, invalid, and failing reads)
 * - Persistence write failures (swallowed by persistTheme)
 * - Default context no-ops outside the provider
 * @module providers/__tests__/ThemeProvider.persistence.test
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

describe("ThemeProvider persistence coverage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);

    jest
      .spyOn(Appearance, "getColorScheme")
      .mockReturnValue("dark" as ColorSchemeName);

    jest.spyOn(Appearance, "addChangeListener").mockReturnValue({
      remove: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Appearance.getColorScheme = originalGetColorScheme;
    Appearance.addChangeListener = originalAddChangeListener;
  });

  describe("system theme change events", () => {
    it("should re-resolve the theme when the Appearance listener fires", () => {
      let listener: (preferences: {
        colorScheme: ColorSchemeName;
      }) => void = () => {};
      jest
        .spyOn(Appearance, "addChangeListener")
        .mockImplementation(handler => {
          listener = handler;
          return { remove: jest.fn() };
        });

      const { result } = renderHook(() => useTheme(), { wrapper });

      // System mode resolving dark (getColorScheme mocked to dark).
      expect(result.current.resolvedTheme).toBe("dark");

      act(() => {
        listener({ colorScheme: "light" });
      });
      expect(result.current.resolvedTheme).toBe("light");

      // Null color scheme falls back to dark.
      act(() => {
        listener({ colorScheme: null as unknown as ColorSchemeName });
      });
      expect(result.current.resolvedTheme).toBe("dark");
    });
  });

  describe("persisted theme loading", () => {
    it("should restore a persisted dark mode", async () => {
      mockGetItem.mockResolvedValue("dark");

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Flush the async loadTheme effect.
      await act(async () => {});

      expect(result.current.isLoaded).toBe(true);
      expect(result.current.mode).toBe("dark");
    });

    it("should restore a persisted light mode", async () => {
      mockGetItem.mockResolvedValue("light");

      const { result } = renderHook(() => useTheme(), { wrapper });

      await act(async () => {});

      expect(result.current.isLoaded).toBe(true);
      expect(result.current.mode).toBe("light");
    });

    it("should restore a persisted system mode", async () => {
      mockGetItem.mockResolvedValue("system");

      const { result } = renderHook(() => useTheme(), { wrapper });

      await act(async () => {});

      expect(result.current.isLoaded).toBe(true);
      expect(result.current.mode).toBe("system");
    });

    it("should ignore an unrecognized persisted value", async () => {
      mockGetItem.mockResolvedValue("sepia");

      const { result } = renderHook(() => useTheme(), { wrapper });

      await act(async () => {});

      expect(result.current.isLoaded).toBe(true);
      expect(result.current.mode).toBe("system");
    });

    it("should fall back to the default mode when reading storage fails", async () => {
      mockGetItem.mockRejectedValue(new Error("storage unavailable"));

      const { result } = renderHook(() => useTheme(), { wrapper });

      await act(async () => {});

      expect(result.current.isLoaded).toBe(true);
      expect(result.current.mode).toBe("system");
    });
  });

  describe("theme persistence errors", () => {
    it("should still apply the mode when persisting fails", async () => {
      mockSetItem.mockRejectedValue(new Error("disk full"));

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setMode("light");
      });

      // Flush the rejected persistence promise (swallowed by persistTheme).
      await act(async () => {});

      expect(result.current.mode).toBe("light");
      expect(mockSetItem).toHaveBeenCalledWith("@themeMode", "light");
    });
  });

  describe("default context outside the provider", () => {
    it("should expose inert defaults when no provider is mounted", () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.mode).toBe("system");
      expect(result.current.resolvedTheme).toBe("light");
      expect(result.current.isLoaded).toBe(false);

      // The default setMode/toggleTheme are no-ops and must not throw.
      expect(() => {
        result.current.setMode("dark");
        result.current.toggleTheme();
      }).not.toThrow();
      expect(result.current.mode).toBe("system");
    });
  });
});
