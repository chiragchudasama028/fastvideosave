import express from 'express';
import InstagramController from '../controllers/instagram.controller.js';

const router = express.Router();
router.post('/download', InstagramController.download);
export default router;