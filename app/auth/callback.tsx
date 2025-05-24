import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { StatusBar } from 'expo-status-bar';

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback
        const { error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error('Error refreshing session:', error);
          // If there's an error, redirect to auth page
          setTimeout(() => router.replace('/auth'), 2000);
        } else {
          // If successful, redirect to the main app
          setTimeout(() => router.replace('/(tabs)'), 2000);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setTimeout(() => router.replace('/auth'), 2000);
      }
    };
    
    handleAuthCallback();
  }, [params]);
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ActivityIndicator size="large" color="#2ECC71" />
      <Text style={styles.text}>Verifying your account...</Text>
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
