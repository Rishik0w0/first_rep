const { pool } = require('../config/database');
const stockService = require('./stockService');

class PortfolioService {
    /**
     * Add a new stock to portfolio
     * @param {Object} stockData - Stock data {symbol, quantity, buyPrice, purchaseDate}
     * @returns {Object} Added stock entry
     */
    async addStock(stockData) {
        const { symbol, quantity, buyPrice, purchaseDate } = stockData;
        
        try {
            const [result] = await pool.execute(
                'INSERT INTO portfolio (symbol, quantity, buy_price, purchase_date) VALUES (?, ?, ?, ?)',
                [symbol.toUpperCase(), quantity, buyPrice, purchaseDate]
            );
            
            // Get the inserted record
            const [rows] = await pool.execute(
                'SELECT * FROM portfolio WHERE id = ?',
                [result.insertId]
            );
            
            return rows[0];
        } catch (error) {
            console.error('Error adding stock to portfolio:', error);
            throw new Error('Failed to add stock to portfolio');
        }
    }

    /**
     * Get all portfolio holdings with current prices
     * @returns {Array} Portfolio holdings with current market data
     */
    async getPortfolio() {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    id,
                    symbol,
                    quantity,
                    buy_price,
                    purchase_date,
                    created_at
                FROM portfolio 
                ORDER BY created_at DESC
            `);

            // Get current prices for all symbols
            const portfolioWithCurrentPrices = await Promise.all(
                rows.map(async (holding) => {
                    try {
                        const currentPrice = await stockService.getCurrentPrice(holding.symbol);
                        const totalValue = holding.quantity * currentPrice;
                        const totalCost = holding.quantity * holding.buy_price;
                        const gainLoss = totalValue - totalCost;
                        const gainLossPercent = ((gainLoss / totalCost) * 100).toFixed(2);

                        return {
                            ...holding,
                            currentPrice: parseFloat(currentPrice.toFixed(2)),
                            totalValue: parseFloat(totalValue.toFixed(2)),
                            totalCost: parseFloat(totalCost.toFixed(2)),
                            gainLoss: parseFloat(gainLoss.toFixed(2)),
                            gainLossPercent: parseFloat(gainLossPercent)
                        };
                    } catch (error) {
                        console.error(`Error getting current price for ${holding.symbol}:`, error);
                        return {
                            ...holding,
                            currentPrice: holding.buy_price,
                            totalValue: holding.quantity * holding.buy_price,
                            totalCost: holding.quantity * holding.buy_price,
                            gainLoss: 0,
                            gainLossPercent: 0
                        };
                    }
                })
            );

            return portfolioWithCurrentPrices;
        } catch (error) {
            console.error('Error getting portfolio:', error);
            throw new Error('Failed to get portfolio');
        }
    }

    /**
     * Get portfolio summary statistics
     * @returns {Object} Portfolio summary
     */
    async getPortfolioSummary() {
        try {
            const portfolio = await this.getPortfolio();
            
            const totalValue = portfolio.reduce((sum, holding) => sum + holding.totalValue, 0);
            const totalCost = portfolio.reduce((sum, holding) => sum + holding.totalCost, 0);
            const totalGainLoss = totalValue - totalCost;
            const totalGainLossPercent = totalCost > 0 ? ((totalGainLoss / totalCost) * 100).toFixed(2) : 0;

            return {
                totalValue: parseFloat(totalValue.toFixed(2)),
                totalCost: parseFloat(totalCost.toFixed(2)),
                totalGainLoss: parseFloat(totalGainLoss.toFixed(2)),
                totalGainLossPercent: parseFloat(totalGainLossPercent),
                holdingsCount: portfolio.length
            };
        } catch (error) {
            console.error('Error getting portfolio summary:', error);
            throw new Error('Failed to get portfolio summary');
        }
    }

    /**
     * Get historical portfolio value data
     * @param {string} period - Time period (1M, 3M, 6M, 1Y, 2Y)
     * @returns {Array} Historical portfolio values
     */
    async getPortfolioHistory(period = '1Y') {
        try {
            // Get all unique symbols in portfolio
            const [symbols] = await pool.execute(`
                SELECT DISTINCT symbol FROM portfolio
            `);

            if (symbols.length === 0) {
                return [];
            }

            // Get historical data for each symbol
            const historicalData = {};
            
            for (const { symbol } of symbols) {
                try {
                    const data = await stockService.getHistoricalData(symbol, period);
                    historicalData[symbol] = data;
                } catch (error) {
                    console.error(`Error getting historical data for ${symbol}:`, error);
                }
            }

            // Calculate portfolio value for each date
            const portfolioHistory = [];
            const dates = this.getUniqueDates(historicalData);

            for (const date of dates) {
                let totalValue = 0;
                
                // Get portfolio holdings as of this date
                const [holdings] = await pool.execute(`
                    SELECT symbol, SUM(quantity) as total_quantity
                    FROM portfolio 
                    WHERE purchase_date <= ?
                    GROUP BY symbol
                `, [date]);

                for (const holding of holdings) {
                    const symbolData = historicalData[holding.symbol];
                    const priceData = symbolData?.find(d => d.date === date);
                    
                    if (priceData) {
                        totalValue += holding.total_quantity * priceData.close;
                    }
                }

                if (totalValue > 0) {
                    portfolioHistory.push({
                        date,
                        value: parseFloat(totalValue.toFixed(2))
                    });
                }
            }

            return portfolioHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
        } catch (error) {
            console.error('Error getting portfolio history:', error);
            throw new Error('Failed to get portfolio history');
        }
    }

    /**
     * Get unique dates from historical data
     * @param {Object} historicalData - Historical data for all symbols
     * @returns {Array} Sorted unique dates
     */
    getUniqueDates(historicalData) {
        const allDates = new Set();
        
        Object.values(historicalData).forEach(symbolData => {
            symbolData.forEach(dataPoint => {
                allDates.add(dataPoint.date);
            });
        });

        return Array.from(allDates).sort();
    }

    /**
     * Delete a stock from portfolio
     * @param {number} id - Portfolio entry ID
     * @returns {boolean} Success status
     */
    async deleteStock(id) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM portfolio WHERE id = ?',
                [id]
            );
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting stock from portfolio:', error);
            throw new Error('Failed to delete stock from portfolio');
        }
    }

    /**
     * Update a stock in portfolio
     * @param {number} id - Portfolio entry ID
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated stock entry
     */
    async updateStock(id, updateData) {
        const { quantity, buyPrice, purchaseDate } = updateData;
        
        try {
            await pool.execute(
                'UPDATE portfolio SET quantity = ?, buy_price = ?, purchase_date = ? WHERE id = ?',
                [quantity, buyPrice, purchaseDate, id]
            );
            
            // Get the updated record
            const [rows] = await pool.execute(
                'SELECT * FROM portfolio WHERE id = ?',
                [id]
            );
            
            return rows[0];
        } catch (error) {
            console.error('Error updating stock in portfolio:', error);
            throw new Error('Failed to update stock in portfolio');
        }
    }
}

module.exports = new PortfolioService();