import React, { useState } from 'react';
import { addStock, formatCurrency } from '../services/api';
import './Assets.css';

const Assets = ({ settings }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    buyPrice: '',
    purchaseDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const stockData = {
        symbol: formData.symbol.toUpperCase(),
        quantity: parseFloat(formData.quantity),
        buyPrice: parseFloat(formData.buyPrice),
        purchaseDate: formData.purchaseDate
      };

      const response = await addStock(stockData);
      if (response.success) {
        setSuccess(`Successfully added ${formData.quantity} shares of ${formData.symbol.toUpperCase()} to your portfolio!`);
        // Reset form
        setFormData({
          symbol: '',
          quantity: '',
          buyPrice: '',
          purchaseDate: ''
        });
      }
    } catch (error) {
      setError(error.message || 'Failed to add stock to portfolio');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCost = () => {
    if (formData.quantity && formData.buyPrice) {
      return parseFloat(formData.quantity) * parseFloat(formData.buyPrice);
    }
    return 0;
  };

  const commonStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NFLX', name: 'Netflix Inc.' }
  ];

  return (
    <div className="assets">
      <div className="assets-container">
        <h1 className="page-title">Manual Asset Entry</h1>
        <p className="page-description">
          Add previously purchased stocks to your portfolio. Perfect for tracking historical investments.
        </p>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            {success}
          </div>
        )}

        <div className="assets-content">
          {/* Manual Entry Form */}
          <div className="entry-form-section">
            <h2>Add Stock to Portfolio</h2>
            
            <form onSubmit={handleSubmit} className="entry-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="symbol">Stock Symbol *</label>
                  <input
                    type="text"
                    id="symbol"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    placeholder="e.g., AAPL, GOOGL, MSFT"
                    maxLength="10"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Number of shares"
                    min="0.0001"
                    step="0.0001"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="buyPrice">Buy Price ({settings.currency}) *</label>
                  <input
                    type="number"
                    id="buyPrice"
                    name="buyPrice"
                    value={formData.buyPrice}
                    onChange={handleInputChange}
                    placeholder="Price per share"
                    min="0.01"
                    step="0.01"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="purchaseDate">Purchase Date *</label>
                  <input
                    type="date"
                    id="purchaseDate"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Total Cost Display */}
              {formData.quantity && formData.buyPrice && (
                <div className="total-cost-display">
                  <strong>
                    Total Investment: {formatCurrency(calculateTotalCost(), settings.currency)}
                  </strong>
                </div>
              )}

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Adding to Portfolio...' : 'Add to Portfolio'}
              </button>
            </form>
          </div>

          {/* Quick Add Section */}
          <div className="quick-add-section">
            <h2>Popular Stocks</h2>
            <p>Click on a stock to quickly fill the symbol field</p>
            
            <div className="stock-grid">
              {commonStocks.map((stock) => (
                <div 
                  key={stock.symbol}
                  className="stock-card"
                  onClick={() => setFormData(prev => ({ ...prev, symbol: stock.symbol }))}
                >
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Example Section */}
        <div className="example-section">
          <h2>Example Entry</h2>
          <div className="example-card">
            <div className="example-header">
              <span className="example-label">Example:</span>
              <span className="example-title">Historical Investment</span>
            </div>
            <div className="example-content">
              <div className="example-row">
                <span className="example-field">Symbol:</span>
                <span className="example-value">GOOGL</span>
              </div>
              <div className="example-row">
                <span className="example-field">Quantity:</span>
                <span className="example-value">200 shares</span>
              </div>
              <div className="example-row">
                <span className="example-field">Buy Price:</span>
                <span className="example-value">$500.00</span>
              </div>
              <div className="example-row">
                <span className="example-field">Purchase Date:</span>
                <span className="example-value">2014-08-05</span>
              </div>
              <div className="example-row">
                <span className="example-field">Total Investment:</span>
                <span className="example-value">$100,000.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <h2>Tips for Manual Entry</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">📊</div>
              <div className="tip-content">
                <h3>Accurate Data</h3>
                <p>Enter the exact purchase price and date for accurate performance tracking</p>
              </div>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🔍</div>
              <div className="tip-content">
                <h3>Stock Symbols</h3>
                <p>Use official stock ticker symbols (e.g., AAPL for Apple, MSFT for Microsoft)</p>
              </div>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📅</div>
              <div className="tip-content">
                <h3>Historical Dates</h3>
                <p>You can add stocks purchased years ago to track long-term performance</p>
              </div>
            </div>
            <div className="tip-card">
              <div className="tip-icon">💼</div>
              <div className="tip-content">
                <h3>Multiple Entries</h3>
                <p>Add the same stock multiple times if purchased at different dates/prices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assets;