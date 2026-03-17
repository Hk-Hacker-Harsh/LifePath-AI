@echo off
echo ====================================
echo  LifePath AI - Starting...
echo ====================================

:: Install backend deps if needed
echo [1/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 ( echo ERROR: Backend npm install failed & pause & exit /b 1 )

:: Install frontend deps if needed
echo [2/4] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 ( echo ERROR: Frontend npm install failed & pause & exit /b 1 )

:: Start backend in a new window
echo [3/4] Starting backend on port 5000...
cd ..\backend
start "LifePath Backend" cmd /k "node src/index.js"

:: Wait 3 seconds for backend to connect to DB
timeout /t 3 /nobreak >nul

:: Start frontend
echo [4/4] Starting frontend on port 3000...
cd ..\frontend
echo.
echo ====================================
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo ====================================
echo.
npm run dev
