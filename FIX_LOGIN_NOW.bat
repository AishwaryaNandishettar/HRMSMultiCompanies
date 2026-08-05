@echo off
echo.
echo ============================================================
echo   FIX LOGIN ISSUE - Reset Password
echo ============================================================
echo.
echo This will reset the password for Aishwarya@company.com
echo to: admin123
echo.
pause

cd HRMS-Backend
node reset_admin_password.js

echo.
echo ============================================================
echo   Password Reset Complete!
echo ============================================================
echo.
echo IMPORTANT: You MUST restart the frontend now!
echo.
echo 1. Go to the terminal running frontend
echo 2. Press Ctrl+C to stop it
echo 3. Run: npm run dev
echo 4. Open incognito window
echo 5. Login with:
echo      Email: Aishwarya@company.com
echo      Password: admin123
echo.
pause
