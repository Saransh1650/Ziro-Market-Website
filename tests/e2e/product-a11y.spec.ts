import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

/**
 * Accessibility gate for the product surfaces (Design System → "done").
 * Every page, both themes, WCAG 2 A/AA. Any violation fails.
 */
const PAGES = [
  '/app/market',
  '/app/discover',
  '/app/discover/etfs',
  '/app/discover/funds',
  '/app/commodities/gold',
  '/app/login',
  '/stocks/RELIANCE',
];

for (const theme of ['light', 'dark'] as const) {
  for (const path of PAGES) {
    test(`${path} (${theme}) has no a11y violations`, async ({ page }) => {
      await page.addInitScript(
        ([key, value]) => localStorage.setItem(key, value),
        ['zw-theme', theme] as const,
      );
      await page.goto(path, { waitUntil: 'networkidle' });
      // Let live data and logos land; axe reads the settled DOM.
      await page.waitForTimeout(1500);
      await injectAxe(page);
      await checkA11y(page, undefined, {
        detailedReport: true,
        axeOptions: { runOnly: ['wcag2a', 'wcag2aa'] },
      });
    });
  }
}
