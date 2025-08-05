const axios = require('axios');
require('dotenv').config();

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

class StockService {
  /**
   * Search for stock symbol and get basic info
   * @param {string} symbol - Stock symbol (e.g., 'AAPL')
   * @returns {Object} Stock information
   */
  async searchStock(symbol) {
    try {
      if (!API_KEY) {
        throw new Error('Alpha Vantage API key not configured');
      }

      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol.toUpperCase(),
          apikey: API_KEY
        },
        timeout: 10000
      });

      const data = response.data;
      
      if (data['Error Message']) {
        throw new Error(`Invalid stock symbol: ${symbol}`);
      }

      if (data['Note']) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }

      const quote = data['Global Quote'];
      if (!quote || Object.keys(quote).length === 0) {
        throw new Error(`No data found for symbol: ${symbol}`);
      }

      return {
        symbol: quote['01. symbol'],
        name: quote['01. symbol'], // Alpha Vantage doesn't provide company name in this endpoint
        currentPrice: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: quote['10. change percent'],
        lastUpdated: quote['07. latest trading day']
      };
    } catch (error) {
      console.error('Stock search error:', error.message);
      throw error;
    }
  }

  /**
   * Get historical price data for a stock
   * @param {string} symbol - Stock symbol
   * @param {string} period - Time period ('daily', 'weekly', 'monthly')
   * @returns {Array} Historical price data
   */
  async getHistoricalData(symbol, period = 'daily') {
    try {
      if (!API_KEY) {
        throw new Error('Alpha Vantage API key not configured');
      }

      let functionName;
      switch (period) {
        case 'weekly':
          functionName = 'TIME_SERIES_WEEKLY';
          break;
        case 'monthly':
          functionName = 'TIME_SERIES_MONTHLY';
          break;
        default:
          functionName = 'TIME_SERIES_DAILY';
      }

      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: functionName,
          symbol: symbol.toUpperCase(),
          apikey: API_KEY,
          outputsize: 'compact' // Last 100 data points
        },
        timeout: 15000
      });

      const data = response.data;

      if (data['Error Message']) {
        throw new Error(`Invalid stock symbol: ${symbol}`);
      }

      if (data['Note']) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }

      // Extract time series data
      const timeSeriesKey = Object.keys(data).find(key => key.includes('Time Series'));
      if (!timeSeriesKey) {
        throw new Error(`No historical data found for symbol: ${symbol}`);
      }

      const timeSeries = data[timeSeriesKey];
      const historicalData = [];

      for (const [date, values] of Object.entries(timeSeries)) {
        historicalData.push({
          date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume'])
        });
      }

      // Sort by date (most recent first)
      return historicalData.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Historical data error:', error.message);
      throw error;
    }
  }

  /**
   * Get current price for multiple stocks
   * @param {Array} symbols - Array of stock symbols
   * @returns {Object} Object with symbol as key and price info as value
   */
  async getBatchQuotes(symbols) {
    const quotes = {};
    
    // Note: Alpha Vantage free tier has rate limits, so we'll process sequentially
    for (const symbol of symbols) {
      try {
        const quote = await this.searchStock(symbol);
        quotes[symbol] = quote;
        
        // Add delay to respect rate limits (5 requests per minute for free tier)
        await new Promise(resolve => setTimeout(resolve, 12000)); // 12 second delay
      } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error.message);
        quotes[symbol] = { error: error.message };
      }
    }

    return quotes;
  }
}

module.exports = new StockService();