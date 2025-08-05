import React, { useState, useEffect } from 'react';
import { updateSettings, resetSettings } from '../services/api';
import './Settings.css';

const Settings = ({ settings, updateSettings: updateAppSettings, onSettingsChange }) => {
  const [formData, setFormData] = useState({
    currency: 'USD',
    darkMode: false,
    proMode: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setFormData({
      currency: settings.currency || 'USD',
      darkMode: settings.darkMode || false,
      proMode: settings.proMode || false
    });
  }, [settings]);

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
    { value: 'EUR', label: 'Euro (€)', symbol: '€' },
    { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
    { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
    { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
    { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateSettings(formData);
      if (response.success) {
        setSuccess('Settings saved successfully!');
        updateAppSettings(formData);
        if (onSettingsChange) {
          onSettingsChange();
        }
      }
    } catch (error) {
      setError(error.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        const response = await resetSettings();
        if (response.success) {
          const defaultSettings = {
            currency: 'USD',
            darkMode: false,
            proMode: false
          };
          setFormData(defaultSettings);
          updateAppSettings(defaultSettings);
          setSuccess('Settings reset to default values!');
          if (onSettingsChange) {
            onSettingsChange();
          }
        }
      } catch (error) {
        setError(error.message || 'Failed to reset settings');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="settings">
      <div className="settings-container">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">
          Customize your portfolio management experience
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

        <div className="settings-content">
          <form onSubmit={handleSubmit} className="settings-form">
            {/* Display Preferences */}
            <div className="settings-section">
              <h2 className="section-title">
                <span className="section-icon">🎨</span>
                Display Preferences
              </h2>
              
              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
                <small className="form-help">
                  Choose your preferred currency for displaying prices and values
                </small>
              </div>

              <div className="form-group">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="darkMode"
                      checked={formData.darkMode}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">
                      <strong>Dark Mode</strong>
                      <small>Use dark theme for better viewing in low light</small>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Interface Preferences */}
            <div className="settings-section">
              <h2 className="section-title">
                <span className="section-icon">⚙️</span>
                Interface Preferences
              </h2>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="proMode"
                      checked={formData.proMode}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">
                      <strong>Pro Mode</strong>
                      <small>Enable advanced features and detailed analytics</small>
                    </span>
                  </label>
                </div>
              </div>

              <div className="mode-comparison">
                <div className="mode-card">
                  <h3>Normal Mode</h3>
                  <ul>
                    <li>Simple portfolio overview</li>
                    <li>Card-based holdings view</li>
                    <li>Essential metrics only</li>
                    <li>Clean, minimal interface</li>
                  </ul>
                </div>
                <div className="mode-card pro">
                  <h3>Pro Mode</h3>
                  <ul>
                    <li>Detailed analytics</li>
                    <li>Advanced table view</li>
                    <li>Comprehensive metrics</li>
                    <li>Professional interface</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Application Info */}
            <div className="settings-section">
              <h2 className="section-title">
                <span className="section-icon">ℹ️</span>
                Application Information
              </h2>
              
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Version:</span>
                  <span className="info-value">1.0.0</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Data Source:</span>
                  <span className="info-value">Alpha Vantage API</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Update Frequency:</span>
                  <span className="info-value">Real-time</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Storage:</span>
                  <span className="info-value">Local Database</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="settings-actions">
              <button
                type="button"
                className="reset-button"
                onClick={handleReset}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset to Defaults'}
              </button>
              
              <button
                type="submit"
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>

          {/* Tips Section */}
          <div className="tips-section">
            <h2>Tips & Information</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">💡</div>
                <div className="tip-content">
                  <h3>Currency Display</h3>
                  <p>Changing currency only affects the display format. All calculations remain accurate regardless of the selected currency.</p>
                </div>
              </div>
              
              <div className="tip-card">
                <div className="tip-icon">🌙</div>
                <div className="tip-content">
                  <h3>Dark Mode</h3>
                  <p>Dark mode reduces eye strain and saves battery on OLED displays. Perfect for late-night portfolio monitoring.</p>
                </div>
              </div>
              
              <div className="tip-card">
                <div className="tip-content">
                  <h3>Pro Mode Benefits</h3>
                  <p>Pro mode unlocks detailed analytics, advanced charts, and comprehensive data views for serious investors.</p>
                </div>
              </div>
              
              <div className="tip-card">
                <div className="tip-icon">🔄</div>
                <div className="tip-content">
                  <h3>Auto-Save</h3>
                  <p>Settings are automatically applied when saved. No need to refresh the page or restart the application.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;