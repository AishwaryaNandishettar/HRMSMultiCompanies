@echo off
echo ========================================
echo CRITICAL FIX - Block Omoi Employees
echo ========================================
echo.
echo This will:
echo 1. Update database with company assignments
echo 2. Show you the results
echo.

echo Step 1: Checking if MongoDB is running...
mongosh --eval "db.version()" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MongoDB is not running!
    echo Please start MongoDB first, then run this script again.
    echo.
    pause
    exit /b 1
)
echo MongoDB is running.
echo.

echo Step 2: Updating database...
echo Running database updates...
echo.

mongosh --quiet --eval "use hrms_db; db.users.updateMany({email:{$in:['Aishwarya@company.com','aishwarya@omoi.com','Aishmanager@omoi.com','nikita@omoi.com','nikitaadigennavar@gmail.com','mahesh@omoi.com','vishnu@omoi.com','padmanabh@omoi.com','shambuling@omoi.com','lata@omoi.com']}},{$set:{companyId:'omoikaneinnovations'}}); print('Updated ' + db.users.countDocuments({companyId:'omoikaneinnovations'}) + ' Omoi employees');"

echo.
echo Step 3: Verifying Aishwarya's company assignment...
echo.

mongosh --quiet --eval "use hrms_db; var user=db.users.findOne({email:'Aishwarya@company.com'},{email:1,companyId:1,_id:0}); if(user){print('Email: '+user.email); print('CompanyId: '+(user.companyId||'NOT SET'));}else{print('User not found!');}"

echo.
echo ========================================
echo Database Update Complete
echo ========================================
echo.
echo Next step: RESTART THE BACKEND
echo.
echo Option 1: Run restart-backend.bat
echo Option 2: In your IDE, stop and restart the backend
echo.
echo After backend restarts, try logging in again.
echo Aishwarya should NOT be able to login.
echo.

pause
