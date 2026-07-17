@echo off
echo ========================================
echo FORCING DATABASE UPDATE
echo ========================================
echo.
echo This will UPDATE Aishwarya's companyId RIGHT NOW
echo.

echo Connecting to MongoDB...
mongosh --quiet --eval "use hrms_db; db.users.updateOne({email:'Aishwarya@company.com'},{$set:{companyId:'omoikaneinnovations'}}); var user=db.users.findOne({email:'Aishwarya@company.com'},{email:1,companyId:1,_id:0}); print('Email: '+user.email); print('CompanyId: '+(user.companyId||'NOT SET')); if(user.companyId==='omoikaneinnovations'){print('✅ SUCCESS - CompanyId is correct');}else{print('❌ FAILED - CompanyId is wrong');}"

echo.
echo ========================================
echo.
echo If you see "✅ SUCCESS", the database is fixed.
echo.
echo Now you MUST restart the backend:
echo   1. Stop backend (Ctrl+C in backend terminal)
echo   2. cd HRMS-Backend
echo   3. mvnw.cmd clean package
echo   4. mvnw.cmd spring-boot:run
echo.
echo After backend restarts, check backend console for:
echo   "🔍 TENANT VALIDATION"
echo.
echo If you DON'T see that message, the backend didn't
echo restart with the new code.
echo.

pause
