const { chromium } = require('H:/RAZ DWA/RAZDWA/node_modules/playwright');

const BASE = 'http://127.0.0.1:8765/portfolio.html';
const results = [];

function log(icon, label, detail) {
  const line = icon + ' ' + label + (detail ? ' — ' + detail : '');
  results.push(line);
  console.log(line);
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function openKaroma(page) {
  await page.locator('[data-project="karoma"]').click();
  await wait(4000);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // 1. Klik inline
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const gridCardImg = await page.locator('[data-project="karoma"] img').getAttribute('src');
  log(gridCardImg && gridCardImg.includes('karoma/') ? 'OK' : 'FAIL', 'Grid card img path', gridCardImg);

  await openKaroma(page);
  const kwcs1 = (await page.locator('#case-viewer section.kwcs').count()) > 0;
  const url1 = page.url();
  if (kwcs1 && url1.includes('#karoma')) {
    log('OK', 'Klik → viewer inline, hash ustawiony', url1.split('#')[1]);
  } else {
    log('FAIL', 'Klik → viewer problem', 'kwcs:' + kwcs1 + ' url:' + url1);
  }

  // 2. Hero image loads
  const heroNw = await page.locator('#case-viewer .hero-image img').evaluate(function(el) { return el.naturalWidth; });
  if (heroNw > 0) {
    log('OK', 'Hero image wczytany', 'naturalWidth:' + heroNw);
  } else {
    log('FAIL', 'Hero image broken', 'naturalWidth:' + heroNw);
  }

  // 3. Content images load — scroll each into view first (lazy loading)
  const contentImgs = await page.locator('#case-viewer .lightbox-trigger').all();
  let loadedCount = 0;
  for (let i = 0; i < Math.min(3, contentImgs.length); i++) {
    await contentImgs[i].scrollIntoViewIfNeeded();
    await wait(600);
    const nw = await contentImgs[i].evaluate(function(el) { return el.naturalWidth; });
    if (nw > 0) loadedCount++;
  }
  if (loadedCount === Math.min(3, contentImgs.length)) {
    log('OK', 'Content images wczytane', loadedCount + '/' + Math.min(3, contentImgs.length) + ' sprawdzonych');
  } else {
    log('FAIL', 'Content images broken', 'loaded:' + loadedCount + '/' + Math.min(3, contentImgs.length));
  }

  // 4. Chapter rail — visible and sticky
  const railCount = await page.locator('#karoma-chapter-rail').count();
  const railVisible = railCount > 0 && await page.locator('#karoma-chapter-rail').isVisible();
  if (railVisible) {
    const railBox = await page.locator('#karoma-chapter-rail').boundingBox();
    await page.evaluate(() => window.scrollBy(0, 500));
    await wait(300);
    const railBoxAfter = await page.locator('#karoma-chapter-rail').boundingBox();
    const isSticky = railBox && railBoxAfter && Math.abs(railBox.y - railBoxAfter.y) < 5;

    // Check JS scroll-spy initialized (active class applied on scroll)
    const hasActiveLink = (await page.locator('#karoma-chapter-rail .razdwa-chapter-link.active').count()) > 0;

    await page.locator('#karoma-chapter-rail .razdwa-chapter-link').first().click();
    await wait(400);

    if (isSticky) {
      log('OK', 'Chapter rail widoczny i sticky');
    } else {
      log('FAIL', 'Chapter rail NIE sticky', 'y-diff:' + Math.abs(railBox.y - railBoxAfter.y));
    }
    if (hasActiveLink) {
      log('OK', 'Chapter rail scroll-spy aktywny');
    } else {
      log('WARN', 'Chapter rail — brak active link po scrollu (scroll-spy może nie inicjować od razu)');
    }
  } else {
    log('FAIL', 'Chapter rail NIE widoczny', 'count:' + railCount);
  }

  // 5. Ponowny klik zamyka
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(300);
  await page.locator('[data-project="karoma"]').click();
  await wait(500);
  const cls5 = await page.locator('#case-viewer').getAttribute('class');
  const url5 = page.url();
  if ((cls5 || '').includes('hidden') && !url5.includes('#')) {
    log('OK', 'Ponowny klik → zamknięty, hash czysty');
  } else {
    log('FAIL', 'Ponowny klik problem', 'cls:' + cls5 + ' url:' + url5);
  }

  // 6. Close button
  await openKaroma(page);
  const closeBtn = page.locator('.close-button').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await wait(400);
    const cls6 = await page.locator('#case-viewer').getAttribute('class');
    if ((cls6 || '').includes('hidden')) {
      log('OK', 'Close button → viewer zamknięty');
    } else {
      log('FAIL', 'Close button problem', cls6);
    }
  } else {
    log('FAIL', 'Close button niewidoczny');
  }

  // 7. Escape
  await openKaroma(page);
  await page.keyboard.press('Escape');
  await wait(400);
  const cls7 = await page.locator('#case-viewer').getAttribute('class');
  if ((cls7 || '').includes('hidden')) {
    log('OK', 'Escape → viewer zamknięty');
  } else {
    log('FAIL', 'Escape problem', cls7);
  }

  // 8. Brak regresji — RazDwa nadal działa
  await page.locator('[data-project="RazDwa"]').click();
  await wait(4000);
  const rzKwcs = (await page.locator('#case-viewer section.kwcs').count()) > 0;
  const rzRail = (await page.locator('#razdwa-chapter-rail').count()) > 0;
  if (rzKwcs && rzRail) {
    log('OK', 'RazDwa bez regresji — viewer i rail działają');
  } else {
    log('FAIL', 'RazDwa regresja', 'kwcs:' + rzKwcs + ' rail:' + rzRail);
  }

  // 9. Brak regresji strony
  const closeBtnFinal = page.locator('.close-button').first();
  if (await closeBtnFinal.isVisible()) await closeBtnFinal.click();
  await wait(400);
  const heroOk = await page.locator('.about-me-section').isVisible();
  const gridOk = await page.locator('.portfolio-new-grid').isVisible();
  if (heroOk && gridOk) {
    log('OK', 'Brak regresji strony — hero i grid widoczne');
  } else {
    log('FAIL', 'Regresja strony', 'hero:' + heroOk + ' grid:' + gridOk);
  }

  await ctx.close();
  await browser.close();

  console.log('\n=== QA KAROMA ===');
  const pass = results.filter(function(r) { return r.startsWith('OK'); }).length;
  const fail = results.filter(function(r) { return r.startsWith('FAIL'); }).length;
  const warn = results.filter(function(r) { return r.startsWith('WARN'); }).length;
  results.forEach(function(r) { console.log(' ', r); });
  console.log('\nPASS: ' + pass + '  FAIL: ' + fail + '  WARN: ' + warn);
  console.log(fail > 0 ? '\nVERDICT: FAIL' : '\nVERDICT: PASS');
  process.exit(fail > 0 ? 1 : 0);
})();
