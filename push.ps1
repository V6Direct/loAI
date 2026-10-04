param(
    [Parameter(Mandatory = $true)]
    [string]$Reason
)

Write-Host "`n=== Git Status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Adding changes ===" -ForegroundColor Cyan
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "git add failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Committing ===" -ForegroundColor Cyan
git commit -m $Reason

if ($LASTEXITCODE -ne 0) {
    Write-Host "git commit failed or there was nothing to commit." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n=== Pushing ===" -ForegroundColor Cyan
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host "git push failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Done! ===" -ForegroundColor Green