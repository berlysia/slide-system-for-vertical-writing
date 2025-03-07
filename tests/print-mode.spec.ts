import { test, expect } from "@playwright/test";

test.describe("Print mode test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/slides/vrt-test");
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("domcontentloaded");
  });

  test("horizontal writing mode in print", async ({ page }) => {
    // 横書きモードに設定
    const button = page.getByText(/書きにする/);
    await button.waitFor({ state: "visible" });
    const text = await button.textContent();
    if (text?.includes("横書き")) {
      await button.click();
      await page.waitForTimeout(300);
    }

    // プリントメディアをエミュレート
    await page.emulateMedia({ media: "print" });

    // スクリーンショットを取得して検証
    await expect(page).toHaveScreenshot(
      `print-horizontal-${test.info().project.name}.png`,
    );

    // コントロールが非表示になっていることを確認
    const controls = page.locator(".controls");
    await expect(controls).not.toBeVisible();
  });

  test("vertical writing mode in print", async ({ page }) => {
    // 縦書きモードに設定
    const button = page.getByText(/書きにする/);
    await button.waitFor({ state: "visible" });
    const text = await button.textContent();
    if (text?.includes("縦書き")) {
      await button.click();
      await page.waitForTimeout(300);
    }

    // プリントメディアをエミュレート
    await page.emulateMedia({ media: "print" });

    // スクリーンショットを取得して検証
    await expect(page).toHaveScreenshot(
      `print-vertical-${test.info().project.name}.png`,
    );

    // コントロールが非表示になっていることを確認
    const controls = page.locator(".controls");
    await expect(controls).not.toBeVisible();
  });

  test("multiple slides in print", async ({ page }) => {
    // プリントメディアをエミュレート
    await page.emulateMedia({ media: "print" });

    // すべてのスライドが表示されていることを確認
    const slides = page.locator(".slide");
    await expect(slides).toBeVisible();

    // スクリーンショットを取得して検証
    await expect(page).toHaveScreenshot(
      `print-all-slides-${test.info().project.name}.png`,
    );

    // スライドのレイアウトを確認
    const slidesContainer = page.locator(".slides");
    await expect(slidesContainer).toHaveCSS("overflow", "visible");
    await expect(slidesContainer).toHaveCSS("writing-mode", "horizontal-tb");
  });
});
