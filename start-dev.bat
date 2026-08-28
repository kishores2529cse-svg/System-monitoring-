@echo off
echo ==========================================================
echo Starting Assessment Monitoring System Services...
echo ==========================================================

:: 1. Start main backend (backend-auth) on Port 8080
echo [1/4] Starting Main Backend (backend-auth) on Port 8080...
start "Main Backend (8080)" cmd /k "cd /d %~dp0backend-auth && go run main.go"

:: 2. Start Anti-cheating backend (Anticheating) on Port 8081
echo [2/4] Starting Anti-cheating Backend (Anticheating) on Port 8081...
start "Anti-cheating Backend (8081)" cmd /k "cd /d %~dp0Anticheating && set PORT=8081 && go run main.go"

:: 3. Start YOLO + OpenCV Python Microservice on Port 8082
echo [3/4] Starting YOLO/OpenCV Python Proctor Backend on Port 8082...
start "YOLO Proctor Backend (8082)" cmd /k "cd /d %~dp0yolo-proctor && python main.py"

:: 4. Start Frontend (Vite + React)
echo [4/4] Starting React Frontend...
start "Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo ==========================================================
echo All services launched! You can close this loader window.
echo ==========================================================
timeout /t 5
