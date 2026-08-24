@echo off
echo ===================================================
echo   SINKRONISASI & DEPLOYMENT CV KE GITHUB PAGES
echo ===================================================
echo.

:: 1. Sinkronisasi dari Word Document (Master CV.docx)
echo [1/5] Membaca dan menyinkronkan data dari Master CV (Word)...
node sync_master_docx.js

:: 2. Sinkronisasi dari Folder Certificate (PDF & Images)
echo [2/5] Memeriksa dan menyinkronkan file sertifikat...
node sync_certificates.js

:: 3. Build website Vite
echo [3/5] Membangun ulang website (Vite Build)...
call npm run build

:: 4. Stage & Commit Git
echo [4/5] Menyiapkan dan membuat commit pembaruan...
git add .
git commit -m "Pembaruan otomatis CV dari Word & Sertifikat pada %date% %time%"

:: 5. Push to GitHub Pages
echo [5/5] Mengunggah perubahan ke GitHub Pages...
git push origin main --force

echo.
echo ===================================================
echo   BERHASIL! Seluruh CV dari Word & Sertifikat 
echo   telah ter-update dan online dalam 1-2 menit.
echo ===================================================
pause
