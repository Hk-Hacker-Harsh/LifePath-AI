#!/bin/bash
echo "===================================="
echo " LifePath AI - Starting..."
echo "===================================="

# Install backend deps
echo "[1/4] Installing backend dependencies..."
cd backend && npm install
if [ $? -ne 0 ]; then echo "ERROR: Backend npm install failed"; exit 1; fi

# Install frontend deps
echo "[2/4] Installing frontend dependencies..."
cd ../frontend && npm install
if [ $? -ne 0 ]; then echo "ERROR: Frontend npm install failed"; exit 1; fi

# Start backend in background
echo "[3/4] Starting backend on port 5000..."
cd ../backend
node src/index.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to be ready
sleep 3

# Start frontend
echo "[4/4] Starting frontend on port 3000..."
cd ../frontend
echo ""
echo "===================================="
echo " Backend:  http://localhost:5000"
echo " Frontend: http://localhost:3000"
echo "===================================="
echo ""
npm run dev

# Cleanup on exit
kill $BACKEND_PID 2>/dev/null
