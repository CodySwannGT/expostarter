/**
 * Tests for centralized build information module.
 * @module lib/build/info.test
 */
import { env } from "@/lib/env";

import {
  formatOtaDebugAlert,
  getAppEnvironment,
  getBuildInfo,
  isLocalDevelopment,
} from "./info";

jest.mock("@/lib/env", () => ({
  env: {
    EXPO_PUBLIC_APP_ENV: undefined,
    EXPO_PUBLIC_API_URL: "http://localhost:3000",
    EXPO_PUBLIC_SENTRY_DSN: undefined,
    EXPO_PUBLIC_DEBUG: false,
  },
}));

const mockEnv = jest.mocked(env);

describe("getAppEnvironment", () => {
  beforeEach(() => {
    mockEnv.EXPO_PUBLIC_APP_ENV = undefined;
  });

  it("should return 'local' when EXPO_PUBLIC_APP_ENV is not set", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = undefined;

    expect(getAppEnvironment()).toBe("local");
  });

  it("should return 'dev' when EXPO_PUBLIC_APP_ENV is 'dev'", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = "dev";

    expect(getAppEnvironment()).toBe("dev");
  });

  it("should return 'staging' when EXPO_PUBLIC_APP_ENV is 'staging'", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = "staging";

    expect(getAppEnvironment()).toBe("staging");
  });

  it("should return 'production' when EXPO_PUBLIC_APP_ENV is 'production'", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = "production";

    expect(getAppEnvironment()).toBe("production");
  });

  it("should return 'local' for invalid environment values", () => {
    // @ts-expect-error - Testing invalid value handling
    mockEnv.EXPO_PUBLIC_APP_ENV = "invalid";

    expect(getAppEnvironment()).toBe("local");
  });
});

describe("isLocalDevelopment", () => {
  beforeEach(() => {
    mockEnv.EXPO_PUBLIC_APP_ENV = undefined;
  });

  it("should return true when environment is local", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = undefined;

    expect(isLocalDevelopment()).toBe(true);
  });

  it("should return false when environment is dev", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = "dev";

    expect(isLocalDevelopment()).toBe(false);
  });

  it("should return false when environment is production", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = "production";

    expect(isLocalDevelopment()).toBe(false);
  });
});

describe("getBuildInfo", () => {
  beforeEach(() => {
    mockEnv.EXPO_PUBLIC_APP_ENV = undefined;
  });

  it("should return complete build info object", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = "dev";

    const info = getBuildInfo();

    expect(info).toHaveProperty("version");
    expect(info).toHaveProperty("environment", "dev");
    expect(info).toHaveProperty("nativeBuildVersion");
    expect(info).toHaveProperty("runtimeVersion");
    expect(info).toHaveProperty("channel");
    expect(info).toHaveProperty("sentryRelease");
    expect(info).toHaveProperty("displayString");
    expect(info).toHaveProperty("debugString");
    expect(info).toHaveProperty("ota");
  });

  it("should build correct sentry release format", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = "dev";

    const info = getBuildInfo();

    // Format: your-project@{version}+{buildNumber}
    // buildNumber can be numeric or "mock" in test environment
    expect(info.sentryRelease).toMatch(/^your-project@[\d.]+\+.+$/);
  });

  it("should include version in display string", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = "staging";

    const info = getBuildInfo();

    expect(info.displayString).toContain("v");
    expect(info.displayString).toContain("staging");
  });

  it("should include OTA debug info", () => {
    const info = getBuildInfo();

    expect(info.ota).toHaveProperty("isEnabled");
    expect(info.ota).toHaveProperty("channel");
    expect(info.ota).toHaveProperty("runtimeVersion");
    expect(info.ota).toHaveProperty("isEmbeddedLaunch");
    expect(info.ota).toHaveProperty("updateId");
  });
});

describe("formatOtaDebugAlert", () => {
  it("should format OTA debug info for display", () => {
    const mockInfo = {
      version: "7.5.2",
      environment: "dev" as const,
      nativeBuildVersion: "7005002",
      runtimeVersion: "1.0.0",
      channel: "dev",
      sentryRelease: "your-project@7.5.2+7005002",
      displayString: "v7.5.2 dev 1.0.0 Build: 7005002",
      debugString: "v7.5.2 dev 1.0.0 Build: 7005002 ch:dev",
      ota: {
        isEnabled: true,
        channel: "dev",
        runtimeVersion: "1.0.0",
        isEmbeddedLaunch: false,
        updateId: "test-update-id",
      },
    };

    const result = formatOtaDebugAlert(mockInfo);

    expect(result).toContain("Version: v7.5.2 dev 1.0.0 Build: 7005002 ch:dev");
    expect(result).toContain("isEnabled: true");
    expect(result).toContain("channel: dev");
    expect(result).toContain("runtimeVersion: 1.0.0");
    expect(result).toContain("isEmbeddedLaunch: false");
    expect(result).toContain("updateId: test-update-id");
  });

  it("should handle null values in OTA info", () => {
    const mockInfo = {
      version: "7.5.2",
      environment: "local" as const,
      nativeBuildVersion: null,
      runtimeVersion: null,
      channel: null,
      sentryRelease: "your-project@7.5.2+0",
      displayString: "v7.5.2",
      debugString: "v7.5.2",
      ota: {
        isEnabled: false,
        channel: null,
        runtimeVersion: null,
        isEmbeddedLaunch: true,
        updateId: null,
      },
    };

    const result = formatOtaDebugAlert(mockInfo);

    expect(result).toContain("channel: null");
    expect(result).toContain("runtimeVersion: null");
    expect(result).toContain("updateId: null");
  });
});

describe("getBuildInfo edge cases", () => {
  beforeEach(() => {
    mockEnv.EXPO_PUBLIC_APP_ENV = undefined;
  });

  it("should use fallback for null native build version in sentry release", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = "dev";

    const info = getBuildInfo();

    // Even with null nativeBuildVersion, sentryRelease should have a fallback
    expect(info.sentryRelease).toContain("+");
  });

  it("should handle production environment stripping in display string", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = "production";

    const info = getBuildInfo();

    // Production should be stripped from display
    expect(info.displayString).not.toContain("production");
    expect(info.environment).toBe("production");
  });

  it("should handle undefined expo-updates values with null fallbacks", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = "dev";

    const info = getBuildInfo();

    // These should either be the mock values or null fallbacks
    expect(info.runtimeVersion).toBeDefined();
    expect(info.channel).toBeDefined();
    expect(info.ota.channel).toBeDefined();
    expect(info.ota.runtimeVersion).toBeDefined();
    expect(info.ota.updateId).toBeDefined();
  });

  it("should build sentry release with fallback when nativeBuildVersion is null", () => {
    mockEnv.EXPO_PUBLIC_APP_ENV = "staging";

    const info = getBuildInfo();

    // sentryRelease should always have format: your-project@{version}+{build}
    expect(info.sentryRelease).toContain("your-project@");
    expect(info.sentryRelease).toContain("+");
  });
});

describe("getBuildInfo with undefined expo values", () => {
  beforeEach(() => {
    jest.resetModules();
    mockEnv.EXPO_PUBLIC_APP_ENV = "dev";
  });

  it("should use null fallbacks when expo-updates returns undefined", () => {
    // Mock expo-updates to return undefined values
    jest.doMock("expo-updates", () => ({
      isEnabled: false,
      channel: undefined,
      runtimeVersion: undefined,
      isEmbeddedLaunch: true,
      updateId: undefined,
    }));

    // Mock expo-application to return null
    jest.doMock("expo-application", () => ({
      nativeBuildVersion: null,
    }));

    jest.isolateModules(() => {
      const { getBuildInfo: getBuildInfoIsolated } = require("./info");
      const info = getBuildInfoIsolated();

      expect(info.runtimeVersion).toBeNull();
      expect(info.channel).toBeNull();
      expect(info.ota.channel).toBeNull();
      expect(info.ota.runtimeVersion).toBeNull();
      expect(info.ota.updateId).toBeNull();
      expect(info.sentryRelease).toContain("+0");
    });
  });
});
