/**
 * Error boundary component that captures React errors and reports to Sentry.
 * Uses Sentry's built-in ErrorBoundary to avoid class components.
 * @module components/shared/ErrorBoundary
 */
import * as Sentry from "@sentry/react-native";
import { ReactElement, ReactNode } from "react";
import { Text, View } from "react-native";

/** Props for the ErrorBoundary component */
interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactElement;
}

/**
 * Default fallback styles using inline styles instead of Tailwind/NativeWind.
 * @remarks
 * Inline styles are intentional here to ensure the error fallback UI renders
 * correctly even if the styling system (NativeWind/Tailwind) fails to load
 * or encounters an error itself. This provides a reliable last-resort UI.
 */
const defaultFallbackStyles = {
  container: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 20,
  },
  text: {
    textAlign: "center" as const,
    fontSize: 16,
  },
};

/**
 * Default fallback component shown when an error occurs.
 * Exported for testing purposes.
 * @returns Default error fallback UI
 */
export function DefaultFallback(): React.JSX.Element {
  return (
    <View style={defaultFallbackStyles.container}>
      <Text style={defaultFallbackStyles.text}>
        Something went wrong. Please restart the app.
      </Text>
    </View>
  );
}

/**
 * Error boundary that catches React errors and reports them to Sentry.
 * Displays a fallback UI when an error occurs.
 * @remarks
 * This component is intentionally not memoized because:
 * 1. Error boundaries sit at the top of component trees and rarely re-render
 * 2. Memoization adds unnecessary overhead for a component with simple props
 * 3. The underlying Sentry.ErrorBoundary handles its own optimization
 * @param props - Component props
 * @param props.children - Child components to render
 * @param props.fallback - Optional custom fallback UI
 * @returns The children or fallback UI
 */
export function ErrorBoundary({
  children,
  fallback,
}: ErrorBoundaryProps): React.JSX.Element {
  return (
    <Sentry.ErrorBoundary fallback={fallback ?? <DefaultFallback />}>
      {children}
    </Sentry.ErrorBoundary>
  );
}
