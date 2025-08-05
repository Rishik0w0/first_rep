#!/bin/bash

# Portfolio Management Application Setup Script
# This script helps you set up the application quickly

echo "🚀 Portfolio Management Application Setup"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL v8.0 or higher."
    echo "   Download from: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

cd ..

# Database setup
echo "🗃️  Setting up database..."
echo "Please enter your MySQL root password when prompted:"
mysql -u root -p < database/schema.sql
if [ $? -ne 0 ]; then
    echo "❌ Failed to set up database"
    echo "   Please run manually: mysql -u root -p < database/schema.sql"
else
    echo "✅ Database setup completed"
fi

# Environment setup
echo "⚙️  Setting up environment..."
if [ ! -f backend/.env ]; then
    echo "❌ Backend .env file not found"
    echo "   Please copy backend/.env.example to backend/.env and configure it"
else
    echo "✅ Environment file found"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Get your free Alpha Vantage API key from: https://www.alphavantage.co/support/#api-key"
echo "2. Update backend/.env with your API key and database credentials"
echo "3. Start the backend server: cd backend && npm run dev"
echo "4. Start the frontend server: cd frontend && npm start"
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed instructions, see README.md"
echo ""
echo "Happy investing! 📈💰"