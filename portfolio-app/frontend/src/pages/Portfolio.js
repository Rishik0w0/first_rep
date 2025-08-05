import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  getPortfolio, 
  getPortfolioHistory, 
  deleteStock,
  formatCurrency, 
  formatPercent, 
  formatDate 
} from '../services/api';
import './Portfolio.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Portfolio = ({ settings }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState(null);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');

  const periods = [
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: '2Y', label: '2 Years' }
  ];

  useEffect(() => {
    loadPortfolioData();
  }, []);

  useEffect(() => {
    loadPortfolioHistory();
  }, [selectedPeriod]);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const response = await getPortfolio();
      if (response.success) {
        setPortfolio(response.data.holdings);
        setSummary(response.data.summary);
      }
    } catch (error) {
      setError(error.message || 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolioHistory = async () => {
    try {
      const response = await getPortfolioHistory(selectedPeriod);
      if (response.success) {
        setPortfolioHistory(response.data);
      }
    } catch (error) {
      console.error('Error loading portfolio history:', error);
    }
  };

  const handleDeleteStock = async (id, symbol) => {
    if (window.confirm(`Are you sure you want to remove ${symbol} from your portfolio?`)) {
      try {
        await deleteStock(id);
        loadPortfolioData(); // Refresh data
      } catch (error) {
        setError(error.message || 'Failed to delete stock');
      }
    }
  };

  // Chart configuration
  const chartData = {
    labels: portfolioHistory.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Portfolio Value',
        data: portfolioHistory.map(item => item.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Portfolio Performance (${selectedPeriod})`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Value: ${formatCurrency(context.parsed.y, settings.currency)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 8
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value, settings.currency);
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="portfolio">
      <div className="portfolio-container">
        <h1 className="page-title">Portfolio</h1>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        {/* Portfolio Summary */}
        {summary && (
          <div className="portfolio-summary">
            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-label">Total Value</div>
                <div className="card-value">
                  {formatCurrency(summary.totalValue, settings.currency)}
                </div>
              </div>
              <div className="summary-card">
                <div className="card-label">Total Cost</div>
                <div className="card-value">
                  {formatCurrency(summary.totalCost, settings.currency)}
                </div>
              </div>
              <div className="summary-card">
                <div className="card-label">Gain/Loss</div>
                <div className={`card-value ${summary.totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(summary.totalGainLoss, settings.currency)}
                  <span className="percentage">
                    ({formatPercent(summary.totalGainLossPercent)})
                  </span>
                </div>
              </div>
              <div className="summary-card">
                <div className="card-label">Holdings</div>
                <div className="card-value">{summary.holdingsCount}</div>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Chart */}
        {portfolioHistory.length > 0 && (
          <div className="chart-section">
            <div className="chart-header">
              <h2>Portfolio Performance</h2>
              <div className="period-selector">
                {periods.map(period => (
                  <button
                    key={period.value}
                    className={`period-button ${selectedPeriod === period.value ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod(period.value)}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Holdings Table */}
        <div className="holdings-section">
          <h2>Current Holdings</h2>
          
          {portfolio.length === 0 ? (
            <div className="empty-portfolio">
              <div className="empty-icon">📊</div>
              <h3>No Holdings Yet</h3>
              <p>Start building your portfolio by adding stocks from the Dashboard or Assets page.</p>
            </div>
          ) : (
            <div className="holdings-table-container">
              {settings.proMode ? (
                // Pro Mode - Detailed Table
                <table className="holdings-table pro">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Quantity</th>
                      <th>Buy Price</th>
                      <th>Current Price</th>
                      <th>Total Cost</th>
                      <th>Current Value</th>
                      <th>Gain/Loss</th>
                      <th>%</th>
                      <th>Purchase Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((holding) => (
                      <tr key={holding.id}>
                        <td className="symbol-cell">
                          <strong>{holding.symbol}</strong>
                        </td>
                        <td>{holding.quantity}</td>
                        <td>{formatCurrency(holding.buy_price, settings.currency)}</td>
                        <td>{formatCurrency(holding.currentPrice, settings.currency)}</td>
                        <td>{formatCurrency(holding.totalCost, settings.currency)}</td>
                        <td>{formatCurrency(holding.totalValue, settings.currency)}</td>
                        <td className={holding.gainLoss >= 0 ? 'positive' : 'negative'}>
                          {formatCurrency(holding.gainLoss, settings.currency)}
                        </td>
                        <td className={holding.gainLossPercent >= 0 ? 'positive' : 'negative'}>
                          {formatPercent(holding.gainLossPercent)}
                        </td>
                        <td>{formatDate(holding.purchase_date)}</td>
                        <td>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteStock(holding.id, holding.symbol)}
                            title="Remove from portfolio"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // Normal Mode - Simplified Cards
                <div className="holdings-cards">
                  {portfolio.map((holding) => (
                    <div key={holding.id} className="holding-card">
                      <div className="card-header">
                        <h3 className="symbol">{holding.symbol}</h3>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteStock(holding.id, holding.symbol)}
                          title="Remove from portfolio"
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <div className="card-content">
                        <div className="card-row">
                          <span className="label">Quantity:</span>
                          <span className="value">{holding.quantity} shares</span>
                        </div>
                        <div className="card-row">
                          <span className="label">Current Value:</span>
                          <span className="value">
                            {formatCurrency(holding.totalValue, settings.currency)}
                          </span>
                        </div>
                        <div className="card-row">
                          <span className="label">Gain/Loss:</span>
                          <span className={`value ${holding.gainLoss >= 0 ? 'positive' : 'negative'}`}>
                            {formatCurrency(holding.gainLoss, settings.currency)}
                            ({formatPercent(holding.gainLossPercent)})
                          </span>
                        </div>
                        <div className="card-row">
                          <span className="label">Purchase Date:</span>
                          <span className="value">{formatDate(holding.purchase_date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;