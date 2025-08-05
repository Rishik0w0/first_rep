const express = require('express');
const portfolioController = require('../controllers/portfolioController');
const stockController = require('../controllers/stockController');
const settingsController = require('../controllers/settingsController');

const router = express.Router();

// Portfolio routes
router.post('/portfolio', portfolioController.addStock);
router.get('/portfolio', portfolioController.getPortfolio);
router.get('/portfolio/history/:period?', portfolioController.getPortfolioHistory);
router.get('/portfolio/history/:symbol/:period', portfolioController.getSymbolHistory);
router.put('/portfolio/:id', portfolioController.updateStock);
router.delete('/portfolio/:id', portfolioController.deleteStock);

// Stock routes
router.get('/search', stockController.searchStock);
router.get('/stocks/:symbol/price', stockController.getCurrentPrice);
router.get('/stocks/:symbol/history/:period?', stockController.getHistoricalData);
router.post('/stocks/quotes', stockController.getMultipleQuotes);

// Settings routes
router.get('/settings', settingsController.getSettings);
router.get('/settings/:key', settingsController.getSetting);
router.put('/settings/:key', settingsController.updateSetting);
router.put('/settings', settingsController.updateSettings);
router.post('/settings/reset', settingsController.resetSettings);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;