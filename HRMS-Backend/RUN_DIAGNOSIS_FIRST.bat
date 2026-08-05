@echo off
echo.
echo ============================================================
echo   EMPLOYEE DIRECTORY DIAGNOSIS
echo ============================================================
echo.
echo This will check what's actually in your MongoDB database.
echo.
pause

node check_mongodb_data.js

echo.
echo ============================================================
echo   Diagnosis complete!
echo ============================================================
echo.
echo If issues were found, run: fix_all_employee_companyid.js
echo.
pause
