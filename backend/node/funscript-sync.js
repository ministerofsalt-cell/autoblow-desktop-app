// Funscript Synchronization Engine
const fs = require('fs').promises;
const EventEmitter = require('events');

class FunscriptSync extends EventEmitter {
  constructor(autoblowController) {
    super();
    this.controller = autoblowController;
    this.funscriptData = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.videoPosition = 0;
    this.syncInterval = null;
    this.actionIndex = 0;
    this.latencyOffset = 50; // ms - Target <100ms latency
  }

  // Load funscript file
  async loadFunscript(funscriptPath) {
    try {
      const fileContent = await fs.readFile(funscriptPath, 'utf8');
      this.funscriptData = JSON.parse(fileContent);
      
      if (!this.validateFunscript(this.funscriptData)) {
        throw new Error('Invalid funscript format');
      }

      this.actionIndex = 0;
      this.emit('funscript-loaded', { 
        path: funscriptPath, 
        actions: this.funscriptData.actions.length 
      });

      return {
        success: true,
        actions: this.funscriptData.actions.length,
        duration: this.funscriptData.actions[this.funscriptData.actions.length - 1].at
      };
    } catch (error) {
      console.error('Failed to load funscript:', error);
      throw error;
    }
  }

  // Validate funscript format
  validateFunscript(data) {
    return data && 
           data.version && 
           Array.isArray(data.actions) && 
           data.actions.every(action => 
             typeof action.at === 'number' && 
             typeof action.pos === 'number'
           );
  }

  // Start synchronization with video
  async play(startTime = 0) {
    try {
      if (!this.funscriptData) {
        throw new Error('No funscript loaded');
      }

      if (!this.controller.isConnected) {
        throw new Error('Device not connected');
      }

      this.isPlaying = true;
      this.currentTime = startTime;
      this.videoPosition = startTime;
      
      // Find starting action index
      this.actionIndex = this.funscriptData.actions.findIndex(
        action => action.at >= startTime
      );
      
      if (this.actionIndex === -1) {
        this.actionIndex = 0;
      }

      // Start sync loop
      this.startSyncLoop();
      
      this.emit('playback-start', { startTime });
      return { success: true };
    } catch (error) {
      console.error('Playback start failed:', error);
      throw error;
    }
  }

  // Synchronization loop
  startSyncLoop() {
    const SYNC_INTERVAL = 16; // ~60fps
    const startTimestamp = Date.now();
    const startPosition = this.currentTime;

    this.syncInterval = setInterval(async () => {
      if (!this.isPlaying) {
        return;
      }

      // Calculate current time with latency compensation
      const elapsed = Date.now() - startTimestamp;
      this.currentTime = startPosition + elapsed + this.latencyOffset;

      // Process actions at current time
      await this.processActions(this.currentTime);
    }, SYNC_INTERVAL);
  }

  // Process funscript actions
  async processActions(currentTime) {
    if (!this.funscriptData || this.actionIndex >= this.funscriptData.actions.length) {
      return;
    }

    const actions = this.funscriptData.actions;
    
    // Process all actions that should have happened by now
    while (this.actionIndex < actions.length && 
           actions[this.actionIndex].at <= currentTime) {
      const action = actions[this.actionIndex];
      
      try {
        // Calculate speed based on time to next action
        let speed = 100;
        if (this.actionIndex < actions.length - 1) {
          const nextAction = actions[this.actionIndex + 1];
          const timeDiff = nextAction.at - action.at;
          const posDiff = Math.abs(nextAction.pos - action.pos);
          
          // Speed calculation (0-100)
          speed = Math.min(100, Math.max(20, (posDiff / timeDiff) * 100));
        }

        await this.controller.sendCommand(action.pos, speed);
        
        this.emit('action-executed', { 
          time: action.at, 
          position: action.pos,
          speed: speed,
          index: this.actionIndex 
        });
      } catch (error) {
        console.error('Action execution failed:', error);
      }
      
      this.actionIndex++;
    }
  }

  // Pause synchronization
  pause() {
    this.isPlaying = false;
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.emit('playback-paused', { time: this.currentTime });
    return { success: true, time: this.currentTime };
  }

  // Resume from current position
  resume() {
    if (this.funscriptData && !this.isPlaying) {
      return this.play(this.currentTime);
    }
    return { success: false, message: 'Cannot resume' };
  }

  // Seek to specific time
  async seek(time) {
    const wasPlaying = this.isPlaying;
    
    if (wasPlaying) {
      this.pause();
    }

    this.currentTime = time;
    this.videoPosition = time;
    
    // Find appropriate action index
    this.actionIndex = this.funscriptData.actions.findIndex(
      action => action.at >= time
    );
    
    if (this.actionIndex === -1) {
      this.actionIndex = this.funscriptData.actions.length;
    }

    this.emit('seek', { time });

    if (wasPlaying) {
      await this.play(time);
    }

    return { success: true, time };
  }

  // Stop playback
  async stop() {
    this.isPlaying = false;
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    this.currentTime = 0;
    this.videoPosition = 0;
    this.actionIndex = 0;
    
    await this.controller.stop();
    this.emit('playback-stopped');
    
    return { success: true };
  }

  // Update video position (external sync)
  updateVideoPosition(position) {
    const timeDiff = Math.abs(position - this.videoPosition);
    
    // If desync > 200ms, resync
    if (timeDiff > 200) {
      this.seek(position);
    }
    
    this.videoPosition = position;
  }

  // Set latency offset
  setLatencyOffset(offset) {
    this.latencyOffset = Math.max(0, Math.min(200, offset));
    return { success: true, offset: this.latencyOffset };
  }

  // Get current status
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      videoPosition: this.videoPosition,
      actionIndex: this.actionIndex,
      totalActions: this.funscriptData ? this.funscriptData.actions.length : 0,
      latencyOffset: this.latencyOffset
    };
  }
}

module.exports = FunscriptSync;
