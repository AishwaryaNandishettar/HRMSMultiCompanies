@echo off
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║           📤 PUSHING CODE TO GITHUB - AUTOMATIC                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

cd "d:\New folder\HRMSProject (2)\HRMSProject"

echo 📋 Step 1: Checking what files changed...
echo.
git status
echo.

echo 📋 Step 2: Adding all changes...
echo.
git add .
echo.

echo 📋 Step 3: Committing with message...
echo.
git commit -m "Fixed: Profile documents view/download for Vercel, Bulk upload with documents, Email port 587"
echo.

echo 📋 Step 4: Pushing to GitHub...
echo.
git push origin main
echo.

echo ✅ DONE! Code pushed to GitHub!
echo.
echo 🚀 What happens next:
echo    1. Render will auto-deploy backend (2-3 minutes)
echo    2. Vercel will auto-deploy frontend (1-2 minutes)
echo    3. All fixes will be live on production!
echo.

pause
