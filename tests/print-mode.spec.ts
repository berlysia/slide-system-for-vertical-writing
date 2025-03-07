import { test, expect } from "@playwright/test";

test.describe("Print mode test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/slides/vrt-test", {
      waitUntil: "networkidle",
    });
    // Wait for the slides container to be visible and fonts to load
    await page.locator(".slides-container").waitFor({ state: "visible" });
    // Ensure fonts are loaded
    await page.evaluate(() => document.fonts.ready);
    // Additional wait to ensure all styles are applied
    await page.waitForTimeout(500);
  });

  test("horizontal writing mode in print", async ({ page }) => {
    // Set horizontal writing mode
    const button = page.getByText(/書きにする/);
    await button.waitFor({ state: "visible" });

    const text = await button.textContent();
    if (text?.includes("横書き")) {
      await button.click();
      await page.waitForTimeout(300);
    }

    // Switch to print mode
    await page.emulateMedia({ media: "print" });

    // Wait for print styles to be applied
    await page.waitForTimeout(500);

    // Verify writing mode is maintained
    const writingMode = await page.evaluate(() => {
      const slide = document.querySelector(".slide");
      return window.getComputedStyle(slide!).writingMode;
    });
    expect(writingMode).toBe("horizontal-tb");

    // Take screenshot for visual verification
    await expect(page).toHaveScreenshot(
      `${test.info().project.name}-print-mode-horizontal.png`,
      {
        timeout: 5000,
        animations: "disabled",
        // Allow small differences in font rendering and anti-aliasing
        maxDiffPixelRatio: 0.1,
        threshold: 0.2,
      },
    );
  });

  test("vertical writing mode in print", async ({ page }) => {
    // Set vertical writing mode
    const button = page.getByText(/書きにする/);
    await button.waitFor({ state: "visible" });

    const text = await button.textContent();
    if (text?.includes("縦書き")) {
      await button.click();
      await page.waitForTimeout(300);
    }

    // Switch to print mode
    await page.emulateMedia({ media: "print" });

    // Wait for print styles to be applied
    await page.waitForTimeout(500);

    // Verify writing mode is maintained
    const writingMode = await page.evaluate(() => {
      const slide = document.querySelector(".slide");
      return window.getComputedStyle(slide!).writingMode;
    });
    expect(writingMode).toBe("vertical-rl");

    // Take screenshot for visual verification
    await expect(page).toHaveScreenshot(
      `${test.info().project.name}-print-mode-vertical.png`,
      {
        timeout: 5000,
        animations: "disabled",
        // Allow small differences in font rendering and anti-aliasing
        maxDiffPixelRatio: 0.1,
        threshold: 0.2,
      },
    );
  });

  test("multiple slides in print", async ({ page, browserName }) => {
    // Switch to print mode
    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(500);

    // Verify all slides are present
    const slideCount = await page.locator(".slide").count();
    expect(slideCount).toBe(3);

    // Check each slide
    for (let i = 0; i < 3; i++) {
      // Navigate to slide if needed
      if (i > 0) {
        await page.keyboard.press("ArrowDown");
        await page.waitForTimeout(300);
      }

      // Get the slide
      const slide = page.locator(".slide").nth(i);
      await slide.waitFor({ state: "visible" });

      // Third slide has special writing mode toggle
      if (i === 2) {
        // In Firefox, note container query limitation
        if (browserName === "firefox") {
          test.info().annotations.push({
            type: "issue",
            description:
              "Firefox does not support container style queries for custom properties yet",
          });
        }
      }

      // Take screenshot with specific settings
      await expect(page).toHaveScreenshot(
        `${test.info().project.name}-print-sequence-slide${i + 1}.png`,
        {
          timeout: 5000,
          animations: "disabled",
          // Allow small differences in font rendering and anti-aliasing
          maxDiffPixelRatio: 0.1,
          threshold: 0.2,
        },
      );
    }
  });
});
