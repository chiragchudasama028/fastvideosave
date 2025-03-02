import InstagramService from '../services/instagram.service.js';

export default {
  download: async (req, res) => {
    try {
      const { url, type = 'reel' } = req.body;
      if (!url) return res.status(400).json({ error: 'URL is required' });
      
      const result = await InstagramService.downloadContent(url, type);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};