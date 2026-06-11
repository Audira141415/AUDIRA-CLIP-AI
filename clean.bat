@echo off
echo ===================================================
echo   AUDIRA-CLIP-AI Cache Cleaner
echo   Menghapus file sementara, cache, dan riwayat sisa
echo ===================================================
echo.

echo [1/4] Menghapus Cache Next.js...
if exist "apps\web\.next" rmdir /s /q "apps\web\.next"

echo [2/4] Menghapus Cache Turborepo...
if exist ".turbo" rmdir /s /q ".turbo"

echo [3/4] Menghapus Sisa Media Uploads (Video/Audio)...
if exist "services\video-service\uploads" (
    del /q /s "services\video-service\uploads\*.*"
)

echo [4/4] Mengoptimalkan Database Git (Garbage Collection)...
git gc --prune=now

echo.
echo ===================================================
echo Pembersihan Selesai! Ruang penyimpanan telah lega.
echo ===================================================
pause
