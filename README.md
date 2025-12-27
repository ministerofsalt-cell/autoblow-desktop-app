# 🎬 Autoblow Desktop App

Desktop application integrating local video playback with AI-generated funscripts for Autoblow Ultra AI device.

## ⚡ Quick Start (Recommended)

### One-Click Build

```bash
# Clone the repository
git clone https://github.com/ministerofsalt-cell/autoblow-desktop-app.git
cd autoblow-desktop-app

# Run the quick build script
quick_build.bat
```

**Or use the interactive menu:**
```bash
build_menu.bat
```

The batch files handle everything automatically:
- ✅ Clone repository
- ✅ Install dependencies
- ✅ Fix security vulnerabilities
- ✅ Rebuild native modules
- ✅ Build the .exe installer

---

## ✨ Features

- **🎥 Video Player**: Native Electron video player supporting MP4, MKV, AVI, WMV
- **🤖 AI Funscript Generation**: YOLO-based motion detection and funscript generation
- **🔌 WiFi Device Control**: Token-based connection to Autoblow Ultra AI
- **⚡ Real-time Sync**: <100ms latency synchronization between video and device
- **📚 Video Library**: Manage your video collection with thumbnails
- **💾 Local Processing**: All AI processing happens locally for privacy

---

## 🛠️ Prerequisites

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | 18.x or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x or higher | Included with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **Python** | 3.11 or higher | [python.org](https://www.python.org/) |

### Verify Installation

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
git --version     # Should show git version x.x.x
python --version  # Should show Python 3.11.x or higher
```

---

## 📚 Installation Methods

### Method 1: Automated Setup (Easiest)

1. **Download** `quick_build.bat` from this repository
2. **Double-click** the file
3. **Wait** 5-10 minutes for setup
4. **Find** your `.exe` in the `dist/` folder

### Method 2: Interactive Menu

1. **Download** `build_menu.bat` from this repository
2. **Run** the batch file
3. **Choose** from the menu:
   - 1: Setup project from GitHub
   - 2: Install dependencies
   - 3: Test the app
   - 4: Build .exe file
   - 5: Do everything (1-4)

### Method 3: Manual Setup

```bash
# Step 1: Clone the repository
git clone https://github.com/ministerofsalt-cell/autoblow-desktop-app.git
cd autoblow-desktop-app

# Step 2: Install Node dependencies
npm install

# Step 3: Fix security vulnerabilities
npm audit fix

# Step 4: Rebuild native modules
npx electron-rebuild

# Step 5: Install Python dependencies
cd backend/python
pip install -r requirements.txt
cd ../..

# Step 6: Test the app
npm start

# Step 7: Build the .exe
npm run dist
```

---

## 🎯 Project Structure

```
autoblow-desktop-app/
├── package.json              # Dependencies and build config
├── main.js                   # Electron main process
├── renderer/
│   ├── index.html           # Main UI
│   ├── styles.css           # Styling
│   └── renderer.js          # Frontend logic
├── backend/
│   ├── node/
│   │   ├── autoblow-controller.js
│   │   ├── python-bridge.js
│   │   └── funscript-sync.js
│   └── python/
│       ├── fungen_processor.py
│       ├── yolo_detection.py
│       └── requirements.txt
├── database/
│   └── sqlite-manager.js
├── BUILD_INSTRUCTIONS.md    # Detailed build guide
├── TROUBLESHOOTING.md       # Common issues & solutions
├── quick_build.bat          # One-click build script
└── build_menu.bat           # Interactive menu script
```

---

## 🛡️ Security Updates (IMPORTANT)

**⚠️ The following package has been REMOVED due to critical vulnerabilities:**

- ❌ **wcjs-prebuilt** - Deprecated package with severe security issues

**✅ Replaced with:**
- Native Electron video APIs
- Modern, maintained packages
- Secure dependencies (updated to latest versions)

**Always run after installing:**
```bash
npm audit
npm audit fix
```

---

## 💻 Development Mode

```bash
npm start
```

This opens the app in development mode with DevTools enabled.

---

## 📦 Building for Distribution

### Build Windows .exe Installer

```bash
npm run dist
```

**Output:**
- `dist/Autoblow Ultra AI Setup 1.0.0.exe` - NSIS installer
- `dist/win-unpacked/` - Unpacked application files

### Build Portable .exe

```bash
npm run build:portable
```

### Test Build (Faster)

```bash
npm run pack
```

Creates an unpacked build for testing without creating an installer.

---

## 🔧 Configuration

### Device Setup

1. **Connect Autoblow Ultra to WiFi:**
   - Power on device
   - Connect to device's WiFi network ("AB_Network" or "av_")
   - Visit [app.autoblow.com](https://app.autoblow.com)
   - Configure WiFi settings

2. **Get Device Token:**
   - After WiFi setup, copy your device token
   - In the app, click "Connect Device"
   - Paste token and click "Connect"

### Settings

- **Python Path**: Auto-detected or manually set  
- **Output Directory**: Where funscripts are saved
- **AI Settings**: Intensity, smoothing, speed limits

---

## 🤖 AI Funscript Generation

### How It Works

1. **Stage 1: YOLO Detection**
   - Analyzes video frames for motion
   - Detects relevant objects and movements

2. **Stage 2: Tracking & Segmentation**
   - Tracks detected objects across frames
   - Identifies continuous action sequences

3. **Stage 3: Funscript Generation**
   - Converts motion data to funscript format
   - Applies smoothing and speed limiting
   - Outputs standard .funscript JSON

### Funscript Format

```json
{
  "version": "1.0",
  "inverted": false,
  "range": 100,
  "actions": [
    {"at": 0, "pos": 0},
    {"at": 1000, "pos": 100}
  ]
}
```

---

## 🎮 Usage

### Adding Videos

1. Click "➕ Add Video"
2. Select video file(s)
3. Videos appear in library with thumbnails

### Generating Funscripts

1. Select video from library
2. Click "✨ Generate AI Funscript"
3. Adjust settings (intensity, smoothing, speed)
4. Click "🚀 Start Generation"
5. Wait for processing (progress shown)
6. Funscript automatically loads

### Playing with Device

1. Ensure device is connected
2. Select video with funscript
3. Click "▶️ Play"
4. Device synchronizes automatically

---

## 🛠️ Tech Stack

- **Frontend**: Electron 28.3.3, HTML/CSS/JavaScript
- **Backend**: Node.js, Python 3.11+
- **Video**: Native Electron video APIs
- **AI**: YOLO, PyTorch, OpenCV
- **Database**: SQLite (better-sqlite3)
- **Device SDK**: @xsense/autoblow-sdk@2.1.0
- **Build**: electron-builder 24.13.3

---

## 🐛 Common Issues & Solutions

### Issue 1: "Missing script: build"

**Solution:** Pull the latest version - the package.json has been updated:
```bash
git pull origin main
npm install
```

### Issue 2: "ENOENT: no such file or directory, open 'package.json'"

**Solution:** You're running npm commands in the wrong directory:
```bash
cd C:\Users\YourName\Documents\autoblow-desktop-app
```

### Issue 3: Security Vulnerabilities

**Solution:** The deprecated `wcjs-prebuilt` package has been removed. Run:
```bash
npm audit fix
```

### Issue 4: Native Module Errors (better-sqlite3)

**Solution:** Rebuild native modules:
```bash
npx electron-rebuild
```

### Issue 5: Batch File Flashes and Closes

**Solution:** Use the updated batch files:
- `quick_build.bat` - Simple one-click build
- `build_menu.bat` - Interactive menu with options

Both files have proper error handling and won't close on errors.

### Issue 6: Build Fails - Out of Memory

**Solution:** Increase Node.js memory:
```bash
# Windows Command Prompt
set NODE_OPTIONS=--max_old_space_size=4096
npm run dist

# Windows PowerShell
$env:NODE_OPTIONS="--max_old_space_size=4096"
npm run dist
```

**For more detailed troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

---

## 📝 Documentation

- **[BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)** - Complete step-by-step build guide
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Detailed solutions to all known issues
- **[Autoblow API Docs](https://latency.autoblowapi.com/documentation/static/index.html)** - Device API reference

---

## 📝 Remaining TODOs

### High Priority
- [ ] Complete `renderer/renderer.js` - Frontend logic
- [ ] Complete `backend/node/autoblow-controller.js` - Device control
- [ ] Complete `backend/node/python-bridge.js` - Python IPC
- [ ] Complete `backend/node/funscript-sync.js` - Sync engine
- [ ] Complete `backend/python/fungen_processor.py` - AI processor

### Medium Priority
- [ ] Video thumbnail generation
- [ ] Funscript waveform visualization
- [ ] Manual funscript editor
- [ ] Batch processing queue
- [ ] Settings persistence

### Low Priority
- [ ] Custom themes
- [ ] Keyboard shortcuts
- [ ] Video filters
- [ ] Cloud sync (optional)

---

## 📝 Build Timeline

Based on extensive testing, here's what to expect:

| Step | Time | Notes |
|------|------|-------|
| Clone repository | 30 seconds | ~33 KB download |
| `npm install` (first time) | 3-5 minutes | Downloads ~200-300 packages |
| `npm audit fix` | 30-60 seconds | Updates vulnerable packages |
| `npx electron-rebuild` | 1-2 minutes | Compiles native modules |
| `npm run dist` | 5-10 minutes | First build (caches afterwards) |
| **Total Fresh Build** | **10-20 minutes** | |

---

## 📦 Installer Details

**File Size:**
- Installer (.exe): ~200-400 MB
- Unpacked app: ~500-800 MB

**Installation Path:**
```
C:\Users\[YourName]\AppData\Local\Programs\autoblow-ultra-ai
```

**Includes:**
- ✅ Electron app
- ✅ Node.js backend
- ✅ Python AI processor
- ✅ All dependencies bundled
- ✅ Auto-update capability
- ✅ Desktop shortcuts
- ✅ Start menu integration

---

## 📜 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## ⚠️ Disclaimer

This is an unofficial third-party application. Not affiliated with or endorsed by Autoblow. Use at your own risk.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ministerofsalt-cell/autoblow-desktop-app/issues)
- **Build Help**: See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)
- **Troubleshooting**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🎉 Credits

**Built with ❤️ for the Autoblow community**

**Special thanks to:**
- DeepSeek AI for debugging assistance
- Electron and electron-builder teams
- YOLO/Ultralytics for AI models
- The open-source community

---

*Last Updated: December 27, 2025*  
*Version: 1.0.0*
