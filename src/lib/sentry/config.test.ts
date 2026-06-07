/**
 * Tests for Sentry configuration and initialization module.
 * @module lib/sentry/config.test
 */
import * as Sentry from "@sentry/react-native";

import { env } from "@/lib/env";

import { initializeSentry } from "./config";

jest.mock("@/lib/env", () => ({
  env: {
    EXPO_PUBLIC_APP_ENV: undefined,
    EXPO_PUBLIC_API_URL: "http://localhost:3000",
    EXPO_PUBLIC_SENTRY_DSN: undefined,
    EXPO_PUBLIC_DEBUG: false,
  },
}));

const mockEnv = jest.mocked(env);

const TEST_DSN = "https://test@sentry.io/123";
const SHOULD_INITIALIZE_SENTRY = "should initialize Sentry";

describe("initializeSentry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnv.EXPO_PUBLIC_SENTRY_DSN = undefined;
    mockEnv.EXPO_PUBLIC_APP_ENV = undefined;
  });

  describe("when DSN is not configured", () => {
    it("should not initialize Sentry", () => {
      initializeSentry();

      expect(Sentry.init).not.toHaveBeenCalled();
    });

    it("should not initialize Sentry when DSN is empty string", () => {
      // Empty string is falsy, should not initialize
      (mockEnv as { EXPO_PUBLIC_SENTRY_DSN: string }).EXPO_PUBLIC_SENTRY_DSN =
        "";

      initializeSentry();

      expect(Sentry.init).not.toHaveBeenCalled();
    });
  });

  describe("when running in local environment (EXPO_PUBLIC_APP_ENV not set)", () => {
    it("should not initialize Sentry even when DSN is configured", () => {
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;

      initializeSentry();

      expect(Sentry.init).not.toHaveBeenCalled();
    });

    it("should log message when DSN is not configured", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      initializeSentry();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Sentry] DSN not configured, skipping initialization"
      );
      consoleSpy.mockRestore();
    });

    it("should log message when DSN is configured but running locally", () => {
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      initializeSentry();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Sentry] Disabled for local development"
      );
      consoleSpy.mockRestore();
    });
  });

  describe("when running in dev environment", () => {
    beforeEach(() => {
      mockEnv.EXPO_PUBLIC_APP_ENV = "dev";
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;
    });

    it(SHOULD_INITIALIZE_SENTRY, () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledTimes(1);
    });

    it("should set environment to dev", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          environment: "dev",
        })
      );
    });

    it("should use full traces sample rate", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          tracesSampleRate: 1.0,
        })
      );
    });

    it("should enable debug mode", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          debug: true,
        })
      );
    });
  });

  describe("when running in staging environment", () => {
    beforeEach(() => {
      mockEnv.EXPO_PUBLIC_APP_ENV = "staging";
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;
    });

    it(SHOULD_INITIALIZE_SENTRY, () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledTimes(1);
    });

    it("should set environment to staging", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          environment: "staging",
        })
      );
    });

    it("should use full traces sample rate", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          tracesSampleRate: 1.0,
        })
      );
    });

    it("should enable debug mode", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          debug: true,
        })
      );
    });
  });

  describe("when running in production environment", () => {
    beforeEach(() => {
      mockEnv.EXPO_PUBLIC_APP_ENV = "production";
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;
    });

    it(SHOULD_INITIALIZE_SENTRY, () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledTimes(1);
    });

    it("should set environment to production", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          environment: "production",
        })
      );
    });

    it("should use reduced traces sample rate", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          tracesSampleRate: 0.2,
        })
      );
    });

    it("should disable debug mode", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          debug: false,
        })
      );
    });

    it("should not log when DSN is not configured in production", () => {
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = undefined;
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      initializeSentry();

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("common configuration", () => {
    beforeEach(() => {
      mockEnv.EXPO_PUBLIC_APP_ENV = "dev";
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;
    });

    it("should configure DSN", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          dsn: TEST_DSN,
        })
      );
    });

    it("should enable native crash handling", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          enableNativeCrashHandling: true,
        })
      );
    });

    it("should enable screenshot attachment", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          attachScreenshot: true,
        })
      );
    });

    it("should enable view hierarchy attachment", () => {
      initializeSentry();

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          attachViewHierarchy: true,
        })
      );
    });
  });

  describe("invalid environment values", () => {
    it("should treat invalid environment as local", () => {
      // @ts-expect-error - Testing invalid value handling
      mockEnv.EXPO_PUBLIC_APP_ENV = "invalid";
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;

      initializeSentry();

      expect(Sentry.init).not.toHaveBeenCalled();
    });
  });

  describe("beforeSend callback", () => {
    beforeEach(() => {
      mockEnv.EXPO_PUBLIC_APP_ENV = "dev";
      mockEnv.EXPO_PUBLIC_SENTRY_DSN = TEST_DSN;
    });

    it("should filter out React Native fetch network errors (TypeError with Network request failed)", () => {
      initializeSentry();

      const initCall = (Sentry.init as jest.Mock).mock.calls[0][0];
      const beforeSend = initCall.beforeSend;
      const networkErrorEvent = {
        exception: {
          values: [{ type: "TypeError", value: "Network request failed" }],
        },
      };

      expect(beforeSend(networkErrorEvent)).toBeNull();
    });

    it("should filter out axios network errors (Network Error message)", () => {
      initializeSentry();

      const initCall = (Sentry.init as jest.Mock).mock.calls[0][0];
      const beforeSend = initCall.beforeSend;
      const axiosNetworkErrorEvent = {
        exception: {
          values: [{ type: "AxiosError", value: "Network Error" }],
        },
      };

      expect(beforeSend(axiosNetworkErrorEvent)).toBeNull();
    });

    it("should filter out fetch API errors (Failed to fetch message)", () => {
      initializeSentry();

      const initCall = (Sentry.init as jest.Mock).mock.calls[0][0];
      const beforeSend = initCall.beforeSend;
      const fetchErrorEvent = {
        exception: {
          values: [{ type: "TypeError", value: "Failed to fetch" }],
        },
      };

      expect(beforeSend(fetchErrorEvent)).toBeNull();
    });

    it("should pass through non-network TypeErrors", () => {
      initializeSentry();

      const initCall = (Sentry.init as jest.Mock).mock.calls[0][0];
      const beforeSend = initCall.beforeSend;
      const otherErrorEvent = {
        exception: {
          values: [
            { type: "TypeError", value: "Cannot read property of null" },
          ],
        },
      };

      expect(beforeSend(otherErrorEvent)).toBe(otherErrorEvent);
    });

    it("should pass through events without exception", () => {
      initializeSentry();

      const initCall = (Sentry.init as jest.Mock).mock.calls[0][0];
      const beforeSend = initCall.beforeSend;
      const eventWithoutException = { message: "Test message" };

      expect(beforeSend(eventWithoutException)).toBe(eventWithoutException);
    });
  });
});
