/**
 * Tests for Apollo Sentry link.
 * @module lib/apollo/sentryLink.test
 */
import { ApolloLink, Operation } from "@apollo/client";
import { SentryLink, GraphQLBreadcrumb } from "apollo-link-sentry";

import { env } from "@/lib/env";

import { createSentryLink } from "./sentryLink";

jest.mock("@/lib/env", () => ({
  env: {
    EXPO_PUBLIC_SENTRY_DSN: undefined,
    EXPO_PUBLIC_APP_ENV: "development",
    EXPO_PUBLIC_API_URL: "http://localhost:3000",
    EXPO_PUBLIC_DEBUG: false,
  },
}));

const mockEnv = jest.mocked(env);

/** Test constants */
const TEST_DSN = "https://test@sentry.io/123";
const FILTERED_VALUE = "[FILTERED]";
const TEST_EMAIL = "test@example.com";
const TEST_CREDENTIAL_VALUE = "testcredentialvalue";

/**
 * Mock operation factory for testing
 * @param overrides - Override properties for the mock operation
 * @returns A mock operation object
 */
function createMockOperation(overrides?: Partial<Operation>): Operation {
  return {
    operationName: "TestOperation",
    variables: {},
    query: {} as never,
    setContext: jest.fn(),
    getContext: jest.fn(),
    extensions: {},
    ...overrides,
  };
}

describe("createSentryLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnv.EXPO_PUBLIC_SENTRY_DSN = undefined;
  });

  it("should return a pass-through link when DSN is not configured", () => {
    const link = createSentryLink();

    expect(link).toBeInstanceOf(ApolloLink);
    expect(SentryLink).not.toHaveBeenCalled();
  });

  it("should forward operations through pass-through link", () => {
    const link = createSentryLink();
    const mockOperation = { operationName: "TestQuery" };
    const mockForward = jest.fn().mockReturnValue({ subscribe: jest.fn() });

    link.request(mockOperation as never, mockForward as never);

    expect(mockForward).toHaveBeenCalledWith(mockOperation);
  });

  it("should return a SentryLink when DSN is configured", () => {
    mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;

    const link = createSentryLink();

    expect(link).toBeInstanceOf(ApolloLink);
    expect(SentryLink).toHaveBeenCalledWith(
      expect.objectContaining({
        attachBreadcrumbs: expect.objectContaining({
          includeQuery: true,
          includeVariables: true,
          includeFetchResult: true,
          includeError: true,
        }),
      })
    );
  });

  it("should configure transaction and fingerprint options", () => {
    mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;

    createSentryLink();

    expect(SentryLink).toHaveBeenCalledWith(
      expect.objectContaining({
        setTransaction: true,
        setFingerprint: true,
      })
    );
  });

  it("should configure transform function for sensitive variables", () => {
    mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;

    createSentryLink();

    expect(SentryLink).toHaveBeenCalledWith(
      expect.objectContaining({
        attachBreadcrumbs: expect.objectContaining({
          transform: expect.any(Function),
        }),
      })
    );
  });

  describe("breadcrumb transform filtering", () => {
    /**
     * Helper to get the transform function from the last SentryLink call.
     * @returns The transform function configured in SentryLink
     */
    function getTransformFunction(): (
      breadcrumb: GraphQLBreadcrumb,
      operation: Operation
    ) => GraphQLBreadcrumb {
      const mockCalls = (SentryLink as unknown as jest.Mock).mock.calls;
      return mockCalls[0][0].attachBreadcrumbs.transform;
    }

    it("should filter out variables with sensitive names", () => {
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;
      createSentryLink();

      const transform = getTransformFunction();
      const breadcrumb: GraphQLBreadcrumb = {
        category: "graphql",
        message: "Login",
        data: {
          variables: { email: TEST_EMAIL, password: TEST_CREDENTIAL_VALUE },
        },
      };
      const operation = createMockOperation();

      const result = transform(breadcrumb, operation);

      expect(result.data?.variables).toEqual({
        email: TEST_EMAIL,
        password: FILTERED_VALUE,
      });
    });

    it("should filter out token variables", () => {
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;
      createSentryLink();

      const transform = getTransformFunction();
      const breadcrumb: GraphQLBreadcrumb = {
        category: "graphql",
        message: "RefreshToken",
        data: {
          variables: { refreshToken: "abc123", accessToken: "xyz789" },
        },
      };
      const operation = createMockOperation();

      const result = transform(breadcrumb, operation);

      expect(result.data?.variables).toEqual({
        refreshToken: FILTERED_VALUE,
        accessToken: FILTERED_VALUE,
      });
    });

    it("should filter out secret and apiKey variables", () => {
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;
      createSentryLink();

      const transform = getTransformFunction();
      const breadcrumb: GraphQLBreadcrumb = {
        category: "graphql",
        message: "CreateIntegration",
        data: {
          variables: {
            name: "MyIntegration",
            secret: "mysecret",
            apiKey: "key123",
          },
        },
      };
      const operation = createMockOperation();

      const result = transform(breadcrumb, operation);

      expect(result.data?.variables).toEqual({
        name: "MyIntegration",
        secret: FILTERED_VALUE,
        apiKey: FILTERED_VALUE,
      });
    });

    it("should handle breadcrumbs without variables", () => {
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;
      createSentryLink();

      const transform = getTransformFunction();
      const breadcrumb: GraphQLBreadcrumb = {
        category: "graphql",
        message: "GetUser",
        data: {
          query: "query GetUser { user { id } }",
        },
      };
      const operation = createMockOperation();

      const result = transform(breadcrumb, operation);

      expect(result.data).toEqual(breadcrumb.data);
    });

    it("should preserve non-sensitive variables", () => {
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;
      createSentryLink();

      const transform = getTransformFunction();
      const breadcrumb: GraphQLBreadcrumb = {
        category: "graphql",
        message: "UpdateProfile",
        data: {
          variables: { userId: "123", name: "John", age: 30 },
        },
      };
      const operation = createMockOperation();

      const result = transform(breadcrumb, operation);

      expect(result.data?.variables).toEqual({
        userId: "123",
        name: "John",
        age: 30,
      });
    });

    it("should handle breadcrumbs without variables in data", () => {
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;
      createSentryLink();

      const transform = getTransformFunction();
      const breadcrumb: GraphQLBreadcrumb = {
        category: "graphql",
        message: "SimpleQuery",
        data: {},
      };
      const operation = createMockOperation();

      const result = transform(breadcrumb, operation);

      expect(result.data).toEqual({});
    });
  });
});
