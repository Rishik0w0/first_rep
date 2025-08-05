import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for stock API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Portfolio API functions
export const portfolioAPI = {
  // Get all portfolio holdings
  getPortfolio: async () => {
    const response = await api.get('/portfolio');
    return response.data;
  },

  // Add stock to portfolio
  addStock: async (stockData) => {
    const response = await api.post('/portfolio', stockData);
    return response.data;
  },

  // Update stock in portfolio
  updateStock: async (id, updateData) => {
    const response = await api.put(`/portfolio/${id}`, updateData);
    return response.data;
  },

  // Delete stock from portfolio
  deleteStock: async (id) => {
    const response = await api.delete(`/portfolio/${id}`);
    return response.data;
  },

  // Get historical data for a stock
  getHistoricalData: async (symbol, period = 'daily') => {
    const response = await api.get(`/portfolio/history/${symbol}`, {
      params: { period }
    });
    return response.data;
  },
};

// Stock search API functions
export const stockAPI = {
  // Search for stock information
  searchStock: async (symbol) => {
    const response = await api.get('/search', {
      params: { q: symbol }
    });
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;