# 📊 Portfolio Management Application

A comprehensive, single-user portfolio management web application built with React, Node.js, Express, and MySQL. Track your stock investments with real-time data, beautiful charts, and professional analytics.

## ✨ Features

### 🏠 Dashboard
- **Stock Search**: Search for any stock using Alpha Vantage API
- **Real-time Prices**: Get current stock prices and market data
- **Quick Buy**: Add stocks to your portfolio directly from search results
- **Portfolio Overview**: See total value, gain/loss, and holdings count

### 📈 Portfolio Management
- **Holdings Table**: View all your stocks with current values and performance
- **Interactive Charts**: Beautiful line charts showing portfolio value over time (Pro mode)
- **Gain/Loss Tracking**: Automatic calculation of profits and losses
- **Edit/Delete**: Modify or remove holdings with easy-to-use interface

### 📝 Manual Asset Entry
- **Historical Entries**: Add stocks you bought in the past
- **Flexible Dates**: Support for any purchase date
- **Bulk Import**: Easy form for adding multiple assets
- **Validation**: Smart form validation and error handling

### ⚙️ Settings & Customization
- **Light/Dark Theme**: Toggle between beautiful light and dark modes
- **Normal/Pro Mode**: Switch between simple and advanced views
- **Multi-Currency**: Support for USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY
- **Persistent Settings**: All preferences saved locally

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Chart.js** - Beautiful, responsive charts
- **React Icons** - Comprehensive icon library
- **React Toastify** - Elegant notifications
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **Alpha Vantage API** - Real-time stock data
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

### Database
- **MySQL** - Robust relational database
- **Structured Schema** - Optimized for portfolio data
- **Indexing** - Fast queries and lookups

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Alpha Vantage API key (free at [alphavantage.co](https://www.alphavantage.co/support/#api-key))

### 1. Clone Repository
```bash
git clone <repository-url>
cd portfolio-app
```

### 2. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Run the schema
source database/schema.sql
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings:
# - Database credentials
# - Alpha Vantage API key
# - Server configuration

# Start the server
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
portfolio-app/
├── backend/                 # Node.js/Express API server
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── package.json       # Backend dependencies
│   └── server.js          # Main server file
├── frontend/              # React application
│   ├── public/           # Static files
│   ├── src/              # Source code
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── styles/       # Styled components
│   │   ├── context/      # React context
│   │   └── utils/        # Utility functions
│   └── package.json      # Frontend dependencies
├── database/             # Database schema
│   └── schema.sql       # MySQL database structure
└── README.md            # This file
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio_db
DB_PORT=3306

# Server
PORT=5000
NODE_ENV=development

# Alpha Vantage API
ALPHA_VANTAGE_API_KEY=your_api_key

# CORS
FRONTEND_URL=http://localhost:3000
```

### API Rate Limits
- **Alpha Vantage Free Tier**: 5 requests per minute, 500 per day
- The application includes automatic rate limiting and error handling
- Consider upgrading to premium for higher limits in production

## 📊 API Endpoints

### Portfolio Management
- `POST /api/portfolio` - Add stock to portfolio
- `GET /api/portfolio` - Get all holdings with current prices
- `PUT /api/portfolio/:id` - Update stock quantity/price
- `DELETE /api/portfolio/:id` - Remove stock from portfolio

### Stock Data
- `GET /api/search?q=SYMBOL` - Search stock information
- `GET /api/portfolio/history/:symbol` - Get historical price data

### Health Check
- `GET /api/health` - Server health status

## 🎨 Design Features

### Modern UI/UX
- **Clean Interface**: Minimalist design focused on usability
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Professional Charts**: Interactive, animated charts with Chart.js
- **Smooth Animations**: Subtle transitions and hover effects
- **Accessibility**: Proper contrast ratios and keyboard navigation

### Color Schemes
- **Light Theme**: Clean white background with blue accents
- **Dark Theme**: Modern dark interface with proper contrast
- **Semantic Colors**: Green for gains, red for losses, blue for neutral

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with multi-column layouts
- **Tablet**: Optimized layouts with touch-friendly interfaces
- **Mobile**: Single-column design with collapsible navigation

## 🔒 Security Features

- **Input Validation**: All user inputs are validated on both client and server
- **SQL Injection Protection**: Parameterized queries prevent SQL injection
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Error Handling**: Graceful error handling without exposing sensitive data
- **Rate Limiting**: Built-in protection against API abuse

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Use process manager like PM2 for Node.js
3. Configure reverse proxy with Nginx
4. Set up SSL certificates
5. Configure database connection pooling

### Frontend Deployment
1. Build the React app: `npm run build`
2. Serve static files with Nginx or CDN
3. Configure API endpoint URLs for production
4. Enable gzip compression

### Database Optimization
- Add appropriate indexes for frequently queried columns
- Set up regular backups
- Configure connection pooling
- Monitor query performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Alpha Vantage** for providing free stock market data
- **Chart.js** for beautiful charting capabilities
- **React Community** for excellent documentation and ecosystem
- **Node.js Community** for robust backend tools

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Happy Investing! 📈💰**