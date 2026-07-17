@echo off
echo ========================================
echo Testing All Portals - Tenant Isolation
echo ========================================
echo.
echo This tests if Omoi employees are blocked from all client portals
echo.

echo ========================================
echo TEST 1: TalentHub Solutions (company-a)
echo ========================================
echo URL: http://localhost:5176
echo Testing: Aishwarya@company.com
echo.

curl -X POST http://localhost:8082/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"Aishwarya@company.com\",\"password\":\"admin123\",\"tenantId\":\"company-a\"}" ^
  -w "\nHTTP Status: %%{http_code}\n" ^
  -s

echo.
echo Expected: HTTP 403 - Access denied
echo.

echo ========================================
echo TEST 2: WorkForce Pro (company-b)
echo ========================================
echo URL: http://localhost:5177
echo Testing: Nikita@omoi.com
echo.

curl -X POST http://localhost:8082/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"nikita@omoi.com\",\"password\":\"password123\",\"tenantId\":\"company-b\"}" ^
  -w "\nHTTP Status: %%{http_code}\n" ^
  -s

echo.
echo Expected: HTTP 403 - Access denied
echo.

echo ========================================
echo TEST 3: PeopleSync Enterprise (company-c)
echo ========================================
echo URL: http://localhost:5178
echo Testing: Mahesh@omoi.com
echo.

curl -X POST http://localhost:8082/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"mahesh@omoi.com\",\"password\":\"password123\",\"tenantId\":\"company-c\"}" ^
  -w "\nHTTP Status: %%{http_code}\n" ^
  -s

echo.
echo Expected: HTTP 403 - Access denied
echo.

echo ========================================
echo TEST 4: Another Omoi employee on TalentHub
echo ========================================
echo URL: http://localhost:5176
echo Testing: vishnu@omoi.com
echo.

curl -X POST http://localhost:8082/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"vishnu@omoi.com\",\"password\":\"password123\",\"tenantId\":\"company-a\"}" ^
  -w "\nHTTP Status: %%{http_code}\n" ^
  -s

echo.
echo Expected: HTTP 403 - Access denied
echo.

echo ========================================
echo SUMMARY
echo ========================================
echo.
echo All tests above should show:
echo   - HTTP Status: 403
echo   - Message: "Access denied: You do not have permission..."
echo.
echo If you see HTTP 200 (OK), the user was NOT blocked!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo If any test shows HTTP 200:
echo   1. Check database: mongosh ^< verify-companies.js
echo   2. Restart backend: restart-backend.bat
echo   3. Clear browser cache and test again
echo.

pause
