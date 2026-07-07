/**
 * @file ScrollView atom tests — export-shape assertions.
 * @description Scroll primitive: the test asserts the re-exported name and
 * its shape.
 */
import * as ScrollViewAtom from "..";

describe("ScrollView atom", () => {
  it("re-exports ScrollView as a component", () => {
    const exported = (ScrollViewAtom as Record<string, unknown>)["ScrollView"];
    expect(["function", "object"]).toContain(typeof exported);
    expect(exported).toBeTruthy();
  });
});
