# 🚀 Quick Setup Guide

## ✅ **Current Status**
Your Portfolio Management Application is **ready to run**! Both servers are currently running:

- **Frontend**: http://localhost:3000 ✅
- **Backend**: http://localhost:5000 ✅

## 🎯 **What You Can Do Right Now**

### 1. **Access the Application**
Open your browser and go to: **http://localhost:3000**

The application will work with **mock data** for demo purposes, so you can:
- ✅ Browse all pages (Dashboard, Assets, Portfolio, Settings)
- ✅ Search for stocks (will show demo data)
- ✅ Try the dark mode toggle
- ✅ Switch between Normal/Pro modes
- ✅ View the beautiful charts and UI

### 2. **Easy Startup Script**
For future use, you can start both servers with:
```bash
./start.sh
```

## 🗄️ **Database Setup (Optional)**

To enable full functionality with real data persistence, set up MySQL:

### Option 1: Using Docker (Recommended)
```bash
# Pull and run MySQL container
docker run --name portfolio-mysql \
  -e MYSQL_ROOT_PASSWORD=portfolio123 \
  -e MYSQL_DATABASE=portfolio_db \
  -p 3306:3306 \
  -d mysql:8.0

# Wait for MySQL to start (30 seconds)
sleep 30

# Import the database schema
mysql -h 127.0.0.1 -u root -pportfolio123 portfolio_db < database/schema.sql
```

### Option 2: Local MySQL Installation
```bash
# Install MySQL (Ubuntu/Debian)
sudo apt update
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation

# Create database
mysql -u root -p < database/schema.sql
```

### Update Backend Configuration
Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db
ALPHA_VANTAGE_API_KEY=your_api_key  # Optional
```

## 🔑 **Alpha Vantage API Key (Optional)**

For real stock data:
1. Get free API key: https://www.alphavantage.co/support/#api-key
2. Add to `backend/.env`: `ALPHA_VANTAGE_API_KEY=your_key_here`

**Note**: The app works with mock data without an API key!

## 🎨 **Features to Try**

### Dashboard
- Search for stocks: `AAPL`, `GOOGL`, `MSFT`
- Click "Buy Stock" to see the purchase form
- View portfolio summary cards

### Assets
- Manually add historical stock purchases
- Use the popular stocks quick-add buttons
- See the example and tips sections

### Portfolio
- View your holdings in card or table format
- Toggle between Normal and Pro modes
- Interact with the performance charts
- Switch time periods (1M, 3M, 6M, 1Y, 2Y)

### Settings
- Toggle Dark Mode 🌙
- Switch between Normal/Pro modes
- Change currency display
- Explore the tips section

## 🛟 **Troubleshooting**

### Servers Not Starting?
```bash
# Kill any existing processes
pkill -f "node.*portfolio"
pkill -f "npm.*start"

# Restart
./start.sh
```

### Port Already in Use?
```bash
# Find and kill processes on ports 3000 and 5000
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:5000 | xargs kill -9
```

### Database Connection Issues?
The app will work with mock data even without MySQL. Check:
- MySQL service is running
- Credentials in `.env` are correct
- Database schema is imported

## 📱 **Mobile Testing**

The app is fully responsive! Try:
- Resize your browser window
- Test on mobile devices
- All features work on small screens

## 🎉 **You're All Set!**

Your portfolio management application is ready! The beautiful, modern interface includes:

- 📊 Real-time stock search and data
- 📈 Interactive charts with Chart.js
- 🌙 Dark mode support
- 📱 Fully responsive design
- ⚡ Fast, modern React frontend
- 🔧 Robust Node.js/Express backend
- 💾 MySQL database support
- 🎨 Professional UI with gradients and animations

**Happy portfolio tracking! 📈💰**