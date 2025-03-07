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
    await expect(slides).toHaveCount(3); // 3ページあることを確認

    // 各スライドが表示されていることを個別に確認
    await expect(slides.nth(0)).toBeVisible();
    await expect(slides.nth(1)).toBeVisible();
    await expect(slides.nth(2)).toBeVisible();

    // 各スライドの内容を確認
    await expect(page.locator(".slide:nth-child(1)")).toContainText(
      "Visual Regression Test Slide",
    );
    await expect(page.locator(".slide:nth-child(2)")).toContainText(
      "複数ページのテスト",
    );
    await expect(page.locator(".slide:nth-child(3)")).toContainText(
      "縦書き・横書きの切り替え",
    );

    // 各スライドのスクリーンショットを個別に取得して検証
    for (let i = 0; i < 3; i++) {
      // 特定のスライドにフォーカスするためのスクリプトを実行
      await page.evaluate((slideIndex) => {
        const slide = document.querySelectorAll(".slide")[slideIndex];
        slide.scrollIntoView();
      }, i);

      await page.waitForTimeout(300); // スクロールが完了するのを待つ

      // スクリーンショットを取得して検証
      await expect(page).toHaveScreenshot(
        `print-slide-${i + 1}-${test.info().project.name}.png`,
      );
    }

    // スライドのレイアウトを確認
    const slidesContainer = page.locator(".slides");
    await expect(slidesContainer).toHaveCSS("overflow", "visible");
    await expect(slidesContainer).toHaveCSS("writing-mode", "horizontal-tb");
  });

  test("page navigation in print mode", async ({ page }) => {
    // 通常モードでページ移動
    const nextButton = page.getByText("次");
    await nextButton.click();
    await page.waitForTimeout(300);

    // 2ページ目に移動したことを確認
    // 現在表示されているスライドの内容を確認
    const visibleSlideContent = page.locator(
      ".slide:nth-child(2) .slide-content",
    );
    await expect(visibleSlideContent).toContainText("複数ページのテスト");

    // プリントメディアをエミュレート
    await page.emulateMedia({ media: "print" });

    // プリントモードでは全ページが表示されることを確認
    const slides = page.locator(".slide");
    await expect(slides).toHaveCount(3);
    await expect(slides.nth(0)).toBeVisible();
    await expect(slides.nth(1)).toBeVisible();
    await expect(slides.nth(2)).toBeVisible();

    // 各スライドのスクリーンショットを個別に取得して検証
    for (let i = 0; i < 3; i++) {
      // 特定のスライドにフォーカスするためのスクリプトを実行
      await page.evaluate((slideIndex) => {
        const slide = document.querySelectorAll(".slide")[slideIndex];
        slide.scrollIntoView();
      }, i);

      await page.waitForTimeout(300); // スクロールが完了するのを待つ

      // スクリーンショットを取得して検証
      await expect(page).toHaveScreenshot(
        `print-from-page2-slide-${i + 1}-${test.info().project.name}.png`,
      );
    }
  });
});
