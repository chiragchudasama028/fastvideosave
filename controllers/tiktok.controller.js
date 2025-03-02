import TiktokService from '../services/tiktok.service.js';

export const downloadVideo = async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Valid URL required' });
    }

    if (!url.includes('tiktok.com')) {
      return res.status(400).json({ error: 'Invalid TikTok URL' });
    }

    const result = await TiktokService.downloadVideo(url);
    res.json(result);
  } catch (error) {
    console.error('TikTok download error:', error); 
    res.status(500).json({ 
      error: error.message,
      html: error.message.split('HTML: ')[1] || null
    });
  }
};