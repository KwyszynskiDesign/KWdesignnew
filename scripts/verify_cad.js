const { chromium } = require('playwright');
const fs = require('fs');

const OUT = 'C:\\Users\\Karolek\\AppData\\Local\\Temp\\razdwa_cad';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8787/KWdesignnew/projects/razdwa_aplikacja.html', { waitUntil: 'networkidle' });

  const grid = page.locator('#razdwa-cad ~ .kwcs-sec .kwcs-gallery-grid').first();
  await grid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const b = await grid.boundingBox();
  await page.screenshot({
    path: `${OUT}/cad_duo_placeholders.png`,
    clip: { x: Math.max(0, b.x - 24), y: Math.max(0, b.y - 60), width: b.width + 48, height: b.height + 80 }
  });

  console.log('OK →', OUT);
  await browser.close();
})();
