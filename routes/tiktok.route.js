import { Router } from 'express';
import { downloadVideo } from '../controllers/tiktok.controller.js';

const router = Router();
router.post('/download', downloadVideo);
export default router;