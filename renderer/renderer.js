// Autoblow Desktop - Renderer Process
// Frontend logic and IPC communication

const { ipcRenderer } = require('electron');

// State
let currentVideoId = null;
let videoPlayer = null;
let isPlaying = false;

// DOM Elements
const elements = {
  connectionModal: document.getElementById('connection-modal'),
  aiModal: document.getElementById('ai-modal'),
  connectBtn: document.getElementById('connect-btn'),
  connectSubmit: document.getElementById('connect-submit'),
  tokenInput: document.getElementById('token-input'),
  statusIndicator: document.getElementById('connection-indicator'),
  statusText: document.getElementById('status-text'),
  addVideoBtn: document.getElementById('add-video-btn'),
  videoList: document.getElementById('video-list'),
  generateFunscriptBtn: document.getElementById('generate-funscript-btn'),
  uploadFunscriptBtn: document.getElementById('upload-funscript-btn'),
  playBtn: document.getElementById('play-btn'),
  pauseBtn: document.getElementById('pause-btn'),
  seekBar: document.getElementById('seek-bar'),
  timeDisplay: document.getElementById('time-display'),
  volumeSlider: document.getElementById('volume'),
  progressFill: document.getElementById('progress-fill'),
  progressText: document.getElementById('progress-text'),
  intensitySlider: document.getElementById('intensity'),
  intensityValue: document.getElementById('intensity-value'),
  startGeneration: document.getElementById('start-generation'),
  funscriptPreview: document.getElementById('funscript-preview')
};

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
  console.log('Autoblow Desktop loaded');
  initializeEventListeners();
  loadVideoLibrary();
});

// Event Listeners
function initializeEventListeners() {
  // Connection Modal
  elements.connectBtn.addEventListener('click', showConnectionModal);
  elements.connectSubmit.addEventListener('click', connectDevice);
  
  // Modal close buttons
  document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => {
      elements.connectionModal.classList.add('hidden');
    });
  });
  
  document.querySelectorAll('.close-ai').forEach(btn => {
    btn.addEventListener('click', () => {
      elements.aiModal.classList.add('hidden');
    });
  });
  
  // Video Controls
  elements.addVideoBtn.addEventListener('click', addVideo);
  elements.playBtn.addEventListener('click', playVideo);
  elements.pauseBtn.addEventListener('click', pauseVideo);
  elements.seekBar.addEventListener('input', seekVideo);
  elements.volumeSlider.addEventListener('input', changeVolume);
  
  // Funscript Controls
  elements.generateFunscriptBtn.addEventListener('click', showAIModal);
  elements.uploadFunscriptBtn.addEventListener('click', uploadFunscript);
  elements.startGeneration.addEventListener('click', generateFunscript);
  
  // AI Settings
  elements.intensitySlider.addEventListener('input', (e) => {
    elements.intensityValue.textContent = e.target.value;
  });
  
  // Close modals on outside click
  elements.connectionModal.addEventListener('click', (e) => {
    if (e.target === elements.connectionModal) {
      elements.connectionModal.classList.add('hidden');
    }
  });
  
  elements.aiModal.addEventListener('click', (e) => {
    if (e.target === elements.aiModal) {
      elements.aiModal.classList.add('hidden');
    }
  });
}

// Connection Functions
function showConnectionModal() {
  elements.connectionModal.classList.remove('hidden');
  elements.tokenInput.focus();
}

async function connectDevice() {
  const token = elements.tokenInput.value.trim();
  
  if (!token) {
    alert('Please enter a device token');
    return;
  }
  
  try {
    const result = await ipcRenderer.invoke('device:connect', token);
    
    if (result.success) {
      updateConnectionStatus(true);
      elements.connectionModal.classList.add('hidden');
      showNotification('Device connected successfully', 'success');
    } else {
      showNotification('Connection failed: ' + result.error, 'error');
    }
  } catch (error) {
    showNotification('Connection error: ' + error.message, 'error');
  }
}

function updateConnectionStatus(connected) {
  if (connected) {
    elements.statusIndicator.classList.add('connected');
    elements.statusText.textContent = 'Connected';
    elements.statusText.style.color = '#4caf50';
  } else {
    elements.statusIndicator.classList.remove('connected');
    elements.statusText.textContent = 'Not Connected';
    elements.statusText.style.color = '#999';
  }
}

// Video Library Functions
async function loadVideoLibrary() {
  try {
    const videos = await ipcRenderer.invoke('video:get-all');
    displayVideoList(videos);
  } catch (error) {
    console.error('Failed to load videos:', error);
  }
}

function displayVideoList(videos) {
  elements.videoList.innerHTML = '';
  
  if (videos.length === 0) {
    elements.videoList.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No videos yet. Add videos to get started!</p>';
    return;
  }
  
  videos.forEach(video => {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    videoItem.innerHTML = `
      ${video.thumbnail ? `<img src="${video.thumbnail}" alt="${video.filename}">` : '<div style="width: 60px; height: 40px; background: #333; border-radius: 3px;"></div>'}
      <span>${video.filename}</span>
    `;
    videoItem.addEventListener('click', () => loadVideo(video));
    elements.videoList.appendChild(videoItem);
  });
}

async function addVideo() {
  try {
    const filePath = await ipcRenderer.invoke('dialog:open-video');
    
    if (filePath) {
      const videoData = await ipcRenderer.invoke('video:add', filePath);
      await loadVideoLibrary();
      showNotification('Video added successfully', 'success');
    }
  } catch (error) {
    showNotification('Failed to add video: ' + error.message, 'error');
  }
}

function loadVideo(video) {
  currentVideoId = video.id;
  console.log('Loading video:', video.filename);
  
  // Update video player
  const videoContainer = document.getElementById('video-container');
  videoContainer.innerHTML = `<video src="file:///${video.file_path}" controls style="width: 100%; height: 100%; object-fit: contain;"></video>`;
  
  videoPlayer = videoContainer.querySelector('video');
  
  // Video event listeners
  videoPlayer.addEventListener('timeupdate', updateTimeDisplay);
  videoPlayer.addEventListener('ended', () => {
    isPlaying = false;
    ipcRenderer.send('device:pause-sync');
  });
  
  // Load funscript if available
  if (video.funscript_path) {
    ipcRenderer.send('funscript:load', video.funscript_path);
    elements.funscriptPreview.innerHTML = `<p style="color: #4caf50;">✓ Funscript loaded</p>`;
  } else {
    elements.funscriptPreview.innerHTML = `<p style="color: #999;">No funscript available</p>`;
  }
}

// Playback Controls
function playVideo() {
  if (!videoPlayer) {
    showNotification('Please load a video first', 'warning');
    return;
  }
  
  videoPlayer.play();
  isPlaying = true;
  ipcRenderer.send('device:start-sync');
}

function pauseVideo() {
  if (!videoPlayer) return;
  
  videoPlayer.pause();
  isPlaying = false;
  ipcRenderer.send('device:pause-sync');
}

function seekVideo(e) {
  if (!videoPlayer) return;
  
  const seekTime = (e.target.value / 100) * videoPlayer.duration;
  videoPlayer.currentTime = seekTime;
  
  if (isPlaying) {
    ipcRenderer.send('device:seek', seekTime * 1000); // Convert to ms
  }
}

function changeVolume(e) {
  if (!videoPlayer) return;
  videoPlayer.volume = e.target.value / 100;
}

function updateTimeDisplay() {
  if (!videoPlayer) return;
  
  const current = formatTime(videoPlayer.currentTime);
  const duration = formatTime(videoPlayer.duration);
  elements.timeDisplay.textContent = `${current} / ${duration}`;
  
  // Update seek bar
  const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
  elements.seekBar.value = progress;
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// AI Funscript Generation
function showAIModal() {
  if (!currentVideoId) {
    showNotification('Please load a video first', 'warning');
    return;
  }
  
  elements.aiModal.classList.remove('hidden');
  elements.progressFill.style.width = '0%';
  elements.progressText.textContent = 'Ready to start...';
}

async function generateFunscript() {
  if (!currentVideoId) return;
  
  const settings = {
    intensity: elements.intensitySlider.value,
    smoothing: document.getElementById('smoothing').checked,
    speed_limit: parseFloat(document.getElementById('speed-limit').value)
  };
  
  try {
    elements.startGeneration.disabled = true;
    elements.startGeneration.textContent = 'Generating...';
    
    const result = await ipcRenderer.invoke('ai:generate-funscript', currentVideoId, settings);
    
    if (result.success) {
      showNotification('Funscript generated successfully!', 'success');
      elements.aiModal.classList.add('hidden');
      await loadVideoLibrary();
    } else {
      showNotification('Generation failed: ' + result.error, 'error');
    }
  } catch (error) {
    showNotification('Generation error: ' + error.message, 'error');
  } finally {
    elements.startGeneration.disabled = false;
    elements.startGeneration.textContent = '🚀 Start Generation';
  }
}

async function uploadFunscript() {
  // TODO: Implement funscript file upload
  showNotification('Manual upload coming soon!', 'info');
}

// IPC Event Listeners
ipcRenderer.on('ai:progress', (event, progress) => {
  elements.progressFill.style.width = progress.progress + '%';
  
  const stageNames = ['YOLO Detection', 'Tracking & Segmentation', 'Funscript Generation'];
  const stageName = stageNames[progress.stage - 1] || 'Processing';
  elements.progressText.textContent = `Stage ${progress.stage}: ${stageName} (${Math.round(progress.progress)}%)`;
});

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  
  const colors = {
    success: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
    error: 'linear-gradient(135deg, #f44336 0%, #da190b 100%)',
    warning: 'linear-gradient(135deg, #ff9800 0%, #fb8c00 100%)',
    info: 'linear-gradient(135deg, #2196F3 0%, #0b7dda 100%)'
  };
  
  notification.style.background = colors[type] || colors.info;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

console.log('Renderer.js initialized successfully');
