import React, { useState, useEffect } from 'react';
import { searchStock, addStock, getPortfolio, formatCurrency, formatPercent } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ settings }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Purchase form state
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [purchaseData, setPurchaseData] = useState({
    quantity: '',
    buyPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  // Portfolio summary state
  const [portfolioSummary, setPortfolioSummary] = useState(null);

  useEffect(() => {
    loadPortfolioSummary();
  }, []);

  const loadPortfolioSummary = async () => {
    try {
      const response = await getPortfolio();
      if (response.success) {
        setPortfolioSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error loading portfolio summary:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      const response = await searchStock(searchQuery.trim());
      if (response.success) {
        setSearchResult(response.data);
      }
    } catch (error) {
      setError(error.message || 'Failed to search stock');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = () => {
    if (searchResult) {
      setPurchaseData({
        ...purchaseData,
        buyPrice: searchResult.currentPrice.toString()
      });
      setShowPurchaseForm(true);
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const stockData = {
        symbol: searchResult.symbol,
        quantity: parseFloat(purchaseData.quantity),
        buyPrice: parseFloat(purchaseData.buyPrice),
        purchaseDate: purchaseData.purchaseDate
      };

      const response = await addStock(stockData);
      if (response.success) {
        setSuccess(`Successfully added ${purchaseData.quantity} shares of ${searchResult.symbol} to your portfolio!`);
        setShowPurchaseForm(false);
        setPurchaseData({
          quantity: '',
          buyPrice: '',
          purchaseDate: new Date().toISOString().split('T')[0]
        });
        loadPortfolioSummary(); // Refresh portfolio summary
      }
    } catch (error) {
      setError(error.message || 'Failed to add stock to portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1 className="page-title">Dashboard</h1>

        {/* Portfolio Summary */}
        {portfolioSummary && (
          <div className="portfolio-summary">
            <h2>Portfolio Overview</h2>
            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-label">Total Value</div>
                <div className="card-value">
                  {formatCurrency(portfolioSummary.totalValue, settings.currency)}
                </div>
              </div>
              <div className="summary-card">
                <div className="card-label">Total Cost</div>
                <div className="card-value">
                  {formatCurrency(portfolioSummary.totalCost, settings.currency)}
                </div>
              </div>
              <div className="summary-card">
                <div className="card-label">Gain/Loss</div>
                <div className={`card-value ${portfolioSummary.totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(portfolioSummary.totalGainLoss, settings.currency)}
                  <span className="percentage">
                    ({formatPercent(portfolioSummary.totalGainLossPercent)})
                  </span>
                </div>
              </div>
              <div className="summary-card">
                <div className="card-label">Holdings</div>
                <div className="card-value">{portfolioSummary.holdingsCount}</div>
              </div>
            </div>
          </div>
        )}

        {/* Stock Search */}
        <div className="search-section">
          <h2>Search & Buy Stocks</h2>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter stock symbol (e.g., AAPL, GOOGL, MSFT)"
                className="search-input"
                disabled={loading}
              />
              <button 
                type="submit" 
                className="search-button"
                disabled={loading || !searchQuery.trim()}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

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

          {/* Search Result */}
          {searchResult && (
            <div className="search-result">
              <div className="stock-info">
                <div className="stock-header">
                  <h3 className="stock-symbol">{searchResult.symbol}</h3>
                  <span className="stock-name">{searchResult.name}</span>
                </div>
                
                <div className="stock-price">
                  <span className="current-price">
                    {formatCurrency(searchResult.currentPrice, settings.currency)}
                  </span>
                  <span className={`price-change ${searchResult.change >= 0 ? 'positive' : 'negative'}`}>
                    {formatPercent(parseFloat(searchResult.changePercent))}
                  </span>
                </div>

                <div className="stock-actions">
                  <button 
                    className="buy-button"
                    onClick={handleBuyClick}
                    disabled={loading}
                  >
                    Buy Stock
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Form */}
          {showPurchaseForm && searchResult && (
            <div className="purchase-form-overlay">
              <div className="purchase-form">
                <h3>Buy {searchResult.symbol}</h3>
                
                <form onSubmit={handlePurchase}>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      value={purchaseData.quantity}
                      onChange={(e) => setPurchaseData({...purchaseData, quantity: e.target.value})}
                      placeholder="Number of shares"
                      min="0.0001"
                      step="0.0001"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Buy Price ({settings.currency})</label>
                    <input
                      type="number"
                      value={purchaseData.buyPrice}
                      onChange={(e) => setPurchaseData({...purchaseData, buyPrice: e.target.value})}
                      placeholder="Price per share"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Purchase Date</label>
                    <input
                      type="date"
                      value={purchaseData.purchaseDate}
                      onChange={(e) => setPurchaseData({...purchaseData, purchaseDate: e.target.value})}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  {purchaseData.quantity && purchaseData.buyPrice && (
                    <div className="total-cost">
                      <strong>
                        Total Cost: {formatCurrency(
                          parseFloat(purchaseData.quantity) * parseFloat(purchaseData.buyPrice),
                          settings.currency
                        )}
                      </strong>
                    </div>
                  )}

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => setShowPurchaseForm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="confirm-button"
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add to Portfolio'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;