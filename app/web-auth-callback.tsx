import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { StatusBar } from 'expo-status-bar';
import { Linking } from 'react-native';

/**
 * This component handles web-based authentication redirects from Supabase
 * It's specifically designed for the web domain redirect URL
 */
export default function WebAuthCallbackScreen() {
  const params = useLocalSearchParams();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // For web, we need to handle the hash fragment or query parameters
        if (Platform.OS === 'web') {
          const hash = window.location.hash;
          const query = window.location.search;
          
          // Process hash or query parameters
          if (hash || query) {
            // Handle the auth callback
            const { error } = await supabase.auth.refreshSession();
            
            if (error) {
              console.error('Error refreshing session:', error);
              // If there's an error, redirect to auth page
              router.replace('/auth');
            } else {
              // If successful, redirect to the main app
              router.replace('/(tabs)');
            }
          }
        } else {
          // For mobile, try to open the app via deep link
          const appUrl = 'grocerygunj://auth/callback';
          const canOpen = await Linking.canOpenURL(appUrl);
          
          if (canOpen) {
            await Linking.openURL(appUrl);
          } else {
            // Fallback to in-app handling
            const { error } = await supabase.auth.refreshSession();
            
            if (error) {
              console.error('Error refreshing session:', error);
              router.replace('/auth');
            } else {
              router.replace('/(tabs)');
            }
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.replace('/auth');
      }
    };
    
    handleAuthCallback();
  }, [params]);
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ActivityIndicator size="large" color="#2ECC71" />
      <Text style={styles.text}>Processing authentication...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
