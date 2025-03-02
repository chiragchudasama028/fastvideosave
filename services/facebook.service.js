import { launchBrowser, createPage } from '../utils/browser.js';

export async function downloadVideo(url) {  // ✅ Named export
  const browser = await launchBrowser();
  try {
    const page = await createPage(browser, 'https://www.getfvid.com/');
    await page.goto('https://www.getfvid.com/', { waitUntil: 'networkidle2' });

    await page.type('#text-input', url);
    await page.click('#btn-submit');

    await page.waitForSelector('.download-links', { timeout: 15000 });

    return await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('.download-links a').forEach(a => {
        links.push({
          quality: a.innerText.trim(),
          url: a.href
        });
      });
      return links;
    });
  } finally {
    await browser.close();
  }
}
