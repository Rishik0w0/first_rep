#!/bin/bash

# Portfolio Management Application Startup Script
echo "🚀 Starting Portfolio Management Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Portfolio Management Application${NC}"
echo -e "${BLUE}====================================${NC}"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Check if ports are already in use
if check_port 5000; then
    echo -e "${YELLOW}⚠️  Port 5000 is already in use (Backend)${NC}"
fi

if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use (Frontend)${NC}"
fi

echo -e "${GREEN}🔧 Installing dependencies...${NC}"

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd backend
npm install --silent
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd ../frontend
npm install --silent
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ..

echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
echo ""
echo -e "${GREEN}🚀 Starting servers...${NC}"

# Start backend server
echo -e "${BLUE}Starting backend server on port 5000...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo -e "${BLUE}Starting frontend server on port 3000...${NC}"
cd ../frontend
npm start &
FRONTEND_PID=$!

# Wait for servers to start
sleep 5

echo ""
echo -e "${GREEN}✅ Portfolio Management Application is starting!${NC}"
echo ""
echo -e "${BLUE}📍 Access your application at:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "   Backend:  ${GREEN}http://localhost:5000${NC}"
echo ""
echo -e "${YELLOW}📝 Note: The application includes mock data for demo purposes${NC}"
echo -e "${YELLOW}   You can use it without setting up MySQL initially${NC}"
echo ""
echo -e "${BLUE}🛑 To stop the servers, press Ctrl+C${NC}"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait