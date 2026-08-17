const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// ==========================================
// SECURITY: Anti-Bot Rate Limiters
// ==========================================

// Strict limiter for checkout endpoints to prevent carding & bot flooding
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 10, // Limit each IP to 10 checkout requests per windowMs
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    success: false,
    error: "Too many checkout requests from this IP, please try again after 15 minutes."
  }
});

// General limiter for public API routes to prevent resource exhaustion
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Limit each IP to 100 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please slow down."
  }
});

// Apply general limiter to all /api routes
app.use('/api/', apiLimiter);

// ==========================================
// ROUTES
// ==========================================

// 1. Health Check / Ping Endpoint (Used by Uptime Monitor to prevent sleeping)
app.get('/ping', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Canvas Builds Server is active and running',
    timestamp: new Date().toISOString()
  });
});

// 2. Base API Route
app.get('/api', (req, res) => {
  res.json({ message: 'Canvas Builds API v1.0' });
});

// 3. Checkout Endpoint Placeholder (Protected by checkoutLimiter)
app.post('/api/checkout', checkoutLimiter, async (req, res) => {
  try {
    const { items, customerEmail, customerPhone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    // Payment gateway integration (e.g. Razorpay/Stripe order creation) goes here
    res.status(200).json({
      success: true,
      message: 'Checkout initialized successfully',
      orderId: 'ORDER_' + Date.now()
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

// 4. Test Checkout Endpoint (Protected by checkoutLimiter)
app.post('/api/create-test-checkout', checkoutLimiter, async (req, res) => {
  try {
    const { items, customerEmail } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in cart' });
    }

    // Simulate order creation or generate a mock payment session ID
    const mockOrderId = `test_order_${Math.random().toString(36).substring(2, 9)}`;
    
    console.log(`[TEST MODE] Processing order for ${customerEmail || 'Guest'} with ${items.length} items.`);

    res.status(200).json({
      success: true,
      orderId: mockOrderId,
      message: "Test checkout session created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Canvas Builds backend running on port ${PORT}`);
});