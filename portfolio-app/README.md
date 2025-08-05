# Portfolio Management Application

A comprehensive single-user portfolio management web application built with React, Node.js, Express, and MySQL. Track your stock investments, view performance analytics, and manage your portfolio with real-time data.

## 🚀 Features

### 📊 Dashboard
- **Stock Search**: Search for any stock symbol with live market data
- **Quick Purchase**: Buy stocks directly from search results
- **Portfolio Overview**: Real-time summary of your total portfolio value, cost, and gains/losses

### 💼 Assets Management
- **Manual Entry**: Add previously purchased stocks to track historical investments
- **Popular Stocks**: Quick-add buttons for common stocks (AAPL, GOOGL, MSFT, etc.)
- **Comprehensive Form**: Enter quantity, buy price, and purchase date

### 📈 Portfolio Analytics
- **Interactive Charts**: Beautiful line graphs showing portfolio performance over time
- **Multiple Time Periods**: View performance over 1M, 3M, 6M, 1Y, or 2Y periods
- **Holdings Table**: Detailed view of all your stocks with current prices and performance
- **Normal/Pro Modes**: Switch between simple card view and detailed table view

### ⚙️ Settings & Customization
- **Dark Mode**: Toggle between light and dark themes
- **Currency Selection**: Display prices in USD, EUR, GBP, JPY, CAD, or AUD
- **Pro Mode**: Enable advanced analytics and detailed views
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router** - Client-side routing
- **Chart.js + React-ChartJS-2** - Interactive charts and graphs
- **Axios** - HTTP client for API requests
- **CSS3** - Modern styling with gradients, animations, and responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL2** - MySQL database driver with Promise support
- **Axios** - HTTP client for external API calls
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database
- **MySQL** - Relational database for portfolio data
- Optimized schema with indexes for performance
- Historical data tracking for performance analytics

### External APIs
- **Alpha Vantage** - Real-time and historical stock market data
- Fallback mock data for demo purposes

## 📁 Project Structure

```
portfolio-app/
├── frontend/                 # React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Header.js    # Navigation header
│   │   │   └── Header.css
│   │   ├── pages/          # Main application pages
│   │   │   ├── Dashboard.js # Stock search and portfolio overview
│   │   │   ├── Assets.js    # Manual asset entry
│   │   │   ├── Portfolio.js # Holdings and charts
│   │   │   ├── Settings.js  # User preferences
│   │   │   └── *.css       # Page-specific styles
│   │   ├── services/       # API and utility functions
│   │   │   └── api.js      # HTTP client and formatters
│   │   ├── App.js          # Main application component
│   │   ├── App.css         # Global styles
│   │   └── index.js        # Application entry point
│   └── package.json
├── backend/                 # Node.js/Express API
│   ├── config/             # Configuration files
│   │   └── database.js     # MySQL connection setup
│   ├── controllers/        # Request handlers
│   │   ├── portfolioController.js
│   │   ├── stockController.js
│   │   └── settingsController.js
│   ├── services/           # Business logic
│   │   ├── portfolioService.js
│   │   └── stockService.js
│   ├── routes/             # API route definitions
│   │   └── index.js
│   ├── server.js           # Express server setup
│   ├── .env               # Environment variables
│   └── package.json
├── database/               # Database schema
│   └── schema.sql         # MySQL table definitions
└── README.md              # This file
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-app
   ```

2. **Set up the database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   SOURCE database/schema.sql;
   ```

3. **Configure the backend**
   ```bash
   cd backend
   npm install
   
   # Update .env file with your database credentials
   # DB_HOST=localhost
   # DB_USER=your_mysql_user
   # DB_PASSWORD=your_mysql_password
   # DB_NAME=portfolio_db
   # ALPHA_VANTAGE_API_KEY=your_api_key (optional)
   ```

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

2. **Start the frontend application**
   ```bash
   cd frontend
   npm start
   # Application runs on http://localhost:3000
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio_db
ALPHA_VANTAGE_API_KEY=your_api_key
NODE_ENV=development
```

### Alpha Vantage API Key

1. Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Add it to your `.env` file
3. The application includes fallback mock data if the API is unavailable

## 📱 Usage

### Adding Stocks

1. **Dashboard Method**: Search for a stock and click "Buy Stock"
2. **Assets Method**: Manually enter stock details for historical purchases

### Viewing Performance

1. Navigate to the **Portfolio** page
2. View your holdings in card or table format
3. Analyze performance with interactive charts
4. Switch between different time periods

### Customizing Experience

1. Go to **Settings** to customize:
   - Currency display
   - Dark/Light mode
   - Normal/Pro interface mode
2. Use the header toggle to quickly switch between Normal and Pro modes

## 🎨 Design Features

- **Modern UI**: Clean, professional design with smooth animations
- **Responsive**: Optimized for all screen sizes
- **Dark Mode**: Easy on the eyes with beautiful dark theme
- **Interactive Charts**: Smooth, professional-looking graphs
- **Gradient Backgrounds**: Modern visual appeal
- **Hover Effects**: Engaging micro-interactions

## 🔒 Security & Performance

- **Input Validation**: All user inputs are validated
- **SQL Injection Protection**: Parameterized queries
- **Error Handling**: Comprehensive error management
- **Database Indexing**: Optimized queries for performance
- **Connection Pooling**: Efficient database connections

## 🚀 API Endpoints

### Portfolio Management
- `GET /api/portfolio` - Get all portfolio holdings
- `POST /api/portfolio` - Add a new stock
- `PUT /api/portfolio/:id` - Update a stock entry
- `DELETE /api/portfolio/:id` - Remove a stock
- `GET /api/portfolio/history/:period` - Get portfolio performance history

### Stock Data
- `GET /api/search?q=SYMBOL` - Search for stock information
- `GET /api/stocks/:symbol/price` - Get current stock price
- `GET /api/stocks/:symbol/history/:period` - Get historical stock data

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings
- `POST /api/settings/reset` - Reset to default settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Alpha Vantage](https://www.alphavantage.co/) for stock market data
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [React](https://reactjs.org/) for the amazing frontend framework

## 📞 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Happy Portfolio Management! 📈💰**