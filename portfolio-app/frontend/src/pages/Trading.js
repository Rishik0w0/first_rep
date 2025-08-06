import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
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
} from 'chart.js';
import './Trading.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Trading = () => {
  const { user, settings } = useContext(AppContext);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [orderType, setOrderType] = useState('market');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(189.45);
  const [orderSide, setOrderSide] = useState('buy');
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState('1D');
  const [orderHistory, setOrderHistory] = useState([]);

  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: 2.34, changePercent: 1.25 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 234.56, change: -5.67, changePercent: -2.36 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.90, change: 4.56, changePercent: 1.22 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.67, change: 1.23, changePercent: 0.87 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.24, change: -2.15, changePercent: -1.46 }
  ];

  const timeframes = [
    { value: '1D', label: '1 Day' },
    { value: '1W', label: '1 Week' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '1Y', label: '1 Year' }
  ];

  useEffect(() => {
    generateChartData();
  }, [selectedStock, timeframe]);

  const generateChartData = () => {
    const labels = [];
    const data = [];
    const currentPrice = stocks.find(s => s.symbol === selectedStock)?.price || 100;
    
    // Generate mock data based on timeframe
    let points = 24;
    if (timeframe === '1W') points = 7;
    else if (timeframe === '1M') points = 30;
    else if (timeframe === '3M') points = 90;
    else if (timeframe === '1Y') points = 365;

    for (let i = 0; i < points; i++) {
      labels.push(i.toString());
      const randomChange = (Math.random() - 0.5) * 10;
      data.push(currentPrice + randomChange);
    }

    setChartData({
      labels,
      datasets: [
        {
          label: selectedStock,
          data,
          borderColor: orderSide === 'buy' ? '#27ae60' : '#e74c3c',
          backgroundColor: orderSide === 'buy' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const order = {
      id: Date.now(),
      symbol: selectedStock,
      side: orderSide,
      type: orderType,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      total: parseFloat(quantity) * parseFloat(price),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    setOrderHistory(prev => [order, ...prev]);
    
    // Simulate order processing
    setTimeout(() => {
      setOrderHistory(prev => 
        prev.map(o => 
          o.id === order.id ? { ...o, status: 'filled' } : o
        )
      );
    }, 2000);
  };

  const getCurrentStock = () => {
    return stocks.find(s => s.symbol === selectedStock);
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
        display: false,
      },
      y: {
        display: true,
        position: 'right',
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="trading-page">
      <div className="trading-header">
        <h1 className="page-title">Trading Dashboard</h1>
        <div className="trading-stats">
          <div className="stat-item">
            <span className="stat-label">Available Balance</span>
            <span className="stat-value">${user.balance?.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Today's P&L</span>
            <span className="stat-value positive">+$1,234.56</span>
          </div>
        </div>
      </div>

      <div className="trading-layout">
        <div className="trading-main">
          <div className="chart-section">
            <div className="chart-header">
              <div className="stock-selector">
                <select 
                  value={selectedStock} 
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="stock-select"
                >
                  {stocks.map(stock => (
                    <option key={stock.symbol} value={stock.symbol}>
                      {stock.symbol} - {stock.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="stock-info">
                <div className="stock-price">
                  <span className="price-value">${getCurrentStock()?.price}</span>
                  <span className={`price-change ${getCurrentStock()?.change >= 0 ? 'positive' : 'negative'}`}>
                    {getCurrentStock()?.change >= 0 ? '+' : ''}{getCurrentStock()?.change} ({getCurrentStock()?.changePercent}%)
                  </span>
                </div>
              </div>

              <div className="timeframe-selector">
                {timeframes.map(tf => (
                  <button
                    key={tf.value}
                    className={`timeframe-btn ${timeframe === tf.value ? 'active' : ''}`}
                    onClick={() => setTimeframe(tf.value)}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="chart-container">
              {chartData && (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          </div>

          <div className="order-section">
            <h2 className="section-title">Place Order</h2>
            <form onSubmit={handleOrderSubmit} className="order-form">
              <div className="order-type-selector">
                <button
                  type="button"
                  className={`order-side-btn ${orderSide === 'buy' ? 'active buy' : ''}`}
                  onClick={() => setOrderSide('buy')}
                >
                  Buy
                </button>
                <button
                  type="button"
                  className={`order-side-btn ${orderSide === 'sell' ? 'active sell' : ''}`}
                  onClick={() => setOrderSide('sell')}
                >
                  Sell
                </button>
              </div>

              <div className="form-group">
                <label>Order Type</label>
                <select 
                  value={orderType} 
                  onChange={(e) => setOrderType(e.target.value)}
                  className="form-select"
                >
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                  <option value="stop">Stop</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="form-input"
                />
              </div>

              {orderType !== 'market' && (
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    className="form-input"
                  />
                </div>
              )}

              <div className="order-summary">
                <div className="summary-item">
                  <span>Total Value:</span>
                  <span>${(quantity * price).toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Commission:</span>
                  <span>$4.95</span>
                </div>
                <div className="summary-item total">
                  <span>Total Cost:</span>
                  <span>${(quantity * price + 4.95).toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className={`btn btn-lg ${orderSide === 'buy' ? 'btn-success' : 'btn-danger'}`}
              >
                {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedStock}
              </button>
            </form>
          </div>
        </div>

        <div className="trading-sidebar">
          <div className="market-watch">
            <h3 className="sidebar-title">Market Watch</h3>
            <div className="watchlist">
              {stocks.map(stock => (
                <div 
                  key={stock.symbol} 
                  className={`watchlist-item ${selectedStock === stock.symbol ? 'active' : ''}`}
                  onClick={() => setSelectedStock(stock.symbol)}
                >
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-price">${stock.price}</div>
                  <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-history">
            <h3 className="sidebar-title">Order History</h3>
            <div className="history-list">
              {orderHistory.slice(0, 10).map(order => (
                <div key={order.id} className={`history-item ${order.status}`}>
                  <div className="history-header">
                    <span className={`order-side ${order.side}`}>
                      {order.side.toUpperCase()}
                    </span>
                    <span className="order-status">{order.status}</span>
                  </div>
                  <div className="history-details">
                    <span className="order-symbol">{order.symbol}</span>
                    <span className="order-quantity">{order.quantity} shares</span>
                    <span className="order-price">${order.price}</span>
                  </div>
                  <div className="history-time">
                    {new Date(order.timestamp).toLocaleTimeString()}
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

export default Trading;