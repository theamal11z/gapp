import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { OfflineScreen } from './OfflineScreen';

interface NetworkContextType {
  isConnected: boolean;
  checkConnection: () => Promise<boolean>;
}

const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
  checkConnection: async () => true,
});

export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
  children: React.ReactNode;
}

export function NetworkProvider({ children }: NetworkProviderProps) {
  const [isConnected, setIsConnected] = useState(true);

  const checkConnection = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(!!state.isConnected);
    return !!state.isConnected;
  };

  useEffect(() => {
    // Check connection when component mounts
    checkConnection();

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  // Provide network state and utilities to children
  const value = {
    isConnected,
    checkConnection,
  };

  // If not connected, show the offline screen
  if (!isConnected) {
    return <OfflineScreen onRetry={checkConnection} />;
  }

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}
