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
