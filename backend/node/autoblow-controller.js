// Autoblow Ultra AI Device Controller
const { AutoblowSDK } = require('@xsense/autoblow-sdk');
const Store = require('electron-store');
const EventEmitter = require('events');

class AutoblowController extends EventEmitter {
  constructor() {
    super();
    this.store = new Store({
      name: 'autoblow-credentials',
      encryptionKey: 'autoblow-ultra-app-key'
    });
    this.sdk = null;
    this.isConnected = false;
    this.deviceInfo = null;
  }

  // Initialize SDK with token
  async initialize(token) {
    try {
      if (!token) {
        throw new Error('Token is required');
      }

      this.sdk = new AutoblowSDK({
        token: token,
        apiUrl: 'https://latency.autoblowapi.com'
      });

      // Store encrypted token
      this.store.set('deviceToken', token);
      
      await this.connect();
      return { success: true, message: 'SDK initialized successfully' };
    } catch (error) {
      console.error('Failed to initialize SDK:', error);
      throw error;
    }
  }

  // Connect to device
  async connect() {
    try {
      if (!this.sdk) {
        const storedToken = this.store.get('deviceToken');
        if (storedToken) {
          await this.initialize(storedToken);
        } else {
          throw new Error('No token found. Please authenticate first.');
        }
      }

      this.deviceInfo = await this.sdk.connect();
      this.isConnected = true;
      this.emit('connected', this.deviceInfo);
      
      return {
        success: true,
        device: this.deviceInfo
      };
    } catch (error) {
      console.error('Connection failed:', error);
      this.isConnected = false;
      this.emit('error', error);
      throw error;
    }
  }

  // Disconnect from device
  async disconnect() {
    try {
      if (this.sdk && this.isConnected) {
        await this.sdk.disconnect();
        this.isConnected = false;
        this.emit('disconnected');
      }
      return { success: true };
    } catch (error) {
      console.error('Disconnect failed:', error);
      throw error;
    }
  }

  // Send funscript command to device
  async sendCommand(position, speed = 100) {
    try {
      if (!this.isConnected) {
        throw new Error('Device not connected');
      }

      await this.sdk.setPosition({
        position: Math.max(0, Math.min(100, position)),
        speed: Math.max(0, Math.min(100, speed))
      });

      return { success: true };
    } catch (error) {
      console.error('Command failed:', error);
      throw error;
    }
  }

  // Play funscript sequence
  async playFunscript(funscriptData) {
    try {
      if (!this.isConnected) {
        throw new Error('Device not connected');
      }

      if (!funscriptData || !funscriptData.actions) {
        throw new Error('Invalid funscript data');
      }

      this.emit('funscript-start', funscriptData);
      
      return {
        success: true,
        actions: funscriptData.actions.length
      };
    } catch (error) {
      console.error('Funscript playback failed:', error);
      throw error;
    }
  }

  // Stop current playback
  async stop() {
    try {
      if (this.sdk && this.isConnected) {
        await this.sdk.stop();
        this.emit('stopped');
      }
      return { success: true };
    } catch (error) {
      console.error('Stop failed:', error);
      throw error;
    }
  }

  // Get device status
  async getStatus() {
    try {
      if (!this.isConnected) {
        return {
          connected: false,
          message: 'Device not connected'
        };
      }

      const status = await this.sdk.getStatus();
      return {
        connected: true,
        device: this.deviceInfo,
        status: status
      };
    } catch (error) {
      console.error('Status check failed:', error);
      throw error;
    }
  }

  // Clear stored credentials
  clearCredentials() {
    this.store.delete('deviceToken');
    this.sdk = null;
    this.isConnected = false;
    return { success: true };
  }

  // Check if token exists
  hasStoredToken() {
    return this.store.has('deviceToken');
  }
}

module.exports = AutoblowController;
