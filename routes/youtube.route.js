import { Router } from 'express';
import { getDownloadLinks } from '../controllers/youtube.controller.js';

const router = Router();
router.post('/download', getDownloadLinks);
export default router;