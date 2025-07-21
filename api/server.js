const express = require('express');
const cors = require('cors');
const { 
  initializeDatabase, 
  processSubmission, 
  getSocialProof, 
  updateSocialProof, 
  getRecentSubmissions 
} = require('./consulting/submit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://weenoridge.com', 'https://www.weenoridge.com']
    : ['http://localhost:4000', 'http://localhost:3000']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database on startup
app.use(async (req, res, next) => {
  if (!req.app.locals.dbInitialized) {
    try {
      await initializeDatabase();
      req.app.locals.dbInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Submit consulting request
app.post('/api/consulting/submit', async (req, res) => {
  try {
    const result = await processSubmission(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error processing submission:', error);
    res.status(500).json({ 
      error: 'Failed to process submission',
      message: error.message 
    });
  }
});

// Get social proof data
app.get('/api/consulting/social-proof', async (req, res) => {
  try {
    const data = await getSocialProof();
    res.json(data);
  } catch (error) {
    console.error('Error fetching social proof:', error);
    res.status(500).json({ 
      error: 'Failed to fetch social proof data',
      message: error.message 
    });
  }
});

// Update social proof data (admin only)
app.post('/api/consulting/social-proof', async (req, res) => {
  try {
    // Basic admin check - you might want to add proper authentication
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { total_helped, average_rating, response_rate } = req.body;
    await updateSocialProof({ total_helped, average_rating, response_rate });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating social proof:', error);
    res.status(500).json({ 
      error: 'Failed to update social proof data',
      message: error.message 
    });
  }
});

// Get recent submissions (admin only)
app.get('/api/consulting/submissions', async (req, res) => {
  try {
    // Basic admin check
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit) || 5;
    const submissions = await getRecentSubmissions(limit);
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch submissions',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 