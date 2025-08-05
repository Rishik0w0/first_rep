const stockService = require('../services/stockService');

class StockController {
    /**
     * Search for stock information
     * GET /api/search?q=SYMBOL
     */
    async searchStock(req, res) {
        try {
            const { q: symbol } = req.query;

            if (!symbol) {
                return res.status(400).json({
                    error: 'Missing search query parameter "q"'
                });
            }

            if (symbol.length < 1 || symbol.length > 10) {
                return res.status(400).json({
                    error: 'Stock symbol must be between 1 and 10 characters'
                });
            }

            const stockData = await stockService.searchStock(symbol);
            
            res.json({
                success: true,
                data: stockData
            });
        } catch (error) {
            console.error('Error in searchStock controller:', error);
            res.status(500).json({
                error: 'Failed to search stock',
                details: error.message
            });
        }
    }

    /**
     * Get current stock price
     * GET /api/stocks/:symbol/price
     */
    async getCurrentPrice(req, res) {
        try {
            const { symbol } = req.params;

            if (!symbol) {
                return res.status(400).json({
                    error: 'Stock symbol is required'
                });
            }

            const price = await stockService.getCurrentPrice(symbol);
            
            res.json({
                success: true,
                data: {
                    symbol: symbol.toUpperCase(),
                    price: parseFloat(price.toFixed(2)),
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Error in getCurrentPrice controller:', error);
            res.status(500).json({
                error: 'Failed to get current price',
                details: error.message
            });
        }
    }

    /**
     * Get historical data for a stock
     * GET /api/stocks/:symbol/history/:period?
     */
    async getHistoricalData(req, res) {
        try {
            const { symbol, period = '1Y' } = req.params;
            const validPeriods = ['1M', '3M', '6M', '1Y', '2Y'];

            if (!symbol) {
                return res.status(400).json({
                    error: 'Stock symbol is required'
                });
            }

            if (!validPeriods.includes(period)) {
                return res.status(400).json({
                    error: 'Invalid period. Valid periods are: ' + validPeriods.join(', ')
                });
            }

            const historicalData = await stockService.getHistoricalData(symbol, period);
            
            res.json({
                success: true,
                data: historicalData,
                symbol: symbol.toUpperCase(),
                period
            });
        } catch (error) {
            console.error('Error in getHistoricalData controller:', error);
            res.status(500).json({
                error: 'Failed to get historical data',
                details: error.message
            });
        }
    }

    /**
     * Get multiple stock quotes
     * POST /api/stocks/quotes
     * Body: { symbols: ['AAPL', 'GOOGL', 'MSFT'] }
     */
    async getMultipleQuotes(req, res) {
        try {
            const { symbols } = req.body;

            if (!symbols || !Array.isArray(symbols)) {
                return res.status(400).json({
                    error: 'Symbols array is required'
                });
            }

            if (symbols.length === 0) {
                return res.status(400).json({
                    error: 'At least one symbol is required'
                });
            }

            if (symbols.length > 50) {
                return res.status(400).json({
                    error: 'Maximum 50 symbols allowed per request'
                });
            }

            // Get quotes for all symbols in parallel
            const quotes = await Promise.all(
                symbols.map(async (symbol) => {
                    try {
                        const stockData = await stockService.searchStock(symbol);
                        return {
                            symbol: symbol.toUpperCase(),
                            success: true,
                            data: stockData
                        };
                    } catch (error) {
                        return {
                            symbol: symbol.toUpperCase(),
                            success: false,
                            error: error.message
                        };
                    }
                })
            );

            res.json({
                success: true,
                data: quotes,
                requestedSymbols: symbols.length,
                successfulQuotes: quotes.filter(q => q.success).length
            });
        } catch (error) {
            console.error('Error in getMultipleQuotes controller:', error);
            res.status(500).json({
                error: 'Failed to get multiple quotes',
                details: error.message
            });
        }
    }
}

module.exports = new StockController();