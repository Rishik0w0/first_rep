import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../App';
import './Sidebar.css';

const Sidebar = () => {
  const { user, settings, sidebarOpen, toggleSidebar } = useContext(AppContext);

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard', badge: null },
    { path: '/trading', icon: '📈', label: 'Trading', badge: 'Live' },
    { path: '/portfolio', icon: '💼', label: 'Portfolio', badge: null },
    { path: '/watchlist', icon: '👁️', label: 'Watchlist', badge: user.watchlist?.length || 0 },
    { path: '/news', icon: '📰', label: 'News', badge: 'New' },
    { path: '/settings', icon: '⚙️', label: 'Settings', badge: null }
  ];

  return (
    <>
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">📈</span>
            <h2 className="logo-text">TradePro</h2>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
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
            <h3 className="user-name">{user.name}</h3>
            <p className="user-email">{user.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => window.innerWidth < 768 && toggleSidebar()}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && (
                    <span className={`nav-badge ${typeof item.badge === 'number' ? 'count' : 'status'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="account-balance">
            <span className="balance-label">Account Balance</span>
            <span className="balance-amount">
              ${user.balance?.toLocaleString() || '0'}
            </span>
          </div>
          
          <div className="quick-actions">
            <button className="action-btn deposit">
              <span>💰</span>
              <span>Deposit</span>
            </button>
            <button className="action-btn withdraw">
              <span>💸</span>
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        <div className="sidebar-theme-toggle">
          <button 
            className={`theme-toggle ${settings.darkMode ? 'dark' : 'light'}`}
            onClick={() => settings.updateSettings?.({ darkMode: !settings.darkMode })}
          >
            <span className="theme-icon">
              {settings.darkMode ? '🌙' : '☀️'}
            </span>
            <span className="theme-label">
              {settings.darkMode ? 'Dark' : 'Light'} Mode
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;