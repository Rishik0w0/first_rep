import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import './Header.css';

const Header = () => {
  const { user, marketData, settings, toggleSidebar } = useContext(AppContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log('Searching for:', searchQuery);
      setShowSearchResults(false);
    }
  };

  const getMarketStatus = () => {
    const now = new Date();
    const marketOpen = new Date();
    marketOpen.setHours(9, 30, 0, 0);
    const marketClose = new Date();
    marketClose.setHours(16, 0, 0, 0);
    
    if (now.getDay() === 0 || now.getDay() === 6) {
      return { status: 'closed', text: 'Weekend', color: '#e74c3c' };
    } else if (now >= marketOpen && now <= marketClose) {
      return { status: 'open', text: 'Market Open', color: '#27ae60' };
    } else {
      return { status: 'closed', text: 'Market Closed', color: '#e74c3c' };
    }
  };

  const marketStatus = getMarketStatus();

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className="market-status">
          <div 
            className="status-indicator" 
            style={{ backgroundColor: marketStatus.color }}
          ></div>
          <span className="status-text">{marketStatus.text}</span>
        </div>
      </div>

      <div className="header-center">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search stocks, ETFs, or companies..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </div>
          
          {showSearchResults && (
            <div className="search-results">
              <div className="search-result-item">
                <span className="result-symbol">AAPL</span>
                <span className="result-name">Apple Inc.</span>
                <span className="result-price">$189.45</span>
              </div>
              <div className="search-result-item">
                <span className="result-symbol">TSLA</span>
                <span className="result-name">Tesla Inc.</span>
                <span className="result-price">$234.56</span>
              </div>
              <div className="search-result-item">
                <span className="result-symbol">MSFT</span>
                <span className="result-name">Microsoft Corp.</span>
                <span className="result-price">$378.90</span>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="header-right">
        <div className="market-indices">
          {marketData.indices.slice(0, 3).map((index) => (
            <div key={index.symbol} className="index-item">
              <span className="index-symbol">{index.symbol}</span>
              <span className={`index-change ${index.change >= 0 ? 'positive' : 'negative'}`}>
                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="time-display">
          <div className="current-time">{formatTime(currentTime)}</div>
          <div className="current-date">{formatDate(currentTime)}</div>
        </div>

        <div className="user-menu">
          <div className="notifications">
            <button className="notification-btn">
              🔔
              <span className="notification-badge">3</span>
            </button>
          </div>
          
          <div className="user-profile">
            <div className="user-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-balance">${user.balance?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;