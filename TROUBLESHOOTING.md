# 🔧 Troubleshooting Guide - Autoblow Desktop App

## Based on DeepSeek Debugging Sessions

This guide documents all the issues encountered during development and their solutions.

---

## 📝 Common Issues & Solutions

### Issue 1: "ENOENT: no such file or directory, open 'package.json'"

**Problem**: Running `npm install` from Desktop or wrong directory.

**Solution**:
```bash
# WRONG: Running npm install on Desktop
C:\Users\YourName\Desktop> npm install  ❌

# CORRECT: Create a proper project folder first
mkdir C:\Users\YourName\Documents\autoblow-ultra-ai-app
cd C:\Users\YourName\Documents\autoblow-ultra-ai-app
git clone https://github.com/ministerofsalt-cell/autoblow-desktop-app.git .
npm install  ✅
```

---

### Issue 2: "Missing script: 'build'"

**Problem**: The `package.json` doesn't have a build script defined.

**Solution**: Updated `package.json` now includes:
```json
"scripts": {
  "start": "electron .",
  "pack": "electron-builder --dir",
  "dist": "electron-builder",
  "build": "electron-builder build --win --x64"
}
```

Now you can run:
```bash
npm run dist       # Creates installer
npm run pack       # Creates unpacked build for testing
npm run build      # Full Windows build
```

---

### Issue 3: Security Vulnerabilities (wcjs-prebuilt)

**Problem**: The `wcjs-prebuilt` package is deprecated and has severe security vulnerabilities.

**Original Error**:
```
6 vulnerabilities (2 low, 1 moderate, 1 high, 2 critical)

Package: wcjs-prebuilt
Deprecated: This package is no longer maintained.
```

**Solution**: 
- ✅ **REMOVED** `wcjs-prebuilt` from dependencies
- ✅ Using native Electron video APIs instead
- ✅ Alternative: Can use `libvlc` or `video.js` if needed

**To fix any remaining vulnerabilities**:
```bash
npm audit
npm audit fix
npm audit fix --force  # For critical issues
```

---

### Issue 4: Native Module Build Errors (better-sqlite3)

**Problem**: `better-sqlite3` needs to be compiled for Electron's Node version.

**Symptoms**:
```
Error: The module was compiled against a different Node.js version
```

**Solution**:
```bash
# Rebuild native modules for Electron
npm install electron-rebuild --save-dev
npx electron-rebuild

# Or use the postinstall script (already added to package.json)
npm install
```

---

### Issue 5: Electron-Builder Not Found

**Problem**: `electron-builder` is not installed or not in PATH.

**Solution**:
```bash
# Install as dev dependency (already in package.json)
npm install --save-dev electron-builder

# Verify installation
npx electron-builder --version
```

---

### Issue 6: Build Fails - Out of Memory

**Problem**: Node runs out of memory during build.

**Solution**:
```bash
# Windows Command Prompt
set NODE_OPTIONS=--max_old_space_size=4096
npm run dist

# Windows PowerShell
$env:NODE_OPTIONS="--max_old_space_size=4096"
npm run dist

# Linux/Mac
export NODE_OPTIONS=--max_old_space_size=4096
npm run dist
```

---

### Issue 7: Dependencies Not Installing Properly

**Problem**: npm install hangs or fails with network errors.

**Symptoms**:
```
fetchMetadata: sill resolveWithNewModule (6 minutes)
```

**Solutions**:

**Option A: Clear npm cache**
```bash
npm cache clean --force
npm install
```

**Option B: Change npm registry (if behind firewall)**
```bash
npm config set registry https://registry.npmmirror.com
npm install
# Change back after
npm config set registry https://registry.npmjs.org
```

**Option C: Install dependencies individually**
```bash
npm install electron@28.3.3
npm install @xsense/autoblow-sdk@2.1.0
npm install better-sqlite3@9.6.0
npm install electron-store@8.2.0
npm install --save-dev electron-builder@24.13.3
```

---

### Issue 8: Python Backend Not Found

**Problem**: Python scripts can't be found after building.

**Solution**: Ensure `package.json` has `extraResources` config:
```json
"build": {
  "extraResources": [
    {
      "from": "backend/python",
      "to": "python",
      "filter": ["**/*"]
    }
  ]
}
```

---

### Issue 9: "Git is not recognized as an internal or external command"

**Problem**: Git is not installed or not in PATH.

**Solution**:
1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. During installation, select **"Git from the command line and also from 3rd-party software"**
3. Restart your terminal
4. Verify: `git --version`

---

### Issue 10: Icon Not Found During Build

**Problem**: Build fails with "icon.ico not found".

**Solution**:
```bash
# Create assets folder
mkdir assets

# Add a 256x256 PNG and convert to ICO
# Or temporarily remove icon from package.json:
"win": {
  "target": ["nsis", "portable"]
  // Remove: "icon": "assets/icon.ico"
}
```

---

## 🚀 Step-by-Step Fresh Setup (Clean Install)

If nothing works, start fresh:

### 1. Prerequisites Check
```bash
# Check Node.js (should be 18+)
node --version

# Check npm
npm --version

# Check Git
git --version

# Check Python (should be 3.11+)
python --version
```

### 2. Clean Project Setup
```bash
# Remove old installation
rmdir /s /q C:\Users\YourName\Documents\autoblow-ultra-ai-app

# Create fresh directory
mkdir C:\Users\YourName\Documents\autoblow-ultra-ai-app
cd C:\Users\YourName\Documents\autoblow-ultra-ai-app

# Clone repository
git clone https://github.com/ministerofsalt-cell/autoblow-desktop-app.git .

# Clean npm cache
npm cache clean --force

# Install dependencies
npm install

# Fix vulnerabilities
npm audit fix

# Rebuild native modules
npx electron-rebuild
```

### 3. Test Before Building
```bash
# Test the app in development mode
npm start

# If it opens successfully, proceed to build
npm run dist
```

### 4. Locate Your Executable
```bash
# Your .exe will be in:
C:\Users\YourName\Documents\autoblow-ultra-ai-app\dist\Autoblow Ultra AI Setup 1.0.0.exe
```

---

## 📊 Dependency Installation Timeline

Based on the logs, here's how long each step typically takes:

| Step | Time | Notes |
|------|------|-------|
| `npm install` (first time) | 3-5 minutes | Downloads ~200 packages |
| `npm install electron` | 1-2 minutes | Large download (200+ MB) |
| `npm audit fix` | 30-60 seconds | Updates vulnerable packages |
| `npx electron-rebuild` | 1-2 minutes | Compiles native modules |
| `npm run dist` | 5-10 minutes | First build (caches afterwards) |
| **Total Fresh Build** | **10-20 minutes** | |

---

## 🔍 Debugging Commands

### Check Installed Versions
```bash
npm list electron
npm list electron-builder
npm list @xsense/autoblow-sdk
```

### View Full Error Logs
```bash
# Enable verbose logging
npm install --verbose
npm run dist --verbose

# Check npm debug log
type %USERPROFILE%\.npm\_logs\*-debug.log
```

### Clear Everything and Restart
```bash
# Remove node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

---

## ✅ Verification Checklist

Before building, ensure:

- [ ] Node.js version 18 or higher: `node --version`
- [ ] npm version 9 or higher: `npm --version`
- [ ] Git installed: `git --version`
- [ ] Python 3.11+ installed: `python --version`
- [ ] In correct project directory (has `package.json`)
- [ ] `node_modules` folder exists
- [ ] `package.json` has `"dist"` script
- [ ] No critical security vulnerabilities: `npm audit`
- [ ] Native modules built: `npx electron-rebuild`
- [ ] App runs in dev mode: `npm start`

---

## 🆘 Still Having Issues?

### Join the Community
- GitHub Issues: [Report a bug](https://github.com/ministerofsalt-cell/autoblow-desktop-app/issues)
- DeepSeek AI: Use the chat logs as reference

### Provide These Details
1. **Node version**: `node --version`
2. **npm version**: `npm --version`
3. **Operating System**: Windows 10/11, build number
4. **Full error message**: Copy entire terminal output
5. **What you tried**: List all commands you ran
6. **npm debug log**: Located in `%USERPROFILE%\.npm\_logs`

---

## 📚 Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs/latest/)
- [electron-builder Guide](https://www.electron.build/)
- [Node.js Troubleshooting](https://nodejs.org/en/docs/)
- [npm Debug Guide](https://docs.npmjs.com/common-errors)

---

## 🎉 Success Indicators

You know everything is working when:

✅ `npm install` completes without errors
✅ `npm start` opens the Electron window
✅ `npm run dist` completes and creates `dist/` folder
✅ You can find `Autoblow Ultra AI Setup 1.0.0.exe` in `dist/`
✅ The installer runs and installs the app
✅ The installed app launches successfully

---

*Last Updated: December 27, 2025*  
*Based on: DeepSeek debugging sessions for build issues*
