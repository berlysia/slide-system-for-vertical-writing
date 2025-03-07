import { test, expect, type Page } from "@playwright/test";

async function toVertical(page: Page) {
  const button = page.getByText(/書きにする/);
  await button.waitFor({ state: "visible" });

  // 縦書きモードに設定
  const text = await button.textContent();
  if (text?.includes("縦書き")) {
    await button.click();
    await page.waitForTimeout(300);
  }
}

async function toHorizontal(page: Page) {
  const button = page.getByText(/書きにする/);
  await button.waitFor({ state: "visible" });

  // 横書きモードに設定
  const text = await button.textContent();
  if (text?.includes("横書き")) {
    await button.click();
    await page.waitForTimeout(300);
  }
}

test.describe("Visual regression test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/slides/vrt-test", {
      waitUntil: "networkidle",
    });
    // Wait for the slides container to be visible
    await page.locator(".slides-container").waitFor({ state: "visible" });
    // Additional wait to ensure all styles are applied
    await page.waitForTimeout(500);
  });

  test("horizontal writing mode", async ({ page }) => {
    await toHorizontal(page);

    await expect(page).toHaveScreenshot(
      `${test.info().project.name}-writing-mode-horizontal.png`,
    );
  });

  test("vertical writing mode", async ({ page }) => {
    await toVertical(page);

    await expect(page).toHaveScreenshot(
      `${test.info().project.name}-writing-mode-vertical.png`,
    );
  });

  test("responsive layout test", async ({ page }) => {
    const sizes = [
      { width: 1920, height: 1080 },
      { width: 1280, height: 720 },
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.waitForTimeout(300);
      await expect(page).toHaveScreenshot(
        `${test.info().project.name}-responsive-${size.width}x${size.height}.png`,
      );
    }
  });

  test("navigation between pages", async ({ page }) => {
    // 最初のページのスクリーンショット
    await expect(page).toHaveScreenshot(
      `${test.info().project.name}-navigation-page1.png`,
    );

    // 2ページ目へ移動
    const nextButton = page.getByText("次");
    await nextButton.click();
    await page.waitForTimeout(300);

    // 2ページ目のスクリーンショット
    await expect(page).toHaveScreenshot(
      `${test.info().project.name}-navigation-page2.png`,
    );

    // 3ページ目へ移動
    await nextButton.click();
    await page.waitForTimeout(300);

    // 3ページ目のスクリーンショット
    await expect(page).toHaveScreenshot(
      `${test.info().project.name}-navigation-page3.png`,
    );
  });

  test("writing mode switching on different pages", async ({ page }) => {
    // 2ページ目へ移動
    const nextButton = page.getByText("次");
    await nextButton.click();
    await page.waitForTimeout(300);

    await toHorizontal(page);

    // 2ページ目の横書きモードのスクリーンショット
    await expect(page).toHaveScreenshot(
      `${test.info().project.name}-page2-mode-horizontal.png`,
    );

    // 縦書きモードに変更
    await toVertical(page);

    // 2ページ目の縦書きモードのスクリーンショット
    await expect(page).toHaveScreenshot(
      `${test.info().project.name}-page2-mode-vertical.png`,
    );

    // 3ページ目へ移動
    await nextButton.click();
    await page.waitForTimeout(300);

    // 3ページ目の縦書きモードのスクリーンショット
    await expect(page).toHaveScreenshot(
      `${test.info().project.name}-page3-mode-vertical.png`,
    );
  });
});
