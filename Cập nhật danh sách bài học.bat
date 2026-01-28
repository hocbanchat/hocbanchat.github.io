@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════╗
echo ║  CẬP NHẬT DANH SÁCH BÀI HỌC               ║
echo ╚════════════════════════════════════════════╝
echo.

REM Kiểm tra Node.js đã cài đặt chưa
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Lỗi: Chưa cài đặt Node.js!
    echo.
    echo 📥 Vui lòng tải và cài đặt Node.js từ: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Đã tìm thấy Node.js
echo.

REM Chạy script
node scripts/generate-data-index.js

echo.
echo ═══════════════════════════════════════════════
echo.
echo ✨ Hoàn thành! Bạn có thể đóng cửa sổ này.
echo 🌐 Reload trang web để xem kết quả.
echo.
pause
