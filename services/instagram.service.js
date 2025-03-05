import { launchBrowser, createPage } from '../utils/browser.js';

export default class InstagramService {
  static async downloadContent(url, type) {
    let browser;
    try {
      browser = await launchBrowser();
      const page = await createPage(browser, 'https://fastvideosave.net/');

      const API_URL = 'https://api.videodropper.app/allinone';

      const pageConfig = {
        reel: { input: 'input[name="url"]', api: API_URL },
        story: { input: 'input[name="url"]', api: API_URL },
        post: { input: 'input[name="url"]', api: API_URL },
        facebook: { input: 'input[name="url"]', api: API_URL }
      };
      
      const endpoint = this.getEndpoint(type);
      await page.goto(`https://fastvideosave.net/${endpoint}`, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Handle cookie consent (if any)
      try {
        await page.click('button#cookie-ok', { timeout: 2000 });
      } catch {
        console.log('No cookie consent button found or already handled.');
      }

      // Ensure the type exists in pageConfig
      if (!pageConfig[type]) throw new Error(`Invalid content type: ${type}`);

      // Paste URL into input field
      await page.waitForSelector(pageConfig[type].input, { visible: true });
      await page.evaluate((selector, url) => {
        const input = document.querySelector(selector);
        if (input) {
          input.value = url;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, pageConfig[type].input, url);

      // Click Submit Button
      await page.click('button[type="submit"]');

      // Wait for the image and video URLs to load
      await page.waitForSelector('img[src*="https://dl.fastvideosave.net/"], a[href*="cdninstagram.com"]', {
        timeout: 15000,
      }); 

      // Extract both image and video URLs
      const mediaLinks = await page.evaluate((type) => {
        const image = document.querySelector('img[src*="https://dl.fastvideosave.net"], img[src*="cdninstagram.com"]');
      
        let downloadButton;
        if (type === "reel" || type === "facebook" ||  type === "story" ) {
          downloadButton = document.querySelector('a[href*="https://dl.fastvideosave.net/"]');
        } else {
          downloadButton = document.querySelector('a[href*="cdninstagram.com"]');
        }
      
        return {
          imageUrl: image ? image.src : null,
          downloadUrl: downloadButton ? downloadButton.href : null,
          type
        };
      }, type);
      // Check if any media URL is missing
      if (!mediaLinks.imageUrl && !mediaLinks.videoUrl) {
        throw new Error('No media links found');
      }
      return mediaLinks;
    } finally {
      if (browser) await browser.close();
    }
  }
  static getEndpoint(type) {
    const endpoints = { story: 'stories', reel: '', post: 'photo' ,facebook:'facebook'};
    return endpoints[type] || '';
  }
}
