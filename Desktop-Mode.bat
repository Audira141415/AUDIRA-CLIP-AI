@echo off
echo ========================================================
echo   AUDIRA CLIP AI - DESKTOP MODE
echo   Menyalakan Server di Background...
echo ========================================================

:: Menjalankan server Next.js di background (silently)
start /B cmd /c "pnpm dev > nul 2>&1"

:: Menunggu beberapa detik agar server siap
timeout /t 5 /nobreak > nul

echo ========================================================
echo   Server berjalan di http://localhost:3344
echo   Membuka Aplikasi...
echo ========================================================

:: Membuka Chrome atau Edge dalam App Mode (menghilangkan address bar, dll)
:: Coba Chrome dulu
start chrome --app=http://localhost:3344
if %errorlevel% neq 0 (
    :: Jika Chrome tidak ada, coba Edge
    start msedge --app=http://localhost:3344
)

echo AUDIRA CLIP AI telah dibuka. Jendela ini akan tertutup dalam 5 detik.
timeout /t 5 /nobreak > nul
exit
