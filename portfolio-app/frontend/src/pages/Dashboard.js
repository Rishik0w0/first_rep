import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user, marketData, settings } = useContext(AppContext);
  const [portfolioValue, setPortfolioValue] = useState(125000);
  const [dailyPnL, setDailyPnL] = useState(2345.67);
  const [totalPnL, setTotalPnL] = useState(15678.90);

  const portfolioData = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, avgPrice: 175.50, currentPrice: 189.45, value: 9472.50, pnl: 694.50 },
    { symbol: 'TSLA', name: 'Tesla Inc.', shares: 25, avgPrice: 245.30, currentPrice: 234.56, value: 5864.00, pnl: -268.50 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 30, avgPrice: 365.20, currentPrice: 378.90, value: 11367.00, pnl: 411.00 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 15, avgPrice: 138.90, currentPrice: 142.67, value: 2140.05, pnl: 56.55 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 20, avgPrice: 148.75, currentPrice: 145.24, value: 2904.80, pnl: -70.20 }
  ];

  const chartData = {
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

  const allocationData = {
    labels: ['Technology', 'Consumer', 'Healthcare', 'Financial', 'Energy'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          '#3498db',
          '#e74c3c',
          '#2ecc71',
          '#f39c12',
          '#9b59b6'
        ],
        borderWidth: 2,
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

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="dashboard-actions">
          <button className="btn btn-outline">Export Report</button>
          <button className="btn btn-primary">Refresh Data</button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3 className="stat-label">Portfolio Value</h3>
            <p className="stat-value">${portfolioValue.toLocaleString()}</p>
            <span className={`stat-change ${dailyPnL >= 0 ? 'positive' : 'negative'}`}>
              {dailyPnL >= 0 ? '+' : ''}${dailyPnL.toFixed(2)} today
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3 className="stat-label">Total P&L</h3>
            <p className="stat-value">${totalPnL.toLocaleString()}</p>
            <span className={`stat-change ${totalPnL >= 0 ? 'positive' : 'negative'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} all time
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <h3 className="stat-label">Available Cash</h3>
            <p className="stat-value">${user.balance?.toLocaleString()}</p>
            <span className="stat-change">Ready to invest</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-label">Market Status</h3>
            <p className="stat-value">Open</p>
            <span className="stat-change positive">Live trading</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main">
          <div className="chart-section">
            <div className="section-header">
              <h2 className="section-title">Portfolio Performance</h2>
              <div className="chart-controls">
                <button className="chart-btn active">1Y</button>
                <button className="chart-btn">6M</button>
                <button className="chart-btn">3M</button>
                <button className="chart-btn">1M</button>
              </div>
            </div>
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="portfolio-section">
            <div className="section-header">
              <h2 className="section-title">Portfolio Holdings</h2>
              <button className="btn btn-sm btn-outline">View All</button>
            </div>
            <div className="portfolio-table">
              <div className="table-header">
                <div className="table-cell">Stock</div>
                <div className="table-cell">Shares</div>
                <div className="table-cell">Avg Price</div>
                <div className="table-cell">Current</div>
                <div className="table-cell">Value</div>
                <div className="table-cell">P&L</div>
              </div>
              <div className="table-body">
                {portfolioData.map(stock => (
                  <div key={stock.symbol} className="table-row">
                    <div className="table-cell stock-cell">
                      <div className="stock-info">
                        <strong>{stock.symbol}</strong>
                        <span className="stock-name">{stock.name}</span>
                      </div>
                    </div>
                    <div className="table-cell">{stock.shares}</div>
                    <div className="table-cell">${stock.avgPrice}</div>
                    <div className="table-cell">${stock.currentPrice}</div>
                    <div className="table-cell">${stock.value.toLocaleString()}</div>
                    <div className={`table-cell ${stock.pnl >= 0 ? 'positive' : 'negative'}`}>
                      {stock.pnl >= 0 ? '+' : ''}${stock.pnl.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="allocation-section">
            <h3 className="sidebar-title">Asset Allocation</h3>
            <div className="chart-container">
              <Doughnut data={allocationData} options={doughnutOptions} />
            </div>
          </div>

          <div className="market-section">
            <h3 className="sidebar-title">Market Indices</h3>
            <div className="market-list">
              {marketData.indices.map(index => (
                <div key={index.symbol} className="market-item">
                  <div className="market-info">
                    <span className="market-symbol">{index.symbol}</span>
                    <span className="market-name">{index.name}</span>
                  </div>
                  <div className="market-price">
                    <span className="price-value">{index.price.toLocaleString()}</span>
                    <span className={`price-change ${index.change >= 0 ? 'positive' : 'negative'}`}>
                      {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="trending-section">
            <h3 className="sidebar-title">Trending Stocks</h3>
            <div className="trending-list">
              {marketData.trending.map(stock => (
                <div key={stock.symbol} className="trending-item">
                  <div className="trending-info">
                    <span className="trending-symbol">{stock.symbol}</span>
                    <span className="trending-name">{stock.name}</span>
                  </div>
                  <div className="trending-price">
                    <span className="price-value">${stock.price}</span>
                    <span className={`price-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent}%)
                    </span>
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

export default Dashboard;