@echo off
echo Testing Backend Tenant Validation
echo ===================================
echo.
echo This will send a login request WITH tenantId to the backend
echo and show you what the backend returns.
echo.

echo Test 1: Aishwarya to PeopleSync (company-c)
echo ---------------------------------------------
echo.

curl -v -X POST http://localhost:8082/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"Aishwarya@company.com\",\"password\":\"admin123\",\"tenantId\":\"company-c\"}"

echo.
echo.
echo ===================================
echo.
echo Check the response above:
echo.
echo If HTTP 200 (OK) - Login worked (WRONG - tenant validation not running)
echo If HTTP 403 (Forbidden) - Login blocked (CORRECT - tenant validation working)
echo.
echo Also check your backend console logs for:
echo   "TENANT ID: company-c"
echo   "🔍 TENANT VALIDATION:"
echo   "❌ Login denied: Tenant mismatch"
echo.

pause
