import { Linking } from 'react-native';
import { supabase } from './supabase';
import { router } from 'expo-router';

/**
 * Handles deep links for authentication
 * This is used to process links sent by Supabase for email verification
 */
export const handleDeepLink = async (url: string | null) => {
  if (!url) return;
  
  console.log('Received deep link:', url);
  
  // Check if the URL is a Supabase auth URL
  if (url.includes('#access_token=') || url.includes('?token=')) {
    try {
      // Extract the hash or query params from the URL
      const params = url.includes('#') 
        ? url.split('#')[1] 
        : url.includes('?') 
          ? url.split('?')[1] 
          : '';
          
      if (!params) return;
      
      // Parse the parameters
      const queryParams = params.split('&').reduce((acc, param) => {
        const [key, value] = param.split('=');
        return { ...acc, [key]: value };
      }, {} as Record<string, string>);
      
      // Handle different auth flows
      if (queryParams.type === 'recovery') {
        // Password reset flow
        // Navigate to auth screen with reset token
        // Using '/auth' which is a valid route in the app
        router.push({
          pathname: '/auth',
          params: { reset: 'true', token: queryParams.access_token || queryParams.token }
        });
      } else if (queryParams.type === 'signup' || url.includes('confirmation')) {
        // Email verification flow
        const { error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error('Error refreshing session:', error);
          router.push('/auth');
        } else {
          // Successfully verified email
          console.log('Email successfully verified');
          router.replace('/(tabs)');
        }
      } else {
        // General auth callback
        const { error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error('Error refreshing session:', error);
          router.push('/auth');
        } else {
          console.log('Authentication successful');
          router.replace('/(tabs)');
        }
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
      router.push('/auth');
    }
  }
};

/**
 * Sets up listeners for deep links
 * Call this in your app's entry point
 */
export const setupDeepLinkHandlers = () => {
  // Handle deep links when the app is already open
  Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });
  
  // Handle deep links that opened the app
  Linking.getInitialURL().then(url => {
    handleDeepLink(url);
  });
  
  // Register the web domain for handling auth callbacks
  // Note: The actual URL configuration is handled in app.json intentFilters
  console.log('Deep link handlers initialized');
  console.log(`App scheme: grocerygunj://`);
  console.log(`Web domain: https://grocery-gunj.vercel.app/auth/callback`);
};
