import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:3000';
const OUT_DIR = path.resolve('scratch-screenshots');

async function testAll() {
  console.log('🚀 Running Comprehensive Browser Visual Audit on http://localhost:3000...\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push('[PageError] ' + err.toString()));

  // 1. DESKTOP AUDIT (1440x900)
  console.log('--- 1. DESKTOP AUDIT (1440x900) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  const desktopResults = await page.evaluate(() => {
    // Check 1: Card titles & contrast
    const cardTitle = document.querySelector('.group\\/card h3');
    const cardTitleStyle = cardTitle ? window.getComputedStyle(cardTitle) : null;
    const cardMeta = cardTitle ? cardTitle.closest('.bg-\\[\\#F8F7F2\\]') : null;
    const cardMetaStyle = cardMeta ? window.getComputedStyle(cardMeta) : null;
    const cardSummary = document.querySelector('.group\\/card p');
    const cardSummaryStyle = cardSummary ? window.getComputedStyle(cardSummary) : null;

    // Check 2: Header Wordmark visibility
    const wm = document.querySelector('.wordmark');
    const wmRect = wm?.getBoundingClientRect();
    const wmStyle = wm ? window.getComputedStyle(wm) : null;

    // Check 3: Hero Role & AI Engineer prominence
    const heroRole = document.querySelector('.hero-role');
    const aiEngineer = document.querySelector('.hero-role-primary');
    const aiStyle = aiEngineer ? window.getComputedStyle(aiEngineer) : null;
    const kicker = document.querySelector('.hero-role-kicker');
    const kickerStyle = kicker ? window.getComputedStyle(kicker) : null;
    const sec = document.querySelector('.hero-role-secondary');
    const secStyle = sec ? window.getComputedStyle(sec) : null;

    // Collision check between hero-copy and portrait
    const heroCopy = document.querySelector('.hero-copy');
    const copyRect = heroCopy?.getBoundingClientRect();
    const portrait = document.querySelector('.portrait-placeholder');
    const portRect = portrait?.getBoundingClientRect();

    // Check 4: Footer layout
    const footerTop = document.querySelector('.dcf-top');
    const footerCols = document.querySelectorAll('.dcf-top .space-y-3\\.5');

    return {
      cards: {
        titleFound: !!cardTitle,
        titleText: cardTitle?.textContent?.trim(),
        titleColor: cardTitleStyle?.color,
        titleFont: cardTitleStyle?.fontFamily,
        cardBg: cardMetaStyle?.backgroundColor,
        summaryColor: cardSummaryStyle?.color,
      },
      header: {
        wordmarkFound: !!wm,
        wordmarkText: wm?.textContent?.replace(/\s+/g, ' ').trim(),
        wordmarkWidth: wmRect?.width,
        wordmarkVisible: wmRect?.width > 0 && wmStyle?.visibility === 'visible',
        whiteSpace: wmStyle?.whiteSpace,
        flexShrink: wmStyle?.flexShrink,
      },
      heroTypography: {
        aiEngineerFound: !!aiEngineer,
        aiEngineerText: aiEngineer?.textContent?.trim(),
        aiEngineerFontSize: aiStyle?.fontSize,
        aiEngineerFontWeight: aiStyle?.fontWeight,
        aiEngineerColor: aiStyle?.color,
        kickerText: kicker?.textContent?.trim(),
        kickerFontSize: kickerStyle?.fontSize,
        secondaryText: sec?.textContent?.trim(),
        secondaryFontSize: secStyle?.fontSize,
        copyRight: copyRect?.right,
        portraitLeft: portRect?.left,
        collisionWithPortrait: copyRect && portRect ? copyRect.right > portRect.left : false,
      },
      footer: {
        footerFound: !!footerTop,
        columnsCount: footerCols.length,
      },
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  console.log('Desktop Results:', JSON.stringify(desktopResults, null, 2));

  await page.screenshot({ path: path.join(OUT_DIR, 'fix_desktop_hero.png') });
  await page.evaluate(() => document.querySelector('#work')?.scrollIntoView({ behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'fix_desktop_work.png') });
  await page.evaluate(() => document.querySelector('.dcf')?.scrollIntoView({ behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'fix_desktop_footer.png') });


  // 2. RESPONSIVE BREAKPOINT AUDIT FOR HEADER & HERO (1024, 768, 640, 390, 360, 320)
  console.log('\n--- 2. RESPONSIVE BREAKPOINTS CHECK ---');
  for (const w of [1024, 768, 640, 390, 360, 320]) {
    await page.setViewport({ width: w, height: 800, isMobile: w <= 640 });
    await page.goto(URL, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const check = await page.evaluate(() => {
      const wm = document.querySelector('.wordmark');
      const r = wm?.getBoundingClientRect();
      const ai = document.querySelector('.hero-role-primary');
      const aiStyle = ai ? window.getComputedStyle(ai) : null;
      return {
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
        wordmarkText: wm?.textContent?.replace(/\s+/g, ' ').trim(),
        wordmarkLeft: r?.left,
        wordmarkRight: r?.right,
        viewportWidth: window.innerWidth,
        fitsInViewport: r ? r.right <= window.innerWidth : false,
        aiFontSize: aiStyle?.fontSize,
      };
    });
    console.log(`Viewport ${w}px:`, JSON.stringify(check));
    if (w === 390) {
      await page.screenshot({ path: path.join(OUT_DIR, 'fix_mobile_hero.png') });
      await page.evaluate(() => document.querySelector('#work')?.scrollIntoView({ behavior: 'instant' }));
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(OUT_DIR, 'fix_mobile_work.png') });
      await page.evaluate(() => document.querySelector('.dcf')?.scrollIntoView({ behavior: 'instant' }));
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(OUT_DIR, 'fix_mobile_footer.png') });
    }
  }

  console.log('\n--- 3. CONSOLE ERRORS AUDIT ---');
  console.log(`Total Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length === 0) {
    console.log('✅ 0 console errors detected!');
  } else {
    consoleErrors.forEach((e, i) => console.log(`  [${i+1}] ${e}`));
  }

  await browser.close();
  console.log('\n🎉 Visual Fixes Verification Completed Successfully!');
}

testAll().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});
