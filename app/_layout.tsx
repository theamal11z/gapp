import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { SplashScreen } from 'expo-router';
import Providers from './Providers';
import suppressWarnings from '@/utils/errorSuppression';
import { usePermissionsContext } from '@/hooks/PermissionsContext';

// Apply warning suppression
suppressWarnings();

// Suppress text rendering warnings globally
LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text> component',
]);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });
  
  // Permission context is wrapped inside Providers, so this is safe inside the render
  function PermissionCheck() {
    const permissions = usePermissionsContext();
    
    // After fonts have loaded and the app is ready, check permissions
    useEffect(() => {
      let isMounted = true;
      
      const checkAndRedirect = async () => {
        if (fontsLoaded && !fontError) {
          // Check permission status and show permission screen if needed
          await permissions.checkPermissions();
          
          // Only proceed if the component is still mounted
          if (isMounted) {
            permissions.checkAndShowPermissionScreen();
          }
        }
      };
      
      checkAndRedirect();
      
      // Cleanup function to prevent updates on unmounted component
      return () => {
        isMounted = false;
      };
    // Remove permissions from dependencies to prevent infinite updates
    // Only check when fonts are loaded or there's a font error
    }, [fontsLoaded, fontError]);
    
    return null;
  }

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="permissions" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="cart" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="order-confirmation" />
        <Stack.Screen name="order-tracking" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="offers" />
        <Stack.Screen name="help" />
        <Stack.Screen name="address" />
        <Stack.Screen name="payment-methods" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="products" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="settings" />
      </Stack>
      <StatusBar style="auto" />
      <PermissionCheck />
    </Providers>
  );
}