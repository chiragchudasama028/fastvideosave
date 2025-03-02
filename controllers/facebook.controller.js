import FacebookService from '../services/facebook.service.js'; // ✅ Default import

const FacebookController = {
  download: async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: 'URL is required' });

      const result = await FacebookService.downloadVideo(url); // ✅ Access method from class
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default FacebookController;
