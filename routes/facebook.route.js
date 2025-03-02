import { Router } from 'express';
const router = Router();
import { downloadVideo } from '../controllers/facebook.controller.js'; 

router.post('/download', FacebookController.download);

export default router;