import { launchBrowser, createPage, apiHeaders } from '../utils/browser.js';
import axios from 'axios';

export default class InstagramService {
    static async downloadContent(url, type) {
    let browser;
    try {
      browser = await launchBrowser();
      const page = await createPage(browser, 'https://fastdl.app/');

      await page.setRequestInterception(true);

      const pageConfig = {
        reel: {
          input: '#search-form-input',
          api: 'https://fastdl.app/api/convert'
        },
        story: {
          input: '#search-form-input',
          api: 'https://api-wh.fastdl.app/api/v1/instagram/stories'
        },
        post: {
          input: '#search-form-input',
          api: 'https://fastdl.app/api/convert'
        }
      };

      let apiPayload = null;
      page.on('request', (request) => {
        if (request.url().includes(pageConfig[type].api)) {
          apiPayload = request.postData();
          request.continue();
        } else {
          request.continue().catch(() => {});
        }
      });

      await page.goto(`https://fastdl.app/${this.getEndpoint(type)}`, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Handle cookie consent
      try {
        await page.click('button#cookie-ok', { timeout: 2000 });
      } catch (e) {}

      // Direct paste instead of typing
      await page.waitForSelector(pageConfig[type].input, { visible: true });
      await page.evaluate((selector, url) => {
        const input = document.querySelector(selector);
        input.value = url;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }, pageConfig[type].input, url);

      // Universal submit button click
      await page.waitForSelector('button[type="submit"]', { visible: true });
      await page.click('button[type="submit"]');

      // Wait for API response
      await page.waitForResponse(response =>
        response.url().includes(pageConfig[type].api),
        { timeout: 30000 }
      );

      if (!apiPayload) throw new Error('API payload not captured');

      const response = await axios.post(pageConfig[type].api,
        JSON.parse(apiPayload),
        { headers: apiHeaders('https://fastdl.app/') }
      );

      return this.formatResponse(response.data, type);
    } finally {
      if (browser) await browser.close();
    }
  }
  static getEndpoint(type) {
    const endpoints = {
      story: 'story-saver',
      reel: 'instagram-reels-download',
      post: 'photo'
    };
    return endpoints[type] || 'instagram-reels-download';
  }
  static formatResponse(data, type) {
    let mediaUrl = null;    
    let thumbnailUrl = null;

    switch (type) {
      case 'reel':
        mediaUrl = data.url?.[0]?.url;
        thumbnailUrl = data.thumb;
        break;

      case 'story':
        const storyItem = data.result?.[0];
        mediaUrl = storyItem?.video_versions?.[0]?.url_downloadable ||
        storyItem?.image_versions2?.candidates?.[0]?.url;
        thumbnailUrl = storyItem?.image_versions2?.candidates?.[0]?.url_downloadable;
        break;

      case 'post':
        // Post-specific response parsing
        mediaUrl = data.url?.[0]?.url;
        thumbnailUrl = data.thumb;
        break;
    }

    return {
      success: !!mediaUrl,
      type,
      url: mediaUrl,
      thumbnail: thumbnailUrl,
      meta: {
        username: data.meta?.username || data.author?.username,
        likes: data.meta?.like_count || 0,
        description: data.meta?.title || '',
        timestamp: data.timestamp ? new Date(data.timestamp * 1000) : null,
        duration: data.video?.duration || null
      }
    };
  }
}