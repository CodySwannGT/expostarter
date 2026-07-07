/**
 * @file buttonSizeScale.test.ts
 * @description Regression guard for SE-5256. The design-system token-closing
 * migration replaced the Tailwind `spacing` scale with a closed ladder
 * (`0 micro px 1 2 3 4 5 6 8 10 12 16`) — step `7` was removed. The codemod
 * excluded `src/components/ui/**`, and `tailwindcss/no-arbitrary-value` /
 * the design ratchet also exclude it, so an off-scale numeric padding class
 * here (e.g. `px-7`) is caught by NOTHING: it silently compiles to no style.
 * The `size="xl"` Button used `px-7`, so every xl button rendered with zero
 * horizontal padding (the Shadow Team "Assigned Players" Save button's
 * background looked cut off). This test fails if any numeric-step padding
 * class in this primitive falls off the closed spacing scale again.
 * @module components/ui/button/__tests__/buttonSizeScale.test
 */
import { readFileSync } from "fs";
import { join } from "path";

// The closed spacing scale (tailwind.config.js — "CLOSED spacing scale").
// Padding axes resolve ONLY against this ladder; numeric steps outside it
// compile to nothing. `micro` and `px` are named steps and always valid.
const CLOSED_SPACING_STEPS = new Set([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "16",
]);

describe("ui/button padding tokens stay on the closed spacing scale", () => {
  it("uses no off-scale numeric padding step (SE-5256)", () => {
    const raw = readFileSync(join(__dirname, "../index.tsx"), "utf-8");
    // Strip comments first so prose that mentions a class (e.g. this fix's
    // own `px-7` explanation) doesn't register as a real usage.
    const source = raw
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "");

    // Match padding utilities with a numeric step: p-, px-, py-, pt-, pr-,
    // pb-, pl- followed by digits (skips arbitrary `px-[28px]`, which the
    // vendored ui layer is allowed to use).
    const paddingClass = /\bp[xytrbl]?-(\d+)\b/g;
    const offScale: string[] = [];
    for (const match of source.matchAll(paddingClass)) {
      const step = match[1];
      if (!CLOSED_SPACING_STEPS.has(step)) offScale.push(match[0]);
    }

    expect(offScale).toEqual([]);
  });
});
