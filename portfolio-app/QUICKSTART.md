# 🚀 Quick Start Guide

Get your Portfolio Management Application running in 5 minutes!

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ **Node.js** (v16+) - [Download here](https://nodejs.org/)
- ✅ **MySQL** (v8.0+) - [Download here](https://dev.mysql.com/downloads/mysql/)
- ✅ **Alpha Vantage API Key** (free) - [Get here](https://www.alphavantage.co/support/#api-key)

## ⚡ Automated Setup

Run the setup script for automatic installation:

```bash
./setup.sh
```

## 🔧 Manual Setup

If you prefer manual setup:

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema
source database/schema.sql
```

### 3. Configure Environment

```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit the .env file with your settings
nano backend/.env
```

Update these values in `.env`:
```bash
DB_PASSWORD=your_mysql_password
ALPHA_VANTAGE_API_KEY=your_api_key
```

### 4. Start the Application

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎯 First Steps

1. **Search for a stock** on the Dashboard (try "AAPL", "GOOGL", or "MSFT")
2. **Add it to your portfolio** using the buy button
3. **View your holdings** on the Portfolio page
4. **Add historical stocks** on the Assets page
5. **Customize settings** on the Settings page

## 🔍 Test the API

Check if the backend is running:
```bash
curl http://localhost:5000/api/health
```

## 🆘 Troubleshooting

### Database Connection Issues
- Ensure MySQL is running: `sudo service mysql start`
- Check credentials in `.env` file
- Verify database exists: `SHOW DATABASES;` in MySQL

### API Rate Limits
- Alpha Vantage free tier: 5 requests/minute, 500/day
- Use demo key for testing (limited data)
- Get your free API key for full functionality

### Port Already in Use
- Backend (5000): `lsof -ti:5000 | xargs kill -9`
- Frontend (3000): `lsof -ti:3000 | xargs kill -9`

## 📚 Learn More

- [Full Documentation](README.md)
- [API Endpoints](README.md#-api-endpoints)
- [Configuration Options](README.md#-configuration)

---

**Ready to start tracking your investments? Let's go! 🚀📈**