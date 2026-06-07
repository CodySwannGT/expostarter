/**
 * Centralized build information module.
 * Provides version, environment, and release information for use throughout the app.
 * @module lib/build/info
 */
import * as Application from "expo-application";
import * as Updates from "expo-updates";

import { env } from "@/lib/env";
// package.json lives at the project root, outside the `@/` (src) alias scope.
import { version } from "../../../package.json";

import buildVersionString from "./buildVersionString";

/** Valid application environments */
export type AppEnvironment = "local" | "dev" | "staging" | "production";

/** OTA debug information from expo-updates */
export interface OtaDebugInfo {
  readonly isEnabled: boolean;
  readonly channel: string | null;
  readonly runtimeVersion: string | null;
  readonly isEmbeddedLaunch: boolean;
  readonly updateId: string | null;
}

/** Complete build information */
export interface BuildInfo {
  /** App version from package.json (e.g., "7.5.2") */
  readonly version: string;
  /** Current environment (local, dev, staging, production) */
  readonly environment: AppEnvironment;
  /** Native build version code (e.g., "7005002") */
  readonly nativeBuildVersion: string | null;
  /** Expo runtime version for OTA compatibility (e.g., "1.0.0") */
  readonly runtimeVersion: string | null;
  /** EAS Update channel */
  readonly channel: string | null;
  /** Sentry release identifier (e.g., "your-project@7.5.2+7005002") */
  readonly sentryRelease: string;
  /** Human-readable version string for display (e.g., "v7.5.2 dev 1.0.0 Build: 7005002") */
  readonly displayString: string;
  /** Debug string with channel info (e.g., "v7.5.2 dev 1.0.0 Build: 7005002 ch:dev") */
  readonly debugString: string;
  /** OTA debug information */
  readonly ota: OtaDebugInfo;
}

/** Application identifier for Sentry releases */
const APP_IDENTIFIER = "your-project";

/**
 * Gets the application environment from EXPO_PUBLIC_APP_ENV.
 * Returns "local" if not set (indicating local development via expo start).
 * @returns The current application environment
 */
export function getAppEnvironment(): AppEnvironment {
  const appEnv = env.EXPO_PUBLIC_APP_ENV;
  const validEnvironments: readonly AppEnvironment[] = [
    "dev",
    "staging",
    "production",
  ];

  if (appEnv && validEnvironments.includes(appEnv as AppEnvironment)) {
    return appEnv as AppEnvironment;
  }

  return "local";
}

/**
 * Determines if the app is running in local development mode.
 * @returns True if running locally via expo start
 */
export function isLocalDevelopment(): boolean {
  return getAppEnvironment() === "local";
}

/**
 * Gets OTA debug information from expo-updates.
 * @returns OTA debug info object
 */
function getOtaDebugInfo(): OtaDebugInfo {
  return {
    isEnabled: Updates.isEnabled,
    channel: Updates.channel ?? null,
    runtimeVersion: Updates.runtimeVersion ?? null,
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
    updateId: Updates.updateId ?? null,
  };
}

/**
 * Builds the Sentry release identifier.
 * Format: {app-identifier}@{version}+{buildNumber}
 * @param appVersion - The app version
 * @param buildNumber - The native build number
 * @returns Sentry release string
 */
function buildSentryRelease(
  appVersion: string,
  buildNumber: string | null
): string {
  const build = buildNumber ?? "0";
  return `${APP_IDENTIFIER}@${appVersion}+${build}`;
}

/**
 * Gets complete build information for the application.
 * This is the primary export - use this to get all build-related info.
 * @returns Complete build information object
 */
export function getBuildInfo(): BuildInfo {
  const environment = getAppEnvironment();
  const nativeBuildVersion = Application.nativeBuildVersion;
  const runtimeVersion = Updates.runtimeVersion ?? null;
  const channel = Updates.channel ?? null;

  const displayString = buildVersionString({
    version,
    environment,
    runtimeVersion,
    nativeBuildVersion,
  });

  const debugString = buildVersionString({
    version,
    environment,
    runtimeVersion,
    nativeBuildVersion,
    channel,
  });

  return {
    version,
    environment,
    nativeBuildVersion,
    runtimeVersion,
    channel,
    sentryRelease: buildSentryRelease(version, nativeBuildVersion),
    displayString,
    debugString,
    ota: getOtaDebugInfo(),
  };
}

/**
 * Formats OTA debug info for display in an alert.
 * @param info - Build info object
 * @returns Formatted string for display
 */
export function formatOtaDebugAlert(info: BuildInfo): string {
  return (
    `Version: ${info.debugString}\n\n` +
    `isEnabled: ${info.ota.isEnabled}\n` +
    `channel: ${info.ota.channel ?? "null"}\n` +
    `runtimeVersion: ${info.ota.runtimeVersion ?? "null"}\n` +
    `isEmbeddedLaunch: ${info.ota.isEmbeddedLaunch}\n` +
    `updateId: ${info.ota.updateId ?? "null"}`
  );
}
