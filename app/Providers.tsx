import React, { ReactNode, useEffect } from 'react';
import { WishlistProvider } from '@/hooks/WishlistContext';
import { CartProvider } from '@/lib/CartContext';
import { AuthProvider } from '@/hooks/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { disableReanimatedLayoutAnimations } from '@/utils/disableLayoutAnimations';
import { setupDeepLinkHandlers } from '@/lib/deepLinkHandler';

// Disable layout animations immediately on import
disableReanimatedLayoutAnimations();

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Ensure layout animations are disabled on component mount as well
  useEffect(() => {
    disableReanimatedLayoutAnimations();
    
    // Initialize deep link handlers for Supabase auth
    setupDeepLinkHandlers();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 