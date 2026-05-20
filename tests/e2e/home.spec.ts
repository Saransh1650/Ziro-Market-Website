import { test, expect } from '@playwright/test';

test('home renders and key sections are visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Indian markets');
  await expect(page.getByRole('link', { name: /get early access/i }).first()).toBeVisible();
  await expect(page.getByText('NIFTY 50').first()).toBeVisible();
  await expect(page.getByText(/what you/i).first()).toBeVisible();
  await expect(page.getByText(/built for india/i).first()).toBeVisible();
});

test('pain tabs switch content', async ({ page }) => {
  await page.goto('/#pain');
  await page.getByRole('tab', { name: /moneycontrol/i }).click();
  await expect(page.getByText(/ads load/i)).toBeVisible();
});

test('waitlist submit shows position (mock)', async ({ page }) => {
  await page.route('**/api/waitlist', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ position: 2847 }) }),
  );
  await page.goto('/#waitlist');
  await page.getByRole('radio', { name: /ios/i }).click();
  await page.getByPlaceholder(/your email/i).fill('a@b.com');
  await page.getByRole('button', { name: /join the waitlist/i }).click();
  await expect(page.getByText(/#2,847/)).toBeVisible();
});
