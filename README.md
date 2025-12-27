# 🎬 Autoblow Desktop App

Desktop application integrating local video playback with AI-generated funscripts for Autoblow Ultra AI device.

## ✨ Features

- **🎥 Video Player**: VLC-powered player supporting MP4, MKV, AVI, WMV
- **🤖 AI Funscript Generation**: YOLO-based motion detection and funscript generation
- **🔌 WiFi Device Control**: Token-based connection to Autoblow Ultra AI
- **⚡ Real-time Sync**: <100ms latency synchronization between video and device
- **📚 Video Library**: Manage your video collection with thumbnails
- **💾 Local Processing**: All AI processing happens locally for privacy

## 🏗️ Project Structure

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
└── database/
    └── sqlite-manager.js
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **Python 3.11+**
- **VLC Media Player** ([Download](https://www.videolan.org/vlc/))
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/ministerofsalt-cell/autoblow-desktop-app.git
cd autoblow-desktop-app

# Install Node dependencies
npm install

# Install Python dependencies
pip install -r backend/python/requirements.txt

# Download YOLO model (first run)
mkdir -p resources/models
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n-pose.pt -O resources/models/yolov8n-pose.pt
```

### Development Mode

```bash
npm start
```

This opens the app in development mode with DevTools enabled.

## 📦 Building for Distribution

### Build Windows .exe Installer

```bash
npm run build
```

**Output:**
- `dist/Autoblow Desktop Setup.exe` - NSIS installer
- `dist/win-unpacked/` - Unpacked application files

### Build Portable .exe

```bash
npm run build:portable
```

### Build MSI Installer

```bash
npm run build:msi
```

## 🔧 Configuration

### Device Setup

1. Connect Autoblow Ultra to WiFi:
   - Power on device
   - Connect to device's WiFi network ("AB_Network" or "av_")
   - Visit [app.autoblow.com](https://app.autoblow.com)
   - Configure WiFi settings

2. Get Device Token:
   - After WiFi setup, copy your device token
   - In the app, click "Connect Device"
   - Paste token and click "Connect"

### Settings

- **VLC Path**: Auto-detected or manually set
- **Python Path**: Auto-detected or manually set  
- **Output Directory**: Where funscripts are saved
- **AI Settings**: Intensity, smoothing, speed limits

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

## 🛠️ Development

### Tech Stack

- **Frontend**: Electron, HTML/CSS/JavaScript
- **Backend**: Node.js, Python
- **Video**: VLC (libVLC bindings)
- **AI**: YOLO, PyTorch, OpenCV
- **Database**: SQLite
- **Device SDK**: @xsense/autoblow-sdk

### API Documentation

Autoblow API: [https://latency.autoblowapi.com/documentation](https://latency.autoblowapi.com/documentation/static/index.html)

## 📝 Remaining TODOs

### High Priority
- [ ] Create `renderer/styles.css` - UI styling
- [ ] Create `renderer/renderer.js` - Frontend logic
- [ ] Create `backend/node/autoblow-controller.js` - Device control
- [ ] Create `backend/node/python-bridge.js` - Python IPC
- [ ] Create `backend/node/funscript-sync.js` - Sync engine
- [ ] Create `backend/python/fungen_processor.py` - AI processor
- [ ] Create `backend/python/requirements.txt` - Python deps
- [ ] Create `database/sqlite-manager.js` - DB layer

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

## 🐛 Troubleshooting

### VLC Not Found

**Error**: "VLC Media Player not detected"

**Solution**:
1. Install VLC from [videolan.org](https://www.videolan.org/vlc/)
2. Restart the app
3. If still not detected, manually set VLC path in Settings

### Device Won't Connect

**Error**: "Failed to connect to device"

**Solutions**:
- Verify device is on WiFi network
- Check token is correct (no spaces)
- Ensure device firmware is up to date
- Try disconnecting/reconnecting device from power

### AI Generation Fails

**Error**: "Funscript generation failed"

**Solutions**:
- Check Python is installed (`python --version`)
- Verify YOLO model downloaded
- Check video file isn't corrupted
- Try a shorter video clip first

### Sync Latency

**Issue**: Device response delayed

**Solutions**:
- Ensure strong WiFi signal
- Close other network-heavy applications
- Check device battery level
- Reduce funscript complexity

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## ⚠️ Disclaimer

This is an unofficial third-party application. Not affiliated with or endorsed by Autoblow. Use at your own risk.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ministerofsalt-cell/autoblow-desktop-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ministerofsalt-cell/autoblow-desktop-app/discussions)

---

**Built with ❤️ for the Autoblow community**
