@echo off
COLOR 0E
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║          DIAGNOSING WHY AISHWARYA CAN STILL LOGIN            ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo CHECK 1: Is MongoDB Running?
echo ═══════════════════════════════════════════════════════════════
mongosh --eval "db.version()" >nul 2>&1
if %errorlevel%==0 (
    COLOR 0A
    echo ✅ MongoDB is running
    COLOR 0E
) else (
    COLOR 0C
    echo ❌ MongoDB is NOT running
    echo    Start MongoDB and run this again
    pause
    exit /b 1
)
echo.

echo CHECK 2: Does Aishwarya have companyId in database?
echo ═══════════════════════════════════════════════════════════════
mongosh --quiet --eval "use hrms_db; var u=db.users.findOne({email:'Aishwarya@company.com'},{email:1,companyId:1,_id:0}); if(u){print('Email: '+u.email); print('CompanyId: '+(u.companyId||'NOT SET')); if(u.companyId==='omoikaneinnovations'){print('✅ CompanyId is CORRECT');}else{print('❌ CompanyId is WRONG or NOT SET');print('   FIXING NOW...');}}else{print('❌ User not found');}"

echo.
echo If companyId was WRONG, fixing it now...
mongosh --quiet --eval "use hrms_db; db.users.updateOne({email:'Aishwarya@company.com'},{$set:{companyId:'omoikaneinnovations'}}); print('✅ Updated');"
echo.

echo CHECK 3: Is Backend Running?
echo ═══════════════════════════════════════════════════════════════
netstat -ano | findstr :8082 >nul 2>&1
if %errorlevel%==0 (
    COLOR 0A
    echo ✅ Backend is running on port 8082
    COLOR 0E
) else (
    COLOR 0C
    echo ❌ Backend is NOT running
    echo    Start backend: cd HRMS-Backend && mvnw.cmd spring-boot:run
    pause
    exit /b 1
)
echo.

echo CHECK 4: Testing actual login to PeopleSync
echo ═══════════════════════════════════════════════════════════════
echo Sending login request WITH tenantId...
echo.

curl -s -X POST http://localhost:8082/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"Aishwarya@company.com\",\"password\":\"admin123\",\"tenantId\":\"company-c\"}" ^
  -w "\n\nHTTP Status: %%{http_code}\n"

echo.
echo ═══════════════════════════════════════════════════════════════
echo DIAGNOSIS RESULTS:
echo ═══════════════════════════════════════════════════════════════
echo.
echo If you saw:
echo   - HTTP Status: 200 = ❌ Login worked (WRONG!)
echo   - HTTP Status: 403 = ✅ Login blocked (CORRECT!)
echo.
echo ═══════════════════════════════════════════════════════════════
echo WHAT TO CHECK IN BACKEND CONSOLE:
echo ═══════════════════════════════════════════════════════════════
echo.
echo Look at your backend console RIGHT NOW.
echo.
echo You MUST see these logs:
echo   EMAIL: Aishwarya@company.com
echo   TENANT ID: company-c
echo   🔍 TENANT VALIDATION:
echo     Request Tenant ID: company-c
echo     User Company ID: omoikaneinnovations
echo   ❌ Login denied: Tenant mismatch
echo.
echo If you DON'T see "TENANT ID: company-c":
echo   → Frontend not sending tenantId
echo   → Restart frontend
echo.
echo If you DON'T see "🔍 TENANT VALIDATION":
echo   → Backend running old code
echo   → Restart backend: mvnw.cmd clean package && mvnw.cmd spring-boot:run
echo.
echo If you see "Login denied" but HTTP was 200:
echo   → Browser is using cached session
echo   → Test in Incognito mode
echo.

pause
