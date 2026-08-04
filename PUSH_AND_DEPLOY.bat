@echo off
echo ========================================
echo PUSH CODE TO GITHUB AND DEPLOY TO RENDER
echo ========================================
echo.

cd /d "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"

echo Current directory:
cd
echo.

echo Checking Git status...
git status
echo.

echo Adding all changes...
git add .
echo.

echo Committing changes...
git commit -m "Fix: Email quote bug and Gmail password update"
echo.

echo Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo DONE! 
echo.
echo Now go to Render dashboard:
echo https://dashboard.render.com/
echo.
echo Your backend should auto-deploy in 2-3 minutes.
echo Watch the logs for "Deploy succeeded"
echo ========================================
echo.

pause
