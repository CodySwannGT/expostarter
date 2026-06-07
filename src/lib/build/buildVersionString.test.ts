/**
 * Tests for buildVersionString utility.
 * @module lib/build/buildVersionString.test
 */
import buildVersionString from "./buildVersionString";

describe("buildVersionString", () => {
  it("should build complete version string with all values present", () => {
    const result = buildVersionString({
      version: "7.5.0",
      environment: "staging",
      runtimeVersion: "1.0.28",
      nativeBuildVersion: "7000003",
    });

    expect(result).toBe("v7.5.0 staging 1.0.28 Build: 7000003");
  });

  it("should handle missing environment gracefully", () => {
    const result = buildVersionString({
      version: "7.5.0",
      environment: undefined,
      runtimeVersion: "1.0.28",
      nativeBuildVersion: "7000003",
    });

    expect(result).toBe("v7.5.0 1.0.28 Build: 7000003");
  });

  it("should handle missing runtimeVersion gracefully", () => {
    const result = buildVersionString({
      version: "7.5.0",
      environment: "staging",
      runtimeVersion: null,
      nativeBuildVersion: "7000003",
    });

    expect(result).toBe("v7.5.0 staging Build: 7000003");
  });

  it("should handle missing nativeBuildVersion gracefully", () => {
    const result = buildVersionString({
      version: "7.5.0",
      environment: "staging",
      runtimeVersion: "1.0.28",
      nativeBuildVersion: null,
    });

    expect(result).toBe("v7.5.0 staging 1.0.28");
  });

  it("should strip 'production' from environment display", () => {
    const result = buildVersionString({
      version: "7.5.0",
      environment: "production",
      runtimeVersion: "1.0.28",
      nativeBuildVersion: "7000003",
    });

    expect(result).toBe("v7.5.0 1.0.28 Build: 7000003");
  });

  it("should handle all values missing except version", () => {
    const result = buildVersionString({
      version: "7.5.0",
      environment: undefined,
      runtimeVersion: null,
      nativeBuildVersion: null,
    });

    expect(result).toBe("v7.5.0");
  });

  it("should include channel in debug info when provided", () => {
    const result = buildVersionString({
      version: "7.5.0",
      environment: "staging",
      runtimeVersion: "1.0.28",
      nativeBuildVersion: "7000003",
      channel: "staging",
    });

    expect(result).toBe("v7.5.0 staging 1.0.28 Build: 7000003 ch:staging");
  });

  it("should not include channel suffix when channel is null", () => {
    const result = buildVersionString({
      version: "7.5.0",
      environment: "staging",
      runtimeVersion: "1.0.28",
      nativeBuildVersion: "7000003",
      channel: null,
    });

    expect(result).toBe("v7.5.0 staging 1.0.28 Build: 7000003");
  });
});
