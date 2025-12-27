@echo off
chcp 65001 >nul
echo ========================================
echo Autoblow Ultra AI - Setup ^& Build Tool
echo ========================================
echo.

:: Configuration
set "PROJECT_DIR=%CD%"
set "GIT_REPO=https://github.com/ministerofsalt-cell/autoblow-desktop-app.git"

:: Check prerequisites
echo [1/8] Checking prerequisites...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not found.
    pause
    exit /b 1
)

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH.
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo ^[32m✓ Node.js, npm, and Git are installed^[0m

:: Setup repository
echo.
echo [2/8] Setting up Git repository...
if exist ".git" (
    echo Repository already exists. Pulling latest changes...
    git pull origin main
    if %errorlevel% neq 0 (
        echo ^[33mWarning: Could not pull latest changes. Continuing with existing code.^[0m
    )
) else (
    echo Cloning repository from GitHub...
    git clone %GIT_REPO% .
    if %errorlevel% neq 0 (
        echo ^[31mERROR: Failed to clone repository.^[0m
        pause
        exit /b 1
    )
)
echo ^[32m✓ Repository setup complete^[0m

:: Verify package.json exists
echo.
echo [3/8] Verifying package.json...
if not exist "package.json" (
    echo ^[31mERROR: package.json not found!^[0m
    pause
    exit /b 1
)
echo ^[32m✓ Found package.json^[0m

:: Clean install
echo.
echo [4/8] Installing dependencies...
echo This may take several minutes...

:: Remove old modules for clean install
if exist "node_modules" (
    echo ^[33mFound existing node_modules. Cleaning...^[0m
    rmdir /s /q node_modules 2>nul
    del package-lock.json 2>nul
)

:: Install core dependencies
echo Installing Electron and core packages...
call npm install
if %errorlevel% neq 0 (
    echo ^[31mERROR: Failed to install dependencies^[0m
    pause
    exit /b 1
)

echo ^[32m✓ Dependencies installed^[0m

:: Fix security vulnerabilities
echo.
echo [5/8] Fixing security vulnerabilities...
echo Running npm audit...
call npm audit 2>nul
echo Attempting to fix vulnerabilities...
call npm audit fix 2>nul
if %errorlevel% neq 0 (
    echo ^[33mSome vulnerabilities may require manual attention^[0m
)

:: Rebuild native modules
echo.
echo [6/8] Rebuilding native modules...
echo Rebuilding better-sqlite3 (this may take a minute)...
call npx electron-rebuild 2>nul
if %errorlevel% neq 0 (
    echo ^[33mNote: Some native modules may need manual compilation^[0m
)

:: Test the app
echo.
echo [7/8] Testing the application...
echo.
set /p test_choice="Do you want to test the app before building? (y/n): "
if /i "%test_choice%"=="y" (
    echo Starting Electron app... (Close the window to continue)
    call npm start
)

:: Build the app
echo.
echo [8/8] Building the .exe file...
echo ^[34mThis will take several minutes...^[0m
echo.

call npm run dist
if %errorlevel% neq 0 (
    echo ^[31mERROR: Build failed!^[0m
    echo Check the error messages above.
    pause
    exit /b 1
)

:: Success!
echo.
echo ========================================
echo ^[32mBUILD SUCCESSFUL!^[0m
echo ========================================
echo.
echo Your .exe installer is in the 'dist' folder:
dir "%PROJECT_DIR%\dist\*.exe" /b 2>nul
echo.
echo Full path: %PROJECT_DIR%\dist\
echo.
echo ^[33mNext steps:^[0m
echo 1. Test the installer on a clean Windows machine
echo 2. Verify all features work correctly
echo 3. Distribute to users
echo.
pause
