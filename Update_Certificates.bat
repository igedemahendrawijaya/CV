@echo off
echo ============================================================
echo  SINKRONISASI MASTER CV (WORD) & SERTIFIKAT KE GITHUB
echo ============================================================
echo.

node sync_master_docx.js
node sync_certificates.js
call npm run build

git add .
git commit -m "Pembaruan CV otomatis pada %date% %time%"
git push origin main --force

echo.
echo ============================================================
echo  PROSES SELESAI! Perubahan sudah terkirim ke GitHub Pages.
echo ============================================================
pause
