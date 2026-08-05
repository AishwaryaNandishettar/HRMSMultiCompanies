# ========================================================
# FIX EMPLOYEE DIRECTORY - PowerShell Version
# ========================================================

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  FIX EMPLOYEE DIRECTORY - CompanyId Sync" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will fix the employee directory mismatch by:" -ForegroundColor Yellow
Write-Host "  1. Connecting to MongoDB" -ForegroundColor Yellow
Write-Host "  2. Updating all employees to same companyId" -ForegroundColor Yellow
Write-Host "  3. Updating all users to same companyId" -ForegroundColor Yellow
Write-Host ""

# Check if mongosh is available
Write-Host "Checking for MongoDB Shell (mongosh)..." -ForegroundColor Cyan
$mongoshPath = Get-Command mongosh -ErrorAction SilentlyContinue

if (-not $mongoshPath) {
    Write-Host "ERROR: mongosh not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install MongoDB Shell:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.mongodb.com/try/download/shell" -ForegroundColor White
    Write-Host "2. Or run: winget install MongoDB.Shell" -ForegroundColor White
    Write-Host ""
    Write-Host "Alternatively, use MongoDB Compass to run the commands manually." -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "Manual Fix Using MongoDB Compass:" -ForegroundColor Cyan
    Write-Host "1. Open MongoDB Compass" -ForegroundColor White
    Write-Host "2. Connect to: mongodb://localhost:27017" -ForegroundColor White
    Write-Host "3. Select database: Data_base_hrms" -ForegroundColor White
    Write-Host "4. Go to 'employees' collection" -ForegroundColor White
    Write-Host "5. Click the 'Update' tab and run:" -ForegroundColor White
    Write-Host ""
    Write-Host '   Filter: {}' -ForegroundColor Green
    Write-Host '   Update: { $set: { companyId: "omoikaneinnovations" } }' -ForegroundColor Green
    Write-Host '   Options: Check "Update multiple documents"' -ForegroundColor Green
    Write-Host ""
    Write-Host "6. Repeat for 'users' collection with filter:" -ForegroundColor White
    Write-Host '   Filter: { role: { $ne: "ADMIN" } }' -ForegroundColor Green
    Write-Host '   Update: { $set: { companyId: "omoikaneinnovations" } }' -ForegroundColor Green
    Write-Host ""
    
    pause
    exit 1
}

Write-Host "✓ mongosh found at: $($mongoshPath.Source)" -ForegroundColor Green
Write-Host ""

# Run the MongoDB script
Write-Host "Running MongoDB fix script..." -ForegroundColor Cyan
Write-Host ""

$scriptPath = Join-Path $PSScriptRoot "fix_employee_companyid.js"

if (-not (Test-Path $scriptPath)) {
    Write-Host "ERROR: fix_employee_companyid.js not found!" -ForegroundColor Red
    Write-Host "Expected location: $scriptPath" -ForegroundColor Yellow
    pause
    exit 1
}

try {
    mongosh "mongodb://localhost:27017/Data_base_hrms" $scriptPath
    
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host "  FIX COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Restart your backend server (Ctrl+C, then run 'mvn spring-boot:run')" -ForegroundColor White
    Write-Host "  2. Clear browser cache (F12 > Application > Clear site data)" -ForegroundColor White
    Write-Host "  3. Login and check Employee Directory" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "ERROR: Failed to run MongoDB script" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
}

pause
