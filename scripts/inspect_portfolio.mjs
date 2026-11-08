import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve('scratch-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runInspection() {
  console.log('--- Launching Edge Browser ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const consoleLogs = [];
  const networkErrors = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleLogs.push({ type, text });
    if (type === 'error' || type === 'warn') {
      console.log(`[Browser ${type.toUpperCase()}]`, text);
    }
  });

  page.on('pageerror', err => {
    console.log('[Page Error]', err.toString());
    consoleLogs.push({ type: 'pageerror', text: err.toString() });
  });

  page.on('requestfailed', req => {
    console.log('[Request Failed]', req.url(), req.failure()?.errorText);
    networkErrors.push({ url: req.url(), error: req.failure()?.errorText });
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      console.log(`[HTTP ${res.status()}]`, res.url());
      networkErrors.push({ url: res.url(), status: res.status() });
    }
  });

  // 1. Desktop Test (1440x900)
  console.log('\n--- Testing Desktop (1440x900) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle2' });

  // Wait 1.5s for entrance animations
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-hero.png') });
  console.log('Saved desktop-hero.png');

  // Check horizontal overflow
  const desktopOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Desktop horizontal overflow:', desktopOverflow);

  // Test Mousemove parallax
  console.log('Testing mouse parallax on hero...');
  await page.mouse.move(720, 450);
  await page.mouse.move(300, 200);
  await page.mouse.move(1100, 700);
  await new Promise(r => setTimeout(r, 500));

  // Test Filter tabs
  console.log('Testing filter buttons...');
  const filterBtns = await page.$$('.filter-button');
  console.log(`Found ${filterBtns.length} filter buttons.`);
  if (filterBtns.length > 1) {
    await filterBtns[1].click(); // click Automations
    await new Promise(r => setTimeout(r, 400));
    await filterBtns[2].click(); // click Websites
    await new Promise(r => setTimeout(r, 400));
    await filterBtns[0].click(); // click All Work
    await new Promise(r => setTimeout(r, 400));
  }

  // Test Project Modal Dialog
  console.log('Testing project card modal click...');
  const firstCard = await page.$('.project-card');
  if (firstCard) {
    await firstCard.click();
    await new Promise(r => setTimeout(r, 600));
    const dialogOpen = await page.$('[role="dialog"]');
    console.log('Dialog opened successfully:', !!dialogOpen);
    if (dialogOpen) {
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-dialog.png') });
      console.log('Saved desktop-dialog.png');
      // Press Escape to close
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 400));
      const dialogClosed = await page.$('[role="dialog"]');
      console.log('Dialog closed with Escape:', !dialogClosed);
    }
  }

  // 2. Tablet Test (768x1024)
  console.log('\n--- Testing Tablet (768x1024) ---');
  await page.setViewport({ width: 768, height: 1024 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'tablet-hero.png') });
  const tabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Tablet horizontal overflow:', tabletOverflow);

  // 3. Mobile Test (390x844)
  console.log('\n--- Testing Mobile (390x844) ---');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-hero.png') });
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Mobile 390px horizontal overflow:', mobileOverflow);

  // Test Mobile Navigation Drawer
  console.log('Testing mobile menu toggle...');
  const menuToggle = await page.$('.menu-toggle');
  if (menuToggle) {
    await menuToggle.click();
    await new Promise(r => setTimeout(r, 400));
    const mobileNav = await page.$('#mobile-navigation');
    console.log('Mobile nav drawer visible:', !!mobileNav);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-menu-open.png') });
    console.log('Saved mobile-menu-open.png');
    // Click again to close
    await menuToggle.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // 4. Compact Mobile Test (320x568)
  console.log('\n--- Testing Compact Mobile (320x568) ---');
  await page.setViewport({ width: 320, height: 568 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  const compactOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Compact 320px horizontal overflow:', compactOverflow);

  await browser.close();

  console.log('\n=== SUMMARY ===');
  console.log('Total console logs captured:', consoleLogs.length);
  console.log('Total network errors / 4xx / 5xx:', networkErrors.length);
  if (networkErrors.length > 0) {
    console.log('Network errors details:', networkErrors);
  }
}

runInspection().catch(err => {
  console.error('Inspection script error:', err);
  process.exit(1);
});
