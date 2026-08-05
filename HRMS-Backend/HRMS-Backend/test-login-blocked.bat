@echo off
echo ========================================
echo Testing Tenant Isolation
echo ========================================
echo.
echo This will test if Aishwarya is blocked from TalentHub Solutions
echo.

echo Testing login attempt...
echo.

curl -X POST http://localhost:8082/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"Aishwarya@company.com\",\"password\":\"admin123\",\"tenantId\":\"company-a\"}" ^
  -w "\nHTTP Status: %%{http_code}\n"

echo.
echo ========================================
echo Expected Results:
echo ========================================
echo HTTP Status: 403 (Forbidden)
echo Message: "Access denied: You do not have permission..."
echo.
echo If you see HTTP Status: 200 - Login was NOT blocked (problem still exists)
echo If you see HTTP Status: 403 - Login was blocked (SUCCESS!)
echo.

pause
