import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:3000';
const OUT_DIR = path.resolve('scratch-screenshots');

async function runVerification() {
  console.log('🚀 Starting Theme & Typography Verification with puppeteer-core & Edge...\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push('[PageError] ' + err.toString());
  });

  // --- 1. DESKTOP TEST (1440x900) ---
  console.log('--- 1. DESKTOP VIEWPORT (1440x900) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Check document overflow
  const desktopOverflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });
  console.log(`Desktop Overflow Check: scrollWidth=${desktopOverflow.scrollWidth}, innerWidth=${desktopOverflow.innerWidth}, hasOverflow=${desktopOverflow.hasOverflow}`);

  // Check Hero Wordmark
  const heroWordmark = await page.evaluate(() => {
    const wm = document.querySelector('.hero-word');
    if (!wm) return null;
    const letters = Array.from(wm.querySelectorAll('.hero-letter')).map(el => el.textContent.trim()).filter(Boolean);
    const firstLetter = wm.querySelector('.hero-letter');
    const compStyle = firstLetter ? window.getComputedStyle(firstLetter) : null;
    const rect = wm.getBoundingClientRect();
    return {
      text: letters.join(''),
      letterCount: letters.length,
      fullTextContent: wm.textContent.replace(/\s+/g, ' ').trim(),
      fontFamily: compStyle?.fontFamily,
      fontWeight: compStyle?.fontWeight,
      fontSize: compStyle?.fontSize,
      letterSpacing: compStyle?.letterSpacing,
      textTransform: compStyle?.textTransform,
      width: rect.width,
      left: rect.left,
      right: rect.right,
      viewportWidth: window.innerWidth
    };
  });
  console.log('Hero Wordmark Inspection (Desktop):', JSON.stringify(heroWordmark, null, 2));

  // Check Computed Typography
  const typographyCheck = await page.evaluate(() => {
    const h1 = document.querySelector('h1') || document.querySelector('.hero-name');
    const h2 = document.querySelector('.section-title');
    const body = document.body;
    const p = document.querySelector('p');
    const button = document.querySelector('button');

    return {
      h1Font: h1 ? window.getComputedStyle(h1).fontFamily : null,
      h2Font: h2 ? window.getComputedStyle(h2).fontFamily : null,
      bodyFont: window.getComputedStyle(body).fontFamily,
      pFont: p ? window.getComputedStyle(p).fontFamily : null,
      buttonFont: button ? window.getComputedStyle(button).fontFamily : null
    };
  });
  console.log('Computed Typography Check:', JSON.stringify(typographyCheck, null, 2));

  // Check Color Theme & Surfaces
  const themeCheck = await page.evaluate(() => {
    const rootStyle = window.getComputedStyle(document.documentElement);
    const bodyStyle = window.getComputedStyle(document.body);
    const card = document.querySelector('.group\\/card');
    const cardStyle = card ? window.getComputedStyle(card) : null;
    const ctaBtn = document.querySelector('.sg-header-cta') || document.querySelector('.filter-button[data-active="true"]');
    const ctaStyle = ctaBtn ? window.getComputedStyle(ctaBtn) : null;

    return {
      cssVars: {
        bgDeep: rootStyle.getPropertyValue('--bg-deep').trim(),
        bgSurface: rootStyle.getPropertyValue('--bg-surface').trim(),
        vividRed: rootStyle.getPropertyValue('--vivid-red').trim(),
        textMain: rootStyle.getPropertyValue('--text-main').trim(),
        textDark: rootStyle.getPropertyValue('--text-dark').trim(),
      },
      bodyBg: bodyStyle.backgroundColor,
      bodyColor: bodyStyle.color,
      cardBg: cardStyle?.backgroundColor,
      cardBorder: cardStyle?.borderColor,
      ctaBg: ctaStyle?.backgroundColor,
      ctaColor: ctaStyle?.color,
    };
  });
  console.log('Color Theme Check:', JSON.stringify(themeCheck, null, 2));

  // Capture Desktop Screenshots
  await page.screenshot({ path: path.join(OUT_DIR, 'theme_desktop_hero.png') });
  console.log('📸 Saved theme_desktop_hero.png');

  // Scroll to work section and screenshot
  await page.evaluate(() => {
    document.querySelector('#work')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'theme_desktop_work.png') });
  console.log('📸 Saved theme_desktop_work.png');

  // Scroll to footer and screenshot
  await page.evaluate(() => {
    document.querySelector('.doodle-footer-root')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'theme_desktop_footer.png') });
  console.log('📸 Saved theme_desktop_footer.png');


  // --- 2. MOBILE TEST (390x844 - iPhone 14) ---
  console.log('\n--- 2. MOBILE VIEWPORT (390x844) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  const mobileOverflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });
  console.log(`Mobile Overflow Check: scrollWidth=${mobileOverflow.scrollWidth}, innerWidth=${mobileOverflow.innerWidth}, hasOverflow=${mobileOverflow.hasOverflow}`);

  const mobileWordmark = await page.evaluate(() => {
    const wm = document.querySelector('.hero-word');
    if (!wm) return null;
    const rect = wm.getBoundingClientRect();
    const firstLetter = wm.querySelector('.hero-letter');
    const compStyle = firstLetter ? window.getComputedStyle(firstLetter) : null;
    return {
      fullTextContent: wm.textContent.replace(/\s+/g, ' ').trim(),
      fontSize: compStyle?.fontSize,
      width: rect.width,
      viewportWidth: window.innerWidth,
      fitsInsideViewport: rect.width <= window.innerWidth
    };
  });
  console.log('Hero Wordmark Inspection (Mobile):', JSON.stringify(mobileWordmark, null, 2));

  await page.screenshot({ path: path.join(OUT_DIR, 'theme_mobile_hero.png') });
  console.log('📸 Saved theme_mobile_hero.png');

  // Scroll to work section on mobile
  await page.evaluate(() => {
    document.querySelector('#work')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'theme_mobile_work.png') });
  console.log('📸 Saved theme_mobile_work.png');

  // Open Kinetic Navigation on mobile
  await page.evaluate(() => {
    const trigger = document.querySelector('.sg-trigger-wrapper');
    if (trigger) trigger.click();
  });
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(OUT_DIR, 'theme_mobile_nav.png') });
  console.log('📸 Saved theme_mobile_nav.png');

  console.log('\n--- 3. CONSOLE ERRORS AUDIT ---');
  console.log(`Total Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((err, idx) => console.log(`  [${idx + 1}] ${err}`));
  } else {
    console.log('✅ 0 console errors detected!');
  }

  await browser.close();
  console.log('\n🎉 Verification completed successfully!');
}

runVerification().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
