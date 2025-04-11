import { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuth } from '@/hooks/useAuth';

export default function SplashScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait for auth check to complete and a short delay for the splash animation
    const timer = setTimeout(() => {
      if (user) {
        // User is logged in, redirect to main app
        router.replace('/(tabs)');
      } else {
        // User is not logged in, redirect to auth screen
        router.replace('/auth');
      }
    }, loading ? 2500 : 2000); // Wait a bit longer if still loading auth state

    return () => clearTimeout(timer);
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <Animated.Image
        entering={FadeIn.duration(1000)}
        source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop' }}
        style={styles.logo}
      />
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
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});