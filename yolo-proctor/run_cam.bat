@echo off
title YOLOv8 Phone Detector - Live Camera
set "PATH=%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Python312\Scripts;%PATH%"

echo ===================================================
echo   Installing/Checking Python dependencies...
echo ===================================================
python -m pip install -r requirements.txt

echo.
echo ===================================================
echo   Starting Live OpenCV Phone & Object Detector...
echo ===================================================
python detect_cam.py
pause
