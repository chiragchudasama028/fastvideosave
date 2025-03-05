import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// import { verifyHMAC } from './middleware/verifyHMAC.js';
import instagramRouter from './routes/instagram.route.js';
import tiktokRouter from './routes/tiktok.route.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
// app.use(verifyHMAC);
// Routes

app.use('/api/instagram', instagramRouter);
app.use('/api/tiktok', tiktokRouter);
app.get("/", (req, res) => {
  res.redirect("https://fastvideosave.app/");
});
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});