import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 }
  });
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

  await page.goto('http://localhost:3001');

  // Verify hamburger is visible
  const btn = await page.locator('#mobile-menu-btn');
  console.log('Mobile menu button visible:', await btn.isVisible());

  // Click it
  await btn.click();
  
  // Wait a moment for transitions
  await page.waitForTimeout(500);

  // Check if mobile menu has the hidden class
  const menu = await page.locator('#mobile-menu');
  const classList = await menu.getAttribute('class');
  
  console.log('Menu classList:', classList);
  
  const box = await menu.boundingBox();
  console.log('Menu bounding box:', box);

  await browser.close();
})();
