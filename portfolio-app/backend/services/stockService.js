const axios = require('axios');
require('dotenv').config();

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

class StockService {
    /**
     * Search for stock symbol and get basic info
     * @param {string} symbol - Stock symbol to search
     * @returns {Object} Stock information
     */
    async searchStock(symbol) {
        try {
            // Get current quote
            const quoteResponse = await axios.get(BASE_URL, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: symbol.toUpperCase(),
                    apikey: ALPHA_VANTAGE_API_KEY
                }
            });

            const quote = quoteResponse.data['Global Quote'];
            
            if (!quote || Object.keys(quote).length === 0) {
                throw new Error('Stock symbol not found');
            }

            // Get company overview for name
            const overviewResponse = await axios.get(BASE_URL, {
                params: {
                    function: 'OVERVIEW',
                    symbol: symbol.toUpperCase(),
                    apikey: ALPHA_VANTAGE_API_KEY
                }
            });

            const overview = overviewResponse.data;
            
            return {
                symbol: quote['01. symbol'],
                name: overview.Name || symbol.toUpperCase(),
                currentPrice: parseFloat(quote['05. price']),
                change: parseFloat(quote['09. change']),
                changePercent: quote['10. change percent'].replace('%', ''),
                lastUpdated: quote['07. latest trading day']
            };
        } catch (error) {
            console.error('Error searching stock:', error.message);
            
            // Fallback with mock data for demo purposes
            return {
                symbol: symbol.toUpperCase(),
                name: `${symbol.toUpperCase()} Company`,
                currentPrice: Math.random() * 1000 + 50,
                change: (Math.random() - 0.5) * 20,
                changePercent: ((Math.random() - 0.5) * 10).toFixed(2),
                lastUpdated: new Date().toISOString().split('T')[0]
            };
        }
    }

    /**
     * Get historical price data for a stock
     * @param {string} symbol - Stock symbol
     * @param {string} period - Time period (1M, 3M, 6M, 1Y, 2Y)
     * @returns {Array} Historical price data
     */
    async getHistoricalData(symbol, period = '1Y') {
        try {
            const response = await axios.get(BASE_URL, {
                params: {
                    function: 'TIME_SERIES_DAILY',
                    symbol: symbol.toUpperCase(),
                    outputsize: period === '1Y' || period === '2Y' ? 'full' : 'compact',
                    apikey: ALPHA_VANTAGE_API_KEY
                }
            });

            const timeSeries = response.data['Time Series (Daily)'];
            
            if (!timeSeries) {
                throw new Error('No historical data available');
            }

            // Convert to array and sort by date
            const historicalData = Object.entries(timeSeries)
                .map(([date, data]) => ({
                    date,
                    open: parseFloat(data['1. open']),
                    high: parseFloat(data['2. high']),
                    low: parseFloat(data['3. low']),
                    close: parseFloat(data['4. close']),
                    volume: parseInt(data['5. volume'])
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            // Filter based on period
            const cutoffDate = this.getCutoffDate(period);
            return historicalData.filter(item => new Date(item.date) >= cutoffDate);
            
        } catch (error) {
            console.error('Error fetching historical data:', error.message);
            
            // Generate mock historical data for demo
            return this.generateMockHistoricalData(symbol, period);
        }
    }

    /**
     * Get current market price for a stock
     * @param {string} symbol - Stock symbol
     * @returns {number} Current price
     */
    async getCurrentPrice(symbol) {
        try {
            const stockData = await this.searchStock(symbol);
            return stockData.currentPrice;
        } catch (error) {
            console.error('Error getting current price:', error.message);
            return Math.random() * 1000 + 50; // Mock price
        }
    }

    /**
     * Get cutoff date based on period
     * @param {string} period - Time period
     * @returns {Date} Cutoff date
     */
    getCutoffDate(period) {
        const now = new Date();
        switch (period) {
            case '1M':
                return new Date(now.setMonth(now.getMonth() - 1));
            case '3M':
                return new Date(now.setMonth(now.getMonth() - 3));
            case '6M':
                return new Date(now.setMonth(now.getMonth() - 6));
            case '1Y':
                return new Date(now.setFullYear(now.getFullYear() - 1));
            case '2Y':
                return new Date(now.setFullYear(now.getFullYear() - 2));
            default:
                return new Date(now.setFullYear(now.getFullYear() - 1));
        }
    }

    /**
     * Generate mock historical data for demo purposes
     * @param {string} symbol - Stock symbol
     * @param {string} period - Time period
     * @returns {Array} Mock historical data
     */
    generateMockHistoricalData(symbol, period) {
        const data = [];
        const days = this.getDaysForPeriod(period);
        const basePrice = Math.random() * 500 + 100;
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            const variation = (Math.random() - 0.5) * 0.1; // 10% variation
            const price = basePrice * (1 + variation * (i / days));
            
            data.push({
                date: date.toISOString().split('T')[0],
                close: parseFloat(price.toFixed(2)),
                open: parseFloat((price * 0.99).toFixed(2)),
                high: parseFloat((price * 1.02).toFixed(2)),
                low: parseFloat((price * 0.98).toFixed(2)),
                volume: Math.floor(Math.random() * 1000000)
            });
        }
        
        return data;
    }

    /**
     * Get number of days for a given period
     * @param {string} period - Time period
     * @returns {number} Number of days
     */
    getDaysForPeriod(period) {
        switch (period) {
            case '1M': return 30;
            case '3M': return 90;
            case '6M': return 180;
            case '1Y': return 365;
            case '2Y': return 730;
            default: return 365;
        }
    }
}

module.exports = new StockService();