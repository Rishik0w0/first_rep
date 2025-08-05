const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Management API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      'POST /api/portfolio': 'Add stock to portfolio',
      'GET /api/portfolio': 'Get all portfolio holdings',
      'GET /api/portfolio/history/:symbol': 'Get historical data for stock',
      'PUT /api/portfolio/:id': 'Update stock in portfolio',
      'DELETE /api/portfolio/:id': 'Remove stock from portfolio',
      'GET /api/search?q=SYMBOL': 'Search for stock information',
      'GET /api/health': 'Health check'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.log('⚠️  Starting server without database connection');
      console.log('   Make sure MySQL is running and credentials are correct');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Portfolio API Server running on port ${PORT}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode - detailed error messages enabled');
      }
      
      if (!process.env.ALPHA_VANTAGE_API_KEY) {
        console.log('⚠️  Alpha Vantage API key not configured');
        console.log('   Set ALPHA_VANTAGE_API_KEY environment variable');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();