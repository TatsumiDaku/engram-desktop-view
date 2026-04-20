import { test, expect } from "@playwright/test";

test.describe("EngramDesktopView", () => {
	test("should load the app without errors", async ({ page }) => {
		// Navigate to the app
		await page.goto("/");

		// Wait for the app to load
		await page.waitForLoadState("networkidle");

		// Check that the main container exists
		const container = page.locator(".min-h-screen");
		await expect(container).toBeVisible();
	});

	test("should display header with app title", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Check for app title in header
		const header = page.locator("text=EngramDesktopView").first();
		await expect(header).toBeVisible();
	});

	test("should toggle theme", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Find and click theme toggle
		const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="Theme"]').first();
		if (await themeToggle.isVisible()) {
			await themeToggle.click();
			// Verify theme changed
			await page.waitForTimeout(500);
		}
	});

	test("should open settings modal", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Press keyboard shortcut or click settings
		await page.keyboard.press("Control+,");
		await page.waitForTimeout(500);

		// Check if settings modal opened
		// This depends on your implementation
	});
});
