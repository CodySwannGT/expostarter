/**
 * Visual-parity capture: screenshots each atom gallery entry on /playground
 * into PARITY_OUT (one PNG per atom, named after the atom). Pair a baseline
 * capture (pre-migration build) with a current capture and rank the diffs via
 * scripts/design-system/parity-diff.mjs. Not part of the normal e2e run —
 * invoke explicitly with PARITY_OUT set.
 *
 * @module e2e/capture-galleries.spec
 */
import fs from "node:fs";
import path from "node:path";

import { test } from "@playwright/test";

const OUT = process.env.PARITY_OUT;

test.skip(!OUT, "set PARITY_OUT to capture gallery parity screenshots");

test("capture atom galleries", async ({ page }) => {
  test.setTimeout(120_000);
  fs.mkdirSync(OUT as string, { recursive: true });
  await page.setViewportSize({ width: 1200, height: 2000 });
  await page.goto("/playground", { waitUntil: "networkidle" });

  // The scroll container holds one testID'd section per atom.
  const scroll = page.getByTestId("playground-scroll");
  await scroll.waitFor({ state: "visible", timeout: 30_000 });

  const entries = page.locator('[data-testid^="playground-entry-"]');
  const count = await entries.count();
  for (let i = 0; i < count; i++) {
    const entry = entries.nth(i);
    const testId = (await entry.getAttribute("data-testid")) ?? `entry-${i}`;
    const name = testId.replace("playground-entry-", "");
    await entry.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await entry.screenshot({ path: path.join(OUT as string, `${name}.png`) });
  }
});
