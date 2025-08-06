import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Dashboard from './pages/Dashboard';
import Trading from './pages/Trading';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import News from './pages/News';
import Settings from './pages/Settings';

// Context
export const AppContext = createContext();

function App() {
  const [settings, setSettings] = useState({
    darkMode: false,
    proMode: false,
    currency: 'USD',
    language: 'en',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30
  });

  const [user, setUser] = useState({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    balance: 50000,
    portfolio: [],
    watchlist: []
  });

  const [marketData, setMarketData] = useState({
    indices: [],
    trending: [],
    news: [],
    lastUpdated: null
  });

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Simulate loading market data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock market data
      setMarketData({
        indices: [
          { symbol: '^GSPC', name: 'S&P 500', price: 4567.89, change: 23.45, changePercent: 0.52 },
          { symbol: '^DJI', name: 'Dow Jones', price: 34567.89, change: -123.45, changePercent: -0.36 },
          { symbol: '^IXIC', name: 'NASDAQ', price: 14234.56, change: 67.89, changePercent: 0.48 }
        ],
        trending: [
          { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: 2.34, changePercent: 1.25 },
          { symbol: 'TSLA', name: 'Tesla Inc.', price: 234.56, change: -5.67, changePercent: -2.36 },
          { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90, change: 4.56, changePercent: 1.22 }
        ],
        news: [],
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const updateUser = (newUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...newUserData
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const contextValue = {
    settings,
    user,
    marketData,
    updateSettings,
    updateUser,
    sidebarOpen,
    toggleSidebar
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`App ${settings.darkMode ? 'dark-mode' : ''} ${settings.proMode ? 'pro-mode' : ''}`}>
        <Router>
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Header />
              <div className="page-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/trading" element={<Trading />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </div>
    </AppContext.Provider>
  );
}

export default App;
