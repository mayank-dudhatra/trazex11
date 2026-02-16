import io from 'socket.io-client';

/**
 * Socket.io Client Setup
 * Connects to backend live stock update service
 * Handles real-time stock price updates via WebSocket
 */

const SOCKET_SERVER_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')
    : 'http://localhost:3001');

class StockSocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.subscriptions = new Set();
    this.listeners = new Map();
    this._stockListenerAttached = false;
  }

  /**
   * Initialize and connect to server
   */
  connect() {
    if (this.isConnected) {
      console.log('⚠️ Socket already connected');
      return;
    }

    try {
      this.socket = io(SOCKET_SERVER_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling']
      });

      // Connection events
      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('✅ Connected to live stock server');
        this._resubscribeToAll();
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('❌ Disconnected from live stock server');
      });

      this.socket.on('error', (error) => {
        console.error('🔴 Socket error:', error);
      });

      this.socket.on('connect_error', (error) => {
        console.error('🔴 Connection error:', error.message);
      });

      return this;
    } catch (error) {
      console.error('❌ Failed to initialize socket:', error.message);
      return null;
    }
  }

  /**
   * Subscribe to live market stats
   */
  onLiveMarketStats(callback) {
    if (!this.socket) return;

    this.socket.on('market:stats', (data) => {
      callback(data);
    });

    this.socket.emit('request:stats');
  }

  /**
   * Subscribe to specific stock updates
   */
  onStockUpdate(symbol, callback) {
    if (!this.socket) return;

    // Store listener
    this.listeners.set(symbol, callback);

    // Subscribe
    this.subscriptions.add(symbol);
    this.socket.emit('subscribe', symbol);

    // Listen for updates
    this._ensureStockListener();

    console.log(`📊 Subscribed to ${symbol}`);
  }

  /**
   * Unsubscribe from stock updates
   */
  unsubscribeStock(symbol) {
    if (!this.socket) return;

    this.subscriptions.delete(symbol);
    this.listeners.delete(symbol);
    this.socket.emit('unsubscribe', symbol);

    console.log(`👋 Unsubscribed from ${symbol}`);
  }

  /**
   * Get market stats
   */
  requestStats(callback) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('request:stats');
    this.socket.once('market:stats', (data) => {
      callback(data);
    });
  }

  /**
   * Re-subscribe to all stored subscriptions
   */
  _resubscribeToAll() {
    for (const symbol of this.subscriptions) {
      this.socket.emit('subscribe', symbol);
      console.log(`🔄 Resubscribed to ${symbol}`);
    }
  }

  _ensureStockListener() {
    if (!this.socket || this._stockListenerAttached) return;

    this.socket.on('stockUpdate', (data) => {
      const symbol = data?.symbol;
      if (!symbol) return;
      const handler = this.listeners.get(symbol);
      if (handler) {
        handler(data);
      }
    });

    this._stockListenerAttached = true;
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
      this._stockListenerAttached = false;
      console.log('❌ Socket disconnected');
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      subscriptions: Array.from(this.subscriptions),
      socketId: this.socket?.id || null
    };
  }
}

// Export singleton instance
export const stockSocket = new StockSocketClient();

export default stockSocket;
