import { test, expect } from "@playwright/test";

test.describe("Visual regression test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/slides/vrt-test");
    // ページの読み込みとレンダリングを待つ
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("domcontentloaded");
  });

  test("horizontal writing mode", async ({ page }) => {
    const button = page.getByText(/書きにする/);
    await button.waitFor({ state: "visible" });

    const text = await button.textContent();
    if (text?.includes("横書き")) {
      await button.click();
      await page.waitForTimeout(300);
    }

    await expect(page).toHaveScreenshot(
      `horizontal-${test.info().project.name}.png`,
    );
  });

  test("vertical writing mode", async ({ page }) => {
    const button = page.getByText(/書きにする/);
    await button.waitFor({ state: "visible" });

    const text = await button.textContent();
    if (text?.includes("縦書き")) {
      await button.click();
      await page.waitForTimeout(300);
    }

    await expect(page).toHaveScreenshot(
      `vertical-${test.info().project.name}.png`,
    );
  });

  test("responsive layout test", async ({ page }) => {
    const sizes = [
      { width: 1920, height: 1080 },
      { width: 1280, height: 720 },
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);
      await expect(page).toHaveScreenshot(
        `responsive-${size.width}x${size.height}-${test.info().project.name}.png`,
      );
    }
  });
});
