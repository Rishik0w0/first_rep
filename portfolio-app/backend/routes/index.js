const express = require('express');
const portfolioController = require('../controllers/portfolioController');
const stockController = require('../controllers/stockController');
const settingsController = require('../controllers/settingsController');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API is running',
        timestamp: new Date().toISOString()
    });
});

// Portfolio routes
router.post('/portfolio', portfolioController.addStock);
router.get('/portfolio', portfolioController.getPortfolio);
router.put('/portfolio/:id', portfolioController.updateStock);
router.delete('/portfolio/:id', portfolioController.deleteStock);

// Stock routes
router.get('/search', stockController.searchStock);
router.get('/stocks/:symbol/price', stockController.getCurrentPrice);
router.post('/stocks/quotes', stockController.getMultipleQuotes);

// Settings routes
router.get('/settings', settingsController.getSettings);
router.get('/settings/:key', settingsController.getSetting);
router.put('/settings/:key', settingsController.updateSetting);
router.put('/settings', settingsController.updateSettings);
router.post('/settings/reset', settingsController.resetSettings);

module.exports = router;