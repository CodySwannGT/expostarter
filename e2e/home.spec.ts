/**
 * E2E tests for the home screen.
 *
 * Verifies the Hello World screen renders correctly in browser
 * using Playwright test framework.
 *
 * @see https://playwright.dev/docs/writing-tests
 * @module e2e/home.spec
 */
import { expect, test } from "@playwright/test";

test.describe("Home Screen", () => {
  test("displays Hello, World! text", async ({ page }) => {
    await page.goto("/");

    // Verify the Hello, World! text is visible using testID
    const title = page.getByTestId("home:title");
    await expect(title).toBeVisible();
    await expect(title).toHaveText("Hello, World!");
  });

  test("renders the home container", async ({ page }) => {
    await page.goto("/");

    // Verify the container element exists
    const container = page.getByTestId("home:container");
    await expect(container).toBeVisible();
  });
});
