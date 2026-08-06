Write-Host "================================" -ForegroundColor Cyan
Write-Host "Gmail SMTP Connection Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Can we reach smtp.gmail.com?
Write-Host "[Test 1] Checking if smtp.gmail.com is reachable..." -ForegroundColor Yellow
try {
    $result = Test-NetConnection -ComputerName "smtp.gmail.com" -Port 587 -WarningAction SilentlyContinue
    if ($result.TcpTestSucceeded) {
        Write-Host "✅ PASS: Can reach smtp.gmail.com on port 587" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL: Cannot reach smtp.gmail.com on port 587" -ForegroundColor Red
        Write-Host "   This might be a firewall issue" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ FAIL: Network error" -ForegroundColor Red
}

Write-Host ""

# Test 2: Can we reach backend?
Write-Host "[Test 2] Checking if backend is running..." -ForegroundColor Yellow
try {
    $result = Test-NetConnection -ComputerName "localhost" -Port 8082 -WarningAction SilentlyContinue
    if ($result.TcpTestSucceeded) {
        Write-Host "✅ PASS: Backend is running on port 8082" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL: Backend is not running" -ForegroundColor Red
        Write-Host "   Start it with: mvnw spring-boot:run" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAIL: Cannot check backend" -ForegroundColor Red
}

Write-Host ""

# Test 3: Test API endpoint
Write-Host "[Test 3] Testing email API endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        email = "aishushettar95@gmail.com"
        fullName = "Test User"
        department = "IT"
        designation = "Developer"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:8082/api/onboarding/invite" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "✅ PASS: API endpoint works" -ForegroundColor Green
    Write-Host "   Response: $response" -ForegroundColor Green
    Write-Host ""
    Write-Host "   📧 Check inbox: aishushettar95@gmail.com" -ForegroundColor Cyan
    Write-Host "   (Also check spam folder)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ FAIL: API returned error" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "   ⚠️  This error tells us what's wrong with email!" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
