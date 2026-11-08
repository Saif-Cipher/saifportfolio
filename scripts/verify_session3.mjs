import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve('scratch-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function verifySession3() {
  console.log('=== Launching Edge Browser: Session 3 Verification ===');
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

  // 1. Move mouse to trigger cursor
  console.log('Moving mouse to (500, 400)...');
  await page.mouse.move(500, 400);
  await new Promise(r => setTimeout(r, 600));

  const cursorState = await page.evaluate(() => {
    const root = document.querySelector('.vfc-cursor-root');
    const lineX = document.querySelector('.vfc-line-x');
    const lineY = document.querySelector('.vfc-line-y');
    const dot = document.querySelector('.vfc-dot');
    const coords = document.querySelector('.vfc-coords');

    const rootStyle = root ? window.getComputedStyle(root) : null;
    const dotStyle = dot ? window.getComputedStyle(dot) : null;

    return {
      hasRoot: !!root,
      hasLineX: !!lineX,
      hasLineY: !!lineY,
      hasDot: !!dot,
      hasCoords: !!coords,
      rootPointerEvents: rootStyle?.pointerEvents,
      rootZIndex: rootStyle?.zIndex,
      dotBg: dotStyle?.backgroundColor,
      dotBorder: dotStyle?.borderColor,
      coordsText: coords?.textContent?.trim(),
    };
  });

  console.log('\n--- Desktop Cursor Inspection ---');
  console.log('Cursor Root mounted:', cursorState.hasRoot);
  console.log('Horizontal crosshair line present:', cursorState.hasLineX);
  console.log('Vertical crosshair line present:', cursorState.hasLineY);
  console.log('Target dot present:', cursorState.hasDot);
  console.log('Coordinates badge present:', cursorState.hasCoords);
  console.log('Cursor Root pointer-events (must be none):', cursorState.rootPointerEvents);
  console.log('Cursor Root z-index:', cursorState.rootZIndex);
  console.log('Dot Background Color:', cursorState.dotBg);
  console.log('Coordinates text:', cursorState.coordsText);

  // Capture desktop screenshot with cursor
  const desktopCursorPath = path.join(SCREENSHOT_DIR, 'session3-desktop-cursor.png');
  await page.screenshot({ path: desktopCursorPath });
  console.log('Saved screenshot:', desktopCursorPath);

  // 2. Test Non-blocking Clickability (Click Explore CTA button)
  console.log('\n--- Testing Pointer Pass-Through & Clickability ---');
  const isBlocked = await page.evaluate(() => {
    const btn = document.querySelector('.button--orange, .sg-gate-btn');
    if (!btn) return true;
    const rect = btn.getBoundingClientRect();
    const topEl = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    // If top element is cursor, it blocked interaction!
    const isCursor = topEl?.closest('.vfc-cursor-root');
    return !!isCursor;
  });
  console.log('Interactive button is blocked by cursor (must be false):', isBlocked);

  // Click CTA button to ensure it responds
  await page.click('.sg-gate-btn');
  await new Promise(r => setTimeout(r, 800));
  const gateOpenAfterClick = await page.evaluate(() => !!document.querySelector('.sg-overlay-root'));
  console.log('Sterling Gate opened cleanly on click through cursor:', gateOpenAfterClick);

  // Close menu
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  // 3. Test Touch Device Fallback (Emulate touch device)
  console.log('\n--- Testing Mobile / Touch Device Fallback ---');
  const touchPage = await browser.newPage();
  await touchPage.emulate({
    viewport: {
      width: 390,
      height: 844,
      isMobile: true,
      hasTouch: true
    },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  await touchPage.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const touchCursorState = await touchPage.evaluate(() => {
    const root = document.querySelector('.vfc-cursor-root');
    return {
      hasRoot: !!root
    };
  });
  console.log('Custom cursor mounted on touch device (must be false):', touchCursorState.hasRoot);

  const mobileTouchPath = path.join(SCREENSHOT_DIR, 'session3-mobile-touch.png');
  await touchPage.screenshot({ path: mobileTouchPath });
  console.log('Saved touch screenshot:', mobileTouchPath);
  await touchPage.close();

  console.log('\n--- Console Errors Check ---');
  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors);
  }

  await browser.close();
  console.log('\n=== Session 3 Verification Completed Successfully ===');
}

verifySession3().catch(err => {
  console.error('Session 3 Verification Failed:', err);
  process.exit(1);
});
