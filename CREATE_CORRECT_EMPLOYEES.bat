@echo off
color 0B
title Create Correct Employee Records

echo ============================================================
echo   CREATE CORRECT EMPLOYEE RECORDS
echo ============================================================
echo.
echo This will:
echo  1. Remove old test data (Rahul Sharma, Silk Smitha, etc.)
echo  2. Create correct employees matching Vercel:
echo     - Lata Benakop (IT-EMP-0041)
echo     - Mahesh Panchal (GN-EMP-0018)
echo     - Nikita aoigemanavar (GN-EMP-0019)
echo     - Padmanabh Chikkanoor (GN-EMP-0005)
echo.
echo ============================================================
echo.
pause
echo.

echo Checking MongoDB...
mongosh --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] MongoDB Shell (mongosh) not found!
    echo.
    echo Please install MongoDB Shell from:
    echo https://www.mongodb.com/try/download/shell
    echo.
    pause
    exit /b 1
)

echo [OK] MongoDB Shell found
echo.
echo Running MongoDB script...
echo.

mongosh --quiet --file create-correct-employees.js

echo.
echo ============================================================
echo   VERIFICATION
echo ============================================================
echo.
echo To verify the changes:
echo.
echo 1. Open MongoDB Compass
echo 2. Connect to: mongodb://localhost:27017
echo 3. Database: Data_base_hrms
echo 4. Collection: employees
echo 5. You should see 4 employees with correct names
echo.
echo OR
echo.
echo Open your browser:
echo http://localhost:5173/employee-card
echo.
echo Press Ctrl+Shift+R to hard refresh
echo.
echo You should now see the same employees as Vercel!
echo.
echo ============================================================
echo.
pause
