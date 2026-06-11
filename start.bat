@echo off
title AUDIRA-CLIP-AI Starter
echo =======================================================
echo          INITIALIZING AUDIRA-CLIP-AI PLATFORM
echo =======================================================
echo.

echo [1/3] Starting Docker Services (PostgreSQL & Redis)...
docker-compose up -d
echo.

echo [2/3] Checking Port Allocations...
echo -------------------------------------------------------
echo [Database] PostgreSQL       : Port 5432
echo [Cache/MQ] Redis            : Port 6379
echo [Frontend] Next.js Web App  : Port 3344
echo [Backend]  API Gateway      : Port 3000
echo [Backend]  Billing Service  : Port 3001 (If configured)
echo [Backend]  Auth/AI/Video/Render : Connects via Redis TCP (No Port)
echo -------------------------------------------------------
echo.

echo [3/3] Starting Turborepo (Frontend & Microservices)...
echo Server sedang di-booting. Browser akan terbuka otomatis dalam 8 detik...
echo Tekan CTRL+C di jendela ini untuk menghentikan log server.
echo.

:: Menjalankan perintah timer di background untuk membuka browser otomatis
start /b cmd /c "timeout /t 8 >nul && start http://localhost:3344"

pnpm run dev
