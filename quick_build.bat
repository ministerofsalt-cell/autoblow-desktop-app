@echo off
echo Autoblow Ultra AI - Quick Build
echo ================================
echo.

cd /d "C:\Users\LCGzP\Documents\autoblow-ultra-ai-app"

echo Step 1: Get code from GitHub
if not exist "main.js" (
    git clone https://github.com/ministerofsalt-cell/autoblow-desktop-app.git .
)

echo.
echo Step 2: Install dependencies
call npm install

echo.
echo Step 3: Fix security vulnerabilities
call npm audit fix

echo.
echo Step 4: Rebuild native modules
call npx electron-rebuild

echo.
echo Step 5: Build .exe file
call npm install --save-dev electron-builder

echo.
echo Building... (this will take a while)
call npm run dist

if exist "dist\*.exe" (
    echo.
    echo SUCCESS! Executable created:
    dir dist\*.exe /b
    echo.
    echo Full path: %cd%\dist\
) else (
    echo.
    echo ERROR: Build failed!
    echo Check the error messages above.
)

echo.
pause
