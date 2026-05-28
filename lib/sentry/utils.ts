/**
 * Safe Sentry utility functions.
 * All functions fail silently when Sentry is not initialized.
 * @module lib/sentry/utils
 */
import * as Sentry from "@sentry/react-native";

/** User context for Sentry identification */
export interface SentryUser {
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
