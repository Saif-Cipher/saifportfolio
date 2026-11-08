import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve('scratch-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function verifySession2() {
  console.log('--- Launching Edge Browser: Session 2 Verification ---');
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

  // 1. Check DOM for single navbar & Sterling Gate presence
  const navCheck = await page.evaluate(() => {
    const headers = document.querySelectorAll('header');
    const sgHeader = document.querySelector('.sg-header');
    const oldHeader = document.querySelector('.site-header');
    const wordmark = document.querySelector('.wordmark');
    const gateBtn = document.querySelector('.sg-gate-btn, .sg-trigger-wrapper');
    const dataRain = document.querySelector('.dr-root');

    return {
      headerCount: headers.length,
      hasSgHeader: !!sgHeader,
      hasOldHeader: !!oldHeader,
      wordmarkText: wordmark?.textContent?.trim(),
      hasGateBtn: !!gateBtn,
      hasDataRain: !!dataRain,
    };
  });

  console.log('\n--- Initial Navigation Check ---');
  console.log('Total header elements in DOM:', navCheck.headerCount);
  console.log('Sterling Gate Header present:', navCheck.hasSgHeader);
  console.log('Old site-header present:', navCheck.hasOldHeader);
  console.log('Wordmark text:', navCheck.wordmarkText);
  console.log('Kinetic Gate button present:', navCheck.hasGateBtn);
  console.log('Data Rain background active:', navCheck.hasDataRain);

  // Capture Desktop closed hero
  const desktopHeroPath = path.join(SCREENSHOT_DIR, 'session2-desktop-hero.png');
  await page.screenshot({ path: desktopHeroPath });
  console.log('Saved closed header screenshot:', desktopHeroPath);

  // 2. Click Kinetic Gate trigger to open Sterling Gate
  console.log('\n--- Opening Sterling Gate ---');
  await page.click('.sg-trigger-wrapper');
  await new Promise(r => setTimeout(r, 800));

  // Check Gate overlay state
  const gateState = await page.evaluate(() => {
    const overlay = document.querySelector('.sg-overlay-root');
    const stage = document.querySelector('.sg-gate-stage');
    const links = Array.from(document.querySelectorAll('.sg-gate-link')).map(el => {
      const num = el.querySelector('.font-mono')?.textContent?.trim();
      const title = el.querySelector('.sg-kinetic-title')?.textContent?.trim();
      return `${num} ${title}`;
    });
    const shapes = document.querySelectorAll('.sg-shape');

    return {
      hasOverlay: !!overlay,
      hasStage: !!stage,
      links,
      shapeCount: shapes.length
    };
  });

  console.log('Overlay open:', gateState.hasOverlay);
  console.log('Gate stage present:', gateState.hasStage);
  console.log('Gate navigation links:', gateState.links);
  console.log('Ambient shape elements count:', gateState.shapeCount);

  // Capture Desktop open gate screenshot
  const gateOpenPath = path.join(SCREENSHOT_DIR, 'session2-sterling-gate-open.png');
  await page.screenshot({ path: gateOpenPath });
  console.log('Saved open gate screenshot:', gateOpenPath);

  // 3. Click a link (Work) to test smooth scroll and menu close
  console.log('\n--- Clicking navigation link (#work) ---');
  await page.evaluate(() => {
    const workLink = document.querySelector('.sg-gate-link[href="#work"]');
    if (workLink) (workLink).click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const afterClick = await page.evaluate(() => {
    const overlay = document.querySelector('.sg-overlay-root');
    const scrollY = window.scrollY;
    return {
      isOverlayClosed: !overlay,
      scrollY
    };
  });
  console.log('Overlay closed after link click:', afterClick.isOverlayClosed);
  console.log('Window scroll position (scrolled to work):', afterClick.scrollY);

  // 4. Test Mobile Viewport (390x844)
  console.log('\n--- Testing Mobile Viewport (390x844) ---');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1000));

  const mobileHeroPath = path.join(SCREENSHOT_DIR, 'session2-mobile-hero.png');
  await page.screenshot({ path: mobileHeroPath });
  console.log('Saved mobile hero screenshot:', mobileHeroPath);

  // Open Gate on Mobile
  await page.click('.sg-trigger-wrapper');
  await new Promise(r => setTimeout(r, 800));

  const mobileGatePath = path.join(SCREENSHOT_DIR, 'session2-mobile-gate-open.png');
  await page.screenshot({ path: mobileGatePath });
  console.log('Saved mobile open gate screenshot:', mobileGatePath);

  // Close with Escape key
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 1000));
  const closedByEsc = await page.evaluate(() => !document.querySelector('.sg-overlay-root'));
  console.log('Closed by Escape key:', closedByEsc);

  console.log('\n--- Console Errors ---');
  console.log('Error count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors);
  }

  await browser.close();
  console.log('\n--- Session 2 Verification Completed Successfully ---');
}

verifySession2().catch(err => {
  console.error('Session 2 Verification Failed:', err);
  process.exit(1);
});
