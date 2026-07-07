/**
 * Error boundary component that captures React errors and reports to Sentry.
 * Uses Sentry's built-in ErrorBoundary to avoid class components.
 * @module components/molecules/ErrorBoundary/ErrorBoundaryContainer
 */
import * as Sentry from "@sentry/react-native";
import { ReactElement, ReactNode } from "react";

import ErrorBoundaryView from "./ErrorBoundaryView";

/** Props for the ErrorBoundary component */
interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactElement;
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
function ErrorBoundaryContainer({
  children,
  fallback,
}: ErrorBoundaryProps): React.JSX.Element {
  return (
    <Sentry.ErrorBoundary fallback={fallback ?? <ErrorBoundaryView />}>
      {children}
    </Sentry.ErrorBoundary>
  );
}

export default ErrorBoundaryContainer;
