// import { launchBrowser, createPage } from '../utils/browser.js';

// export default class TiktokService {
//   static async downloadVideo(url) {
//     const browser = await launchBrowser();
//     const page = await createPage(browser, 'https://ssstik.io');
    
//     try {
//       await page.goto('https://ssstik.io/en', {
//         waitUntil: 'networkidle2',
//         timeout: 60000
//       });

//       // Handle Cloudflare challenge
//       await this.handleCloudflare(page);

//       await page.evaluate((url) => {
//         const input = document.querySelector('#main_page_text');
//         input.value = url;
//         input.dispatchEvent(new Event('input', { bubbles: true }));
//       }, url);

//       await page.click('#submit');

//       // Wait for download section to appear
//       await page.waitForSelector('#dl_btns', { timeout: 15000 });

//       // Extract specific elements from HTML
//       const result = await page.evaluate(() => {
//         // Get author image
//         const authorImg = document.querySelector('.pure-u-6-24 img.result_author')?.src || null;

//         // Get video download link
//         const videoLink = document.querySelector('a.download_link.without_watermark')?.href || null;

//         // Get audio download link
//         const audioLink = document.querySelector('a.download_link.music')?.href || null;

//         return {
//           authorImage: authorImg,
//           videoUrl: videoLink,
//           audioUrl: audioLink,
         
//         };
//       });

//       if (!result.videoUrl) {
//         const htmlContent = await page.content();
//         throw new Error(`Download link not found. Page HTML: ${JSON.stringify(htmlContent)}`);
//       }

//       return {
//         imageUrl: result.authorImage,
//         downloadUrl: result.videoUrl,
//         audioUrl: result.audioUrl,
//         type:"tiktok"
//       };
//     } catch (error) {
//       const htmlContent = await page.content();
//       console.error('Page HTML at time of error:', htmlContent);
//       throw new Error(`${error.message} | HTML: ${JSON.stringify(htmlContent)}`);
//     } finally {
//       await browser.close();
//     }
//   }

//   static async handleCloudflare(page) {
//     try {
//       await page.waitForSelector('#cf-challenge-wrap', { 
//         visible: true,
//         timeout: 5000 
//       });
//       console.log('Solving Cloudflare challenge...');
//       await page.solveRecaptchas();
//       await page.waitForNavigation({ waitUntil: 'networkidle2' });
//     } catch (error) {
//       // No Cloudflare challenge detected
//     }
//   }
// }

import { launchBrowser, createPage } from '../utils/browser.js';

export default class TiktokService {
  static async downloadVideo(url) {
    const browser = await launchBrowser();
    const page = await createPage(browser, 'https://ssstik.io');
    
    try {
      await page.goto('https://ssstik.io/en', {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Handle Cloudflare challenge
      await this.handleCloudflare(page);

      await page.evaluate((url) => {
        const input = document.querySelector('#main_page_text');
        input.value = url;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, url);

      await page.click('#submit');

      // Wait for download section to appear
      await page.waitForSelector('#dl_btns', { timeout: 15000 });

      // Extract background image from #mainpicture .result_overlay
      const backgroundImageUrl = await page.evaluate(() => {
        const element = document.querySelector('#mainpicture .result_overlay');
        if (!element) return null;

        const backgroundImage = window.getComputedStyle(element).getPropertyValue('background-image');
        const match = backgroundImage.match(/url\(["']?(.*?)["']?\)/);

        return match ? match[1] : null;
      });

      // Extract other download links
      const result = await page.evaluate(() => {

        // Get video download link
        const videoLink = document.querySelector('a.download_link.without_watermark')?.href || null;

        // Get audio download link
        const audioLink = document.querySelector('a.download_link.music')?.href || null;

        return {
          videoUrl: videoLink,
          audioUrl: audioLink,
        };
      });

      if (!result.videoUrl) {
        const htmlContent = await page.content();
        throw new Error(`Download link not found. Page HTML: ${JSON.stringify(htmlContent)}`);
      }

      return {
        backgroundImageUrl,
        downloadUrl: result.videoUrl,
        audioUrl: result.audioUrl,
        type: "tiktok"
      };
    } catch (error) {
      const htmlContent = await page.content();
      console.error('Page HTML at time of error:', htmlContent);
      throw new Error(`${error.message} | HTML: ${JSON.stringify(htmlContent)}`);
    } finally {
      await browser.close();
    }
  }

  static async handleCloudflare(page) {
    try {
      await page.waitForSelector('#cf-challenge-wrap', { 
        visible: true,
        timeout: 5000 
      });
      console.log('Solving Cloudflare challenge...');
      await page.solveRecaptchas();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    } catch (error) {
      // No Cloudflare challenge detected
    }
  }
}
