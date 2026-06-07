/**
 * Sentry configuration and initialization module.
 * Provides safe wrappers that fail silently when Sentry DSN is not configured.
 * @module lib/sentry/config
 */
import * as Sentry from "@sentry/react-native";

import {
  type AppEnvironment,
  getBuildInfo,
  isLocalDevelopment,
} from "@/lib/build/info";
import { env } from "@/lib/env";

/** Environment configuration for Sentry */
interface SentryConfig {
  readonly dsn: string | undefined;
  readonly environment: AppEnvironment;
  readonly release: string;
  readonly isEnabled: boolean;
}

/**
 * Determines if Sentry should be enabled.
 * Enabled when DSN is configured AND running in a real build (not local development).
 * @param dsn - The Sentry DSN
 * @returns True if Sentry should be enabled
 */
function shouldEnableSentry(dsn: string | undefined): boolean {
  return Boolean(dsn) && !isLocalDevelopment();
}

/**
 * Gets the current Sentry configuration from environment.
 * @returns Sentry configuration object
 */
function getSentryConfig(): SentryConfig {
  const dsn = env.EXPO_PUBLIC_SENTRY_DSN;
  const buildInfo = getBuildInfo();

  return {
    dsn,
    environment: buildInfo.environment,
    release: buildInfo.sentryRelease,
    isEnabled: shouldEnableSentry(dsn),
  };
}

/**
 * Initializes Sentry with graceful degradation.
 * Does nothing if EXPO_PUBLIC_SENTRY_DSN is not configured.
 */
export function initializeSentry(): void {
  const config = getSentryConfig();
  const isLocalDev = isLocalDevelopment();

  if (!config.dsn) {
    if (isLocalDev) {
      console.log("[Sentry] DSN not configured, skipping initialization");
    }
    return;
  }

  if (!config.isEnabled) {
    if (isLocalDev) {
      console.log("[Sentry] Disabled for local development");
    }
    return;
  }

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,
    release: config.release,
    enabled: config.isEnabled,
    tracesSampleRate: config.environment === "production" ? 0.2 : 1.0,
    enableNativeCrashHandling: true,
    attachScreenshot: true,
    attachViewHierarchy: true,
    debug: config.environment !== "production",
    beforeSend(event) {
      const exceptionValue = event.exception?.values?.[0]?.value ?? "";
      const exceptionType = event.exception?.values?.[0]?.type ?? "";

      // Filter out network errors that are expected
      // React Native fetch failures come as TypeError with "Network request failed"
      // Axios failures come as AxiosError or Error with "Network Error"
      const isNetworkError =
        (exceptionType === "TypeError" &&
          exceptionValue.includes("Network request failed")) ||
        exceptionValue.includes("Network Error") ||
        exceptionValue.includes("Failed to fetch");

      if (isNetworkError) {
        return null;
      }
      return event;
    },
  });
}

export { Sentry };
