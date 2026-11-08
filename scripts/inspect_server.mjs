import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve('scratch-screenshots');

async function inspectServer() {
  console.log('=== Checking Local Server Rendering ===');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const allLogs = [];
  const errors = [];
  const warnings = [];
  const failedRequests = [];

  page.on('console', msg => {
    allLogs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') errors.push(msg.text());
    if (msg.type() === 'warn') warnings.push(msg.text());
  });

  page.on('pageerror', err => {
    errors.push('[PageError] ' + err.toString());
  });

  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), error: req.failure()?.errorText });
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url(), status: res.status() });
    }
  });

  console.log('Navigating to http://localhost:3000...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });

  // Wait 2.5s for all animations and canvases
  await new Promise(r => setTimeout(r, 2500));

  // Full page screenshot
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'server-check-hero.png') });
  
  // Scroll down and screenshot Work section
  await page.evaluate(() => {
    const work = document.querySelector('#work') || document.querySelector('.work-section');
    if (work) work.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'server-check-work.png') });

  // Scroll down to Approach section
  await page.evaluate(() => {
    const el = document.querySelector('#approach') || document.querySelector('.approach-section');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'server-check-approach.png') });

  // Scroll down to Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'server-check-footer.png') });

  // Extract detailed state from page
  const pageState = await page.evaluate(() => {
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const headerBg = document.querySelector('.sg-header') ? window.getComputedStyle(document.querySelector('.sg-header')).backgroundColor : null;
    const heroBg = document.querySelector('.hero') ? window.getComputedStyle(document.querySelector('.hero')).backgroundColor : null;
    const workBg = document.querySelector('.work-section') ? window.getComputedStyle(document.querySelector('.work-section')).backgroundColor : null;
    const approachBg = document.querySelector('.approach-section') ? window.getComputedStyle(document.querySelector('.approach-section')).backgroundColor : null;
    const aboutBg = document.querySelector('.about-section') ? window.getComputedStyle(document.querySelector('.about-section')).backgroundColor : null;
    const contactBg = document.querySelector('.contact-section') ? window.getComputedStyle(document.querySelector('.contact-section')).backgroundColor : null;

    const dataRainRoot = document.querySelector('.dr-root');
    const dataRainMain = document.querySelector('.dr-main');
    const dataRainBloom = document.querySelector('.dr-bloom');
    
    // Check if canvas is actively rendering pixels
    let canvasPixelsDrawn = false;
    if (dataRainMain && dataRainMain instanceof HTMLCanvasElement) {
      try {
        const ctx = dataRainMain.getContext('2d');
        if (ctx) {
          const imgData = ctx.getImageData(0, 0, Math.min(100, dataRainMain.width), Math.min(100, dataRainMain.height));
          // check if any non-zero pixels
          canvasPixelsDrawn = imgData.data.some(p => p > 0);
        }
      } catch (e) {}
    }

    // Check project thumbnails loaded
    const projectImages = Array.from(document.querySelectorAll('.project-visual-img')).map(img => ({
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    }));

    return {
      bodyBg,
      headerBg,
      heroBg,
      workBg,
      approachBg,
      aboutBg,
      contactBg,
      hasDataRainRoot: !!dataRainRoot,
      hasDataRainMain: !!dataRainMain,
      hasDataRainBloom: !!dataRainBloom,
      canvasPixelsDrawn,
      projectImagesCount: projectImages.length,
      brokenImages: projectImages.filter(img => !img.complete || img.naturalWidth === 0)
    };
  });

  console.log('=== Page State ===');
  console.log(JSON.stringify(pageState, null, 2));

  console.log('=== Errors ===');
  console.log('Total errors:', errors.length);
  if (errors.length) console.log(errors);

  console.log('=== Warnings ===');
  console.log('Total warnings:', warnings.length);
  if (warnings.length) console.log(warnings);

  console.log('=== Failed Requests ===');
  console.log('Total failed requests:', failedRequests.length);
  if (failedRequests.length) console.log(failedRequests);

  await browser.close();
}

inspectServer().catch(console.error);
