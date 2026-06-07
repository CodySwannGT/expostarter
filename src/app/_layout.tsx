/**
 * Root layout for Expo Router application.
 * Provides GluestackUIProvider, SafeAreaProvider, and Sentry to all routes.
 *
 * This file serves as the entry point for the app and replaces the traditional
 * App.tsx file. All initialization code (fonts, splash screen, providers) goes here.
 * @see https://docs.expo.dev/router/advanced/root-layout
 * @module app/_layout
 */
import "@/global.css";

import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useSentryNavigationTracking } from "@/hooks/shared/useSentryNavigationTracking";
import { initializeSentry, Sentry } from "@/lib/sentry/config";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Initialize Sentry as early as possible
initializeSentry();

/** Screen options for the root Stack navigator */
const screenOptions = { headerShown: false } as const;

/**
 * Inner layout component that uses navigation tracking.
 * Separated to ensure hooks are called within the router context.
 * @returns The Stack navigator with navigation tracking
 */
function RootLayoutNav(): React.JSX.Element {
  useSentryNavigationTracking();

  return <Stack screenOptions={screenOptions} />;
}

/**
 * Root layout component that wraps all routes with necessary providers.
 * @returns The root layout with Stack navigator and providers.
 */
function RootLayout(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GluestackUIProvider>
          <RootLayoutNav />
        </GluestackUIProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

// Wrap with Sentry for automatic error boundary (native)
export default Sentry.wrap(RootLayout);
