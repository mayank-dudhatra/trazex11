import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { stockSocket } from '../../services/stockSocket';

const SocketProvider = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ['/', '/login', '/register'];
    const isPublicRoute = publicRoutes.includes(location.pathname);
    const token = localStorage.getItem('token');

    if (isPublicRoute || !token) {
      stockSocket.disconnect();
      return;
    }

    stockSocket.connect();

    return () => {
      stockSocket.disconnect();
    };
  }, [location.pathname]);

  return children;
};

export default SocketProvider;
