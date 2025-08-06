import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Portfolio.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Portfolio = () => {
  const { user, settings } = useContext(AppContext);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [selectedView, setSelectedView] = useState('holdings');

  const portfolioData = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, avgPrice: 175.50, currentPrice: 189.45, value: 9472.50, pnl: 694.50, pnlPercent: 7.9, sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', shares: 25, avgPrice: 245.30, currentPrice: 234.56, value: 5864.00, pnl: -268.50, pnlPercent: -4.4, sector: 'Automotive' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 30, avgPrice: 365.20, currentPrice: 378.90, value: 11367.00, pnl: 411.00, pnlPercent: 3.8, sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 15, avgPrice: 138.90, currentPrice: 142.67, value: 2140.05, pnl: 56.55, pnlPercent: 2.7, sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 20, avgPrice: 148.75, currentPrice: 145.24, value: 2904.80, pnl: -70.20, pnlPercent: -2.4, sector: 'Consumer Discretionary' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', shares: 10, avgPrice: 165.80, currentPrice: 167.89, value: 1678.90, pnl: 20.90, pnlPercent: 1.3, sector: 'Financial' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', shares: 12, avgPrice: 155.20, currentPrice: 156.78, value: 1881.36, pnl: 18.96, pnlPercent: 1.2, sector: 'Healthcare' }
  ];

  const totalValue = portfolioData.reduce((sum, stock) => sum + stock.value, 0);
  const totalPnL = portfolioData.reduce((sum, stock) => sum + stock.pnl, 0);
  const totalPnLPercent = (totalPnL / (totalValue - totalPnL)) * 100;

  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [100000, 105000, 112000, 108000, 115000, 118000, 122000, 125000, 128000, 132000, 135000, 125000],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const sectorData = {
    labels: ['Technology', 'Consumer', 'Healthcare', 'Financial', 'Automotive'],
    datasets: [
      {
        label: 'Allocation (%)',
        data: [45, 15, 10, 8, 22],
        backgroundColor: [
          '#3498db',
          '#e74c3c',
          '#2ecc71',
          '#f39c12',
          '#9b59b6'
        ],
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const timeframes = [
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: 'ALL', label: 'All Time' }
  ];

  const views = [
    { value: 'holdings', label: 'Holdings', icon: '💼' },
    { value: 'performance', label: 'Performance', icon: '📈' },
    { value: 'allocation', label: 'Allocation', icon: '🥧' },
    { value: 'transactions', label: 'Transactions', icon: '📋' }
  ];

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <h1 className="page-title">Portfolio</h1>
        <div className="portfolio-actions">
          <button className="btn btn-outline">Export</button>
          <button className="btn btn-primary">Add Position</button>
        </div>
      </div>

      <div className="portfolio-overview">
        <div className="overview-card">
          <div className="overview-icon">💰</div>
          <div className="overview-content">
            <h3 className="overview-label">Total Value</h3>
            <p className="overview-value">${totalValue.toLocaleString()}</p>
            <span className={`overview-change ${totalPnL >= 0 ? 'positive' : 'negative'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} ({totalPnLPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">📊</div>
          <div className="overview-content">
            <h3 className="overview-label">Total Cost</h3>
            <p className="overview-value">${(totalValue - totalPnL).toLocaleString()}</p>
            <span className="overview-change">Basis</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">📈</div>
          <div className="overview-content">
            <h3 className="overview-label">Total P&L</h3>
            <p className="overview-value">${totalPnL.toLocaleString()}</p>
            <span className={`overview-change ${totalPnL >= 0 ? 'positive' : 'negative'}`}>
              {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">💼</div>
          <div className="overview-content">
            <h3 className="overview-label">Positions</h3>
            <p className="overview-value">{portfolioData.length}</p>
            <span className="overview-change">Active</span>
          </div>
        </div>
      </div>

      <div className="portfolio-content">
        <div className="portfolio-main">
          <div className="view-selector">
            {views.map(view => (
              <button
                key={view.value}
                className={`view-btn ${selectedView === view.value ? 'active' : ''}`}
                onClick={() => setSelectedView(view.value)}
              >
                <span className="view-icon">{view.icon}</span>
                <span className="view-label">{view.label}</span>
              </button>
            ))}
          </div>

          {selectedView === 'holdings' && (
            <div className="holdings-section">
              <div className="section-header">
                <h2 className="section-title">Portfolio Holdings</h2>
                <div className="timeframe-selector">
                  {timeframes.map(tf => (
                    <button
                      key={tf.value}
                      className={`timeframe-btn ${selectedTimeframe === tf.value ? 'active' : ''}`}
                      onClick={() => setSelectedTimeframe(tf.value)}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="holdings-table">
                <div className="table-header">
                  <div className="table-cell">Stock</div>
                  <div className="table-cell">Shares</div>
                  <div className="table-cell">Avg Price</div>
                  <div className="table-cell">Current</div>
                  <div className="table-cell">Value</div>
                  <div className="table-cell">P&L</div>
                  <div className="table-cell">Actions</div>
                </div>
                <div className="table-body">
                  {portfolioData.map(stock => (
                    <div key={stock.symbol} className="table-row">
                      <div className="table-cell stock-cell">
                        <div className="stock-info">
                          <strong>{stock.symbol}</strong>
                          <span className="stock-name">{stock.name}</span>
                          <span className="stock-sector">{stock.sector}</span>
                        </div>
                      </div>
                      <div className="table-cell">{stock.shares}</div>
                      <div className="table-cell">${stock.avgPrice}</div>
                      <div className="table-cell">${stock.currentPrice}</div>
                      <div className="table-cell">${stock.value.toLocaleString()}</div>
                      <div className={`table-cell ${stock.pnl >= 0 ? 'positive' : 'negative'}`}>
                        <div className="pnl-info">
                          <span className="pnl-amount">
                            {stock.pnl >= 0 ? '+' : ''}${stock.pnl.toFixed(2)}
                          </span>
                          <span className="pnl-percent">
                            ({stock.pnlPercent >= 0 ? '+' : ''}{stock.pnlPercent.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="table-cell actions-cell">
                        <button className="btn btn-sm btn-outline">Trade</button>
                        <button className="btn btn-sm btn-secondary">Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedView === 'performance' && (
            <div className="performance-section">
              <div className="section-header">
                <h2 className="section-title">Performance Chart</h2>
                <div className="timeframe-selector">
                  {timeframes.map(tf => (
                    <button
                      key={tf.value}
                      className={`timeframe-btn ${selectedTimeframe === tf.value ? 'active' : ''}`}
                      onClick={() => setSelectedTimeframe(tf.value)}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="chart-container">
                <Line data={performanceData} options={chartOptions} />
              </div>
            </div>
          )}

          {selectedView === 'allocation' && (
            <div className="allocation-section">
              <div className="section-header">
                <h2 className="section-title">Sector Allocation</h2>
              </div>
              <div className="chart-container">
                <Bar data={sectorData} options={barOptions} />
              </div>
            </div>
          )}

          {selectedView === 'transactions' && (
            <div className="transactions-section">
              <div className="section-header">
                <h2 className="section-title">Recent Transactions</h2>
                <button className="btn btn-sm btn-outline">View All</button>
              </div>
              <div className="transactions-list">
                <div className="transaction-item">
                  <div className="transaction-info">
                    <span className="transaction-type buy">BUY</span>
                    <span className="transaction-symbol">AAPL</span>
                    <span className="transaction-details">50 shares @ $175.50</span>
                  </div>
                  <div className="transaction-date">Jan 15, 2024</div>
                  <div className="transaction-amount">$8,775.00</div>
                </div>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <span className="transaction-type sell">SELL</span>
                    <span className="transaction-symbol">TSLA</span>
                    <span className="transaction-details">10 shares @ $240.00</span>
                  </div>
                  <div className="transaction-date">Jan 10, 2024</div>
                  <div className="transaction-amount">$2,400.00</div>
                </div>
                <div className="transaction-item">
                  <div className="transaction-info">
                    <span className="transaction-type buy">BUY</span>
                    <span className="transaction-symbol">MSFT</span>
                    <span className="transaction-details">30 shares @ $365.20</span>
                  </div>
                  <div className="transaction-date">Jan 5, 2024</div>
                  <div className="transaction-amount">$10,956.00</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="portfolio-sidebar">
          <div className="sector-breakdown">
            <h3 className="sidebar-title">Sector Breakdown</h3>
            <div className="sector-list">
              {[
                { sector: 'Technology', value: 22979.55, percentage: 45.0 },
                { sector: 'Automotive', value: 5864.00, percentage: 22.0 },
                { sector: 'Consumer Discretionary', value: 2904.80, percentage: 15.0 },
                { sector: 'Healthcare', value: 1881.36, percentage: 10.0 },
                { sector: 'Financial', value: 1678.90, percentage: 8.0 }
              ].map(sector => (
                <div key={sector.sector} className="sector-item">
                  <div className="sector-info">
                    <span className="sector-name">{sector.sector}</span>
                    <span className="sector-value">${sector.value.toLocaleString()}</span>
                  </div>
                  <div className="sector-bar">
                    <div 
                      className="sector-fill" 
                      style={{ width: `${sector.percentage}%` }}
                    ></div>
                  </div>
                  <span className="sector-percentage">{sector.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="top-performers">
            <h3 className="sidebar-title">Top Performers</h3>
            <div className="performers-list">
              {portfolioData
                .filter(stock => stock.pnl > 0)
                .sort((a, b) => b.pnlPercent - a.pnlPercent)
                .slice(0, 3)
                .map(stock => (
                  <div key={stock.symbol} className="performer-item">
                    <div className="performer-info">
                      <span className="performer-symbol">{stock.symbol}</span>
                      <span className="performer-name">{stock.name}</span>
                    </div>
                    <div className="performer-pnl">
                      <span className="pnl-amount positive">+${stock.pnl.toFixed(2)}</span>
                      <span className="pnl-percent positive">+{stock.pnlPercent.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;