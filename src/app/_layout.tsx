/**
 * Root layout for Expo Router application.
 * Provides ThemeProvider, GluestackUIProvider, SafeAreaProvider, and Sentry
 * to all routes.
 *
 * This file serves as the entry point for the app and replaces the traditional
 * App.tsx file. All initialization code (fonts, splash screen, providers) goes here.
 * @see https://docs.expo.dev/router/advanced/root-layout
 * @module app/_layout
 */
import "@/global.css";

import ErrorBoundary from "@/components/molecules/ErrorBoundary";
// eslint-disable-next-line no-restricted-imports -- root bootstrap: the theme provider itself cannot be an atom; this is the single sanctioned @/components/ui import outside the atom layer
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useSafeAreaInsetSync } from "@/hooks/useSafeAreaInsetSync";
import { useSentryNavigationTracking } from "@/hooks/shared/useSentryNavigationTracking";
import { initializeSentry, Sentry } from "@/lib/sentry/config";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Initialize Sentry as early as possible
initializeSentry();

/** Screen options for the root Stack navigator */
const screenOptions = { headerShown: false } as const;

/**
 * Inner layout component that consumes the theme and applies it to the
 * design-system provider (GluestackUIProvider resolves the raw-palette CSS
 * variables per mode). Separated so hooks run inside the provider tree.
 * @returns The themed Stack navigator with navigation tracking
 */
function RootLayoutNav(): React.JSX.Element {
  const { resolvedTheme } = useTheme();
  useSentryNavigationTracking();
  // Runs inside SafeAreaProvider: captures the bottom inset for
  // portal-rendered sheets, which mount outside it and would read 0.
  useSafeAreaInsetSync();

  return (
    <GluestackUIProvider mode={resolvedTheme}>
      <Stack screenOptions={screenOptions} />
    </GluestackUIProvider>
  );
}

/**
 * Root layout component that wraps all routes with necessary providers.
 * @returns The root layout with Stack navigator and providers.
 */
function RootLayout(): React.JSX.Element {
  // Web: remove the parse-time splash (#app-splash in public/index.html —
  // the SPA template Expo builds index.html from) once React mounts, handing
  // off from the splash's First Contentful Paint to the live app (issue #25).
  // `.remove()` deletes the overlay outright so it can never intercept
  // clicks afterwards. No-op on native (no #app-splash, no document) and on
  // a page where the element is already gone (optional chain).
  //
  // If your app loads custom fonts, gate this on a fonts-ready signal that
  // ALWAYS settles — `const [loaded, error] = useFonts(...)`, gate on
  // `loaded || error !== null` — so a font failure can never strand the
  // overlay over the app.
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.getElementById("app-splash")?.remove();
    }
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootLayoutNav />
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

// Wrap with Sentry for automatic error boundary (native)
export default Sentry.wrap(RootLayout);
