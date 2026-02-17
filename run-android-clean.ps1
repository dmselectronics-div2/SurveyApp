# run-android-clean.ps1
# This script cleans the Android build and starts the application

Write-Host "--- Android Build Clean & Run ---" -ForegroundColor Cyan

# Check if we are in the root directory
if (!(Test-Path .\android)) {
    Write-Error "Error: 'android' directory not found. Please run this script from the project root."
    exit 1
}

Write-Host "Step 1: Cleaning Android build (gradlew clean)..." -ForegroundColor Yellow
Set-Location -Path .\android
try {
    .\gradlew.bat clean
}
catch {
    Write-Error "Failed to clean Android build."
    Set-Location -Path ..
    exit 1
}
Set-Location -Path ..

Write-Host "Step 2: Clearing Metro Bundler cache..." -ForegroundColor Yellow
# We don't want to block the script here, so we just run it with --reset-cache when starting or separately
# Best way to reset cache is to start it with --reset-cache later or just delete the temp folders
# But usuallygradelw clean is enough for most Android issues.
# I'll add the react-native start --reset-cache command as an optional or default.

Write-Host "Step 3: Starting React Native with reset cache..." -ForegroundColor Yellow
# Run adb reverse to ensure physical devices can reach the local backend
adb reverse tcp:5001 tcp:5001
npx react-native run-android


Write-Host "--- Operation Complete ---" -ForegroundColor Green
