const portfolioService = require('../services/portfolioService');
const stockService = require('../services/stockService');

class PortfolioController {
    /**
     * Add a new stock to portfolio
     * POST /api/portfolio
     */
    async addStock(req, res) {
        try {
            const { symbol, quantity, buyPrice, purchaseDate } = req.body;

            // Validate required fields
            if (!symbol || !quantity || !buyPrice || !purchaseDate) {
                return res.status(400).json({
                    error: 'Missing required fields: symbol, quantity, buyPrice, purchaseDate'
                });
            }

            // Validate data types
            if (isNaN(quantity) || isNaN(buyPrice)) {
                return res.status(400).json({
                    error: 'Quantity and buyPrice must be valid numbers'
                });
            }

            if (quantity <= 0 || buyPrice <= 0) {
                return res.status(400).json({
                    error: 'Quantity and buyPrice must be positive numbers'
                });
            }

            const stockData = {
                symbol: symbol.toUpperCase(),
                quantity: parseFloat(quantity),
                buyPrice: parseFloat(buyPrice),
                purchaseDate
            };

            const addedStock = await portfolioService.addStock(stockData);
            
            res.status(201).json({
                success: true,
                data: addedStock,
                message: 'Stock added to portfolio successfully'
            });
        } catch (error) {
            console.error('Error in addStock controller:', error);
            res.status(500).json({
                error: 'Failed to add stock to portfolio',
                details: error.message
            });
        }
    }

    /**
     * Get all portfolio holdings
     * GET /api/portfolio
     */
    async getPortfolio(req, res) {
        try {
            const portfolio = await portfolioService.getPortfolio();
            const summary = await portfolioService.getPortfolioSummary();
            
            res.json({
                success: true,
                data: {
                    holdings: portfolio,
                    summary
                }
            });
        } catch (error) {
            console.error('Error in getPortfolio controller:', error);
            res.status(500).json({
                error: 'Failed to get portfolio',
                details: error.message
            });
        }
    }

    /**
     * Get portfolio historical data
     * GET /api/portfolio/history/:period?
     */
    async getPortfolioHistory(req, res) {
        try {
            const period = req.params.period || '1Y';
            const validPeriods = ['1M', '3M', '6M', '1Y', '2Y'];
            
            if (!validPeriods.includes(period)) {
                return res.status(400).json({
                    error: 'Invalid period. Valid periods are: ' + validPeriods.join(', ')
                });
            }

            const history = await portfolioService.getPortfolioHistory(period);
            
            res.json({
                success: true,
                data: history,
                period
            });
        } catch (error) {
            console.error('Error in getPortfolioHistory controller:', error);
            res.status(500).json({
                error: 'Failed to get portfolio history',
                details: error.message
            });
        }
    }

    /**
     * Get historical price data for a specific symbol
     * GET /api/portfolio/history/:symbol/:period?
     */
    async getSymbolHistory(req, res) {
        try {
            const { symbol, period = '1Y' } = req.params;
            const validPeriods = ['1M', '3M', '6M', '1Y', '2Y'];
            
            if (!validPeriods.includes(period)) {
                return res.status(400).json({
                    error: 'Invalid period. Valid periods are: ' + validPeriods.join(', ')
                });
            }

            const history = await stockService.getHistoricalData(symbol, period);
            
            res.json({
                success: true,
                data: history,
                symbol: symbol.toUpperCase(),
                period
            });
        } catch (error) {
            console.error('Error in getSymbolHistory controller:', error);
            res.status(500).json({
                error: 'Failed to get symbol history',
                details: error.message
            });
        }
    }

    /**
     * Update a stock in portfolio
     * PUT /api/portfolio/:id
     */
    async updateStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity, buyPrice, purchaseDate } = req.body;

            if (!quantity || !buyPrice || !purchaseDate) {
                return res.status(400).json({
                    error: 'Missing required fields: quantity, buyPrice, purchaseDate'
                });
            }

            if (isNaN(quantity) || isNaN(buyPrice)) {
                return res.status(400).json({
                    error: 'Quantity and buyPrice must be valid numbers'
                });
            }

            if (quantity <= 0 || buyPrice <= 0) {
                return res.status(400).json({
                    error: 'Quantity and buyPrice must be positive numbers'
                });
            }

            const updateData = {
                quantity: parseFloat(quantity),
                buyPrice: parseFloat(buyPrice),
                purchaseDate
            };

            const updatedStock = await portfolioService.updateStock(id, updateData);
            
            if (!updatedStock) {
                return res.status(404).json({
                    error: 'Stock not found in portfolio'
                });
            }

            res.json({
                success: true,
                data: updatedStock,
                message: 'Stock updated successfully'
            });
        } catch (error) {
            console.error('Error in updateStock controller:', error);
            res.status(500).json({
                error: 'Failed to update stock',
                details: error.message
            });
        }
    }

    /**
     * Delete a stock from portfolio
     * DELETE /api/portfolio/:id
     */
    async deleteStock(req, res) {
        try {
            const { id } = req.params;
            
            const deleted = await portfolioService.deleteStock(id);
            
            if (!deleted) {
                return res.status(404).json({
                    error: 'Stock not found in portfolio'
                });
            }

            res.json({
                success: true,
                message: 'Stock deleted from portfolio successfully'
            });
        } catch (error) {
            console.error('Error in deleteStock controller:', error);
            res.status(500).json({
                error: 'Failed to delete stock',
                details: error.message
            });
        }
    }
}

module.exports = new PortfolioController();