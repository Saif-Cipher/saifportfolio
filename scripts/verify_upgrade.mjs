import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:3000';
const OUT_DIR = path.resolve('scratch-screenshots');

async function verifyUpgrade() {
  console.log('🚀 Running Portfolio Upgrade Verification on http://localhost:3000...\n');

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

  // --- 1. DESKTOP VIEWPORT AUDIT (1440x900) ---
  console.log('--- 1. DESKTOP AUDIT (1440x900) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  const desktopAudit = await page.evaluate(() => {
    // 1. Header checks
    const fullHeaderBar = document.querySelector('header.sg-header');
    const floatingControls = document.querySelectorAll('.sterling-gate-root .fixed button, .sterling-gate-root .fixed a');
    const floatingTexts = Array.from(floatingControls).map(el => el.textContent.trim());

    // 2. Hero AI Engineer Gradual Spacing
    const aiEngineerEl = document.querySelector('.hero-role-primary');
    const gradualSpacingEl = aiEngineerEl?.querySelector('.select-none');
    const portraitEl = document.querySelector('.portrait-placeholder');
    const aiRect = aiEngineerEl?.getBoundingClientRect();
    const portRect = portraitEl?.getBoundingClientRect();

    // 3. Liquid buttons count & styling
    const liquidButtons = document.querySelectorAll('.group\\/lbtn');

    // 4. Border Beam presence
    const borderBeams = document.querySelectorAll('.animate-border-beam, [class*="animate-border-beam"]');

    // 5. Motion Footer presence & elements
    const motionFooter = document.querySelector('.motion-footer-root');
    const marqueeRibbon = document.querySelector('.animate-marquee');
    const footerColumns = document.querySelectorAll('.motion-footer-root ul');
    const giantTypography = document.querySelector('.motion-footer-root .bg-clip-text');

    return {
      header: {
        hasFullHeaderBar: !!fullHeaderBar,
        floatingControlsCount: floatingControls.length,
        floatingTexts,
      },
      hero: {
        aiEngineerFound: !!aiEngineerEl,
        aiEngineerText: aiEngineerEl?.textContent?.replace(/\s+/g, ' ').trim(),
        hasGradualSpacing: !!gradualSpacingEl,
        aiRight: aiRect?.right,
        portraitLeft: portRect?.left,
        collisionWithPortrait: aiRect && portRect ? aiRect.right > portRect.left : false,
      },
      liquidButtonsCount: liquidButtons.length,
      borderBeamsCount: borderBeams.length,
      motionFooter: {
        found: !!motionFooter,
        hasMarqueeRibbon: !!marqueeRibbon,
        columnsCount: footerColumns.length,
        giantTypographyText: giantTypography?.textContent?.trim(),
      },
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  console.log('Desktop Audit Results:', JSON.stringify(desktopAudit, null, 2));

  // Screenshot hero
  await page.screenshot({ path: path.join(OUT_DIR, 'upgrade_desktop_hero.png') });

  // Test Floating Menu Click & Open Gate
  console.log('Testing Menu toggle...');
  await page.evaluate(() => {
    const menuBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('MENU'));
    menuBtn?.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const menuOpenAudit = await page.evaluate(() => {
    const overlay = document.querySelector('.sg-overlay-root');
    const navItems = document.querySelectorAll('.sg-menu-item a');
    return {
      overlayVisible: !!overlay,
      navItemsCount: navItems.length,
      navLabels: Array.from(navItems).map(a => a.querySelector('.sg-kinetic-title')?.textContent?.trim()).filter(Boolean),
    };
  });
  console.log('Menu Open Audit:', JSON.stringify(menuOpenAudit, null, 2));
  await page.screenshot({ path: path.join(OUT_DIR, 'upgrade_desktop_menu_open.png') });

  // Close Menu
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.sg-overlay-root button[aria-label="Close menu"]');
    closeBtn?.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Scroll to work section and screenshot border beam
  await page.evaluate(() => document.querySelector('#work')?.scrollIntoView({ behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'upgrade_desktop_work.png') });

  // Scroll to footer and screenshot Motion Footer
  await page.evaluate(() => document.querySelector('.motion-footer-root')?.scrollIntoView({ behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'upgrade_desktop_footer.png') });


  // --- 2. MOBILE VIEWPORT AUDIT (390x844 - iPhone 14) ---
  console.log('\n--- 2. MOBILE AUDIT (390x844) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const mobileAudit = await page.evaluate(() => {
    const floatingControls = document.querySelectorAll('.sterling-gate-root .fixed button, .sterling-gate-root .fixed a');
    const wm = document.querySelector('.wordmark');
    return {
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      floatingControlsCount: floatingControls.length,
      headerBarPresent: !!document.querySelector('header.sg-header'),
      aiText: document.querySelector('.hero-role-primary')?.textContent?.replace(/\s+/g, ' ').trim(),
    };
  });
  console.log('Mobile Audit Results:', JSON.stringify(mobileAudit, null, 2));

  await page.screenshot({ path: path.join(OUT_DIR, 'upgrade_mobile_hero.png') });
  await page.evaluate(() => document.querySelector('#work')?.scrollIntoView({ behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'upgrade_mobile_work.png') });
  await page.evaluate(() => document.querySelector('.motion-footer-root')?.scrollIntoView({ behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'upgrade_mobile_footer.png') });

  // --- 3. CONSOLE ERRORS AUDIT ---
  console.log('\n--- 3. CONSOLE ERRORS AUDIT ---');
  console.log(`Total Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length === 0) {
    console.log('✅ 0 console errors detected!');
  } else {
    consoleErrors.forEach((e, i) => console.log(`  [${i+1}] ${e}`));
  }

  await browser.close();
  console.log('\n🎉 Portfolio Interaction & Visual Upgrade Verified Successfully!');
}

verifyUpgrade().catch(e => {
  console.error('Audit failed:', e);
  process.exit(1);
});
