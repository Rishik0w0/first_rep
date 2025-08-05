import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { updateSetting } from '../services/api';
import './Header.css';

const Header = ({ settings, updateSettings, onSettingsChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  const handleModeToggle = async (mode) => {
    try {
      const newValue = !settings[mode];
      await updateSetting(mode, newValue);
      updateSettings({ [mode]: newValue });
      if (onSettingsChange) {
        onSettingsChange();
      }
    } catch (error) {
      console.error(`Error updating ${mode}:`, error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo and Title */}
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-icon">📊</span>
            <span className="logo-text">Portfolio Manager</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/assets" 
            className={`nav-link ${isActive('/assets') ? 'active' : ''}`}
          >
            Assets
          </Link>
          <Link 
            to="/portfolio" 
            className={`nav-link ${isActive('/portfolio') ? 'active' : ''}`}
          >
            Portfolio
          </Link>
        </nav>

        {/* Right Side Controls */}
        <div className="header-right">
          {/* Mode Toggle */}
          <div className="mode-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.proMode}
                onChange={() => handleModeToggle('proMode')}
              />
              <span className="slider"></span>
            </label>
            <span className="toggle-label">
              {settings.proMode ? 'Pro' : 'Normal'}
            </span>
          </div>

          {/* Profile Dropdown */}
          <div className="profile-dropdown">
            <button
              className="profile-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="profile-icon">👤</span>
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <Link 
                  to="/settings" 
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  <span className="dropdown-icon">⚙️</span>
                  Settings
                </Link>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item">
                  <span className="dropdown-icon">🌙</span>
                  <span>Dark Mode</span>
                  <label className="toggle-switch small">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={() => handleModeToggle('darkMode')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;