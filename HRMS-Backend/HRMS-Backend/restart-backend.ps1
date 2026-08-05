# PowerShell script to restart the backend with tenant validation

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend Restart Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop existing Java processes
Write-Host "Step 1: Stopping existing backend..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "Found $($javaProcesses.Count) Java process(es)" -ForegroundColor Yellow
    $javaProcesses | ForEach-Object {
        Write-Host "  Stopping process $($_.Id)..." -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force
    }
    Write-Host "✅ Backend stopped" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "ℹ️  No running backend found" -ForegroundColor Gray
}

Write-Host ""

# Step 2: Navigate to backend directory
Write-Host "Step 2: Navigating to backend directory..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "HRMS-Backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "✅ In directory: $backendPath" -ForegroundColor Green
} else {
    $backendPath = $PSScriptRoot
    Write-Host "⚠️  Using current directory: $backendPath" -ForegroundColor Yellow
}

Write-Host ""

# Step 3: Clean and rebuild
Write-Host "Step 3: Rebuilding backend..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

if (Test-Path "mvnw.cmd") {
    Write-Host "Using Maven wrapper..." -ForegroundColor Gray
    & .\mvnw.cmd clean install -DskipTests
} elseif (Get-Command mvn -ErrorAction SilentlyContinue) {
    Write-Host "Using global Maven..." -ForegroundColor Gray
    mvn clean install -DskipTests
} else {
    Write-Host "❌ Maven not found! Please install Maven or use mvnw.cmd" -ForegroundColor Red
    exit 1
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend rebuilt successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed! Check the errors above" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 4: Start backend
Write-Host "Step 4: Starting backend with tenant validation..." -ForegroundColor Yellow
Write-Host "Backend logs will appear below..." -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the backend" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "mvnw.cmd") {
    & .\mvnw.cmd spring-boot:run
} else {
    mvn spring-boot:run
}
