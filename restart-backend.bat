@echo off
echo ========================================
echo Backend Restart Script
echo ========================================
echo.

echo Step 1: Stopping existing backend...
taskkill /F /IM java.exe 2>nul
if %errorlevel% == 0 (
    echo Backend stopped
    timeout /t 2 /nobreak >nul
) else (
    echo No running backend found
)
echo.

echo Step 2: Navigating to backend directory...
if exist "HRMS-Backend" (
    cd HRMS-Backend
    echo In directory: %CD%
) else (
    echo Using current directory: %CD%
)
echo.

echo Step 3: Rebuilding backend...
echo This may take a few minutes...
if exist "mvnw.cmd" (
    echo Using Maven wrapper...
    call mvnw.cmd clean install -DskipTests
) else (
    echo Using global Maven...
    call mvn clean install -DskipTests
)

if %errorlevel% == 0 (
    echo Backend rebuilt successfully
) else (
    echo Build failed! Check the errors above
    pause
    exit /b 1
)
echo.

echo Step 4: Starting backend with tenant validation...
echo Backend logs will appear below...
echo Press Ctrl+C to stop the backend
echo.
echo ========================================
echo.

if exist "mvnw.cmd" (
    call mvnw.cmd spring-boot:run
) else (
    call mvn spring-boot:run
)

pause
