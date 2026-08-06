@echo off
cls
echo.
echo ========================================
echo   CONNECT TO MONGODB ATLAS
echo ========================================
echo.
echo I will help you connect to your MongoDB Atlas database
echo where your correct employees are stored.
echo.
pause
echo.
echo ========================================
echo   Step 1: Get Connection String
echo ========================================
echo.
echo 1. Open your browser
echo 2. Go to: https://cloud.mongodb.com
echo 3. Login to your account
echo 4. Click on your cluster (Cluster0)
echo 5. Click "Connect" button
echo 6. Click "Connect your application"
echo 7. Copy the connection string
echo.
echo The string looks like:
echo mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Data_base_hrms
echo.
pause
echo.
echo ========================================
echo   Step 2: Enter Your Connection String
echo ========================================
echo.
set /p MONGO_URI="Paste your MongoDB Atlas connection string here: "
echo.

if "%MONGO_URI%"=="" (
    echo ERROR: Connection string cannot be empty!
    echo.
    pause
    exit /b
)

echo.
echo Creating .env file...
echo MONGODB_URI=%MONGO_URI% > .env
echo.
echo SUCCESS! .env file created.
echo.
echo ========================================
echo   Step 3: Restart Backend
echo ========================================
echo.
echo Now you need to restart your backend:
echo.
echo 1. Stop your backend if it's running (press Ctrl+C in the backend terminal)
echo 2. Run: mvnw spring-boot:run
echo 3. Wait for "Started" message
echo 4. Open browser: http://localhost:5173/employee-card
echo 5. Press Ctrl+Shift+R to refresh
echo.
echo You should now see:
echo  - Lata Benakop
echo  - Mahesh Panchal
echo  - Nikita aoigemanavar
echo  - Padmanabh Chikkanoor
echo.
echo ========================================
echo.
pause
