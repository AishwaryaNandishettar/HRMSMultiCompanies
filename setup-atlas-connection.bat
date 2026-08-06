@echo off
color 0E
title Connect to MongoDB Atlas

echo ============================================================
echo   CONNECT LOCALHOST TO MONGODB ATLAS
echo ============================================================
echo.
echo Your localhost is showing wrong employee names because it's
echo NOT connected to your MongoDB Atlas cloud database.
echo.
echo This script will help you connect to MongoDB Atlas.
echo ============================================================
echo.
pause
echo.

echo Step 1: Get MongoDB Atlas Connection String
echo ============================================================
echo.
echo 1. Go to: https://cloud.mongodb.com
echo 2. Login to your account
echo 3. Click your cluster: "Cluster0"
echo 4. Click "Connect" button
echo 5. Choose "Connect your application"
echo 6. Copy the connection string
echo 7. Replace ^<password^> with your actual password
echo.
echo Example format:
echo mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Data_base_hrms
echo.
echo ============================================================
echo.
set /p MONGO_URI="Paste your MongoDB Atlas connection string here: "
echo.

if "%MONGO_URI%"=="" (
    echo [ERROR] Connection string cannot be empty!
    echo.
    pause
    exit /b 1
)

echo.
echo Checking connection string format...
echo.

echo %MONGO_URI% | findstr /C:"mongodb+srv://" >nul
if errorlevel 1 (
    echo [WARNING] Connection string should start with: mongodb+srv://
    echo.
    set /p continue="Continue anyway? (Y/N): "
    if /i not "%continue%"=="Y" (
        exit /b 1
    )
)

echo %MONGO_URI% | findstr /C:"Data_base_hrms" >nul
if errorlevel 1 (
    echo [WARNING] Connection string should end with: /Data_base_hrms
    echo.
    set /p continue="Continue anyway? (Y/N): "
    if /i not "%continue%"=="Y" (
        exit /b 1
    )
)

echo.
echo Creating .env file...
echo MONGODB_URI=%MONGO_URI% > .env
echo.

if exist .env (
    echo [SUCCESS] .env file created!
    echo.
    echo File location: %CD%\.env
    echo Content: MONGODB_URI=%MONGO_URI%
    echo.
) else (
    echo [ERROR] Failed to create .env file!
    echo.
    pause
    exit /b 1
)

echo ============================================================
echo   IMPORTANT: Whitelist Your IP in MongoDB Atlas
echo ============================================================
echo.
echo 1. Go to: https://cloud.mongodb.com
echo 2. Click "Network Access" in left menu
echo 3. Click "Add IP Address"
echo 4. Choose "Allow Access from Anywhere" (0.0.0.0/0)
echo 5. Click "Confirm"
echo.
echo This allows your localhost to connect to MongoDB Atlas.
echo ============================================================
echo.
pause
echo.

echo ============================================================
echo   NEXT STEPS
echo ============================================================
echo.
echo 1. Restart your backend:
echo    - Stop backend (Ctrl+C if running)
echo    - Run: mvnw spring-boot:run
echo.
echo 2. Check backend logs for:
echo    "MongoDB URI: mongodb+srv://..."
echo    "Connected to MongoDB Atlas"
echo.
echo 3. Refresh browser:
echo    - Open: http://localhost:5173/employee-card
echo    - Press: Ctrl+Shift+R (hard refresh)
echo.
echo 4. You should now see correct employees:
echo    - Lata Benakop (IT-EMP-0041)
echo    - Mahesh Panchal (GN-EMP-0018)
echo    - Nikita aoigemanavar (GN-EMP-0019)
echo    - Padmanabh Chikkanoor (GN-EMP-0005)
echo.
echo ============================================================
echo.
echo [SUCCESS] Setup complete!
echo.
echo Your localhost will now connect to MongoDB Atlas
echo and show the same employees as Vercel!
echo.
echo ============================================================
echo.
pause
