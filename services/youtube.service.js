import { launchBrowser, createPage, apiHeaders } from '../utils/browser.js';
import axios from 'axios';

export default class YoutubeService {
  static async getDownloadInfo(url) {
    let browser;
    try {
      browser = await launchBrowser();
      const page = await createPage(browser, 'https://zeemo.ai/');

      await page.setRequestInterception(true);

      const pageConfig = {
        input: '.textInput',
        api: 'https://api.zeemo.ai/hy-caption-front/api/v1/video-download/yt-dlp-video-info',
        submit: '.linkButton'
      };

      let apiPayload = null;
      page.on('request', (request) => {
        if (request.url().includes(pageConfig.api)) {
          apiPayload = request.postData();
          request.continue();
        } else {
          request.continue().catch(() => {});
        }
      });

      await page.goto("https://zeemo.ai/tools/youtube-video-downloader", {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Handle cookie consent
      try {
        await page.click('button#cookie-ok', { timeout: 2000 });
      } catch (e) {}

      // Direct URL input
      await page.waitForSelector(pageConfig.input, { visible: true });
      await page.evaluate((selector, url) => {
        const input = document.querySelector(selector);
        input.value = url;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, pageConfig.input, url);

      // Submit form
      await page.click(pageConfig.submit);

      // Wait for API response
      await page.waitForResponse(response => 
        response.url().includes(pageConfig.api),
        { timeout: 30000 }
      );

      if (!apiPayload) throw new Error('API payload not captured');

      const response = await axios.post(pageConfig.api,
        JSON.parse(apiPayload),
        { headers: apiHeaders('https://zeemo.ai') }
      );
      console.log(response.data)
      return this.formatResponse(response.data);
    } finally {
      if (browser) await browser.close();
    }
  }

  static formatResponse(data) {
    return {
      success: true,
      downloadUrl: data.data?.downloadUrl || null,
      audioDownloadUrl: data.data?.audioDownloadUrl || null,
      thumbnailUrl: data.data?.thumbnailUrl || null
    };
  }
}