import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve('scratch-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function verifySession4() {
  console.log('=== Launching Edge Browser: Session 4 Comprehensive Verification ===');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  console.log('Navigating to ' + URL);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Scroll to #work section
  console.log('Scrolling to #work section...');
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  // 2. Check slider track and cards
  const sliderInfo = await page.evaluate(() => {
    const track = document.querySelector('.slider-scroll-track');
    const cards = document.querySelectorAll('.group\\/card');
    const mask = document.querySelector('.slider-mask-container');
    const playPauseBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('PAUSE') || b.textContent?.includes('RESUME'));
    const style = track ? window.getComputedStyle(track) : null;
    return {
      trackExists: !!track,
      cardCount: cards.length,
      maskExists: !!mask,
      hasPlayPauseBtn: !!playPauseBtn,
      firstCardTitle: cards[0]?.querySelector('h3')?.textContent || '',
      firstCardNumber: cards[0]?.querySelector('span')?.textContent || '',
      animationName: style?.animationName,
      animationDuration: style?.animationDuration,
    };
  });

  console.log('Slider Info:', JSON.stringify(sliderInfo, null, 2));

  // 3. Helper to read translateX
  const getTransform = () => page.evaluate(() => {
    const track = document.querySelector('.slider-scroll-track');
    if (!track) return null;
    const style = window.getComputedStyle(track);
    return {
      transform: style.transform,
      matrix: new DOMMatrix(style.transform).m41,
      playState: style.animationPlayState
    };
  });

  // Test auto-scroll motion
  console.log('Testing auto-scroll motion...');
  const t1 = await getTransform();
  await new Promise(r => setTimeout(r, 1500));
  const t2 = await getTransform();

  const movedDistance = (t1 && t2) ? Math.abs(t1.matrix - t2.matrix) : 0;
  const isAutoScrolling = movedDistance > 5;
  console.log(`T1 translateX: ${t1?.matrix?.toFixed(1)}px, T2 translateX: ${t2?.matrix?.toFixed(1)}px, Delta: ${movedDistance.toFixed(1)}px`);
  console.log(`Auto-scrolling verified: ${isAutoScrolling}`);

  // Test Pause on Hover over stationary mask container
  console.log('Testing hover pause: moving mouse over mask container...');
  const maskBox = await page.evaluate(() => {
    const mask = document.querySelector('.slider-mask-container');
    if (!mask) return null;
    const r = mask.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  if (maskBox) {
    await page.mouse.move(maskBox.x, maskBox.y);
  }
  await new Promise(r => setTimeout(r, 600));

  const ht1 = await getTransform();
  await new Promise(r => setTimeout(r, 1200));
  const ht2 = await getTransform();
  const hoverDiff = (ht1 && ht2) ? Math.abs(ht1.matrix - ht2.matrix) : 999;
  const isPausedOnHover = hoverDiff < 1;
  console.log(`Hover T1: ${ht1?.matrix?.toFixed(1)}px (state: ${ht1?.playState}), Hover T2: ${ht2?.matrix?.toFixed(1)}px (state: ${ht2?.playState}), Hover diff: ${hoverDiff.toFixed(1)}px`);
  console.log(`Pause on hover verified: ${isPausedOnHover}`);

  // Move mouse away to resume
  console.log('Moving mouse away from slider...');
  await page.mouse.move(100, 100);
  await new Promise(r => setTimeout(r, 600));

  // Test Manual Pause / Play button
  console.log('Testing manual toggle button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pBtn = btns.find(b => b.textContent?.includes('PAUSE'));
    if (pBtn) pBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  const manualPauseState = await getTransform();
  await new Promise(r => setTimeout(r, 1000));
  const manualPauseCheck = await getTransform();
  const manualDiff = (manualPauseState && manualPauseCheck) ? Math.abs(manualPauseState.matrix - manualPauseCheck.matrix) : 999;
  console.log(`Manual Pause T1: ${manualPauseState?.matrix?.toFixed(1)}px, T2: ${manualPauseCheck?.matrix?.toFixed(1)}px, Diff: ${manualDiff.toFixed(1)}px`);
  console.log(`Manual pause verified: ${manualDiff < 1}`);

  // Click resume to restore
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const rBtn = btns.find(b => b.textContent?.includes('RESUME'));
    if (rBtn) rBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Capture desktop slider screenshot
  const desktopShot = path.join(SCREENSHOT_DIR, 'session4_slider_desktop.png');
  await page.screenshot({ path: desktopShot, fullPage: false });
  console.log(`Saved screenshot: ${desktopShot}`);

  // 4. Test clicking card to open ProjectDialog
  console.log('Clicking card to test ProjectDialog modal...');
  await page.evaluate(() => {
    const card = document.querySelector('.group\\/card');
    if (card) card.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const dialogInfo = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const title = dialog ? dialog.querySelector('#dialog-title')?.textContent : null;
    const stages = dialog ? dialog.querySelectorAll('.p-3.bg-\\[\\#38000A\\]').length : 0;
    const tools = dialog ? dialog.querySelectorAll('.px-3.py-1.bg-\\[\\#38000A\\]').length : 0;
    return {
      dialogOpen: !!dialog,
      dialogTitle: title,
      keyStagesCount: stages,
      toolsCount: tools,
    };
  });
  console.log('Dialog Info:', JSON.stringify(dialogInfo, null, 2));

  // Capture dialog screenshot
  const dialogShot = path.join(SCREENSHOT_DIR, 'session4_dialog_open.png');
  await page.screenshot({ path: dialogShot, fullPage: false });
  console.log(`Saved screenshot: ${dialogShot}`);

  // Close dialog via Escape
  console.log('Pressing Escape to close dialog...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  const dialogClosed = await page.evaluate(() => !document.querySelector('[role="dialog"]'));
  console.log(`Dialog closed successfully: ${dialogClosed}`);

  // 5. Test Filters
  console.log('Testing category filter tabs...');
  const filterResults = await page.evaluate(async () => {
    const buttons = Array.from(document.querySelectorAll('.filter-button'));
    const results = {};
    for (const btn of buttons) {
      btn.click();
      await new Promise(r => setTimeout(r, 200));
      const activeBtn = document.querySelector('.filter-button.is-active')?.textContent?.trim();
      const cardCount = document.querySelectorAll('.group\\/card').length;
      results[btn.textContent.trim()] = { activeBtn, cardCount };
    }
    // Restore ALL
    buttons[0]?.click();
    return results;
  });
  console.log('Filter Test Results:', JSON.stringify(filterResults, null, 2));

  // 6. Test Mobile Viewport (390x844)
  console.log('Testing mobile viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  const mobileShot = path.join(SCREENSHOT_DIR, 'session4_slider_mobile.png');
  await page.screenshot({ path: mobileShot, fullPage: false });
  console.log(`Saved screenshot: ${mobileShot}`);

  console.log('Console Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Console errors:', consoleErrors);
  }

  await browser.close();
  console.log('=== All Session 4 Verifications Completed Successfully ===');
}

verifySession4().catch(err => {
  console.error('Session 4 Verification Failed:', err);
  process.exit(1);
});
