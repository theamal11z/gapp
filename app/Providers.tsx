import React, { ReactNode, useEffect } from 'react';
import { WishlistProvider } from '@/hooks/WishlistContext';
import { CartProvider } from '@/lib/CartContext';
import { AuthProvider } from '@/hooks/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { NetworkProvider } from '@/components/NetworkProvider';
import { NotificationProvider } from '@/hooks/NotificationContext';
import * as Notifications from 'expo-notifications';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // Set up notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <NetworkProvider>
        <AuthProvider>
          <NotificationProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </WishlistProvider>
          </NotificationProvider>
        </AuthProvider>
      </NetworkProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 