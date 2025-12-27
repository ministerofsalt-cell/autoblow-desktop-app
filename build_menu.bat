@echo off
echo ========================================
echo Autoblow Ultra AI - Setup ^& Build Tool
echo ========================================
echo.

:: Set project directory
set PROJECT_DIR=C:\Users\LCGzP\Documents\autoblow-ultra-ai-app

:: Go to project folder
cd /d "%PROJECT_DIR%"

:: Check if we're in the right place
echo Current directory: %cd%
echo.

:menu
echo What do you want to do?
echo 1. Setup project from GitHub
echo 2. Install dependencies
echo 3. Test the app
echo 4. Build .exe file
echo 5. Do everything (1-4)
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto install
if "%choice%"=="3" goto test
if "%choice%"=="4" goto build
if "%choice%"=="5" goto everything
if "%choice%"=="6" exit

echo Invalid choice! Try again.
echo.
goto menu

:setup
echo.
echo ======= SETTING UP PROJECT =======
echo.
echo Checking if Git is installed...
git --version
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo.
echo Setting up from GitHub...
if exist ".git" (
    echo Already a Git repository. Pulling updates...
    git pull
) else (
    echo Cloning repository...
    git clone https://github.com/ministerofsalt-cell/autoblow-desktop-app.git .
)

echo.
echo Setup complete!
pause
goto menu

:install
echo.
echo ======= INSTALLING DEPENDENCIES =======
echo.
echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Installing dependencies (this may take a few minutes)...
echo.
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo Running security audit fix...
call npm audit fix

echo.
echo Rebuilding native modules...
call npx electron-rebuild

echo.
echo Dependencies installed successfully!
pause
goto menu

:test
echo.
echo ======= TESTING THE APP =======
echo.
echo Starting the app...
echo If it works, you should see an Electron window.
echo.
call npm start
if errorlevel 1 (
    echo ERROR: Failed to start the app!
    echo Make sure dependencies are installed first.
    pause
)
goto menu

:build
echo.
echo ======= BUILDING .EXE FILE =======
echo.
echo This will take several minutes...
echo.

echo Installing electron-builder if needed...
call npm install --save-dev electron-builder

echo.
echo Building executable...
echo.
call npm run dist

if errorlevel 1 (
    echo ERROR: Build failed!
    echo Check the error messages above.
    pause
    goto menu
)

echo.
echo ======= BUILD SUCCESSFUL! =======
echo.
echo Your .exe file is in the 'dist' folder:
dir dist\*.exe /b 2>nul
echo.
echo Full path: %PROJECT_DIR%\dist\
pause
goto menu

:everything
echo.
echo ======= DOING EVERYTHING =======
echo.

echo Step 1: Setting up project...
call :setup
if errorlevel 1 exit /b 1

echo.
echo Step 2: Installing dependencies...
call :install
if errorlevel 1 exit /b 1

echo.
echo Step 3: Testing app (optional - press Ctrl+C to skip)...
timeout /t 5

echo.
echo Step 4: Building .exe...
call :build
if errorlevel 1 exit /b 1

echo.
echo ======= ALL STEPS COMPLETE! =======
pause
goto menu
