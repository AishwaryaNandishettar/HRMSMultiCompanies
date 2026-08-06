@echo off
echo ========================================
echo   Setup Production Database Connection
echo ========================================
echo.
echo This script will help you connect localhost to production MongoDB
echo.
echo IMPORTANT: You need your production MongoDB URI first
echo Get it from: Render/Railway Dashboard -^> Environment Variables -^> MONGODB_URI
echo.
echo Example URI format:
echo mongodb+srv://username:password@cluster.mongodb.net/database
echo.
pause
echo.
echo.
set /p MONGO_URI="Enter your production MongoDB URI: "
echo.
echo Creating .env file...
echo MONGODB_URI=%MONGO_URI% > .env
echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo .env file created with production MongoDB URI
echo.
echo Next steps:
echo 1. Restart your backend: mvnw spring-boot:run
echo 2. Open http://localhost:5173/employee-card
echo 3. Verify employee names are now correct
echo.
pause
