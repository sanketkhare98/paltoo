@echo off
title Paltoo Launcher
color 06
cd /d "%~dp0"

echo.
echo ======================================================
echo           PALTOO - AI PET CARE ASSISTANT
echo ======================================================
echo.
echo [1/2] Freeing ports 3001 and 3500 if occupied...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001 "') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3500 "') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/2] Launching Backend (3001) and Frontend (3500)...
echo.
echo  * Frontend: http://localhost:3500
echo  * Backend:  http://localhost:3001
echo.
echo ======================================================
echo Application is running! Keep this window open.
echo To close Paltoo, simply close this window.
echo ======================================================
echo.

call npm start
pause
