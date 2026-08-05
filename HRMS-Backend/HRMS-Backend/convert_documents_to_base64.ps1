# PowerShell Script to Convert Documents to Base64
# Run this in PowerShell: .\convert_documents_to_base64.ps1

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   Document to Base64 Converter for HRMS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Base path to uploaded files
$basePath = "HRMS-Backend\uploads\tasks"

# Check if directory exists
if (-not (Test-Path $basePath)) {
    Write-Host "❌ Directory not found: $basePath" -ForegroundColor Red
    Write-Host "Please run this script from HRMSProject folder" -ForegroundColor Yellow
    exit
}

# List all files
Write-Host "📁 Files found in uploads folder:" -ForegroundColor Green
Get-ChildItem $basePath | ForEach-Object { Write-Host "   - $($_.Name)" }
Write-Host ""

# Function to convert file to Base64
function Convert-ToBase64 {
    param (
        [string]$FilePath,
        [string]$DocName
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "❌ File not found: $FilePath" -ForegroundColor Red
        return $null
    }
    
    Write-Host "🔄 Converting $DocName..." -ForegroundColor Yellow
    
    # Read file bytes
    $bytes = [System.IO.File]::ReadAllBytes($FilePath)
    
    # Convert to Base64
    $base64 = [System.Convert]::ToBase64String($bytes)
    
    # Get file extension
    $extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
    
    # Determine MIME type
    $mimeType = switch ($extension) {
        ".pdf" { "application/pdf" }
        ".docx" { "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
        ".doc" { "application/msword" }
        ".jpg" { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".png" { "image/png" }
        default { "application/octet-stream" }
    }
    
    # Create data URL
    $dataUrl = "data:$mimeType;base64,$base64"
    
    # File size
    $sizeKB = [math]::Round($bytes.Length / 1024, 2)
    $sizeMB = [math]::Round($bytes.Length / (1024 * 1024), 2)
    
    Write-Host "✅ Converted successfully!" -ForegroundColor Green
    Write-Host "   Size: $sizeKB KB ($sizeMB MB)" -ForegroundColor Gray
    Write-Host "   MIME: $mimeType" -ForegroundColor Gray
    Write-Host ""
    
    return $dataUrl
}

# Aishwarya's documents (update file names based on what you see)
$documents = @{
    "Resume" = "f441508b-7233-4acc-8653-a3ec13566be4.docx"
    "PAN" = "0a601170-eca1-4e5a-821f-c85494151fe8.pdf"
    "Aadhaar" = "765e956f-710a-4ece-ac13-f73a354b4fc6.pdf"
    "OfferLetter" = "62f69765-ba42-4287-96d3-9012bf347

15e.pdf"
    "Experience" = "886d3dfc-e50f-48f3-8f4a-ee1c9a718352.docx"
    "PaySlips" = "87f0d055-cc5d-4358-8ab3-df1461ca3659.pdf"
    "Education" = "d04d520c-93b3-4bbe-9cb8-9e5367f6be32.pdf"
    "Relieving" = "4abec310-3a45-407f-a89c-b16f3236cff.pdf"
}

$results = @{}

# Convert each document
foreach ($doc in $documents.GetEnumerator()) {
    $filePath = Join-Path $basePath $doc.Value
    $base64Data = Convert-ToBase64 -FilePath $filePath -DocName $doc.Key
    
    if ($base64Data) {
        $results[$doc.Key] = $base64Data
    }
}

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   Conversion Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Generate MongoDB update script
$mongoScript = @"
// MongoDB Script to Update Aishwarya's Documents
// Copy and paste this into MongoDB Compass → MONGOSH

// Update Employee record
db.employees.updateOne(
  { email: "aishushettar9@gmail.com" },
  {
    `$set: {
      resumeDocument: "$($results['Resume'])",
      panDocument: "$($results['PAN'])",
      aadhaarDocument: "$($results['Aadhaar'])",
      offerLetterDocument: "$($results['OfferLetter'])",
      educationDocument: "$($results['Education'])"
    }
  }
);

console.log("✅ Employee documents updated");

// Update Onboarding record
db.onboarding_records.updateOne(
  { "personal.email": "aishushettar9@gmail.com" },
  {
    `$set: {
      "documents.resume": "$($results['Resume'])",
      "documents.pan": "$($results['PAN'])",
      "documents.aadhaar": "$($results['Aadhaar'])",
      "documents.offerLetter": "$($results['OfferLetter'])",
      "documents.education": "$($results['Education'])",
      "documents.experience": "$($results['Experience'])",
      "documents.paySlips": "$($results['PaySlips'])",
      "documents.relieving": "$($results['Relieving'])"
    }
  }
);

console.log("✅ Onboarding record updated");
console.log("✅ Documents are now viewable in Profile and BGV pages");
"@

# Save MongoDB script to file
$mongoScriptPath = "update_aishwarya_documents.js"
$mongoScript | Out-File -FilePath $mongoScriptPath -Encoding UTF8

Write-Host "📝 MongoDB update script saved to: $mongoScriptPath" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open MongoDB Compass" -ForegroundColor White
Write-Host "2. Connect to your database" -ForegroundColor White
Write-Host "3. Click MONGOSH at the bottom" -ForegroundColor White
Write-Host "4. Copy contents of $mongoScriptPath" -ForegroundColor White
Write-Host "5. Paste and run in MONGOSH" -ForegroundColor White
Write-Host "6. Documents will be viewable in Profile page!" -ForegroundColor White
Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green
