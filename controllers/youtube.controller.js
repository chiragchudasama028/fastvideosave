import YoutubeService from '../services/youtube.service.js';

export const getDownloadLinks = async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Valid URL required' });
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const result = await YoutubeService.getDownloadInfo(url);
    res.json(result);
  } catch (error) {
    console.error('YouTube download error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch download links'
    });
  }
};