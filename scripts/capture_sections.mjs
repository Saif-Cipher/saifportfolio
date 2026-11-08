import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve('scratch-screenshots');

async function captureSections() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll to Work section
  const workEl = await page.$('#work');
  if (workEl) {
    await workEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'section-work.png') });
    console.log('Saved section-work.png');
  }

  // Scroll to Approach section
  const approachEl = await page.$('#approach');
  if (approachEl) {
    await approachEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'section-approach.png') });
    console.log('Saved section-approach.png');
  }

  // Scroll to About section
  const aboutEl = await page.$('#about');
  if (aboutEl) {
    await aboutEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'section-about.png') });
    console.log('Saved section-about.png');
  }

  // Scroll to Contact section
  const contactEl = await page.$('#contact');
  if (contactEl) {
    await contactEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'section-contact.png') });
    console.log('Saved section-contact.png');
  }

  await browser.close();
}

captureSections().catch(console.error);
