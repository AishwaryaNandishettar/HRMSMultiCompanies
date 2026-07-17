@echo off
COLOR 0A
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║         EMERGENCY COMPLETE FIX - DO EVERYTHING NOW            ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo This script will:
echo   1. Update database for ALL Omoi employees
echo   2. Verify the updates
echo   3. Tell you EXACTLY what to do next
echo.
pause
echo.

echo ═══════════════════════════════════════════════════════════════
echo STEP 1: Updating Database
echo ═══════════════════════════════════════════════════════════════
echo.

echo Checking MongoDB connection...
mongosh --eval "db.version()" >nul 2>&1
if %errorlevel% neq 0 (
    COLOR 0C
    echo ❌ ERROR: MongoDB is not running!
    echo.
    echo Please start MongoDB first:
    echo   - Windows Service: net start MongoDB
    echo   - OR start MongoDB manually
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)
echo ✅ MongoDB is connected
echo.

echo Updating Aishwarya@company.com...
mongosh --quiet --eval "use hrms_db; db.users.updateOne({email:'Aishwarya@company.com'},{$set:{companyId:'omoikaneinnovations'}})"
echo.

echo Updating all other Omoi employees...
mongosh --quiet --eval "use hrms_db; db.users.updateMany({email:{$in:['aishwarya@omoi.com','Aishmanager@omoi.com','nikita@omoi.com','nikitaadigennavar@gmail.com','mahesh@omoi.com','vishnu@omoi.com','padmanabh@omoi.com','shambuling@omoi.com','lata@omoi.com']}},{$set:{companyId:'omoikaneinnovations'}})"
echo.

echo Updating all @omoi.com and @company.com emails...
mongosh --quiet --eval "use hrms_db; db.users.updateMany({email:{$regex:'@(omoi|company)\\.com$',$options:'i'}},{$set:{companyId:'omoikaneinnovations'}})"
echo.

echo ═══════════════════════════════════════════════════════════════
echo STEP 2: Verifying Updates
echo ═══════════════════════════════════════════════════════════════
echo.

echo Checking Aishwarya's companyId...
mongosh --quiet --eval "use hrms_db; var u=db.users.findOne({email:'Aishwarya@company.com'},{email:1,companyId:1,_id:0}); if(u){if(u.companyId==='omoikaneinnovations'){print('✅ Aishwarya: companyId = omoikaneinnovations');}else{print('❌ ERROR: companyId = '+(u.companyId||'NOT SET'));}}else{print('❌ ERROR: User not found');}"
echo.

echo Counting Omoi employees...
mongosh --quiet --eval "use hrms_db; var count=db.users.countDocuments({companyId:'omoikaneinnovations'}); print('✅ Total Omoi employees: '+count);"
echo.

echo ═══════════════════════════════════════════════════════════════
echo ✅ DATABASE UPDATE COMPLETE!
echo ═══════════════════════════════════════════════════════════════
echo.
COLOR 0E
echo ⚠️  CRITICAL: YOU MUST NOW RESTART THE BACKEND!
echo.
echo ═══════════════════════════════════════════════════════════════
echo STEP 3: Restart Backend (DO THIS MANUALLY)
echo ═══════════════════════════════════════════════════════════════
echo.
echo 1. Go to the terminal where backend is running
echo.
echo 2. Press: Ctrl + C (to stop backend)
echo.
echo 3. Run these commands:
echo.
COLOR 0A
echo    cd HRMS-Backend
echo    mvnw.cmd clean package -DskipTests
echo    mvnw.cmd spring-boot:run
echo.
COLOR 0E
echo 4. Wait for this message:
echo    "Started HmrsbackendApplication"
echo.
echo 5. Look for these logs when you try to login:
echo    "🔍 TENANT VALIDATION:"
echo    "❌ Login denied: Tenant mismatch"
echo.
COLOR 0A
echo ═══════════════════════════════════════════════════════════════
echo STEP 4: Test Login
echo ═══════════════════════════════════════════════════════════════
echo.
echo After backend restarts:
echo.
echo 1. Open Incognito browser window (Ctrl+Shift+N)
echo.
echo 2. Go to: http://localhost:5178 (or 5176, 5177)
echo.
echo 3. Try to login:
echo    Email: Aishwarya@company.com
echo    Password: admin123
echo.
echo 4. Expected result:
echo    ❌ "Access denied: You do not have permission to access
echo        this company portal."
echo.
echo ═══════════════════════════════════════════════════════════════
echo ✅ IF YOU SEE "ACCESS DENIED" - SUCCESS!
echo ═══════════════════════════════════════════════════════════════
echo.
COLOR 0F
pause
