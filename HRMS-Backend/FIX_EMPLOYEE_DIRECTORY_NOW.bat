@echo off
echo ====================================================
echo   FIX EMPLOYEE DIRECTORY - Set Admin CompanyId
echo ====================================================
echo.

echo Running fix for admin users...
echo.

node fix_admin_companyid.js

echo.
echo ====================================================
echo   FIX COMPLETED!
echo ====================================================
echo.
echo IMPORTANT: 
echo   1. Stop backend server (Ctrl+C in backend terminal)
echo   2. Restart backend: mvn spring-boot:run
echo   3. Clear browser cache (F12 ^> Application ^> Clear site data)
echo   4. Refresh Employee Directory page
echo.

pause
