$testEmail = "aishushettar95@gmail.com"
$apiUrl = "http://localhost:8082/api/onboarding/invite"

$body = @{
    email = $testEmail
    fullName = "Test User"
    department = "IT"
    designation = "Developer"
} | ConvertTo-Json

Write-Host "Testing email to: $testEmail"

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json"
    Write-Host "Success: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
