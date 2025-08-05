import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    
    throw error.response?.data || error;
  }
);

// Portfolio API calls
export const getPortfolio = () => api.get('/portfolio');

export const addStock = (stockData) => api.post('/portfolio', stockData);

export const updateStock = (id, stockData) => api.put(`/portfolio/${id}`, stockData);

export const deleteStock = (id) => api.delete(`/portfolio/${id}`);

export const getPortfolioHistory = (period = '1Y') => api.get(`/portfolio/history/${period}`);

export const getSymbolHistory = (symbol, period = '1Y') => 
  api.get(`/portfolio/history/${symbol}/${period}`);

// Stock API calls
export const searchStock = (symbol) => api.get(`/search?q=${encodeURIComponent(symbol)}`);

export const getCurrentPrice = (symbol) => api.get(`/stocks/${symbol}/price`);

export const getStockHistory = (symbol, period = '1Y') => 
  api.get(`/stocks/${symbol}/history/${period}`);

export const getMultipleQuotes = (symbols) => api.post('/stocks/quotes', { symbols });

// Settings API calls
export const getSettings = () => api.get('/settings');

export const getSetting = (key) => api.get(`/settings/${key}`);

export const updateSetting = (key, value) => api.put(`/settings/${key}`, { value });

export const updateSettings = (settings) => api.put('/settings', settings);

export const resetSettings = () => api.post('/settings/reset');

// Utility functions
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (number, decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

export const formatPercent = (percent) => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default api;