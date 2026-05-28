/**
 * Build version string utility.
 * Constructs a formatted version string for display in the app.
 * @module lib/build/buildVersionString
 */

/** Parameters for building the version string */
interface BuildVersionStringParams {
  /** App version from package.json */
  readonly version: string;
  /** Environment name (dev, staging, production) */
  readonly environment: string | undefined;
  /** Runtime version for OTA compatibility */
  readonly runtimeVersion: string | null;
  /** Native build version code */
  readonly nativeBuildVersion: string | null;
  /** EAS Update channel (optional, for debugging) */
  readonly channel?: string | null;
}

/**
 * Builds a formatted version string for display in the app.
 * Format: v{version} {env} {runtimeVersion} Build: {buildVersion} [ch:{channel}]
 * @param params - Version string parameters
 * @param params.version - The app version number
 * @param params.environment - The current environment name
 * @param params.runtimeVersion - The Expo runtime version
 * @param params.nativeBuildVersion - The native build version number
 * @param params.channel - The release channel name
 * @returns Formatted version string
 */
function buildVersionString({
  version,
  environment,
  runtimeVersion,
  nativeBuildVersion,
  channel,
}: BuildVersionStringParams): string {
  const parts: readonly string[] = [
    `v${version}`,
    ...getEnvironmentPart(environment),
    ...getRuntimeVersionPart(runtimeVersion),
    ...getNativeBuildPart(nativeBuildVersion),
    ...getChannelPart(channel),
  ];

  return parts.join(" ");
}

/**
 * Gets the environment part of the version string.
 * Strips "production" for cleaner display.
 * @param environment - The environment name
 * @returns Array with environment string or empty array
 */
function getEnvironmentPart(environment: string | undefined): readonly string[] {
  const displayEnv = (environment ?? "").replace(/production/g, "").trim();
  return displayEnv ? [displayEnv] : [];
}

/**
 * Gets the runtime version part of the version string.
 * @param runtimeVersion - The runtime version
 * @returns Array with runtime version or empty array
 */
function getRuntimeVersionPart(runtimeVersion: string | null): readonly string[] {
  return runtimeVersion ? [runtimeVersion] : [];
}

/**
 * Gets the native build part of the version string.
 * @param nativeBuildVersion - The native build version
 * @returns Array with formatted build string or empty array
 */
function getNativeBuildPart(nativeBuildVersion: string | null): readonly string[] {
  return nativeBuildVersion ? [`Build: ${nativeBuildVersion}`] : [];
}

/**
 * Gets the channel part of the version string.
 * @param channel - The channel name
 * @returns Array with formatted channel string or empty array
 */
function getChannelPart(channel: string | null | undefined): readonly string[] {
  return channel ? [`ch:${channel}`] : [];
}

export default buildVersionString;
