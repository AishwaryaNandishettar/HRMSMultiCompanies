# PowerShell script to fix EVERYTHING automatically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AUTOMATIC FIX - Block Omoi Employees" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check MongoDB
Write-Host "Step 1: Checking MongoDB..." -ForegroundColor Yellow
try {
    $null = mongosh --eval "db.version()" 2>&1
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} catch {
    Write-Host "❌ MongoDB is not running!" -ForegroundColor Red
    Write-Host "   Please start MongoDB and run this script again" -ForegroundColor Red
    pause
    exit 1
}
Write-Host ""

# Step 2: Update Database
Write-Host "Step 2: Updating database..." -ForegroundColor Yellow
Write-Host "Setting companyId for all Omoi employees..." -ForegroundColor Gray

$mongoCommand = @"
use hrms_db;
db.users.updateMany(
  {email: {`$in: [
    'Aishwarya@company.com',
    'aishwarya@omoi.com',
    'Aishmanager@omoi.com',
    'nikita@omoi.com',
    'nikitaadigennavar@gmail.com',
    'mahesh@omoi.com',
    'vishnu@omoi.com',
    'padmanabh@omoi.com',
    'shambuling@omoi.com',
    'lata@omoi.com'
  ]}},
  {`$set: {companyId: 'omoikaneinnovations'}}
);
print('✅ Updated users');
"@

mongosh --quiet --eval $mongoCommand

Write-Host ""
Write-Host "Verifying Aishwarya..." -ForegroundColor Gray

$verifyCommand = @"
use hrms_db;
var user = db.users.findOne(
  {email: 'Aishwarya@company.com'},
  {email: 1, companyId: 1, _id: 0}
);
if (user) {
  if (user.companyId === 'omoikaneinnovations') {
    print('✅ Aishwarya has correct companyId');
  } else {
    print('❌ ERROR: CompanyId is ' + (user.companyId || 'NOT SET'));
  }
} else {
  print('❌ ERROR: User not found');
}
"@

mongosh --quiet --eval $verifyCommand

Write-Host "✅ Database updated" -ForegroundColor Green
Write-Host ""

# Step 3: Stop Backend
Write-Host "Step 3: Stopping backend..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    $javaProcesses | ForEach-Object {
        Write-Host "  Stopping process $($_.Id)..." -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force
    }
    Start-Sleep -Seconds 2
    Write-Host "✅ Backend stopped" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No running backend found" -ForegroundColor Gray
}
Write-Host ""

# Step 4: Rebuild Backend
Write-Host "Step 4: Rebuilding backend..." -ForegroundColor Yellow
Write-Host "This will take a few minutes..." -ForegroundColor Gray

$backendPath = Join-Path $PSScriptRoot "HRMS-Backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
} else {
    Write-Host "⚠️  HRMS-Backend folder not found, using current directory" -ForegroundColor Yellow
}

if (Test-Path "mvnw.cmd") {
    & .\mvnw.cmd clean install -DskipTests
} elseif (Get-Command mvn -ErrorAction SilentlyContinue) {
    mvn clean install -DskipTests
} else {
    Write-Host "❌ Maven not found!" -ForegroundColor Red
    pause
    exit 1
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend rebuilt successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host ""

# Step 5: Start Backend
Write-Host "Step 5: Starting backend..." -ForegroundColor Yellow
Write-Host "Backend will start now. Watch for 'Started HmrsbackendApplication'" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend Logs (Press Ctrl+C to stop):" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "mvnw.cmd") {
    & .\mvnw.cmd spring-boot:run
} else {
    mvn spring-boot:run
}
