@echo off
echo.
echo ============================================================
echo   Starting Backend with MongoDB Atlas (Production DB)
echo ============================================================
echo.

REM Set MongoDB Atlas connection string
set MONGODB_URI=mongodb+srv://hrms_user:HRMS%%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true^&w=majority^&appName=Cluster0

REM Set other required environment variables
set JWT_SECRET=MyFixedSecretKey123456
set SPRING_MAIL_USERNAME=aishushettar95@gmail.com
set SPRING_MAIL_PASSWORD=uibswyvitauzsjjf

echo ✅ Environment variables set:
echo    - MONGODB_URI: MongoDB Atlas (production)
echo    - JWT_SECRET: Set
echo    - Email credentials: Set
echo.
echo Starting backend server on port 8082...
echo.

mvn spring-boot:run
