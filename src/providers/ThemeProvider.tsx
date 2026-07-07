/**
 * @file ThemeProvider.tsx
 * @description Manages app-wide theming including dark/light mode and color scheme.
 * Persists user preference to AsyncStorage and responds to system theme changes.
 * @module providers/ThemeProvider
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Appearance } from "react-native";

/**
 * Available theme modes for the application
 * @remarks "system" follows the device's color scheme preference
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * Props for the ThemeProvider component
 */
interface Props {
  children: React.ReactNode;
}

/**
 * Context value providing theme state and controls
 * @remarks resolvedTheme converts "system" mode to actual light/dark value
 */
interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isLoaded: boolean;
}

const defaultThemeContextValue: ThemeContextValue = {
  mode: "system",
  resolvedTheme: "light",
  setMode: () => {},
  toggleTheme: () => {},
  isLoaded: false,
};

const ThemeContext = React.createContext<ThemeContextValue>(
  defaultThemeContextValue
);

/**
 * Hook exposing the theme context (mode, resolved theme, and controls).
 * @returns The current theme context value
 */
export const useTheme = () => {
  return React.useContext(ThemeContext);
};

const STORAGE_KEY = "@themeMode";
const DEFAULT_MODE: ThemeMode = "system";

/**
 * Gets the current system color scheme preference
 * @returns The system's current theme preference, defaulting to "dark" if null
 */
function getSystemTheme(): "light" | "dark" {
  const systemScheme = Appearance.getColorScheme();
  return systemScheme === "light" ? "light" : "dark";
}

/**
 * Provider component that manages theme state and persistence
 * @param root0 - Component props
 * @param root0.children - Child components to render within the theme context
 * @remarks Loads persisted theme on mount and syncs with system theme changes
 */
const ThemeProvider = ({ children }: Props) => {
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
    getSystemTheme()
  );

  const resolvedTheme = useMemo(() => {
    if (mode === "system") {
      return systemTheme;
    }
    return mode;
  }, [mode, systemTheme]);

  // Persist theme changes
  const persistTheme = useCallback(async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
    } catch (_error) {
      // Ignore error
    }
  }, []);

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setModeState(newMode);
      persistTheme(newMode);
    },
    [persistTheme]
  );

  const toggleTheme = useCallback(() => {
    if (mode === "system") {
      // If currently system, switch to opposite of current resolved theme
      setMode(resolvedTheme === "dark" ? "light" : "dark");
    } else if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, [mode, resolvedTheme, setMode]);

  const value: ThemeContextValue = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
      toggleTheme,
      isLoaded,
    }),
    [mode, resolvedTheme, setMode, toggleTheme, isLoaded]
  );

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme === "light" ? "light" : "dark");
    });

    return () => subscription?.remove();
  }, []);

  // Load persisted theme on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
        if (
          savedMode &&
          (savedMode === "light" ||
            savedMode === "dark" ||
            savedMode === "system")
        ) {
          setModeState(savedMode as ThemeMode);
        }
      } catch (_error) {
        // Ignore error, use default
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
