const { test } = require('playwright/test');

test('responsive check', async ({ page }) => {
  page.on('console', (msg) => console.log(`console:${msg.type()}:${msg.text()}`));
  page.on('pageerror', (err) => console.log(`pageerror:${err.message}`));
  await page.goto(process.env.TARGET_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(6000);
  const loader = page.locator('#qd-loader');
  console.log(`loaderCount:${await loader.count()}`);
  if (await loader.count()) {
    console.log(`loaderVisible:${await loader.isVisible()}`);
  }
  console.log(`title:${await page.title()}`);
  await page.screenshot({ path: process.env.SHOT_PATH, fullPage: true });
});
