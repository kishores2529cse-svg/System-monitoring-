@echo off
title YOLOv8 Phone Detector & Proctor Service
set "PATH=%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Python312\Scripts;%PATH%"

set "PYTHON_EXE=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
if not exist "%PYTHON_EXE%" set "PYTHON_EXE=python"

echo ===================================================
echo   Installing/Checking Python dependencies...
echo ===================================================
"%PYTHON_EXE%" -m pip install -r requirements.txt

echo.
echo ===================================================
echo   Starting YOLOv8 Proctor Service (Port 8082)...
echo ===================================================
"%PYTHON_EXE%" main.py
pause
