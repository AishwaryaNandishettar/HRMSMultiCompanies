# PowerShell Script to Sync Employee Data from Production to Local MongoDB
# This fetches employee data from your production backend and updates local MongoDB

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "  Sync Employee Data: Production → Local MongoDB" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""

# Configuration
$PRODUCTION_API = "https://latestfinalhrmsapplication.onrender.com"
$LOCAL_MONGO = "mongodb://localhost:27017"
$DATABASE = "Data_base_hrms"
$COLLECTION = "employees"

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "   Production API: $PRODUCTION_API"
Write-Host "   Local MongoDB:  $LOCAL_MONGO"
Write-Host "   Database:       $DATABASE"
Write-Host ""

# Step 1: Fetch employee data from production
Write-Host "📥 Step 1: Fetching employee data from production..." -ForegroundColor Yellow

$TOKEN = Read-Host "Enter your JWT token (get from localStorage in browser)"

if ([string]::IsNullOrWhiteSpace($TOKEN)) {
    Write-Host "❌ Error: Token is required!" -ForegroundColor Red
    Write-Host ""
    Write-Host "How to get token:" -ForegroundColor Cyan
    Write-Host "1. Open your production site: https://omoi-hrms.vercel.app"
    Write-Host "2. Login"
    Write-Host "3. Press F12 (Developer Tools)"
    Write-Host "4. Go to Console tab"
    Write-Host "5. Type: localStorage.getItem('token')"
    Write-Host "6. Copy the token (without quotes)"
    Write-Host ""
    pause
    exit
}

try {
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$PRODUCTION_API/api/employee/all" -Headers $headers -Method Get
    
    Write-Host "✅ Fetched $($response.Count) employees from production" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "❌ Error fetching from production: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible causes:" -ForegroundColor Yellow
    Write-Host "- Invalid or expired token"
    Write-Host "- Production backend is down"
    Write-Host "- Network connection issue"
    Write-Host ""
    pause
    exit
}

# Step 2: Generate MongoDB update script
Write-Host "📝 Step 2: Generating MongoDB update script..." -ForegroundColor Yellow

$updateScript = @"
// Auto-generated MongoDB Update Script
// Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

use $DATABASE

print("=".repeat(60));
print("Updating $($response.Count) employees...");
print("=".repeat(60));

"@

foreach ($emp in $response) {
    $safeName = $emp.fullName -replace "'", "''"
    $updateScript += @"

// Update: $($emp.employeeId) - $($emp.fullName)
db.$COLLECTION.updateOne(
    { employeeId: "$($emp.employeeId)" },
    { `$set: { 
        fullName: "$safeName",
        email: "$($emp.email)",
        department: "$($emp.department)",
        designation: "$($emp.designation)",
        status: "$($emp.status)"
    }}
);
print("✅ Updated: $($emp.employeeId) - $safeName");

"@
}

$updateScript += @"

print("\n=".repeat(60));
print("✅ Update complete!");
print("=".repeat(60));
print("\nUpdated employees:");
db.$COLLECTION.find({}, {employeeId: 1, fullName: 1}).forEach(emp => {
    print("  " + emp.employeeId + ": " + emp.fullName);
});
"@

# Save script
$scriptPath = ".\update-employees-generated.js"
$updateScript | Out-File -FilePath $scriptPath -Encoding UTF8

Write-Host "✅ Generated update script: $scriptPath" -ForegroundColor Green
Write-Host ""

# Step 3: Show instructions
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "  Next Steps" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Using mongosh (MongoDB Shell)" -ForegroundColor Yellow
Write-Host "  1. Open Command Prompt or PowerShell"
Write-Host "  2. Run: mongosh"
Write-Host "  3. Run: load('$scriptPath')"
Write-Host ""
Write-Host "Option 2: Using MongoDB Compass" -ForegroundColor Yellow
Write-Host "  1. Open MongoDB Compass"
Write-Host "  2. Connect to: $LOCAL_MONGO"
Write-Host "  3. Select database: $DATABASE"
Write-Host "  4. Click 'Open MongoDB Shell' at bottom"
Write-Host "  5. Copy-paste the content of: $scriptPath"
Write-Host "  6. Press Enter"
Write-Host ""
Write-Host "Option 3: Direct Command Line" -ForegroundColor Yellow
Write-Host "  Run: mongosh --file $scriptPath"
Write-Host ""
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 Employee Summary:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Employee ID          Full Name" -ForegroundColor Cyan
Write-Host "  " + ("-" * 50) -ForegroundColor DarkGray
foreach ($emp in $response | Select-Object -First 10) {
    Write-Host ("  {0,-20} {1}" -f $emp.employeeId, $emp.fullName)
}
if ($response.Count -gt 10) {
    Write-Host "  ... and $($response.Count - 10) more employees"
}
Write-Host ""

$choice = Read-Host "Do you want to execute the update script now? (Y/N)"

if ($choice -eq 'Y' -or $choice -eq 'y') {
    Write-Host ""
    Write-Host "📤 Executing MongoDB update..." -ForegroundColor Yellow
    
    try {
        $result = & mongosh --quiet --file $scriptPath 2>&1
        Write-Host $result
        Write-Host ""
        Write-Host "✅ Update executed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔄 Next: Refresh your browser at http://localhost:5173/employee-card" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Error executing script: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please run the script manually using one of the options above." -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "⏭️  Skipped execution. Run the script manually when ready." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✨ Done!" -ForegroundColor Green
Write-Host ""
pause
