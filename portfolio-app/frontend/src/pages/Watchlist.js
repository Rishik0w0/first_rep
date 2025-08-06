import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import './Watchlist.css';

const Watchlist = () => {
  const { user, updateUser } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddStock, setShowAddStock] = useState(false);
  const [newStock, setNewStock] = useState({ symbol: '', name: '' });
  const [sortBy, setSortBy] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');

  const availableStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: 2.34, changePercent: 1.25, sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 234.56, change: -5.67, changePercent: -2.36, sector: 'Automotive' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90, change: 4.56, changePercent: 1.22, sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.67, change: 1.23, changePercent: 0.87, sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.24, change: -2.15, changePercent: -1.46, sector: 'Consumer Discretionary' },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 298.76, change: 3.45, changePercent: 1.17, sector: 'Technology' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 456.78, change: 12.34, changePercent: 2.78, sector: 'Technology' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 167.89, change: -1.23, changePercent: -0.73, sector: 'Financial' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.78, change: 0.45, changePercent: 0.29, sector: 'Healthcare' },
    { symbol: 'V', name: 'Visa Inc.', price: 234.56, change: 2.34, changePercent: 1.01, sector: 'Financial' }
  ];

  const watchlist = user.watchlist || [];

  const addToWatchlist = (stock) => {
    if (!watchlist.find(item => item.symbol === stock.symbol)) {
      const updatedWatchlist = [...watchlist, stock];
      updateUser({ watchlist: updatedWatchlist });
    }
  };

  const removeFromWatchlist = (symbol) => {
    const updatedWatchlist = watchlist.filter(item => item.symbol !== symbol);
    updateUser({ watchlist: updatedWatchlist });
  };

  const handleAddStock = (e) => {
    e.preventDefault();
    const stock = availableStocks.find(s => s.symbol === newStock.symbol);
    if (stock) {
      addToWatchlist(stock);
      setNewStock({ symbol: '', name: '' });
      setShowAddStock(false);
    }
  };

  const filteredStocks = availableStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'symbol':
        aValue = a.symbol;
        bValue = b.symbol;
        break;
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'change':
        aValue = a.changePercent;
        bValue = b.changePercent;
        break;
      default:
        aValue = a.symbol;
        bValue = b.symbol;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getSectorColor = (sector) => {
    const colors = {
      'Technology': '#3498db',
      'Financial': '#27ae60',
      'Healthcare': '#e74c3c',
      'Consumer Discretionary': '#f39c12',
      'Automotive': '#9b59b6'
    };
    return colors[sector] || '#95a5a6';
  };

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1 className="page-title">Watchlist</h1>
        <div className="watchlist-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddStock(true)}
          >
            + Add Stock
          </button>
        </div>
      </div>

      <div className="watchlist-content">
        <div className="watchlist-section">
          <div className="section-header">
            <h2 className="section-title">My Watchlist ({watchlist.length})</h2>
            <div className="sort-controls">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="symbol">Symbol</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="change">Change</option>
              </select>
              <button 
                className="sort-btn"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {watchlist.length === 0 ? (
            <div className="empty-watchlist">
              <div className="empty-icon">👁️</div>
              <h3>Your watchlist is empty</h3>
              <p>Add stocks to your watchlist to track their performance</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddStock(true)}
              >
                Add Your First Stock
              </button>
            </div>
          ) : (
            <div className="stock-grid">
              {sortedWatchlist.map(stock => (
                <div key={stock.symbol} className="stock-card">
                  <div className="stock-header">
                    <div className="stock-info">
                      <h3 className="stock-symbol">{stock.symbol}</h3>
                      <p className="stock-name">{stock.name}</p>
                      <span 
                        className="sector-badge"
                        style={{ backgroundColor: getSectorColor(stock.sector) }}
                      >
                        {stock.sector}
                      </span>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromWatchlist(stock.symbol)}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="stock-price-info">
                    <div className="price-section">
                      <span className="price-value">${stock.price}</span>
                      <span className={`price-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                      </span>
                    </div>
                    
                    <div className="stock-actions">
                      <button className="btn btn-sm btn-outline">Trade</button>
                      <button className="btn btn-sm btn-secondary">Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="available-stocks-section">
          <div className="section-header">
            <h2 className="section-title">Available Stocks</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="stocks-table">
            <div className="table-header">
              <div className="table-cell">Symbol</div>
              <div className="table-cell">Name</div>
              <div className="table-cell">Sector</div>
              <div className="table-cell">Price</div>
              <div className="table-cell">Change</div>
              <div className="table-cell">Action</div>
            </div>
            
            <div className="table-body">
              {filteredStocks.map(stock => (
                <div key={stock.symbol} className="table-row">
                  <div className="table-cell symbol-cell">
                    <strong>{stock.symbol}</strong>
                  </div>
                  <div className="table-cell name-cell">
                    {stock.name}
                  </div>
                  <div className="table-cell sector-cell">
                    <span 
                      className="sector-badge small"
                      style={{ backgroundColor: getSectorColor(stock.sector) }}
                    >
                      {stock.sector}
                    </span>
                  </div>
                  <div className="table-cell price-cell">
                    ${stock.price}
                  </div>
                  <div className={`table-cell change-cell ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </div>
                  <div className="table-cell action-cell">
                    {watchlist.find(item => item.symbol === stock.symbol) ? (
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => removeFromWatchlist(stock.symbol)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => addToWatchlist(stock)}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddStock && (
        <div className="modal-overlay" onClick={() => setShowAddStock(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Stock to Watchlist</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddStock(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddStock} className="modal-form">
              <div className="form-group">
                <label>Stock Symbol</label>
                <input
                  type="text"
                  value={newStock.symbol}
                  onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value.toUpperCase() })}
                  placeholder="e.g., AAPL"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={newStock.name}
                  onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                  placeholder="e.g., Apple Inc."
                  className="form-input"
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddStock(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add to Watchlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;