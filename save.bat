@echo off
echo ===================================================
echo   Menyimpan dan Mengunggah Kode ke GitHub
echo   Repositori: https://github.com/Audira141415/AUDIRA-CLIP-AI.git
echo ===================================================
echo.

set /p commit_msg="Masukkan pesan commit (tekan Enter untuk 'auto update'): "
if "%commit_msg%"=="" set commit_msg=auto update

:: Cek apakah repositori git sudah diinisialisasi
if not exist .git (
    echo Menginisialisasi repositori Git baru...
    git init
    git branch -M main
)

echo.
echo [1/3] Menambahkan file ke staging area...
git add .

echo.
echo [2/3] Menyimpan commit...
git commit -m "%commit_msg%"

echo.
echo [3/3] Mengunggah (pushing) ke GitHub...
git push https://github.com/Audira141415/AUDIRA-CLIP-AI.git main

echo.
echo ===================================================
echo Selesai! Kode Anda berhasil didorong ke GitHub.
echo ===================================================
pause
