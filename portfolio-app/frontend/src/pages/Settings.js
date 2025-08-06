import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import './Settings.css';

const Settings = () => {
  const { settings, updateSettings, user, updateUser } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('general');
  const [showResetModal, setShowResetModal] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'trading', label: 'Trading', icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'account', label: 'Account', icon: '👤' }
  ];

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  const handleUserUpdate = (key, value) => {
    updateUser({ [key]: value });
  };

  const handleResetSettings = () => {
    updateSettings({
      darkMode: false,
      proMode: false,
      currency: 'USD',
      language: 'en',
      notifications: true,
      autoRefresh: true,
      refreshInterval: 30
    });
    setShowResetModal(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-main">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2 className="section-title">General Settings</h2>
              
              <div className="setting-group">
                <h3 className="setting-label">Appearance</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Dark Mode</span>
                    <span className="setting-description">Switch between light and dark themes</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Pro Mode</span>
                    <span className="setting-description">Enable advanced trading features</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.proMode}
                      onChange={(e) => handleSettingChange('proMode', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <h3 className="setting-label">Display</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Currency</span>
                    <span className="setting-description">Select your preferred currency</span>
                  </div>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                    className="setting-select"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Language</span>
                    <span className="setting-description">Choose your preferred language</span>
                  </div>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="setting-select"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trading' && (
            <div className="settings-section">
              <h2 className="section-title">Trading Settings</h2>
              
              <div className="setting-group">
                <h3 className="setting-label">Auto Refresh</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Enable Auto Refresh</span>
                    <span className="setting-description">Automatically update market data</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.autoRefresh}
                      onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Refresh Interval</span>
                    <span className="setting-description">How often to refresh data (seconds)</span>
                  </div>
                  <select
                    value={settings.refreshInterval}
                    onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                    className="setting-select"
                    disabled={!settings.autoRefresh}
                  >
                    <option value={15}>15 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={300}>5 minutes</option>
                  </select>
                </div>
              </div>

              <div className="setting-group">
                <h3 className="setting-label">Trading Preferences</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Default Order Type</span>
                    <span className="setting-description">Set your preferred order type</span>
                  </div>
                  <select className="setting-select">
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                    <option value="stop">Stop</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Confirm Orders</span>
                    <span className="setting-description">Require confirmation before placing orders</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2 className="section-title">Notification Settings</h2>
              
              <div className="setting-group">
                <h3 className="setting-label">General Notifications</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Enable Notifications</span>
                    <span className="setting-description">Receive push notifications</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <h3 className="setting-label">Trading Alerts</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Price Alerts</span>
                    <span className="setting-description">Get notified when stocks reach target prices</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Order Confirmations</span>
                    <span className="setting-description">Receive notifications when orders are filled</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Market Updates</span>
                    <span className="setting-description">Get daily market summary emails</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2 className="section-title">Security Settings</h2>
              
              <div className="setting-group">
                <h3 className="setting-label">Account Security</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Two-Factor Authentication</span>
                    <span className="setting-description">Add an extra layer of security</span>
                  </div>
                  <button className="btn btn-outline">Enable 2FA</button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Change Password</span>
                    <span className="setting-description">Update your account password</span>
                  </div>
                  <button className="btn btn-outline">Change Password</button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Login History</span>
                    <span className="setting-description">View recent login activity</span>
                  </div>
                  <button className="btn btn-outline">View History</button>
                </div>
              </div>

              <div className="setting-group">
                <h3 className="setting-label">Session Management</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Auto Logout</span>
                    <span className="setting-description">Automatically log out after inactivity</span>
                  </div>
                  <select className="setting-select">
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={0}>Never</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="settings-section">
              <h2 className="section-title">Account Settings</h2>
              
              <div className="setting-group">
                <h3 className="setting-label">Profile Information</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Display Name</span>
                    <span className="setting-description">Your name as it appears in the app</span>
                  </div>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => handleUserUpdate('name', e.target.value)}
                    className="setting-input"
                  />
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Email Address</span>
                    <span className="setting-description">Your email for notifications</span>
                  </div>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => handleUserUpdate('email', e.target.value)}
                    className="setting-input"
                  />
                </div>
              </div>

              <div className="setting-group">
                <h3 className="setting-label">Account Actions</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Export Data</span>
                    <span className="setting-description">Download your portfolio and transaction data</span>
                  </div>
                  <button className="btn btn-outline">Export Data</button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Reset Settings</span>
                    <span className="setting-description">Reset all settings to default values</span>
                  </div>
                  <button 
                    className="btn btn-outline"
                    onClick={() => setShowResetModal(true)}
                  >
                    Reset Settings
                  </button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-name">Delete Account</span>
                    <span className="setting-description">Permanently delete your account and data</span>
                  </div>
                  <button className="btn btn-danger">Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reset Settings</h3>
              <button 
                className="modal-close"
                onClick={() => setShowResetModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <p>Are you sure you want to reset all settings to their default values? This action cannot be undone.</p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleResetSettings}
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;