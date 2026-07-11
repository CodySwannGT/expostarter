// @ts-nocheck
/**
 * Portal component exports test
 *
 * Verifies the portal module exports the Portal wrapper. Under gluestack-ui v5
 * the portal is a thin wrapper over the core Overlay (no @gorhom/portal, no
 * PLAYER_DETAIL_PORTAL/GorhomPortal/PortalHost/PortalProvider re-exports).
 */

// Mock gluestack overlay to avoid native module issues in Jest
jest.mock("@gluestack-ui/core/overlay/creator", () => ({
  Overlay: jest.fn(),
}));

describe("Portal exports", () => {
  it("should export Portal component", () => {
    const { Portal } = require("../index");
    expect(Portal).toBeDefined();
  });
});
