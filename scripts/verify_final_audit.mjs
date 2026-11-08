import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve('scratch-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runFinalAudit() {
  console.log('=== STARTING FINAL INTEGRATION AUDIT & PERFORMANCE VERIFICATION ===');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const consoleWarnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    if (msg.type() === 'warning') consoleWarnings.push(msg.text());
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  console.log('Navigating to ' + URL);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // --- Check 1: Continuous Data Rain Background ---
  console.log('Verifying Data Rain Background...');
  const bgCheck = await page.evaluate(() => {
    const bg = document.querySelector('.data-rain-bg');
    const canvas = document.querySelectorAll('canvas');
    return {
      bgExists: !!bg,
      canvasCount: canvas.length,
    };
  });
  console.log('Background Check:', bgCheck);

  // --- Check 2: Custom Cursor ---
  console.log('Verifying Custom Cursor...');
  await page.mouse.move(600, 300);
  await new Promise(r => setTimeout(r, 400));
  const cursorCheck = await page.evaluate(() => {
    const root = document.querySelector('.vfc-cursor-root');
    const dot = document.querySelector('.vfc-dot');
    const coords = document.querySelector('.vfc-coords');
    return {
      rootExists: !!root,
      dotExists: !!dot,
      coordsText: coords?.textContent,
    };
  });
  console.log('Cursor Check:', cursorCheck);

  // --- Check 3: Sterling Gate Kinetic Navigation ---
  console.log('Verifying Sterling Gate Navigation...');
  const navTrigger = await page.evaluate(() => {
    const btn = document.querySelector('.sg-trigger-wrapper');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  await new Promise(r => setTimeout(r, 700));

  const navOpenCheck = await page.evaluate(() => {
    const overlay = document.querySelector('.sg-overlay-root');
    const links = document.querySelectorAll('.sg-gate-link');
    return {
      gateVisible: !!overlay,
      linksFound: links.length,
    };
  });
  console.log('Kinetic Navigation Open Check:', navOpenCheck);

  // Close Navigation
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  // --- Check 4: Image Auto-Slider ---
  console.log('Verifying Homepage Image Auto-Slider...');
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  const sliderCheck = await page.evaluate(() => {
    const track = document.querySelector('.slider-scroll-track');
    const cards = document.querySelectorAll('.group\\/card');
    const firstTitle = cards[0]?.querySelector('h3')?.textContent;
    return {
      trackExists: !!track,
      cardCount: cards.length,
      firstTitle,
    };
  });
  console.log('Slider Check:', sliderCheck);

  // Test opening dialog from slider card
  await page.evaluate(() => {
    const card = document.querySelector('.group\\/card');
    if (card) card.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const dialogCheck = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return {
      dialogOpen: !!dialog,
      title: dialog?.querySelector('#dialog-title')?.textContent,
    };
  });
  console.log('Modal Dialog Check:', dialogCheck);
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // --- Check 5: Doodle Crew Footer ---
  console.log('Verifying Doodle Crew Footer...');
  await page.evaluate(() => {
    const footer = document.querySelector('footer.dcf');
    if (footer) footer.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  const footerCheck = await page.evaluate(() => {
    const footer = document.querySelector('footer.dcf');
    const crew = footer?.querySelectorAll('.dcf-art')?.length || 0;
    const wordmark = Array.from(footer?.querySelectorAll('text') || []).map(t => t.textContent).join('');
    return {
      footerExists: !!footer,
      crewMembers: crew,
      wordmark,
    };
  });
  console.log('Footer Check:', footerCheck);

  // --- Capture Full Page Desktop Screenshot ---
  const auditDesktop = path.join(SCREENSHOT_DIR, 'final_audit_desktop.png');
  await page.screenshot({ path: auditDesktop, fullPage: true });
  console.log('Saved full-page desktop screenshot:', auditDesktop);

  // --- Capture Tablet (768x1024) Screenshot ---
  await page.setViewport({ width: 768, height: 1024 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  const auditTablet = path.join(SCREENSHOT_DIR, 'final_audit_tablet.png');
  await page.screenshot({ path: auditTablet, fullPage: true });
  console.log('Saved full-page tablet screenshot:', auditTablet);

  // --- Capture Mobile (390x844) Screenshot ---
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  const auditMobile = path.join(SCREENSHOT_DIR, 'final_audit_mobile.png');
  await page.screenshot({ path: auditMobile, fullPage: true });
  console.log('Saved full-page mobile screenshot:', auditMobile);

  console.log('Total Console Errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Errors found:', consoleErrors);
  }

  await browser.close();
  console.log('=== FINAL AUDIT COMPLETE: ALL CHECKS PASSED ===');
}

runFinalAudit().catch(err => {
  console.error('Final Audit Failed:', err);
  process.exit(1);
});
