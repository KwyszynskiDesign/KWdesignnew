const { chromium } = require('H:/RAZ DWA/RAZDWA/node_modules/playwright');

const BASE = 'http://127.0.0.1:8765/portfolio.html';
const results = [];

function log(icon, label, detail) {
  const line = icon + ' ' + label + (detail ? ' — ' + detail : '');
  results.push(line);
  console.log(line);
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function openRazDwa(page) {
  await page.locator('[data-project="RazDwa"]').click();
  await wait(4000);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // 1. Klik inline
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await openRazDwa(page);
  const kwcs1 = (await page.locator('#case-viewer section.kwcs').count()) > 0;
  const url1 = page.url();
  if (kwcs1 && url1.includes('#RazDwa')) {
    log('OK', 'Klik → viewer inline, hash ustawiony', url1.split('#')[1]);
  } else {
    log('FAIL', 'Klik → viewer problem', 'kwcs:' + kwcs1 + ' url:' + url1);
  }

  // 2. Ponowny klik zamyka
  await page.locator('[data-project="RazDwa"]').click();
  await wait(500);
  const cls2 = await page.locator('#case-viewer').getAttribute('class');
  const url2 = page.url();
  if ((cls2 || '').includes('hidden') && !url2.includes('#')) {
    log('OK', 'Ponowny klik → zamknięty, hash wyczyszczony');
  } else {
    log('FAIL', 'Ponowny klik problem', 'cls:' + cls2 + ' url:' + url2);
  }

  // 3. Reload z hashem
  await page.goto(BASE + '#RazDwa', { waitUntil: 'networkidle' });
  await wait(6000);
  const kwcs3 = (await page.locator('#case-viewer section.kwcs').count()) > 0;
  const url3 = page.url();
  const redirected = !url3.startsWith('http://127.0.0.1:8765/portfolio.html');
  if (kwcs3 && !redirected) {
    log('OK', 'Reload z hashem → inline, bez redirectu');
  } else {
    log('FAIL', 'Reload z hashem problem', 'kwcs:' + kwcs3 + ' url:' + url3);
  }

  // 4a. Close button
  const closeBtn = page.locator('.close-button').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await wait(400);
    const cls4a = await page.locator('#case-viewer').getAttribute('class');
    const url4a = page.url();
    if ((cls4a || '').includes('hidden') && !url4a.includes('#')) {
      log('OK', 'Close button → viewer zamknięty, hash czysty');
    } else {
      log('FAIL', 'Close button problem', 'cls:' + cls4a + ' url:' + url4a);
    }
  } else {
    log('FAIL', 'Close button niewidoczny');
  }

  // 4b. Escape bez lightbox
  await openRazDwa(page);
  await page.keyboard.press('Escape');
  await wait(400);
  const cls4b = await page.locator('#case-viewer').getAttribute('class');
  const url4b = page.url();
  if ((cls4b || '').includes('hidden') && !url4b.includes('#')) {
    log('OK', 'Escape → viewer zamknięty, hash czysty');
  } else {
    log('FAIL', 'Escape problem', 'cls:' + cls4b + ' url:' + url4b);
  }

  // 5. Lightbox + Escape zamyka tylko lightbox
  await openRazDwa(page);
  const imgs = await page.locator('#case-viewer section.kwcs img').all();
  let lbPassed = false;
  let viewerSurvived = false;
  for (const img of imgs) {
    const w = await img.evaluate(function(el) { return el.naturalWidth || el.width; });
    if (w >= 100) {
      await img.click();
      await wait(700);
      const lbActive = await page.locator('#lightbox').evaluate(function(el) { return el.classList.contains('active'); });
      if (lbActive) {
        lbPassed = true;
        await page.keyboard.press('Escape');
        await wait(400);
        const lbGone = !(await page.locator('#lightbox').evaluate(function(el) { return el.classList.contains('active'); }));
        const viewerCls = await page.locator('#case-viewer').getAttribute('class');
        const viewerOpen = !(viewerCls || '').includes('hidden');
        viewerSurvived = lbGone && viewerOpen;
      }
      break;
    }
  }
  if (lbPassed && viewerSurvived) {
    log('OK', 'Lightbox: otwiera się, Escape zamyka lb ale NIE viewer');
  } else if (lbPassed && !viewerSurvived) {
    log('FAIL', 'Lightbox: Escape zamknął też viewer (double-Escape bug)');
  } else {
    log('WARN', 'Lightbox nie potwierdzony', 'imgs:' + imgs.length);
  }

  // 6. Accordion (viewer otwarty)
  const accBtn = page.locator('#case-viewer .kwcs-header').first();
  if ((await accBtn.count()) > 0) {
    await accBtn.click();
    await wait(400);
    const isOpen = (await page.locator('#case-viewer .kwcs-item.open').count()) > 0;
    if (isOpen) {
      log('OK', 'Accordion działa po injekcji');
    } else {
      log('FAIL', 'Accordion NIE otwiera się');
    }
  } else {
    log('WARN', 'Accordion: brak .kwcs-header w bieżącym viewport');
  }

  // 6b. Chapter rail
  const railCount = await page.locator('#razdwa-chapter-rail').count();
  const railVisible = railCount > 0 && await page.locator('#razdwa-chapter-rail').isVisible();
  if (railVisible) {
    // Sprawdź pozycję raila — powinien być fixed (nie scrollować z treścią)
    const railBox = await page.locator('#razdwa-chapter-rail').boundingBox();
    await page.evaluate(() => window.scrollBy(0, 500));
    await wait(300);
    const railBoxAfter = await page.locator('#razdwa-chapter-rail').boundingBox();
    const isSticky = railBox && railBoxAfter && Math.abs(railBox.y - railBoxAfter.y) < 5;
    await page.locator('#razdwa-chapter-rail .razdwa-chapter-link').first().click();
    await wait(500);
    if (isSticky) {
      log('OK', 'Chapter rail widoczny, sticky (nie scrolluje z treścią) i klikalny');
    } else {
      log('FAIL', 'Chapter rail widoczny ale NIE sticky — scrolluje z treścią', 'y-before:' + (railBox && railBox.y) + ' y-after:' + (railBoxAfter && railBoxAfter.y));
    }
  } else {
    log('FAIL', 'Chapter rail NIE widoczny', 'count:' + railCount);
  }

  // 7. Brak regresji
  const closeBtnFinal = page.locator('.close-button').first();
  if (await closeBtnFinal.isVisible()) await closeBtnFinal.click();
  await wait(400);
  const heroOk = await page.locator('.about-me-section').isVisible();
  const gridOk = await page.locator('.portfolio-new-grid').isVisible();
  const expOk = await page.locator('#experience-section').isVisible();
  if (heroOk && gridOk && expOk) {
    log('OK', 'Brak regresji — hero, grid, experience widoczne');
  } else {
    log('FAIL', 'Regresja!', 'hero:' + heroOk + ' grid:' + gridOk + ' exp:' + expOk);
  }

  await ctx.close();

  // Mobile 390x844
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mCtx.newPage();
  await mPage.goto(BASE, { waitUntil: 'networkidle' });
  await mPage.locator('[data-project="RazDwa"]').click();
  await wait(4000);
  const mKwcs = (await mPage.locator('#case-viewer section.kwcs').count()) > 0;
  const mHero = await mPage.locator('.about-me-section').isVisible();
  if (mKwcs && mHero) {
    log('OK', 'Mobile 390px — viewer działa, hero zachowany');
  } else {
    log('FAIL', 'Mobile problem', 'kwcs:' + mKwcs + ' hero:' + mHero);
  }
  await mCtx.close();
  await browser.close();

  console.log('\n=== QA WYNIK ===');
  const pass = results.filter(function(r) { return r.startsWith('OK'); }).length;
  const fail = results.filter(function(r) { return r.startsWith('FAIL'); }).length;
  const warn = results.filter(function(r) { return r.startsWith('WARN'); }).length;
  results.forEach(function(r) { console.log(' ', r); });
  console.log('\nPASS: ' + pass + '  FAIL: ' + fail + '  WARN: ' + warn);
  console.log(fail > 0 ? '\nVERDICT: FAIL' : '\nVERDICT: PASS');
  process.exit(fail > 0 ? 1 : 0);
})();
