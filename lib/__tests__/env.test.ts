/**
 * Tests for environment variable validation module.
 * @remarks
 * These tests verify Zod schema validation and transformation behavior.
 * Each test resets modules to ensure fresh validation on each run.
 */

describe("env", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("default values", () => {
    it("should use undefined APP_ENV when not set (indicates local development)", () => {
      const { env } = require("../env");

      expect(env.EXPO_PUBLIC_APP_ENV).toBeUndefined();
    });

    it("should use default API_URL of localhost", () => {
      const { env } = require("../env");

      expect(env.EXPO_PUBLIC_API_URL).toBe("http://localhost:3000");
    });

    it("should use default DEBUG of false", () => {
      const { env } = require("../env");

      expect(env.EXPO_PUBLIC_DEBUG).toBe(false);
    });

    it("should have undefined SENTRY_DSN by default", () => {
      const { env } = require("../env");

      expect(env.EXPO_PUBLIC_SENTRY_DSN).toBeUndefined();
    });
  });

  describe("valid values", () => {
    it("should accept valid APP_ENV values", () => {
      process.env.EXPO_PUBLIC_APP_ENV = "production";

      const { env } = require("../env");

      expect(env.EXPO_PUBLIC_APP_ENV).toBe("production");
    });

    it("should accept valid API_URL", () => {
      process.env.EXPO_PUBLIC_API_URL = "https://api.example.com";

      const { env } = require("../env");

      expect(env.EXPO_PUBLIC_API_URL).toBe("https://api.example.com");
    });

    it("should accept valid SENTRY_DSN", () => {
      process.env.EXPO_PUBLIC_SENTRY_DSN = "https://sentry.example.com/123";

      const { env } = require("../env");

      expect(env.EXPO_PUBLIC_SENTRY_DSN).toBe("https://sentry.example.com/123");
    });

    it("should transform DEBUG true string to boolean true", () => {
      process.env.EXPO_PUBLIC_DEBUG = "true";

      const { env } = require("../env");

      expect(env.EXPO_PUBLIC_DEBUG).toBe(true);
    });

    it("should transform DEBUG TRUE string to boolean true (case insensitive)", () => {
      process.env.EXPO_PUBLIC_DEBUG = "TRUE";

      const { env } = require("../env");

      expect(env.EXPO_PUBLIC_DEBUG).toBe(true);
    });

    it("should transform DEBUG false string to boolean false", () => {
      process.env.EXPO_PUBLIC_DEBUG = "false";

      const { env } = require("../env");

      expect(env.EXPO_PUBLIC_DEBUG).toBe(false);
    });
  });

  describe("invalid values", () => {
    it("should throw for invalid APP_ENV value", () => {
      process.env.EXPO_PUBLIC_APP_ENV = "invalid";

      expect(() => require("../env")).toThrow(/EXPO_PUBLIC_APP_ENV/);
    });

    it("should throw for invalid API_URL format", () => {
      process.env.EXPO_PUBLIC_API_URL = "not-a-url";

      expect(() => require("../env")).toThrow(/EXPO_PUBLIC_API_URL/);
    });

    it("should throw for invalid SENTRY_DSN format", () => {
      process.env.EXPO_PUBLIC_SENTRY_DSN = "not-a-url";

      expect(() => require("../env")).toThrow(/EXPO_PUBLIC_SENTRY_DSN/);
    });
  });

  describe("error messages", () => {
    it("should provide helpful error message on validation failure", () => {
      process.env.EXPO_PUBLIC_APP_ENV = "invalid";

      expect(() => require("../env")).toThrow(/Environment validation failed/);
    });
  });
});
