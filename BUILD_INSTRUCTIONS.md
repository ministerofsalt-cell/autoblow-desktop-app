# 🚀 Build Instructions - Autoblow Desktop App

## IMPORTANT: Updated Instructions from DeepSeek Debugging

These instructions have been updated based on extensive debugging sessions to fix all build issues.

---

## Quick Start (Recommended)

### Option 1: Use the Automated Batch File

1. **Download and run `setup_and_build.bat`** (included in the repository)
2. **Double-click** the file
3. **Follow the prompts**
4. Your `.exe` will be in the `dist/` folder

### Option 2: Manual Setup (Step-by-Step)

```bash
# Step 1: Clone the repository
git clone https://github.com/ministerofsalt-cell/autoblow-desktop-app.git
cd autoblow-desktop-app

# Step 2: Install dependencies (this may take 3-5 minutes)
npm install

# Step 3: Fix security vulnerabilities
npm audit fix

# Step 4: Rebuild native modules for Electron
npx electron-rebuild

# Step 5: Test the app
npm start

# Step 6: Build the .exe installer
npm run dist
```

---

## Prerequisites

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | 18.x or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x or higher | Included with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **Python** | 3.11 or higher | [python.org](https://www.python.org/) |

### Verify Installation

```bash
# Check Node.js version
node --version
# Should show: v18.x.x or higher

# Check npm version
npm --version
# Should show: 9.x.x or higher

# Check Git
git --version
# Should show: git version x.x.x

# Check Python
python --version
# Should show: Python 3.11.x or higher
```

---

## Step-by-Step Build Process

### Step 1: Clone the Repository

```bash
# Create a project folder (NOT on Desktop!)
mkdir C:\Users\YourName\Documents\autoblow-desktop-app
cd C:\Users\YourName\Documents\autoblow-desktop-app

# Clone the repository
git clone https://github.com/ministerofsalt-cell/autoblow-desktop-app.git .
```

**⚠️ IMPORTANT:** Do NOT run npm commands directly on your Desktop. Always work in a proper project folder.

---

### Step 2: Install Dependencies

```bash
# Install all dependencies from package.json
npm install
```

**Expected output:**
- ~200-300 packages will be installed
- Takes approximately 3-5 minutes
- Total size: ~200-300 MB

**If you see warnings about vulnerabilities:**
```bash
npm audit
npm audit fix
```

---

### Step 3: Fix Security Issues

**CRITICAL:** The `wcjs-prebuilt` package has been REMOVED from this project due to severe security vulnerabilities.

The updated `package.json` now uses:
- ✅ Native Electron video APIs
- ✅ Modern, maintained packages
- ✅ No deprecated dependencies

Run security audit:
```bash
npm audit
npm audit fix
```

---

### Step 4: Rebuild Native Modules

Some packages like `better-sqlite3` need to be compiled for Electron:

```bash
# Install electron-rebuild if not already installed
npm install --save-dev electron-rebuild

# Rebuild native modules
npx electron-rebuild
```

This step is CRITICAL for the app to work correctly.

---

### Step 5: Install Python Dependencies

For the AI funscript generation backend:

```bash
# Navigate to Python backend
cd backend/python

# Install Python requirements
pip install -r requirements.txt

# Return to project root
cd ../..
```

---

### Step 6: Test the Application

Before building, test that everything works:

```bash
npm start
```

**Expected behavior:**
- Electron window opens
- UI loads correctly
- No console errors
- Video playback works (if you load a video)
- Device connection interface is functional

If the app doesn't start, check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file.

---

### Step 7: Build the .exe Installer

```bash
# Build Windows installer
npm run dist
```

**Build process:**
- Takes 5-10 minutes (first time)
- Subsequent builds are faster (~2-3 minutes)
- Creates output in `dist/` folder

**Output files:**
```
dist/
├── Autoblow Ultra AI Setup 1.0.0.exe  ← YOUR INSTALLER
├── win-unpacked/                      ← Unpacked app files
└── latest.yml                         ← Auto-update config
```

---

## Build Configuration

The `package.json` includes the following build configuration:

```json
{
  "build": {
    "appId": "com.autoblow.desktop",
    "productName": "Autoblow Ultra AI",
    "directories": {
      "output": "dist"
    },
    "win": {
      "target": ["nsis", "portable"],
      "icon": "assets/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    },
    "extraResources": [
      {
        "from": "backend/python",
        "to": "python",
        "filter": ["**/*"]
      }
    ]
  }
}
```

---

## Alternative Build Commands

```bash
# Create unpacked build for testing (faster)
npm run pack

# Build portable .exe (no installer)
npm run build:portable

# Build for both 32-bit and 64-bit Windows
npm run build:msi
```

---

## Common Issues & Solutions

### Issue 1: "Missing script: build"
**Solution:** The package.json has been updated with proper build scripts. Pull latest changes:
```bash
git pull origin main
npm install
```

### Issue 2: "ENOENT: no such file or directory, open 'package.json'"
**Solution:** You're running npm commands in the wrong directory. Make sure you're in the project folder:
```bash
cd C:\Users\YourName\Documents\autoblow-desktop-app
```

### Issue 3: Security vulnerabilities
**Solution:** The deprecated `wcjs-prebuilt` package has been removed. Run:
```bash
npm audit fix
npm audit fix --force  # For critical issues
```

### Issue 4: Native module errors (better-sqlite3)
**Solution:** Rebuild native modules:
```bash
npx electron-rebuild
```

### Issue 5: Build fails - out of memory
**Solution:** Increase Node.js memory:
```bash
# Windows Command Prompt
set NODE_OPTIONS=--max_old_space_size=4096
npm run dist

# Windows PowerShell
$env:NODE_OPTIONS="--max_old_space_size=4096"
npm run dist
```

For more detailed troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

---

## Testing Your Build

### Test the Installer

1. **Locate your installer:**
   ```
   C:\Users\YourName\Documents\autoblow-desktop-app\dist\Autoblow Ultra AI Setup 1.0.0.exe
   ```

2. **Test on a clean Windows machine** (if possible)

3. **Verify:**
   - ✅ Installer runs without errors
   - ✅ App installs to correct location
   - ✅ Desktop shortcut created
   - ✅ Start menu entry created
   - ✅ App launches successfully
   - ✅ Video playback works
   - ✅ Device connection works

---

## Distribution Checklist

- [ ] App runs correctly in development mode (`npm start`)
- [ ] All features tested and working
- [ ] No console errors or warnings
- [ ] Build completes without errors (`npm run dist`)
- [ ] Installer tested on clean Windows 10/11 machine
- [ ] File size is reasonable (~200-400 MB for installer)
- [ ] (Optional) Code sign the .exe with a certificate
- [ ] Create release notes
- [ ] Upload to GitHub Releases or distribution platform

---

## File Structure After Build

```
autoblow-desktop-app/
├── dist/
│   ├── Autoblow Ultra AI Setup 1.0.0.exe  ← FINAL INSTALLER
│   ├── win-unpacked/                      ← Unpacked app
│   └── latest.yml                         ← Update manifest
├── backend/
│   ├── node/                              ← Node.js backend
│   └── python/                            ← Python AI processor
├── renderer/
│   ├── index.html                         ← Main UI
│   ├── renderer.js                        ← UI logic
│   └── styles.css                         ← Styling
├── main.js                                ← Electron main process
├── package.json                           ← Dependencies & build config
├── BUILD_INSTRUCTIONS.md                  ← This file
├── TROUBLESHOOTING.md                     ← Detailed troubleshooting
└── setup_and_build.bat                    ← Automated setup script
```

---

## Installation Path

After building and installing, the app will be located at:
```
C:\Users\[YourName]\AppData\Local\Programs\autoblow-ultra-ai
```

---

## Success! 🎉

You now have a working Windows executable installer!

**Next steps:**
1. Test the installer on multiple Windows machines
2. Gather user feedback
3. Iterate on features
4. (Optional) Set up code signing for professional distribution
5. (Optional) Submit to Microsoft Store

---

## Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs/latest/)
- [electron-builder Documentation](https://www.electron.build/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Troubleshooting](https://docs.npmjs.com/)
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Detailed solutions to all known issues

---

## Need Help?

- **Issues:** [GitHub Issues](https://github.com/ministerofsalt-cell/autoblow-desktop-app/issues)
- **Troubleshooting:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Updates:** Check this file regularly for latest instructions

---

*Last Updated: December 27, 2025*  
*Based on: DeepSeek debugging sessions and successful builds*
