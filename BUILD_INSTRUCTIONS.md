# 🚀 Build Instructions - Autoblow Desktop App

## How to Compile the App into a Windows .EXE Installer

### Prerequisites

1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
2. **Python 3.11+** - Download from [python.org](https://www.python.org/)
3. **VLC Media Player** - Download from [videolan.org](https://www.videolan.org/)
4. **Git** - Download from [git-scm.com](https://git-scm.com/)

---

## Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/ministerofsalt-cell/autoblow-desktop-app.git
cd autoblow-desktop-app

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r backend/python/requirements.txt
```

---

## Step 2: Install Additional Dependencies

The app requires some additional packages for building and video processing:

```bash
# Install Electron Builder and Store
npm install --save-dev electron-builder
npm install electron-store

# Install Autoblow SDK
npm install @xsense/autoblow-sdk

# Install VLC bindings
npm install wcjs-prebuilt

# Install SQLite
npm install better-sqlite3
```

---

## Step 3: Development Testing

Before building, test the app in development mode:

```bash
npm run dev
```

This will open the app in development mode. Test all features:
- Video playback
- Device connection
- AI funscript generation
- Video library management

---

## Step 4: Build the Windows .EXE Installer

### Option A: Using npm run build (Recommended)

```bash
# Build Windows installer
npm run build
```

This will:
1. Compile all source files
2. Package the Electron app
3. Create a Windows installer (.exe) in the `dist/` folder
4. Include all dependencies (Node, Python libraries, VLC)

### Option B: Manual Electron Builder Command

```bash
# Build for Windows 64-bit
npx electron-builder --win --x64

# Build for Windows 32-bit
npx electron-builder --win --ia32

# Build portable exe (no installer)
npx electron-builder --win portable
```

---

## Step 5: Locate Your .EXE File

After building, your installer will be located at:

```
autoblow-desktop-app/
└── dist/
    ├── Autoblow Desktop App Setup 1.0.0.exe    # Main installer
    ├── win-unpacked/                            # Unpacked app files
    └── latest.yml                               # Auto-update config
```

### File Sizes (Approximate)
- **Installer (.exe)**: ~200-400 MB (includes Electron, Node, Python deps)
- **Unpacked**: ~500-800 MB

---

## Step 6: Install and Run

1. **Double-click** `Autoblow Desktop App Setup 1.0.0.exe`
2. Follow the installation wizard
3. App will be installed to `C:\Users\[YourName]\AppData\Local\Programs\autoblow-desktop-app`
4. Desktop shortcut will be created
5. Launch the app!

---

## Build Configuration (package.json)

The `package.json` already includes the build configuration:

```json
{
  "build": {
    "appId": "com.autoblow.desktop",
    "productName": "Autoblow Desktop App",
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
    "files": [
      "main.js",
      "renderer/**/*",
      "backend/**/*",
      "node_modules/**/*"
    ]
  }
}
```

---

## Troubleshooting Build Issues

### Issue: "Python not found"
**Solution**: Add Python to your system PATH
```bash
# Windows: System Properties > Environment Variables
# Add: C:\Python311\ to PATH
```

### Issue: "VLC not detected"
**Solution**: Install VLC and ensure it's in Program Files
```
C:\Program Files\VideoLAN\VLC\
```

### Issue: "electron-builder command not found"
**Solution**: Install globally
```bash
npm install -g electron-builder
```

### Issue: "Build fails - out of memory"
**Solution**: Increase Node memory
```bash
set NODE_OPTIONS=--max_old_space_size=4096
npm run build
```

### Issue: "YOLO model not found"
**Solution**: The app will auto-download YOLO on first AI generation. Ensure internet connection.

---

## Advanced Build Options

### Build for Multiple Platforms
```bash
# Windows + Linux
npx electron-builder -wl

# Windows + Mac + Linux
npx electron-builder -wml
```

### Code Signing (for distribution)
```bash
# Add to package.json build config
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "yourpassword"
}
```

### Auto-Update Configuration
The app includes auto-update capabilities. Host `latest.yml` and your .exe on a server:

```javascript
// In main.js (already included)
const { autoUpdater } = require('electron-updater');
autoUpdater.checkForUpdatesAndNotify();
```

---

## Distribution Checklist

- [ ] Test app in development mode
- [ ] Build Windows installer
- [ ] Test installer on clean Windows machine
- [ ] Verify VLC video playback works
- [ ] Test device connection
- [ ] Test AI funscript generation
- [ ] Check file sizes are reasonable
- [ ] (Optional) Code sign the .exe
- [ ] Create release notes
- [ ] Upload to GitHub Releases

---

## File Structure After Build

```
autoblow-desktop-app/
├── dist/
│   ├── Autoblow Desktop App Setup 1.0.0.exe  # ✅ YOUR INSTALLER
│   ├── win-unpacked/
│   └── latest.yml
├── src/
├── backend/
├── renderer/
├── package.json
└── main.js
```

---

## Quick Build Command Summary

```bash
# Install everything
npm install
pip install -r backend/python/requirements.txt

# Build Windows installer
npm run build

# Your .exe will be in: dist/Autoblow Desktop App Setup 1.0.0.exe
```

---

## Need Help?

- **Electron Builder Docs**: https://www.electron.build/
- **Node.js Issues**: Check Node version with `node --version`
- **Python Issues**: Check Python version with `python --version`
- **VLC Issues**: Reinstall VLC from official site

---

## Success! 🎉

You now have a Windows .exe installer that you can:
- Install on any Windows 10/11 machine
- Distribute to users
- Upload to Microsoft Store (with additional steps)
- Sign with a code signing certificate

The installer includes:
- ✅ Electron app
- ✅ Node.js backend
- ✅ Python AI processor
- ✅ VLC video player integration
- ✅ All dependencies bundled
- ✅ Auto-update capability
- ✅ Desktop shortcuts
- ✅ Start menu integration

**Installer Location**: `dist/Autoblow Desktop App Setup 1.0.0.exe`
**File Size**: ~200-400 MB
**Installation Path**: `C:\Users\[Name]\AppData\Local\Programs\autoblow-desktop-app`
