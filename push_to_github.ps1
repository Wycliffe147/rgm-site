#Self-contained PowerShell script for pushing to GitHub
$Host.UI.RawUI.WindowTitle = "Push to GitHub (RGM)"
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "      Pushing changes to GitHub...       " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

Write-Host "Adding files..." -ForegroundColor Yellow
git add .

Write-Host ""
$msg = Read-Host "Enter commit message (or press ENTER for default)"
if ([string]::IsNullOrWhiteSpace($msg)) {
    $msg = "Update website content"
}

# Clean any quotes from message so git CLI parses it safely
$cleanMsg = $msg -replace '"', ''

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "$cleanMsg"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin master

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "      Done! Process finished.            " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Read-Host "Press ENTER to close..."
