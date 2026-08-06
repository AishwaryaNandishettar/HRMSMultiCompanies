# PowerShell script to test email sending endpoint

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Testing HRMS Email Endpoint" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test data
$testEmail = "aishushettar95@gmail.com"  # Change this to your test email
$apiUrl = "http://localhost:8082/api/onboarding/invite"

$body = @{
    email = $testEmail
    fullName = "Test User"
    department = "IT"
    designation = "Developer"
    password = "TestPassword123"
} | ConvertTo-Json

Write-Host "Testing API: $apiUrl" -ForegroundColor Yellow
Write-Host "Sending invite to: $testEmail" -ForegroundColor Yellow
Write-Host ""

try {
    # Make the API call
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $response" -ForegroundColor Green
    Write-Host ""
    Write-Host "📧 Check your email inbox: $testEmail" -ForegroundColor Cyan
    Write-Host "   (Also check spam folder)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error: $errorBody" -ForegroundColor Red
        } catch {
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "⚠️  Is the backend running?" -ForegroundColor Yellow
        Write-Host "   Start it with: mvnw spring-boot:run" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
