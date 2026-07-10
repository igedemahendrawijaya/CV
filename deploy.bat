@echo off
echo ===================================================
echo   MEMULAI DEPLOYMENT KE GITHUB PAGES
echo ===================================================
echo.

:: Stage all changes
echo [1/3] Menyiapkan file yang diperbarui...
git add .

:: Commit changes with current timestamp
echo [2/3] Membuat commit pembaruan...
git commit -m "Pembaruan CV otomatis pada %date% %time%"

:: Push to GitHub
echo [3/3] Mengunggah file ke GitHub...
git push origin main

echo.
echo ===================================================
echo   BERHASIL! Website akan ter-update dalam 1-2 menit.
echo ===================================================
pause
