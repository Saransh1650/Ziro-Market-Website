import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('home has no serious a11y violations', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    axeOptions: { runOnly: ['wcag2a', 'wcag2aa'] },
  });
});
