const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

// Import backend modules (to be created)
// const AutoblowController = require('./backend/node/autoblow-controller');
// const PythonBridge = require('./backend/node/python-bridge');
// const FunscriptSync = require('./backend/node/funscript-sync');
// const DatabaseManager = require('./database/sqlite-manager');

let mainWindow;
let autoblowController;
let pythonBridge;
let funscriptSync;
let dbManager;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/icon.ico')
  });
  
  mainWindow.loadFile('renderer/index.html');
  
  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
  
  // Initialize services when ready
  mainWindow.webContents.on('did-finish-load', () => {
    initializeServices();
  });
}

function initializeServices() {
  // Initialize backend services
  // autoblowController = new AutoblowController();
  // pythonBridge = new PythonBridge();
  // funscriptSync = new FunscriptSync(autoblowController);
  // dbManager = new DatabaseManager();
  
  console.log('Services initialized');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('device:connect', async (event, token) => {
  // return await autoblowController.connect(token);
  return { success: true, message: 'Connected (placeholder)' };
});

ipcMain.handle('dialog:open-video', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Videos', extensions: ['mp4', 'mkv', 'avi', 'wmv'] }
    ]
  });
  
  return result.filePaths[0];
});

ipcMain.handle('video:add', async (event, filePath) => {
  const filename = path.basename(filePath);
  // const thumbnail = ''; // Implement thumbnail generation
  // const duration = 0; // Get video duration
  // return dbManager.addVideo(filePath, filename, thumbnail, duration);
  return { id: 1, filePath, filename };
});

ipcMain.handle('video:get-all', async () => {
  // return dbManager.getAllVideos();
  return [];
});

ipcMain.handle('ai:generate-funscript', async (event, videoId, settings) => {
  try {
    // const video = dbManager.getAllVideos().find(v => v.id === videoId);
    // const outputPath = video.file_path.replace(/\.[^/.]+$/, '.funscript');
    // const result = await pythonBridge.generateFunscript(
    //   video.file_path,
    //   outputPath,
    //   settings,
    //   (progress) => {
    //     event.sender.send('ai:progress', progress);
    //   }
    // );
    // dbManager.updateVideoFunscript(videoId, outputPath);
    // return { success: true, path: outputPath };
    return { success: true, path: 'placeholder.funscript' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.on('funscript:load', (event, funscriptPath) => {
  // funscriptSync.loadFunscript(funscriptPath);
  console.log('Load funscript:', funscriptPath);
});

ipcMain.on('device:start-sync', (event) => {
  // funscriptSync.startSync(null);
  console.log('Start sync');
});

ipcMain.on('device:pause-sync', (event) => {
  // funscriptSync.pause();
  console.log('Pause sync');
});
