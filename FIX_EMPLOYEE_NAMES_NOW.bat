@echo off
color 0A
title Fix Employee Names - MongoDB Update

echo ============================================================
echo   FIX EMPLOYEE NAMES - Update Local MongoDB
echo ============================================================
echo.
echo This will update your local MongoDB with correct employee names
echo from your production database.
echo.
echo ============================================================
echo.
pause
echo.

echo Checking MongoDB connection...
mongosh --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] mongosh not found!
    echo.
    echo MongoDB Shell (mongosh) is required to run this script.
    echo.
    echo Download from: https://www.mongodb.com/try/download/shell
    echo.
    pause
    exit /b
)

echo ✓ MongoDB Shell found
echo.
echo ============================================================
echo   METHOD 1: Manual Update (Recommended)
echo ============================================================
echo.
echo 1. Open MongoDB Compass
echo 2. Connect to: mongodb://localhost:27017
echo 3. Select database: Data_base_hrms
echo 4. Select collection: employees
echo 5. Find each employee by employeeId and update fullName:
echo.
echo    EMP101 → Change "Rahul Sharma" to correct name
echo    EMP102 → Change "Rahul Mandre" to correct name  
echo    EMP103 → Change "Silk Smitha" to correct name
echo    EMP105 → Change "ABCD" to correct name
echo.
echo ============================================================
echo   METHOD 2: Automated Sync from Production
echo ============================================================
echo.
echo Run the PowerShell script:
echo    sync-employee-data.ps1
echo.
echo This will:
echo - Fetch employee data from production backend
echo - Generate MongoDB update script
echo - Update your local database
echo.
echo ============================================================
echo   METHOD 3: Use Pre-made Update Script
echo ============================================================
echo.
echo 1. Edit the file: fix-employee-names.js
echo 2. Update the employee names in the script
echo 3. Run: mongosh ^< fix-employee-names.js
echo.
echo ============================================================
echo.

set /p choice="Choose method (1, 2, or 3): "

if "%choice%"=="1" (
    echo.
    echo Opening MongoDB Compass instructions...
    echo.
    echo Please follow the steps above to manually update employee names.
    echo.
    pause
    exit /b
)

if "%choice%"=="2" (
    echo.
    echo Running PowerShell sync script...
    echo.
    powershell -ExecutionPolicy Bypass -File sync-employee-data.ps1
    echo.
    pause
    exit /b
)

if "%choice%"=="3" (
    echo.
    echo ============================================================
    echo   Before running, make sure you've edited:
    echo   fix-employee-names.js
    echo.
    echo   Update these lines with correct names:
    echo   - fullName: "Pradyumna Mishra" 
    echo   - fullName: "Aishushettar95"
    echo   etc.
    echo ============================================================
    echo.
    set /p confirm="Have you updated fix-employee-names.js? (Y/N): "
    
    if /i "%confirm%"=="Y" (
        echo.
        echo Running MongoDB update script...
        echo.
        mongosh --quiet --file fix-employee-names.js
        echo.
        echo ============================================================
        echo   ✓ Update complete!
        echo ============================================================
        echo.
        echo Next steps:
        echo 1. Open http://localhost:5173/employee-card
        echo 2. Refresh the page (Ctrl+R)
        echo 3. Verify names are now correct
        echo.
    ) else (
        echo.
        echo Please edit fix-employee-names.js first, then run this script again.
        echo.
    )
    pause
    exit /b
)

echo.
echo Invalid choice. Please run the script again.
echo.
pause
