@echo off
echo.
echo ============================================================
echo   FIX EMPLOYEE DIRECTORY - Set CompanyId
echo ============================================================
echo.
echo This will set companyId='omoikaneinnovations' for:
echo   - All admin users
echo   - All employees
echo.
echo WARNING: This will update ALL records in your database!
echo.
pause

node fix_all_employee_companyid.js

echo.
echo ============================================================
echo   Fix complete!
echo ============================================================
echo.
echo NEXT STEPS:
echo   1. Restart your backend server (Ctrl+C and mvn spring-boot:run)
echo   2. Clear browser cache (F12 ^> Application ^> Clear site data)
echo   3. Close and reopen browser
echo   4. Login and check Employee Directory
echo.
pause
