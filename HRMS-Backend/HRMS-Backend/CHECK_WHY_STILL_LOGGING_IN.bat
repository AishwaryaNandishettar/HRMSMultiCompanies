@echo off
echo ========================================
echo Diagnosing Why Login Still Works
echo ========================================
echo.

echo CHECK 1: Is MongoDB running?
echo ────────────────────────────────────────
mongosh --eval "db.version()" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB is NOT running
    echo    Fix: Start MongoDB service
    echo.
) else (
    echo ✅ MongoDB is running
    echo.
)

echo CHECK 2: Does Aishwarya have companyId in database?
echo ────────────────────────────────────────
mongosh --quiet --eval "use hrms_db; var user=db.users.findOne({email:'Aishwarya@company.com'},{email:1,companyId:1,_id:0}); if(user){if(user.companyId==='omoikaneinnovations'){print('✅ Correct: companyId is omoikaneinnovations');}else{print('❌ WRONG: companyId is '+(user.companyId||'NOT SET'));print('   Fix: Run CRITICAL_FIX_NOW.bat');}}else{print('❌ User not found in database');}"
echo.

echo CHECK 3: Is backend running?
echo ────────────────────────────────────────
netstat -ano | findstr :8082 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend is NOT running on port 8082
    echo    Fix: Start the backend
    echo.
) else (
    echo ✅ Backend is running on port 8082
    echo.
)

echo CHECK 4: Testing actual login attempt
echo ────────────────────────────────────────
echo Attempting login as Aishwarya to TalentHub...
echo.

curl -X POST http://localhost:8082/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"Aishwarya@company.com\",\"password\":\"admin123\",\"tenantId\":\"company-a\"}" ^
  -w "\nHTTP Status: %%{http_code}\n" ^
  -s 2>nul

echo.
echo Expected: HTTP Status: 403 (Access Denied)
echo If you see: HTTP Status: 200 - Login is working (WRONG!)
echo.

echo ========================================
echo DIAGNOSIS SUMMARY
echo ========================================
echo.
echo If Aishwarya can still login, the problem is:
echo.
echo 1. Database NOT updated
echo    → Run: CRITICAL_FIX_NOW.bat
echo.
echo 2. Backend NOT restarted after code changes
echo    → Run: restart-backend.bat
echo.
echo 3. Frontend NOT sending tenantId
echo    → Check browser DevTools Network tab
echo.

pause
