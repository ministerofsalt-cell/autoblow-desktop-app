// Python Bridge for FunGen AI Processing
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const EventEmitter = require('events');

class PythonBridge extends EventEmitter {
  constructor() {
    super();
    this.pythonProcess = null;
    this.isProcessing = false;
    this.pythonPath = 'python'; // Will be configured based on system
    this.scriptPath = path.join(__dirname, '../python/fungen_processor.py');
  }

  // Check if Python and dependencies are installed
  async checkPythonEnvironment() {
    return new Promise((resolve, reject) => {
      const checkProcess = spawn(this.pythonPath, ['--version']);
      
      checkProcess.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, message: 'Python is installed' });
        } else {
          reject(new Error('Python not found. Please install Python 3.11+'));
        }
      });

      checkProcess.on('error', (error) => {
        reject(new Error('Python not found: ' + error.message));
      });
    });
  }

  // Generate funscript from video
  async generateFunscript(videoPath, options = {}) {
    try {
      if (this.isProcessing) {
        throw new Error('Another generation is already in progress');
      }

      // Verify video file exists
      await fs.access(videoPath);

      this.isProcessing = true;
      this.emit('generation-start', { videoPath });

      const outputPath = options.outputPath || videoPath.replace(/\.[^.]+$/, '.funscript');
      
      return new Promise((resolve, reject) => {
        const args = [
          this.scriptPath,
          '--video', videoPath,
          '--output', outputPath,
          '--model', options.model || 'yolov8n-pose',
          '--confidence', options.confidence || '0.7'
        ];

        if (options.generateKeypoints) {
          args.push('--keypoints');
        }

        this.pythonProcess = spawn(this.pythonPath, args);

        let stdoutData = '';
        let stderrData = '';

        this.pythonProcess.stdout.on('data', (data) => {
          stdoutData += data.toString();
          const lines = stdoutData.split('\n');
          
          lines.forEach(line => {
            if (line.includes('PROGRESS:')) {
              const progress = parseInt(line.split(':')[1]);
              this.emit('progress', { progress, videoPath });
            }
            if (line.includes('STAGE:')) {
              const stage = line.split(':')[1].trim();
              this.emit('stage', { stage, videoPath });
            }
          });
        });

        this.pythonProcess.stderr.on('data', (data) => {
          stderrData += data.toString();
          console.error('Python stderr:', data.toString());
        });

        this.pythonProcess.on('close', (code) => {
          this.isProcessing = false;
          this.pythonProcess = null;

          if (code === 0) {
            this.emit('generation-complete', { 
              videoPath, 
              funscriptPath: outputPath 
            });
            resolve({
              success: true,
              funscriptPath: outputPath,
              message: 'Funscript generated successfully'
            });
          } else {
            const error = new Error(`Python process exited with code ${code}\n${stderrData}`);
            this.emit('generation-error', { videoPath, error: error.message });
            reject(error);
          }
        });

        this.pythonProcess.on('error', (error) => {
          this.isProcessing = false;
          this.pythonProcess = null;
          this.emit('generation-error', { videoPath, error: error.message });
          reject(error);
        });
      });
    } catch (error) {
      this.isProcessing = false;
      throw error;
    }
  }

  // Cancel current generation
  cancelGeneration() {
    if (this.pythonProcess) {
      this.pythonProcess.kill();
      this.pythonProcess = null;
      this.isProcessing = false;
      this.emit('generation-cancelled');
      return { success: true, message: 'Generation cancelled' };
    }
    return { success: false, message: 'No generation in progress' };
  }

  // Batch process multiple videos
  async batchGenerate(videoPaths, options = {}) {
    const results = [];
    
    for (const videoPath of videoPaths) {
      try {
        this.emit('batch-progress', { 
          current: results.length + 1, 
          total: videoPaths.length,
          videoPath 
        });
        
        const result = await this.generateFunscript(videoPath, options);
        results.push({ videoPath, success: true, result });
      } catch (error) {
        results.push({ 
          videoPath, 
          success: false, 
          error: error.message 
        });
      }
    }

    this.emit('batch-complete', { results });
    return results;
  }

  // Install Python dependencies
  async installDependencies() {
    return new Promise((resolve, reject) => {
      const requirementsPath = path.join(__dirname, '../python/requirements.txt');
      const installProcess = spawn(this.pythonPath, [
        '-m', 'pip', 'install', '-r', requirementsPath
      ]);

      let output = '';

      installProcess.stdout.on('data', (data) => {
        output += data.toString();
        this.emit('install-progress', { message: data.toString() });
      });

      installProcess.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, message: 'Dependencies installed successfully' });
        } else {
          reject(new Error('Failed to install dependencies'));
        }
      });
    });
  }
}

module.exports = PythonBridge;
