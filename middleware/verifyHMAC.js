import crypto from 'crypto';

// Helper function to generate HMAC signature
const generateHMACSignature = (body, timestamp, secretKey) => {
  const hmac = crypto.createHmac('sha256', secretKey);
  return hmac.update(body + timestamp).digest('hex');
};

// Middleware to verify HMAC signature
export const verifyHMAC = (req, res, next) => {
  const secretKey = process.env.APP_SECRET_KEY; // Ensure this is set in your environment variables
  const providedSignature = req.headers['x-signature'];
  const timestamp = req.headers['x-timestamp'];

  // Basic validation for required headers
  if (!providedSignature || !timestamp) {
    return res.status(400).json({ error: 'Missing signature or timestamp' });
  }

  // Check for timestamp expiration (e.g., 5 minutes threshold)
  const timeDifference = Math.abs(Date.now() / 1000 - timestamp);
  const threshold = 300;  // 5 minutes threshold for request validity
  if (timeDifference > threshold) {
    return res.status(400).json({ error: 'Request timeout, signature too old' });
  }

  // Get the request body if it's a POST request
  const body = req.method === 'POST' ? JSON.stringify(req.body) : '';

  // Generate the expected signature based on the request details
  const generatedSignature = generateHMACSignature(body, timestamp, secretKey);

  // Compare the provided signature with the generated signature
  if (generatedSignature !== providedSignature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Proceed with the request if signatures match
  next();
};
