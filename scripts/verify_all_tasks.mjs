import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:3000';
const OUT_DIR = path.resolve('scratch-screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function verifyAll() {
  console.log('🚀 Starting Full Verification for Task Implementation...\n');

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

  // ==========================================
  // 1. DESKTOP VIEWPORT AUDIT (1440x900)
  // ==========================================
  console.log('--- 1. DESKTOP AUDIT (1440x900) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Capture Hero Swarm Rebuild
  await page.screenshot({ path: path.join(OUT_DIR, 'task_swarm_hero.png') });
  console.log('📸 Saved task_swarm_hero.png');

  // Audit Section Dividers
  const dividerAudit = await page.evaluate(() => {
    const heroBottom = document.querySelector('.hero-bottom');
    const contactTopline = document.querySelector('.contact-topline');
    const motionFooter = document.querySelector('.motion-footer-root');
    const heroBottomBorder = heroBottom ? window.getComputedStyle(heroBottom).borderTopWidth : null;
    const contactToplineBorder = contactTopline ? window.getComputedStyle(contactTopline).borderBottomWidth : null;

    return {
      heroBottomBorder,
      contactToplineBorder,
      hasWideDivider: parseFloat(heroBottomBorder) > 0 || parseFloat(contactToplineBorder) > 0
    };
  });
  console.log('Divider Audit:', dividerAudit);

  // Scroll to Approach section to trigger Swarm
  await page.evaluate(() => {
    const el = document.getElementById('approach');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'task_swarm_approach.png') });
  console.log('📸 Saved task_swarm_approach.png');

  // Scroll to Contact section & MAKE IT WORK panel
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await new Promise(r => setTimeout(r, 1200));

  const borderBeamAudit = await page.evaluate(() => {
    const panel = document.querySelector('.contact-art');
    const beam = panel ? panel.querySelector('.border-beam-mesh') : null;
    const headline = panel ? panel.querySelector('.contact-art__headline')?.textContent : null;
    const style = panel ? window.getComputedStyle(panel) : null;

    return {
      hasPanel: !!panel,
      hasBorderBeam: !!beam,
      borderRadius: style ? style.borderRadius : null,
      headline: headline ? headline.replace(/\s+/g, ' ').trim() : null,
      backdropFilter: style ? style.backdropFilter : null
    };
  });
  console.log('Border Beam Panel Audit:', borderBeamAudit);

  // Capture MAKE IT WORK panel with Border Beam
  const contactArtElement = await page.$('.contact-art');
  if (contactArtElement) {
    await contactArtElement.screenshot({ path: path.join(OUT_DIR, 'task_border_beam_panel.png') });
    console.log('📸 Saved task_border_beam_panel.png');
  }

  // Scroll to Footer
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUT_DIR, 'task_transition_blend.png') });
  console.log('📸 Saved task_transition_blend.png');

  // Verify Name on Desktop
  const desktopNameAudit = await page.evaluate(() => {
    const heroName = document.querySelector('.hero-name');
    const fullSpan = heroName ? heroName.querySelector('.responsive-name-full') : null;
    const shortSpan = heroName ? heroName.querySelector('.responsive-name-short') : null;
    const fullVisible = fullSpan ? window.getComputedStyle(fullSpan).display !== 'none' : false;
    const shortVisible = shortSpan ? window.getComputedStyle(shortSpan).display !== 'none' : false;

    return {
      fullVisible,
      shortVisible,
      heroText: heroName?.textContent?.trim()
    };
  });
  console.log('Desktop Name Audit:', desktopNameAudit);

  // ==========================================
  // 2. MOBILE VIEWPORT AUDIT (390x844)
  // ==========================================
  console.log('\n--- 2. MOBILE AUDIT (390x844) ---');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(OUT_DIR, 'task_mobile_hero.png') });
  console.log('📸 Saved task_mobile_hero.png');

  const mobileAudit = await page.evaluate(() => {
    const heroName = document.querySelector('.hero-name');
    const fullSpan = heroName ? heroName.querySelector('.responsive-name-full') : null;
    const shortSpan = heroName ? heroName.querySelector('.responsive-name-short') : null;
    const fullVisible = fullSpan ? window.getComputedStyle(fullSpan).display !== 'none' : false;
    const shortVisible = shortSpan ? window.getComputedStyle(shortSpan).display !== 'none' : false;

    const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;

    return {
      heroText: heroName?.textContent?.trim(),
      fullVisible,
      shortVisible,
      hasOverflow,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth
    };
  });
  console.log('Mobile Audit:', mobileAudit);

  // Scroll to bottom on mobile
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUT_DIR, 'task_mobile_footer.png') });
  console.log('📸 Saved task_mobile_footer.png');

  // ==========================================
  // 3. CONSOLE AUDIT
  // ==========================================
  console.log('\n--- 3. CONSOLE AUDIT ---');
  console.log('Console Errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Errors found:', consoleErrors);
  } else {
    console.log('✅ 0 console errors detected!');
  }

  await browser.close();
  console.log('\n🎉 Verification completed successfully!');
}

verifyAll().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
