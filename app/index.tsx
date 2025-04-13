import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';
import OptimizedImage from '@/components/OptimizedImage';
import { supabase } from '@/lib/supabase';

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        // Delay redirect slightly for a smoother experience
        setTimeout(() => {
          if (data.session) {
            // User is authenticated, go to main app
            router.replace('/(tabs)');
          } else {
            // No active session, go to auth
            router.replace('/auth');
          }
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Auth check error:', error);
        // On error, default to auth screen
        setTimeout(() => {
          router.replace('/auth');
          setIsLoading(false);
        }, 1500);
      }
    };
    
    checkAuthStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={styles.logoContainer}>
        <OptimizedImage
          source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop' }}
          style={styles.logo}
          contentFit="contain"
          priority="high"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});