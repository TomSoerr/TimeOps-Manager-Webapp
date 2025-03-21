import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { setupSSEConnection } from '../services/sseService';

interface ConnectionContextType {
  isOnline: boolean;
  setOnline: (status: boolean) => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined,
);

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOnline, setOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    // Listen to browser's online/offline events
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize SSE connection
    const cleanupSSE = setupSSEConnection(setOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      cleanupSSE();
    };
  }, []);

  return (
    <ConnectionContext.Provider value={{ isOnline, setOnline }}>
      {children}
    </ConnectionContext.Provider>
  );
};

// Custom hook for easy access to the connection status
export const useConnection = (): ConnectionContextType => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};
