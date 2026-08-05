@echo off
echo ====================================================
echo   FIX EMPLOYEE DIRECTORY - CompanyId Sync
echo ====================================================
echo.

echo This script will:
echo   1. Check your admin user's companyId
echo   2. Update all employees to match that companyId
echo   3. Fix the Employee Directory mismatch
echo.

echo Press Ctrl+C to cancel, or
pause

echo.
echo Checking for Node.js...
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.
echo Installing MongoDB driver if needed...
echo.

call npm install mongodb --no-save

echo.
echo Running fix script...
echo.

node fix_employee_directory_node.js

echo.
echo ====================================================
echo   FIX COMPLETED!
echo ====================================================
echo.
echo Next steps:
echo   1. Restart your backend server (mvn spring-boot:run)
echo   2. Clear browser cache (Ctrl+Shift+Delete)
echo   3. Login and check Employee Directory
echo.

pause
