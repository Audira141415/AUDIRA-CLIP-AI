@echo off
title AUDIRA-CLIP-AI Stopper
echo =======================================================
echo         STOPPING ALL AUDIRA-CLIP-AI COMPONENTS
echo =======================================================
echo.

echo [1/3] Stopping Docker Containers (PostgreSQL & Redis)...
docker-compose down
echo.

echo [2/3] Force killing Node.js processes (Freeing Ports 3344, 3000, 3001)...
taskkill /F /IM node.exe >nul 2>&1
echo Node.js stopped.
echo.

echo [3/3] Force killing Turborepo processes...
taskkill /F /IM turbo.exe >nul 2>&1
echo Turborepo stopped.
echo.

echo =======================================================
echo   ALL COMPONENTS STOPPED AND PORTS FREED SUCCESSFULLY!
echo =======================================================
pause
