@echo off
COLOR 0C
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║              STOPPING ALL SERVICES                            ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo This will FORCE STOP:
echo   - All frontend dev servers (ports 5176, 5177, 5178, 5173)
echo   - Backend server (port 8082)
echo.
pause
echo.

echo Stopping Node.js (Frontend)...
taskkill /F /IM node.exe 2>nul
if %errorlevel%==0 (
    echo ✅ Frontend stopped
) else (
    echo ℹ️  No frontend running
)
echo.

echo Stopping Java (Backend)...
taskkill /F /IM java.exe 2>nul
if %errorlevel%==0 (
    echo ✅ Backend stopped
) else (
    echo ℹ️  No backend running
)
echo.

echo Verifying ports are free...
netstat -ano | findstr "5176 5177 5178 8082" >nul 2>&1
if %errorlevel%==0 (
    COLOR 0E
    echo ⚠️  WARNING: Some ports still in use!
    echo.
    netstat -ano | findstr "5176 5177 5178 8082"
    echo.
    echo You may need to restart your computer or manually kill these processes.
) else (
    COLOR 0A
    echo ✅ All ports are free
)
echo.

COLOR 0F
echo ═══════════════════════════════════════════════════════════════
echo ✅ EVERYTHING STOPPED
echo ═══════════════════════════════════════════════════════════════
echo.
echo Next steps:
echo.
echo 1. Start Backend:
echo    cd HRMS-Backend
echo    mvnw.cmd clean package -DskipTests
echo    mvnw.cmd spring-boot:run
echo.
echo 2. Start Frontend (PeopleSync):
echo    cd HRMS-Frontend
echo    npm run dev:company-c
echo.
echo 3. Test in Incognito browser
echo.

pause
