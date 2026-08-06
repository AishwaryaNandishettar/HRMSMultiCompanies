@echo off
echo ========================================
echo   HRMS Backend - Starting Server
echo ========================================
echo.
echo Starting Spring Boot application...
echo Backend will be available at: http://localhost:8082
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

cd /d "%~dp0"
call mvnw.cmd spring-boot:run

pause
