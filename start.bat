@echo off
title AUDIRA-CLIP-AI Starter
echo =======================================================
echo          INITIALIZING AUDIRA-CLIP-AI PLATFORM
echo =======================================================
echo.

echo [1/4] Cleaning up existing processes (Mencegah Crash Port)...
call npx -y kill-port 3344 3000 3345 8000 >nul 2>&1
echo.

echo [2/4] Starting Docker Services (PostgreSQL & Redis)...
docker-compose up -d
echo.

echo [3/4] Starting AI Engine (FastAPI)...
echo -------------------------------------------------------
start "AI Engine (Whisper)" cmd /k "cd ai-engine && run.bat"
echo AI Engine started on port 8000
echo.

echo [4/4] Starting Turborepo (Frontend & Microservices)...
echo Server sedang di-booting. Browser akan terbuka otomatis setelah semua sistem siap...
echo Tekan CTRL+C di jendela ini untuk menghentikan semua server.
echo.

:: Menjalankan perintah timer pintar di background untuk mengecek kesehatan komponen sebelum membuka browser
start /b powershell -Command "$ErrorActionPreference = 'SilentlyContinue'; Write-Host '[SMART WAIT] Menunggu NestJS dan Next.js (Port 3345/3344)...'; while((Invoke-WebRequest -Uri http://localhost:3345/video/health -UseBasicParsing).StatusCode -ne 200 -or (Invoke-WebRequest -Uri http://localhost:3344/api/health -UseBasicParsing).StatusCode -ne 200) { Start-Sleep -Seconds 3 }; Write-Host '[SMART WAIT] Menunggu AI Engine memuat model Whisper (Bisa memakan waktu 10-30 detik)...'; while((Invoke-WebRequest -Uri http://localhost:8000/health -UseBasicParsing).StatusCode -ne 200) { Start-Sleep -Seconds 3 }; Write-Host '[SMART WAIT] Semua sistem hijau! Membuka browser...'; Start-Sleep -Seconds 1; Start-Process 'http://localhost:3344'"

pnpm run dev
