/**
 * @file colors.test.ts
 * @description Unit tests for the raw-palette color extensions — verifies
 * the toast color family exposes every slot tailwind.config.js spreads into
 * `theme.extend.colors`, and that each value is a hex color literal.
 * @module __tests__/colors.test
 */
import colors from "@/config/colors";

describe("config/colors", () => {
  it("defines the complete toast color family as hex literals", () => {
    expect(
      Object.keys(colors.toast).sort((a, b) => a.localeCompare(b))
    ).toEqual(["danger", "icon", "normal", "success", "text", "warning"]);
    for (const value of Object.values(colors.toast)) {
      expect(value).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
});
