import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Portfolio from './pages/Portfolio';
import Settings from './pages/Settings';

// Services
import { getSettings } from './services/api';

function App() {
  const [settings, setSettings] = useState({
    darkMode: false,
    proMode: false,
    currency: 'USD'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await getSettings();
      if (response.success) {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...response.data
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Portfolio Manager...</p>
      </div>
    );
  }

  return (
    <div className={`App ${settings.darkMode ? 'dark-mode' : ''} ${settings.proMode ? 'pro-mode' : ''}`}>
      <Router>
        <Header 
          settings={settings} 
          updateSettings={updateSettings}
          onSettingsChange={loadSettings}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard settings={settings} />} />
            <Route path="/dashboard" element={<Dashboard settings={settings} />} />
            <Route path="/assets" element={<Assets settings={settings} />} />
            <Route path="/portfolio" element={<Portfolio settings={settings} />} />
            <Route path="/settings" element={
              <Settings 
                settings={settings} 
                updateSettings={updateSettings}
                onSettingsChange={loadSettings}
              />
            } />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
