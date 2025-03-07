import { test, expect } from "@playwright/test";

test.describe("Print mode test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/slides/vrt-test", {
      waitUntil: "networkidle",
    });
    // Wait for the slides container to be visible
    await page.locator(".slides-container").waitFor({ state: "visible" });
    // Additional wait to ensure all styles are applied
    await page.waitForTimeout(500);
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

    // 印刷モードに切り替え
    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(300);

    // スクリーンショットを取得して検証
    await expect(page).toHaveScreenshot(
      `${test.info().project.name}-print-mode-horizontal.png`,
    );
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

    // 印刷モードに切り替え
    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(300);

    // スクリーンショットを取得して検証
    await expect(page).toHaveScreenshot(
      `${test.info().project.name}-print-mode-vertical.png`,
    );
  });

  test("multiple slides in print", async ({ page, browserName }) => {
    // 印刷モードに切り替え
    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(300);

    // 各スライドのスクリーンショットを取得
    for (let i = 0; i < 3; i++) {
      if (i > 0) {
        // 次のスライドに移動
        await page.keyboard.press("ArrowDown");
        await page.waitForTimeout(300);
      }

      // スライドが表示されるまで待機
      const slide = page.locator(".slide").nth(i);
      await slide.waitFor({ state: "visible" });
      await page.waitForTimeout(300);

      // Firefoxの場合は異なる挙動であることをテストでマーク
      if (browserName === "firefox" && i === 2) {
        test.info().annotations.push({
          type: "issue",
          description:
            "Firefox does not support container style queries for custom properties yet",
        });
      }

      // スクリーンショットを取得して検証
      await expect(page).toHaveScreenshot(
        `${test.info().project.name}-print-sequence-slide${i + 1}.png`,
      );
    }
  });
});
