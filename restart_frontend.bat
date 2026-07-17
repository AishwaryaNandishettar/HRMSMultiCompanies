@echo off
echo ========================================
echo 🔄 RESTARTING ALL FRONTEND INSTANCES
echo ========================================

echo.
echo Step 1: Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ Node processes stopped
) else (
    echo ℹ️  No Node processes running
)

echo.
echo Step 2: Navigating to frontend folder...
cd HRMS-Frontend

echo.
echo ========================================
echo 🚀 STARTING ALL PORTALS
echo ========================================
echo.
echo You need to run each command in a SEPARATE terminal window:
echo.
echo Terminal 1 - Omoi HR Works (port 5173):
echo   npm run dev
echo.
echo Terminal 2 - TalentHub Solutions (port 5176):
echo   npm run dev:company-a
echo.
echo Terminal 3 - WorkForce Pro (port 5177):
echo   npm run dev:company-b
echo.
echo Terminal 4 - PeopleSync Enterprise (port 5178):
echo   npm run dev:company-c
echo.
echo ========================================
echo.

pause
