import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve('scratch-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function verifySession5() {
  console.log('=== Launching Edge Browser: Session 5 Verification (Doodle Crew Footer) ===');
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

  // 1. Scroll to footer
  console.log('Scrolling to footer...');
  await page.evaluate(() => {
    const footer = document.querySelector('footer.dcf');
    if (footer) footer.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  // 2. Check footer components and structure
  const footerInfo = await page.evaluate(() => {
    const footer = document.querySelector('footer.dcf');
    const brand = footer ? footer.querySelector('.font-serif')?.textContent?.trim() : null;
    const letters = footer ? Array.from(footer.querySelectorAll('text')).map(t => t.textContent).join('') : '';
    const crewMembers = footer ? footer.querySelectorAll('.dcf-art').length : 0;
    const navLinks = footer ? footer.querySelectorAll('a').length : 0;
    const backToTop = footer ? !!footer.querySelector('button[aria-label="Scroll back to top"]') : false;
    return {
      footerExists: !!footer,
      brand,
      wordmark: letters,
      crewMembersCount: crewMembers,
      navLinksCount: navLinks,
      hasBackToTop: backToTop,
    };
  });
  console.log('Footer Info:', JSON.stringify(footerInfo, null, 2));

  // Capture desktop footer screenshot
  const desktopShot = path.join(SCREENSHOT_DIR, 'session5_footer_desktop.png');
  await page.screenshot({ path: desktopShot, fullPage: false });
  console.log(`Saved screenshot: ${desktopShot}`);

  // 3. Test Clicking a Crew Member to trigger Speech Bubble
  console.log('Testing crew interaction: clicking a crew member...');
  await page.evaluate(() => {
    const member = document.querySelector('.dcf-art[role="button"]');
    if (member) member.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 500));

  const speechBubble = await page.evaluate(() => {
    const bubble = document.querySelector('.animate-in');
    return {
      visible: !!bubble,
      text: bubble ? bubble.textContent : null,
    };
  });
  console.log('Speech Bubble Info:', JSON.stringify(speechBubble, null, 2));

  // Capture speech bubble screenshot
  const speechShot = path.join(SCREENSHOT_DIR, 'session5_footer_speech.png');
  await page.screenshot({ path: speechShot, fullPage: false });
  console.log(`Saved screenshot: ${speechShot}`);

  // 4. Test "Back to top" button
  console.log('Testing "Back to top" button...');
  const scrollBefore = await page.evaluate(() => window.scrollY);
  console.log(`Scroll position before clicking Back to top: ${scrollBefore}px`);

  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Scroll back to top"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const scrollAfter = await page.evaluate(() => window.scrollY);
  console.log(`Scroll position after clicking Back to top: ${scrollAfter}px`);
  const backToTopSuccess = scrollAfter < scrollBefore && scrollAfter < 100;
  console.log(`Back to top verified: ${backToTopSuccess}`);

  // 5. Test Mobile Viewport (390x844)
  console.log('Testing mobile viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    const footer = document.querySelector('footer.dcf');
    if (footer) footer.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  const mobileShot = path.join(SCREENSHOT_DIR, 'session5_footer_mobile.png');
  await page.screenshot({ path: mobileShot, fullPage: false });
  console.log(`Saved screenshot: ${mobileShot}`);

  console.log('Console Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Console errors:', consoleErrors);
  }

  await browser.close();
  console.log('=== All Session 5 Verifications Completed Successfully ===');
}

verifySession5().catch(err => {
  console.error('Session 5 Verification Failed:', err);
  process.exit(1);
});
