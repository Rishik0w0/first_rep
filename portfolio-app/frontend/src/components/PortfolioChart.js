import React, { useEffect, useRef } from 'react';
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
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';

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

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 300px;
  }
`;

const PortfolioChart = ({ data, type = 'portfolio' }) => {
  const { state } = useApp();
  const chartRef = useRef();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.settings.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const getChartOptions = () => {
    const isDark = state.settings.theme === 'dark';
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: isDark ? '#cbd5e1' : '#64748b',
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              weight: '500'
            }
          }
        },
        title: {
          display: true,
          text: type === 'portfolio' ? 'Portfolio Value Over Time' : 'Stock Performance',
          color: isDark ? '#f1f5f9' : '#1e293b',
          font: {
            size: 16,
            weight: '600'
          },
          padding: {
            bottom: 30
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          titleColor: isDark ? '#f1f5f9' : '#1e293b',
          bodyColor: isDark ? '#cbd5e1' : '#64748b',
          borderColor: isDark ? '#334155' : '#e2e8f0',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = formatCurrency(context.parsed.y);
              return `${label}: ${value}`;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            color: isDark ? '#334155' : '#f1f5f9',
            drawBorder: false,
          },
          ticks: {
            color: isDark ? '#94a3b8' : '#64748b',
            font: {
              size: 11
            }
          }
        },
        y: {
          display: true,
          grid: {
            color: isDark ? '#334155' : '#f1f5f9',
            drawBorder: false,
          },
          ticks: {
            color: isDark ? '#94a3b8' : '#64748b',
            font: {
              size: 11
            },
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      },
      elements: {
        line: {
          tension: 0.4,
          borderWidth: 3,
        },
        point: {
          radius: 4,
          hoverRadius: 6,
          borderWidth: 2,
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
        }
      }
    };
  };

  const getChartData = () => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const isDark = state.settings.theme === 'dark';

    if (type === 'portfolio') {
      // Portfolio value chart
      const labels = data.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: data.length > 30 ? 'numeric' : undefined
        });
      });

      const values = data.map(item => item.totalValue || 0);
      const costs = data.map(item => item.totalCost || 0);

      return {
        labels,
        datasets: [
          {
            label: 'Portfolio Value',
            data: values,
            borderColor: '#10b981',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
            fill: true,
            pointBackgroundColor: '#10b981',
            pointBorderColor: isDark ? '#1e293b' : '#ffffff',
          },
          {
            label: 'Total Cost',
            data: costs,
            borderColor: '#64748b',
            backgroundColor: 'transparent',
            fill: false,
            pointBackgroundColor: '#64748b',
            pointBorderColor: isDark ? '#1e293b' : '#ffffff',
            borderDash: [5, 5],
          }
        ]
      };
    } else {
      // Individual stock chart
      const labels = data.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        });
      });

      const prices = data.map(item => item.close);

      return {
        labels,
        datasets: [
          {
            label: 'Stock Price',
            data: prices,
            borderColor: '#3b82f6',
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
            fill: true,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: isDark ? '#1e293b' : '#ffffff',
          }
        ]
      };
    }
  };

  // Generate sample portfolio data if none provided
  const getSampleData = () => {
    const today = new Date();
    const sampleData = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const baseValue = 50000;
      const variance = Math.sin(i * 0.2) * 5000 + Math.random() * 2000;
      const totalValue = baseValue + variance + (i * 100); // Slight upward trend
      const totalCost = baseValue;
      
      sampleData.push({
        date: date.toISOString().split('T')[0],
        totalValue,
        totalCost
      });
    }
    
    return sampleData;
  };

  const chartData = getChartData();
  const hasData = chartData.datasets.length > 0 && chartData.datasets[0].data.length > 0;

  // Use sample data if no real data provided
  const displayData = hasData ? chartData : getChartData(getSampleData());

  return (
    <ChartContainer>
      <Line 
        ref={chartRef}
        data={displayData} 
        options={getChartOptions()} 
      />
    </ChartContainer>
  );
};

export default PortfolioChart;