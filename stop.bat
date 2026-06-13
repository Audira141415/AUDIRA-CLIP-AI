@echo off
title AUDIRA-CLIP-AI Stopper
echo =======================================================
echo         STOPPING ALL AUDIRA-CLIP-AI COMPONENTS
echo =======================================================
echo.

echo [1/3] Stopping Docker Containers (PostgreSQL & Redis)...
docker-compose down
echo.

echo [2/3] Force killing Node.js processes (Freeing Ports 3344, 3000, 3345)...
:: Kill Next.js (Port 3344) and NestJS (Port 3345/3000)
powershell -Command "foreach ($port in 3344,3000,3345,8000) { Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Foreach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }"
echo. Turborepo stopped.
echo.

echo [3/3] Force killing Turborepo processes...
taskkill /F /IM turbo.exe >nul 2>&1
echo Turborepo stopped.
echo.

echo =======================================================
echo   ALL COMPONENTS STOPPED AND PORTS FREED SUCCESSFULLY!
echo =======================================================
pause
