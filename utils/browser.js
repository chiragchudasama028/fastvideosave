import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import config from '../config/puppeteer.config.js';

puppeteer.use(StealthPlugin(config.stealthOptions));

export const launchBrowser = async () => {
  return await puppeteer.launch({
    headless: "new",
    executablePath: config.executablePath,
    args: config.commonArgs
  });
};

export const createPage = async (browser, referer) => {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
  });
  return page;
};

export const apiHeaders = (referer) => ({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': referer,
  'Origin': new URL(referer).origin,
  'Content-Type': 'application/json'
});