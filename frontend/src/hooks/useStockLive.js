import { useEffect, useState, useCallback } from 'react';
import { stockSocket } from '../services/stockSocket';

/**
 * useStockLive Hook
 * Manages live stock updates via WebSocket
 * Use this in components to get real-time stock data
 * 
 * Example:
 * const stock = useStockLive('RELIANCE.NS');
 */

export const useStockLive = (symbol) => {
  const [stock, setStock] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect socket if not already connected
    if (!stockSocket.isConnected) {
      stockSocket.connect();
    }

    setIsConnected(stockSocket.isConnected);

    if (!symbol) return;

    try {
      // Subscribe to stock updates
      stockSocket.onStockUpdate(symbol, (data) => {
        setStock(data);
        setError(null);
      });

      return () => {
        stockSocket.unsubscribeStock(symbol);
      };
    } catch (err) {
      setError(err.message);
      console.error('Error subscribing to stock:', err);
    }
  }, [symbol]);

  return { stock, isConnected, error };
};

/**
 * useMarketStats Hook
 * Get top gainers, losers, and overall market stats
 * 
 * Example:
 * const { topGainers, topLosers } = useMarketStats();
 */

export const useMarketStats = () => {
  const [stats, setStats] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect socket if not already connected
    if (!stockSocket.isConnected) {
      stockSocket.connect();
    }

    setIsConnected(stockSocket.isConnected);

    try {
      setLoading(true);

      // Subscribe to market stats
      stockSocket.onLiveMarketStats((data) => {
        setStats(data.data);
        setError(null);
        setLoading(false);
      });

      // Request initial stats
      stockSocket.requestStats((data) => {
        setStats(data.data);
        setLoading(false);
      });

      return () => {
        // Cleanup if needed
      };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error getting market stats:', err);
    }
  }, []);

  return { stats, isConnected, loading, error };
};

/**
 * useMultipleStocks Hook
 * Monitor multiple stocks at once
 * 
 * Example:
 * const stocks = useMultipleStocks(['RELIANCE.NS', 'TCS.NS', 'INFY.NS']);
 */

export const useMultipleStocks = (symbols) => {
  const [stocks, setStocks] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connect socket if not already connected
    if (!stockSocket.isConnected) {
      stockSocket.connect();
    }

    setIsConnected(stockSocket.isConnected);

    if (!symbols || symbols.length === 0) {
      setLoading(false);
      return;
    }

    const updateHandlers = {};

    // Subscribe to each symbol
    symbols.forEach((symbol) => {
      updateHandlers[symbol] = (data) => {
        setStocks((prev) => ({
          ...prev,
          [symbol]: data
        }));
      };

      stockSocket.onStockUpdate(symbol, updateHandlers[symbol]);
    });

    setLoading(false);

    return () => {
      symbols.forEach((symbol) => {
        stockSocket.unsubscribeStock(symbol);
      });
    };
  }, [symbols?.join(',')]); // Join to avoid re-render on array reference change

  return { stocks, isConnected, loading };
};

export default useStockLive;
