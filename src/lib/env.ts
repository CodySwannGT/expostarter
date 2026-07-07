/**
 * Type-safe environment variable configuration.
 *
 * This module validates all environment variables at module load time,
 * providing type-safe access with full TypeScript inference.
 * @remarks
 * - All client-side variables MUST use the EXPO_PUBLIC_ prefix
 * - Variables are validated regardless of source (.env, EAS, CI/CD)
 * - Add new variables to the parsers below, then access via `env.VARIABLE_NAME`
 * - Validation is hand-rolled (enum/url/boolean-string checks) instead of
 *   using zod: importing zod here put ~370KB of minified validator runtime
 *   into every bundle's entry (Metro cannot tree-shake it) to validate four
 *   strings at startup. Feature code that needs rich schemas (e.g. forms via
 *   `@hookform/resolvers`) should still use zod — inside the feature, where
 *   only consumers of that feature pay for it.
 * @example
 * ```typescript
 * import { env } from "@/lib/env";
 *
 * const apiUrl = env.EXPO_PUBLIC_API_URL;
 * const isDev = env.EXPO_PUBLIC_APP_ENV === "dev";
 * ```
 * @see .claude/skills/expo-env-config/SKILL.md for patterns and best practices
 * @module
 */

/** A single validation failure: which variable and why. */
interface EnvIssue {
  /** The environment variable name. */
  readonly path: string;
  /** Human-readable failure reason. */
  readonly message: string;
}

/** Valid application environment identifiers. */
const APP_ENVS = ["dev", "staging", "production"] as const;

/** Application environment identifier union. */
type AppEnv = (typeof APP_ENVS)[number];

/**
 * Validated environment configuration shape.
 * @remarks
 * Add new environment variables here and validate them in {@link parseEnv}.
 * Properties are intentionally mutable — test suites stub values on the
 * shared `env` object (matching the previous zod-inferred type).
 */
export interface Env {
  /**
   * Application environment identifier.
   * Determines API endpoints, feature flags, and logging behavior.
   * Note: "dev" matches the AppEnvironment type used throughout the app.
   * Undefined indicates local development.
   */
  EXPO_PUBLIC_APP_ENV: AppEnv | undefined;

  /**
   * Backend API base URL.
   * Must be a valid URL. Defaults to localhost for development.
   */
  EXPO_PUBLIC_API_URL: string;

  /**
   * Sentry DSN for error tracking.
   * Required in production, optional in other environments.
   */
  EXPO_PUBLIC_SENTRY_DSN: string | undefined;

  /**
   * Enable debug mode.
   * Shows additional logging and developer tools.
   */
  EXPO_PUBLIC_DEBUG: boolean;
}

/**
 * Checks whether a value is a valid absolute URL.
 * @param value - The candidate URL string.
 * @returns True when `new URL(value)` parses.
 */
function isValidUrl(value: string): boolean {
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
}

/**
 * Validates the app-environment enum variable.
 * @param value - Raw process.env value.
 * @returns The issue, or undefined when valid/absent.
 */
function checkAppEnv(value: string | undefined): EnvIssue | undefined {
  return value === undefined || (APP_ENVS as readonly string[]).includes(value)
    ? undefined
    : {
        path: "EXPO_PUBLIC_APP_ENV",
        message: `Invalid enum value. Expected one of: ${APP_ENVS.join(" | ")}`,
      };
}

/**
 * Validates an optional URL variable.
 * @param name - The environment variable name (for the issue path).
 * @param value - Raw process.env value.
 * @returns The issue, or undefined when valid/absent.
 */
function checkUrl(
  name: string,
  value: string | undefined
): EnvIssue | undefined {
  return value === undefined || isValidUrl(value)
    ? undefined
    : { path: name, message: "Invalid URL" };
}

/**
 * Transforms string "true"/"false" to boolean.
 * Handles case-insensitive matching; absent values default to false.
 * @param value - Raw process.env value.
 * @returns The parsed boolean flag.
 */
function parseBooleanString(value: string | undefined): boolean {
  return (value ?? "false").toLowerCase() === "true";
}

/**
 * Parses and validates environment variables with helpful error messages.
 * @returns Validated environment configuration
 * @throws Error with formatted message listing all validation failures
 */
function parseEnv(): Env {
  const issues = [
    checkAppEnv(process.env.EXPO_PUBLIC_APP_ENV),
    checkUrl("EXPO_PUBLIC_API_URL", process.env.EXPO_PUBLIC_API_URL),
    checkUrl("EXPO_PUBLIC_SENTRY_DSN", process.env.EXPO_PUBLIC_SENTRY_DSN),
  ].filter((issue): issue is EnvIssue => issue !== undefined);

  if (issues.length > 0) {
    const formatted = issues
      .map(issue => `  - ${issue.path}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Environment validation failed:\n${formatted}\n\nEnsure all required EXPO_PUBLIC_* variables are set.`
    );
  }

  return {
    EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV as AppEnv | undefined,
    EXPO_PUBLIC_API_URL:
      process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000",
    EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
    EXPO_PUBLIC_DEBUG: parseBooleanString(process.env.EXPO_PUBLIC_DEBUG),
  };
}

/**
 * Validated environment configuration.
 * @remarks
 * Access environment variables through this object for type safety.
 * Validation occurs at module load time - if this module loads,
 * all variables are guaranteed to be valid.
 * @example
 * ```typescript
 * import { env } from "@/lib/env";
 *
 * if (env.EXPO_PUBLIC_APP_ENV === "production") {
 *   // Production-specific logic
 * }
 * ```
 */
export const env = parseEnv();
