/**
 * Design-token module invariants.
 *
 * Guards src/design-system/tokens.ts — the single source of truth global.css is
 * generated from. Replaces the former src/__tests__/colors.test.ts (the toast
 * palette moved from src/config/colors.ts into TOAST_COLORS) and mirrors the
 * design-system/semantic-token-budget lint rule so the closed tiers stay closed.
 */
import {
  SEMANTIC_COLORS,
  CHART_COLORS,
  TOAST_COLORS,
  SHADCN_COLORS,
  RAW_PALETTE,
} from "@/design-system/tokens";

describe("design tokens", () => {
  it("keeps the toast palette (was config/colors.ts)", () => {
    expect(TOAST_COLORS).toEqual({
      normal: "#032A3E",
      danger: "#A84A4A",
      success: "#032A3E",
      warning: "#032A3E",
      icon: "#FFFFFF",
      text: "#FFFFFF",
    });
  });

  it("keeps the semantic color tier within its closed budget (15-25)", () => {
    const status = Object.keys(SEMANTIC_COLORS.status).filter(
      key => !key.endsWith("-surface")
    ).length;
    const total =
      Object.keys(SEMANTIC_COLORS.content).length +
      Object.keys(SEMANTIC_COLORS.surface).length +
      Object.keys(SEMANTIC_COLORS.accent).length +
      status +
      Object.keys(SEMANTIC_COLORS.outline).length;
    expect(total).toBeGreaterThanOrEqual(15);
    expect(total).toBeLessThanOrEqual(25);
  });

  it("keeps the semantic outline names exact", () => {
    const outlineKeys = Object.keys(SEMANTIC_COLORS.outline).sort((a, b) =>
      a.localeCompare(b)
    );
    expect(outlineKeys).toEqual(["default", "emphasis", "strong", "subtle"]);
  });

  it("keeps the chart annex a closed palette", () => {
    const allowed = ["player", "other", "horizontalLine", "line", "up", "down"];
    for (const key of Object.keys(CHART_COLORS)) {
      expect(allowed).toContain(key);
    }
  });

  it("defines the gluestack v5 shadcn component-token bridge", () => {
    for (const name of ["primary", "destructive", "muted", "border", "ring"]) {
      expect(SHADCN_COLORS[name]).toBeDefined();
    }
  });

  it("defines light and dark values for every raw palette key", () => {
    expect(Object.keys(RAW_PALETTE.light)).toEqual(
      Object.keys(RAW_PALETTE.dark)
    );
    expect(Object.keys(RAW_PALETTE.light).length).toBeGreaterThan(100);
  });
});
