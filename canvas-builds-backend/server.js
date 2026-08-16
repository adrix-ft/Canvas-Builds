const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

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

// 3. Checkout Endpoint Placeholder
app.post('/api/checkout', async (req, res) => {
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
// Example Express backend route for test checkout
app.post('/api/create-test-checkout', async (req, res) => {
  try {
    const { items, customerEmail } = req.body;
    
    // Simulate order creation or generate a mock payment session ID
    const mockOrderId = `test_order_${Math.random().toString(36.substring(2, 9)}`
    
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