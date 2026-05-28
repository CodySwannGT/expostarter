/**
 * Apollo Link that reports GraphQL errors to Sentry.
 * @module lib/apollo/sentryLink
 */
import { ApolloLink, Operation } from "@apollo/client";
import { Breadcrumb } from "@sentry/core";
import { SentryLink, GraphQLBreadcrumb } from "apollo-link-sentry";

import { env } from "@/lib/env";

/**
 * List of variable names that should be filtered from Sentry reports.
 * These patterns match common sensitive field names (case-insensitive).
 */
const SENSITIVE_VARIABLE_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /apiKey/i,
  /api_key/i,
  /authorization/i,
  /credential/i,
  /private/i,
];

/** Placeholder value used to replace filtered sensitive data */
const FILTERED_VALUE = "[FILTERED]";

/**
 * Checks if a variable name matches any sensitive patterns.
 * @param variableName - The name of the variable to check
 * @returns True if the variable is sensitive and should be filtered
 */
function isSensitiveVariable(variableName: string): boolean {
  return SENSITIVE_VARIABLE_PATTERNS.some(pattern =>
    pattern.test(variableName)
  );
}

/**
 * Filters sensitive variables from an object.
 * @param variables - The variables object to filter
 * @returns A new object with sensitive values replaced
 */
function filterVariables(
  variables: Record<string, unknown>
): Record<string, unknown> {
  return Object.entries(variables).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: isSensitiveVariable(key) ? FILTERED_VALUE : value,
    }),
    {} as Record<string, unknown>
  );
}

/**
 * Transform function that filters sensitive data from Sentry breadcrumbs.
 * @param breadcrumb - The GraphQL breadcrumb to transform
 * @param _operation - The Apollo operation (unused)
 * @returns The filtered breadcrumb
 */
function transformBreadcrumb(
  breadcrumb: GraphQLBreadcrumb,
  _operation: Operation
): Breadcrumb {
  const filteredData = breadcrumb.data?.variables
    ? {
        ...breadcrumb.data,
        variables: filterVariables(
          breadcrumb.data.variables as Record<string, unknown>
        ),
      }
    : breadcrumb.data;

  return {
    ...breadcrumb,
    data: filteredData,
  };
}

/**
 * Creates an Apollo Link that reports GraphQL operations to Sentry.
 * Returns a pass-through link if Sentry DSN is not configured.
 * @remarks
 * Sensitive variables (passwords, tokens, secrets, API keys) are automatically
 * filtered before being sent to Sentry to prevent PII/credential exposure.
 * @returns Apollo Link for Sentry integration
 */
export function createSentryLink(): ApolloLink {
  const dsn = env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    return new ApolloLink((operation, forward) => forward(operation));
  }

  return new SentryLink({
    attachBreadcrumbs: {
      includeQuery: true,
      includeVariables: true,
      includeFetchResult: true,
      includeError: true,
      transform: transformBreadcrumb,
    },
    setTransaction: true,
    setFingerprint: true,
  });
}
