const { pool } = require('../config/database');
const stockService = require('../services/stockService');

class PortfolioController {
  /**
   * Add a stock to portfolio
   * POST /api/portfolio
   */
  async addStock(req, res) {
    try {
      const { symbol, quantity, buyPrice, buyDate } = req.body;

      // Validate required fields
      if (!symbol || !quantity || !buyPrice || !buyDate) {
        return res.status(400).json({
          error: 'Missing required fields: symbol, quantity, buyPrice, buyDate'
        });
      }

      // Validate data types
      if (isNaN(quantity) || isNaN(buyPrice) || quantity <= 0 || buyPrice <= 0) {
        return res.status(400).json({
          error: 'Quantity and buyPrice must be positive numbers'
        });
      }

      // Insert into database
      const [result] = await pool.execute(
        'INSERT INTO portfolio (symbol, quantity, buy_price, buy_date) VALUES (?, ?, ?, ?)',
        [symbol.toUpperCase(), parseInt(quantity), parseFloat(buyPrice), buyDate]
      );

      res.status(201).json({
        message: 'Stock added to portfolio successfully',
        id: result.insertId,
        data: {
          symbol: symbol.toUpperCase(),
          quantity: parseInt(quantity),
          buyPrice: parseFloat(buyPrice),
          buyDate
        }
      });
    } catch (error) {
      console.error('Add stock error:', error);
      res.status(500).json({ error: 'Failed to add stock to portfolio' });
    }
  }

  /**
   * Get all portfolio holdings
   * GET /api/portfolio
   */
  async getPortfolio(req, res) {
    try {
      // Get all portfolio entries
      const [portfolioRows] = await pool.execute(
        'SELECT * FROM portfolio ORDER BY symbol ASC'
      );

      if (portfolioRows.length === 0) {
        return res.json({
          holdings: [],
          totalValue: 0,
          totalCost: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0
        });
      }

      // Get unique symbols for current price lookup
      const symbols = [...new Set(portfolioRows.map(row => row.symbol))];
      
      // Get current prices (this might take time due to API rate limits)
      const currentPrices = {};
      for (const symbol of symbols) {
        try {
          const quote = await stockService.searchStock(symbol);
          currentPrices[symbol] = quote.currentPrice;
        } catch (error) {
          console.error(`Error fetching price for ${symbol}:`, error.message);
          currentPrices[symbol] = null;
        }
      }

      // Calculate portfolio metrics
      let totalValue = 0;
      let totalCost = 0;

      const holdings = portfolioRows.map(row => {
        const currentPrice = currentPrices[row.symbol];
        const cost = row.quantity * row.buy_price;
        const value = currentPrice ? row.quantity * currentPrice : null;
        const gainLoss = value ? value - cost : null;
        const gainLossPercent = cost > 0 && gainLoss !== null ? ((gainLoss / cost) * 100) : null;

        if (value) totalValue += value;
        totalCost += cost;

        return {
          id: row.id,
          symbol: row.symbol,
          quantity: row.quantity,
          buyPrice: row.buy_price,
          buyDate: row.buy_date,
          currentPrice: currentPrice,
          cost: cost,
          currentValue: value,
          gainLoss: gainLoss,
          gainLossPercent: gainLossPercent ? parseFloat(gainLossPercent.toFixed(2)) : null,
          lastUpdated: new Date().toISOString()
        };
      });

      const totalGainLoss = totalValue - totalCost;
      const totalGainLossPercent = totalCost > 0 ? ((totalGainLoss / totalCost) * 100) : 0;

      res.json({
        holdings,
        totalValue: parseFloat(totalValue.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2)),
        totalGainLoss: parseFloat(totalGainLoss.toFixed(2)),
        totalGainLossPercent: parseFloat(totalGainLossPercent.toFixed(2))
      });
    } catch (error) {
      console.error('Get portfolio error:', error);
      res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  }

  /**
   * Get historical price data for a stock
   * GET /api/portfolio/history/:symbol
   */
  async getHistoricalData(req, res) {
    try {
      const { symbol } = req.params;
      const { period = 'daily' } = req.query;

      if (!symbol) {
        return res.status(400).json({ error: 'Stock symbol is required' });
      }

      const historicalData = await stockService.getHistoricalData(symbol, period);

      res.json({
        symbol: symbol.toUpperCase(),
        period,
        data: historicalData
      });
    } catch (error) {
      console.error('Historical data error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch historical data' });
    }
  }

  /**
   * Search for stock information
   * GET /api/search?q=SYMBOL
   */
  async searchStock(req, res) {
    try {
      const { q: symbol } = req.query;

      if (!symbol) {
        return res.status(400).json({ error: 'Search query (q) is required' });
      }

      const stockInfo = await stockService.searchStock(symbol);

      res.json(stockInfo);
    } catch (error) {
      console.error('Stock search error:', error);
      res.status(500).json({ error: error.message || 'Failed to search stock' });
    }
  }

  /**
   * Delete a stock from portfolio
   * DELETE /api/portfolio/:id
   */
  async deleteStock(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Valid stock ID is required' });
      }

      const [result] = await pool.execute(
        'DELETE FROM portfolio WHERE id = ?',
        [parseInt(id)]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Stock not found in portfolio' });
      }

      res.json({ message: 'Stock removed from portfolio successfully' });
    } catch (error) {
      console.error('Delete stock error:', error);
      res.status(500).json({ error: 'Failed to remove stock from portfolio' });
    }
  }

  /**
   * Update stock quantity in portfolio
   * PUT /api/portfolio/:id
   */
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity, buyPrice } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Valid stock ID is required' });
      }

      if (!quantity && !buyPrice) {
        return res.status(400).json({ error: 'Quantity or buyPrice is required' });
      }

      let updateQuery = 'UPDATE portfolio SET ';
      let updateValues = [];
      let updateFields = [];

      if (quantity !== undefined) {
        if (isNaN(quantity) || quantity <= 0) {
          return res.status(400).json({ error: 'Quantity must be a positive number' });
        }
        updateFields.push('quantity = ?');
        updateValues.push(parseInt(quantity));
      }

      if (buyPrice !== undefined) {
        if (isNaN(buyPrice) || buyPrice <= 0) {
          return res.status(400).json({ error: 'Buy price must be a positive number' });
        }
        updateFields.push('buy_price = ?');
        updateValues.push(parseFloat(buyPrice));
      }

      updateQuery += updateFields.join(', ') + ' WHERE id = ?';
      updateValues.push(parseInt(id));

      const [result] = await pool.execute(updateQuery, updateValues);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Stock not found in portfolio' });
      }

      res.json({ message: 'Stock updated successfully' });
    } catch (error) {
      console.error('Update stock error:', error);
      res.status(500).json({ error: 'Failed to update stock' });
    }
  }
}

module.exports = new PortfolioController();