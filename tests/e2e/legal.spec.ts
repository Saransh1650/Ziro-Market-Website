import { test, expect } from '@playwright/test';

for (const path of ['/privacy', '/terms']) {
  test(`${path} renders`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/ziro market/i).first()).toBeVisible();
  });
}
