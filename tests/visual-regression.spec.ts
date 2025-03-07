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

  test("navigation between pages", async ({ page }) => {
    // 最初のページのスクリーンショット
    await expect(page).toHaveScreenshot(
      `page1-${test.info().project.name}.png`,
    );

    // 次のページに移動
    const nextButton = page.getByText("次");
    await nextButton.click();
    await page.waitForTimeout(300);

    // 2ページ目のスクリーンショット
    await expect(page).toHaveScreenshot(
      `page2-${test.info().project.name}.png`,
    );

    // さらに次のページに移動
    await nextButton.click();
    await page.waitForTimeout(300);

    // 3ページ目のスクリーンショット
    await expect(page).toHaveScreenshot(
      `page3-${test.info().project.name}.png`,
    );
  });

  test("writing mode switching on different pages", async ({ page }) => {
    // 最初のページで横書きモードに設定
    const writingModeButton = page.getByText(/書きにする/);
    await writingModeButton.waitFor({ state: "visible" });

    const text = await writingModeButton.textContent();
    if (text?.includes("横書き")) {
      await writingModeButton.click();
      await page.waitForTimeout(300);
    }

    // 2ページ目に移動
    const nextButton = page.getByText("次");
    await nextButton.click();
    await page.waitForTimeout(300);

    // 2ページ目の横書きモードのスクリーンショット
    await expect(page).toHaveScreenshot(
      `page2-horizontal-${test.info().project.name}.png`,
    );

    // 縦書きモードに切り替え
    await writingModeButton.click();
    await page.waitForTimeout(300);

    // 2ページ目の縦書きモードのスクリーンショット
    await expect(page).toHaveScreenshot(
      `page2-vertical-${test.info().project.name}.png`,
    );

    // 3ページ目に移動
    await nextButton.click();
    await page.waitForTimeout(300);

    // 3ページ目の縦書きモードのスクリーンショット
    await expect(page).toHaveScreenshot(
      `page3-vertical-${test.info().project.name}.png`,
    );
  });
});
