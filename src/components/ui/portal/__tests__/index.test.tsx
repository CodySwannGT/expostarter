/**
 * Portal component exports test
 *
 * Verifies that the portal module correctly exports all required components
 * for scoped modal rendering within specific content areas.
 */

// Mock gluestack overlay to avoid native module issues in Jest
jest.mock("@gluestack-ui/core/overlay/creator", () => ({
  Overlay: jest.fn(),
}));

// Mock @gorhom/portal
jest.mock("@gorhom/portal", () => ({
  Portal: jest.fn(),
  PortalHost: jest.fn(),
  PortalProvider: jest.fn(),
}));

describe("Portal exports", () => {
  it("should export PLAYER_DETAIL_PORTAL constant with correct value", () => {
    // Import after mocks are set up
    const { PLAYER_DETAIL_PORTAL } = require("../index");
    expect(PLAYER_DETAIL_PORTAL).toBe("player-detail-portal");
  });

  it("should export Portal component", () => {
    const { Portal } = require("../index");
    expect(Portal).toBeDefined();
  });

  it("should export GorhomPortal component from @gorhom/portal", () => {
    const { GorhomPortal } = require("../index");
    expect(GorhomPortal).toBeDefined();
  });

  it("should export PortalHost component from @gorhom/portal", () => {
    const { PortalHost } = require("../index");
    expect(PortalHost).toBeDefined();
  });

  it("should export PortalProvider component from @gorhom/portal", () => {
    const { PortalProvider } = require("../index");
    expect(PortalProvider).toBeDefined();
  });
});
