@echo off
echo ========================================
echo 🔄 RESTARTING BACKEND
echo ========================================

echo.
echo Step 1: Stopping all Java processes...
taskkill /F /IM java.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ Java processes stopped
) else (
    echo ℹ️  No Java processes running
)

echo.
echo Step 2: Navigating to backend folder...
cd HRMS-Backend

echo.
echo Step 3: Cleaning old build...
call mvnw.cmd clean

echo.
echo Step 4: Building backend...
call mvnw.cmd package -DskipTests

echo.
echo Step 5: Starting backend...
echo ========================================
echo 🚀 Backend starting on port 8082
echo ========================================
echo Wait for "Tomcat started" message...
echo.
call mvnw.cmd spring-boot:run
