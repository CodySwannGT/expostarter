# Sentry Integration Specification

This document outlines the implementation plan for integrating Sentry error monitoring into the Expo frontend application.

## Executive Summary

**Analysis Date**: 2026-01-15
**Current Status**: Plugin configured, initialization missing
**Dependencies Installed**: `@sentry/react-native@7.2.0`, `apollo-link-sentry@^4.0.0`
**Environment Variable**: `EXPO_PUBLIC_SENTRY_DSN` (configured in eas.json)

## Current State

The project has:

- Sentry Expo plugin configured in `app.json` (organization: `gunnertech`, project: `thumbwar-frontend`)
- `@sentry/react-native` and `apollo-link-sentry` dependencies installed
- `EXPO_PUBLIC_SENTRY_DSN` environment variable configured for all build profiles

Missing:

- Sentry initialization code
- Error boundary components
- Navigation tracking
- User identification
- Apollo Client integration
- Source maps upload configuration

## Critical Requirement: Graceful Degradation

**All Sentry functionality MUST fail silently when DSN is not configured.** This ensures:

1. Local development works without Sentry setup
2. CI/CD pipelines don't fail if DSN is missing
3. New developers can onboard without requiring Sentry credentials

## Implementation Tasks

### Task 1: Create Sentry Configuration Module

**File**: `lib/sentry/config.ts`

Create a centralized Sentry configuration module that handles graceful degradation:

```typescript
/**
 * Sentry configuration and initialization module.
 * Provides safe wrappers that fail silently when Sentry DSN is not configured.
 *
 * @module lib/sentry/config
 */
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

/** Environment configuration for Sentry */
interface SentryConfig {
  readonly dsn: string | undefined;
  readonly environment: string;
  readonly release: string;
  readonly isEnabled: boolean;
}

/**
 * Gets the current Sentry configuration from environment.
 * @returns Sentry configuration object
 */
function getSentryConfig(): SentryConfig {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  const version = Constants.expoConfig?.version ?? "unknown";
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber ??
    Constants.expoConfig?.android?.versionCode?.toString() ??
    "0";

  return {
    dsn,
    environment: __DEV__ ? "development" : "production",
    release: `thumbwar-frontend@${version}+${buildNumber}`,
    isEnabled: Boolean(dsn) && !__DEV__,
  };
}

/**
 * Initializes Sentry with graceful degradation.
 * Does nothing if EXPO_PUBLIC_SENTRY_DSN is not configured.
 */
export function initializeSentry(): void {
  const config = getSentryConfig();

  if (!config.dsn) {
    if (__DEV__) {
      console.log("[Sentry] DSN not configured, skipping initialization");
    }
    return;
  }

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,
    release: config.release,
    enabled: config.isEnabled,

    // Performance monitoring
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,

    // Enable native crash reporting
    enableNativeCrashHandling: true,

    // Attach screenshots to error reports (native only)
    attachScreenshot: true,

    // Attach view hierarchy to error reports
    attachViewHierarchy: true,

    // Debug mode for development
    debug: __DEV__,

    // Filter out noisy errors
    beforeSend(event) {
      // Filter out network errors that are expected
      if (event.exception?.values?.[0]?.type === "NetworkError") {
        return null;
      }
      return event;
    },
  });
}

/** Re-export Sentry for convenience */
export { Sentry };
```

### Task 2: Create Safe Sentry Utilities

**File**: `lib/sentry/utils.ts`

Create utility functions that safely interact with Sentry:

```typescript
/**
 * Safe Sentry utility functions.
 * All functions fail silently when Sentry is not initialized.
 *
 * @module lib/sentry/utils
 */
import * as Sentry from "@sentry/react-native";

/** User context for Sentry identification */
interface SentryUser {
  readonly id: string;
  readonly email?: string;
  readonly username?: string;
}

/**
 * Checks if Sentry is properly initialized.
 * @returns True if Sentry client is available and configured
 */
function isSentryEnabled(): boolean {
  try {
    const client = Sentry.getClient();
    return Boolean(client);
  } catch {
    return false;
  }
}

/**
 * Sets the current user for Sentry error tracking.
 * Call this after successful authentication.
 *
 * @param user - User information to attach to errors
 */
export function setSentryUser(user: SentryUser): void {
  if (!isSentryEnabled()) return;

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

/**
 * Clears the current user from Sentry.
 * Call this on logout.
 */
export function clearSentryUser(): void {
  if (!isSentryEnabled()) return;
  Sentry.setUser(null);
}

/**
 * Adds a breadcrumb for navigation events.
 * @param routeName - The name of the route navigated to
 * @param params - Optional route parameters
 */
export function addNavigationBreadcrumb(
  routeName: string,
  params?: Record<string, unknown>
): void {
  if (!isSentryEnabled()) return;

  Sentry.addBreadcrumb({
    category: "navigation",
    message: `Navigated to ${routeName}`,
    data: params,
    level: "info",
  });
}

/**
 * Captures an exception with optional context.
 * @param error - The error to capture
 * @param context - Optional additional context
 */
export function captureException(
  error: Error,
  context?: Record<string, unknown>
): void {
  if (!isSentryEnabled()) {
    console.error("[Sentry disabled]", error);
    return;
  }

  if (context) {
    Sentry.withScope(scope => {
      scope.setExtras(context);
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Captures a message with optional severity level.
 * @param message - The message to capture
 * @param level - Severity level (default: info)
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info"
): void {
  if (!isSentryEnabled()) {
    console.log(`[Sentry disabled] ${level}: ${message}`);
    return;
  }

  Sentry.captureMessage(message, level);
}

/**
 * Sets extra context data for the current scope.
 * @param key - Context key
 * @param value - Context value
 */
export function setExtraContext(key: string, value: unknown): void {
  if (!isSentryEnabled()) return;
  Sentry.setExtra(key, value);
}

/**
 * Sets a tag for filtering in Sentry dashboard.
 * @param key - Tag key
 * @param value - Tag value
 */
export function setTag(key: string, value: string): void {
  if (!isSentryEnabled()) return;
  Sentry.setTag(key, value);
}
```

### Task 3: Create Navigation Tracking Hook

**File**: `hooks/shared/useSentryNavigationTracking.ts`

Create a hook to track expo-router navigation:

```typescript
/**
 * Hook for tracking navigation events in Sentry.
 *
 * @module hooks/shared/useSentryNavigationTracking
 */
import { usePathname, useSegments } from "expo-router";
import { useEffect, useRef } from "react";

import { addNavigationBreadcrumb } from "@/lib/sentry/utils";

/**
 * Tracks navigation changes and sends breadcrumbs to Sentry.
 * Should be called once in the root layout.
 */
export function useSentryNavigationTracking(): void {
  const pathname = usePathname();
  const segments = useSegments();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      addNavigationBreadcrumb(pathname, {
        segments,
        previousRoute: previousPathname.current,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, segments]);
}
```

### Task 4: Create Error Boundary Component

**File**: `components/shared/ErrorBoundary/ErrorBoundary.tsx`

Create an error boundary that reports to Sentry:

```typescript
/**
 * Error boundary component that captures React errors and reports to Sentry.
 *
 * @module components/shared/ErrorBoundary
 */
import * as Sentry from "@sentry/react-native";
import { Component, ReactNode } from "react";
import { Text, View } from "react-native";

/** Props for the ErrorBoundary component */
interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

/** State for the ErrorBoundary component */
interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

/**
 * Error boundary that catches React errors and reports them to Sentry.
 * Displays a fallback UI when an error occurs.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Report to Sentry with component stack
    Sentry.withScope(scope => {
      scope.setExtra("componentStack", errorInfo.componentStack);
      Sentry.captureException(error);
    });
  }

  render(): ReactNode {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      return (
        fallback ?? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Something went wrong. Please restart the app.</Text>
          </View>
        )
      );
    }

    return children;
  }
}
```

**File**: `components/shared/ErrorBoundary/index.ts`

```typescript
export { ErrorBoundary } from "./ErrorBoundary";
```

### Task 5: Create Apollo Sentry Link

**File**: `lib/apollo/sentryLink.ts`

Integrate Sentry with Apollo Client for GraphQL error tracking:

```typescript
/**
 * Apollo Link that reports GraphQL errors to Sentry.
 *
 * @module lib/apollo/sentryLink
 */
import { ApolloLink } from "@apollo/client";
import SentryLink from "apollo-link-sentry";

/**
 * Creates an Apollo Link that reports GraphQL operations to Sentry.
 * Returns a pass-through link if Sentry DSN is not configured.
 *
 * @returns Apollo Link for Sentry integration
 */
export function createSentryLink(): ApolloLink {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  // Return pass-through link if Sentry is not configured
  if (!dsn) {
    return new ApolloLink((operation, forward) => forward(operation));
  }

  return new SentryLink({
    // Attach breadcrumbs for GraphQL operations
    attachBreadcrumbs: {
      includeQuery: true,
      includeVariables: true,
      includeFetchResult: true,
      includeError: true,
    },

    // Include operation context for debugging
    setTransaction: true,

    // Include fingerprint for grouping similar errors
    setFingerprint: true,
  });
}
```

### Task 6: Update Root Layout

**File**: `app/_layout.tsx`

Update the root layout to initialize Sentry and wrap with error boundary:

```typescript
/**
 * Root layout for Expo Router application.
 * Provides GluestackUIProvider, SafeAreaProvider, and Sentry to all routes.
 *
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
```

### Task 7: Configure Source Maps Upload

The Sentry plugin in `app.json` handles source maps for EAS builds automatically. No additional configuration needed since the plugin is already configured:

```json
[
  "@sentry/react-native/expo",
  {
    "organization": "gunnertech",
    "project": "thumbwar-frontend"
  }
]
```

For source maps to upload during EAS builds, ensure these secrets are configured in EAS:

- `SENTRY_AUTH_TOKEN` - Generate from Sentry Settings > Auth Tokens
- `SENTRY_ORG` - Organization slug (already set to `gunnertech`)
- `SENTRY_PROJECT` - Project slug (already set to `thumbwar-frontend`)

### Task 8: Add Sentry Testing Utilities

**File**: `lib/sentry/__mocks__/config.ts`

Create mock for testing:

```typescript
/**
 * Mock Sentry configuration for testing.
 *
 * @module lib/sentry/__mocks__/config
 */
export const initializeSentry = jest.fn();

export const Sentry = {
  init: jest.fn(),
  wrap: jest.fn((component: unknown) => component),
  setUser: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
  setExtra: jest.fn(),
  setTag: jest.fn(),
  withScope: jest.fn((callback: (scope: unknown) => void) =>
    callback({
      setExtras: jest.fn(),
      setExtra: jest.fn(),
    })
  ),
  getClient: jest.fn(() => null),
};
```

**File**: `lib/sentry/__mocks__/utils.ts`

```typescript
/**
 * Mock Sentry utilities for testing.
 *
 * @module lib/sentry/__mocks__/utils
 */
export const setSentryUser = jest.fn();
export const clearSentryUser = jest.fn();
export const addNavigationBreadcrumb = jest.fn();
export const captureException = jest.fn();
export const captureMessage = jest.fn();
export const setExtraContext = jest.fn();
export const setTag = jest.fn();
```

Update `jest.setup.js` to include:

```javascript
// Mock Sentry
jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
  wrap: jest.fn(component => component),
  setUser: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
  setExtra: jest.fn(),
  setTag: jest.fn(),
  withScope: jest.fn(callback =>
    callback({
      setExtras: jest.fn(),
      setExtra: jest.fn(),
    })
  ),
  getClient: jest.fn(() => null),
  SeverityLevel: {
    Fatal: "fatal",
    Error: "error",
    Warning: "warning",
    Info: "info",
    Debug: "debug",
  },
}));
```

## File Structure

After implementation, the following files will be created/modified:

```text
thumbwar-frontend/
├── lib/
│   ├── sentry/
│   │   ├── config.ts           # Sentry initialization
│   │   ├── utils.ts            # Safe utility functions
│   │   └── __mocks__/
│   │       ├── config.ts       # Test mock
│   │       └── utils.ts        # Test mock
│   └── apollo/
│       └── sentryLink.ts       # Apollo integration
├── hooks/
│   └── shared/
│       └── useSentryNavigationTracking.ts
├── components/
│   └── shared/
│       └── ErrorBoundary/
│           ├── ErrorBoundary.tsx
│           └── index.ts
├── app/
│   └── _layout.tsx             # Modified
└── jest.setup.js               # Modified
```

## Usage Examples

### Setting User After Login

```typescript
import { setSentryUser } from "@/lib/sentry/utils";

// After successful authentication
setSentryUser({
  id: user.id,
  email: user.email,
  username: user.displayName,
});
```

### Clearing User on Logout

```typescript
import { clearSentryUser } from "@/lib/sentry/utils";

// On logout
clearSentryUser();
```

### Manually Capturing Errors

```typescript
import { captureException, captureMessage } from "@/lib/sentry/utils";

try {
  await riskyOperation();
} catch (error) {
  captureException(error as Error, {
    context: "payment_processing",
    userId: user.id,
  });
}

// Capture a message
captureMessage("User completed onboarding", "info");
```

### Adding Context

```typescript
import { setExtraContext, setTag } from "@/lib/sentry/utils";

// Set feature flags or experiment context
setTag("experiment", "new_checkout_flow");
setExtraContext("cart_items", cartItems.length);
```

## Testing Checklist

- [ ] Verify app runs without `EXPO_PUBLIC_SENTRY_DSN` set
- [ ] Verify no console errors when Sentry is disabled
- [ ] Verify errors are captured when DSN is configured
- [ ] Verify navigation breadcrumbs appear in Sentry
- [ ] Verify user context is attached to errors
- [ ] Verify source maps are uploaded in EAS builds
- [ ] Verify Apollo GraphQL errors are tracked
- [ ] Verify ErrorBoundary catches and reports React errors
- [ ] Verify all unit tests pass with mocked Sentry

## Environment Variables Required

| Variable                  | Description             | Required |
| ------------------------- | ----------------------- | -------- |
| `EXPO_PUBLIC_SENTRY_DSN`  | Sentry project DSN      | No\*     |
| `SENTRY_AUTH_TOKEN`       | For source maps upload  | EAS only |
| `SENTRY_ORG`              | Organization slug       | EAS only |
| `SENTRY_PROJECT`          | Project slug            | EAS only |

\*App will function without Sentry DSN; monitoring will be disabled.

## Implementation Notes

1. **Order of Operations**: Sentry must be initialized before any other code runs. The call to `initializeSentry()` should be at module scope in `_layout.tsx`.

2. **Sentry.wrap()**: This wraps the root component and provides automatic error boundary for native crashes. It's safe to use even when Sentry is disabled.

3. **Sample Rates**: Production uses 0.2 (20%) trace sample rate to manage costs. Adjust based on traffic volume.

4. **Error Filtering**: The `beforeSend` hook filters out expected network errors. Customize based on your error patterns.

5. **Debug Mode**: `debug: __DEV__` enables verbose logging in development for troubleshooting.

## References

- [Sentry React Native Documentation](https://docs.sentry.io/platforms/react-native/)
- [Expo Sentry Setup Guide](https://docs.expo.dev/guides/using-sentry/)
- [apollo-link-sentry Documentation](https://github.com/DiederikvandenB/apollo-link-sentry)
- [Sentry Best Practices](https://docs.sentry.io/platforms/react-native/configuration/options/)
