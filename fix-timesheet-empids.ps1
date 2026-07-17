# Fix Timesheet EMP IDs - Backfill Script
# Run this ONCE to populate all missing empIds in attendance records

Write-Host "🔄 Starting EMP ID backfill..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8082/api/attendance/backfill-empids" -Method POST -UseBasicParsing
    
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Yellow
    Write-Host $response.Content
    Write-Host ""
    Write-Host "✅ Backfill complete! Now refresh your timesheet page." -ForegroundColor Green
    Write-Host "   The EMP IDs should persist even after refresh." -ForegroundColor Green
    
} catch {
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error message:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "  1. Backend is running (mvn spring-boot:run)" -ForegroundColor White
    Write-Host "  2. Backend is on port 8082" -ForegroundColor White
    Write-Host "  3. You're in the correct directory" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
