# Safety check
Write-Host "Starting ChaiPod Migration to pure Frontend at Root..." -ForegroundColor Cyan

# 1. Clean backend files
$backendFiles = @("package.json", "package-lock.json", "server.js", "db.js", "chaiopod.db", "chaiopod.db-shm", "chaiopod.db-wal")
foreach ($file in $backendFiles) {
    if (Test-Path $file) {
        Write-Host "Removing $file..." -ForegroundColor Yellow
        Remove-Item -Force $file
    }
}

# 2. Clean backend node_modules
if (Test-Path "node_modules") {
    Write-Host "Removing root node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules"
}

# 3. Move all items from frontend to root
if (Test-Path "frontend") {
    Write-Host "Moving frontend files to root..." -ForegroundColor Green
    Get-ChildItem -Path "frontend" -Force | ForEach-Object {
        Write-Host "Moving $($_.Name)..."
        Move-Item -Path $_.FullName -Destination "." -Force
    }

    # 4. Remove empty frontend folder
    Write-Host "Removing empty frontend folder..." -ForegroundColor Green
    Remove-Item -Recurse -Force "frontend"
}

Write-Host "Migration Complete! The workspace is now a pure React Vite frontend application." -ForegroundColor Cyan
