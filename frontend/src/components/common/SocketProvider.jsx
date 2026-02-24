import { useEffect } from 'react';
import { stockSocket } from '../../services/stockSocket';

const SocketProvider = ({ children }) => {
  useEffect(() => {
    stockSocket.connect();

    return () => {
      stockSocket.disconnect();
    };
  }, []);

  return children;
};

export default SocketProvider;
