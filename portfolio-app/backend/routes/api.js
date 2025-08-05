const express = require('express');
const portfolioController = require('../controllers/portfolioController');

const router = express.Router();

// Portfolio routes
router.post('/portfolio', portfolioController.addStock);
router.get('/portfolio', portfolioController.getPortfolio);
router.get('/portfolio/history/:symbol', portfolioController.getHistoricalData);
router.put('/portfolio/:id', portfolioController.updateStock);
router.delete('/portfolio/:id', portfolioController.deleteStock);

// Search routes
router.get('/search', portfolioController.searchStock);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Portfolio Management API'
  });
});

module.exports = router;