/**
 * Type-safe environment variable configuration using Zod validation.
 *
 * This module validates all environment variables at module load time,
 * providing type-safe access with full TypeScript inference.
 * @remarks
 * - All client-side variables MUST use the EXPO_PUBLIC_ prefix
 * - Variables are validated regardless of source (.env, EAS, CI/CD)
 * - Add new variables to the schema below, then access via `env.VARIABLE_NAME`
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
import { z } from "zod";

/**
 * Transforms string "true"/"false" to boolean.
 * Handles case-insensitive matching.
 */
const booleanString = z
  .string()
  .default("false")
  .transform(v => v.toLowerCase() === "true");

/**
 * Environment variable schema.
 * @remarks
 * Add new environment variables here. Use appropriate Zod types:
 * - `z.string()` for required strings
 * - `z.string().optional()` for optional strings
 * - `z.url()` for URL validation
 * - `z.enum([...])` for constrained values
 * - `booleanString` for boolean flags from string values
 */
const envSchema = z.object({
  /**
   * Application environment identifier.
   * Determines API endpoints, feature flags, and logging behavior.
   * Note: "dev" matches the AppEnvironment type used throughout the app.
   */
  EXPO_PUBLIC_APP_ENV: z.enum(["dev", "staging", "production"]).optional(),

  /**
   * Backend API base URL.
   * Must be a valid URL. Defaults to localhost for development.
   */
  EXPO_PUBLIC_API_URL: z.url().optional().default("http://localhost:3000"),

  /**
   * Sentry DSN for error tracking.
   * Required in production, optional in other environments.
   */
  EXPO_PUBLIC_SENTRY_DSN: z.url().optional(),

  /**
   * Enable debug mode.
   * Shows additional logging and developer tools.
   */
  EXPO_PUBLIC_DEBUG: booleanString,
});

/**
 * Parses and validates environment variables with helpful error messages.
 * @returns Validated environment configuration
 * @throws Error with formatted message listing all validation failures
 */
function parseEnv(): z.infer<typeof envSchema> {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map(issue => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Environment validation failed:\n${formatted}\n\nEnsure all required EXPO_PUBLIC_* variables are set.`
    );
  }

  return result.data;
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

/**
 * Type representing the validated environment configuration.
 * Use this when typing functions that accept env config.
 */
export type Env = z.infer<typeof envSchema>;
