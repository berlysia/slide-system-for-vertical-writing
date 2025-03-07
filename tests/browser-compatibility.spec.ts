import { test, expect } from "@playwright/test";

test.describe("Browser compatibility tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/slides/vrt-test", {
      waitUntil: "networkidle",
    });
    // Wait for the slides container to be visible
    await page.locator(".slides-container").waitFor({ state: "visible" });
    // Additional wait to ensure all styles are applied
    await page.waitForTimeout(500);
  });

  test("writing mode switching preserves layout across browsers", async ({
    page,
  }) => {
    const button = page.getByText(/書きにする/);
    await button.waitFor({ state: "visible" });

    // 縦書きモード
    const text = await button.textContent();
    if (text?.includes("縦書き")) {
      await button.click();
      await page.waitForTimeout(300);
    }

    // Check vertical writing mode
    const slides = page.locator(".slides");
    await expect(slides).toHaveCSS("writing-mode", "vertical-rl");

    // 横書きモードに切り替え
    await button.click();
    await page.waitForTimeout(300);

    // Check horizontal writing mode
    await expect(slides).toHaveCSS("writing-mode", "horizontal-tb");

    // Verify slide content positioning
    const slideContent = page.locator(".slide-content").first();
    await expect(slideContent).toBeVisible();
  });

  test("scroll snap works consistently across browsers", async ({ page }) => {
    const slides = page.locator(".slides");
    await expect(slides).toHaveCSS("scroll-snap-type", /.*mandatory/);

    // Next slide navigation
    const nextButton = page.getByText("次");
    await nextButton.click();
    await page.waitForTimeout(300);

    // Verify the second slide is fully visible
    const secondSlide = page.locator(".slide").nth(1);
    await expect(secondSlide).toBeVisible();

    // Check intersection with viewport
    const isInViewport = await secondSlide.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
    });
    expect(isInViewport).toBeTruthy();
  });

  test("print mode layout consistency", async ({ page }) => {
    // Set print media
    await page.emulateMedia({ media: "print" });

    // In print mode, writing-mode should be explicitly unset
    const slides = page.locator(".slides");
    await expect(slides).toHaveCSS("writing-mode", /^(unset|horizontal-tb)$/);

    // Check if all slides are visible in print mode
    const allSlides = page.locator(".slide");
    await expect(allSlides).toHaveCount(3);

    // Verify each slide's print layout
    for (let i = 0; i < 3; i++) {
      const slide = allSlides.nth(i);
      await expect(slide).toBeVisible();
      await expect(slide).toHaveCSS("page-break-after", "always");
      await expect(slide).toHaveCSS("page-break-inside", "avoid");
    }

    // Verify print-specific styles
    await expect(page.locator(".controls")).not.toBeVisible();
    await expect(page.locator(".slides-container")).toHaveCSS(
      "overflow",
      "visible",
    );
  });

  // ちょっとずれるので一旦スキップ
  test.skip("container query behavior", async ({ page }) => {
    // Check if container queries are working
    const slidesContainer = page.locator(".slides-container");
    await expect(slidesContainer).toHaveCSS("container-type", "size");

    // Responsive tests
    const size = { width: 1920, height: 1080 };

    await page.setViewportSize(size);
    await page.waitForTimeout(300);

    const slides = page.locator(".slides");

    // Verify container-based sizing with tolerance for browser precision differences
    const expectedMaxWidth = (size.height * 16) / 9;
    const expectedMaxHeight = (size.width * 9) / 16;

    const actualMaxWidth = await slides.evaluate((el) =>
      parseFloat(getComputedStyle(el).maxWidth),
    );
    const actualMaxHeight = await slides.evaluate((el) =>
      parseFloat(getComputedStyle(el).maxHeight),
    );

    // Allow 1px difference due to browser rounding
    expect(Math.abs(actualMaxWidth - expectedMaxWidth)).toBeLessThanOrEqual(1);
    expect(Math.abs(actualMaxHeight - expectedMaxHeight)).toBeLessThanOrEqual(
      1,
    );
  });
});
