import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { usePermissions, PermissionState, PermissionType } from './usePermissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Permission check interval in milliseconds (check permissions every 3 days)
const PERMISSION_CHECK_INTERVAL = 3 * 24 * 60 * 60 * 1000;

// Storage key for last permission check time
const LAST_PERMISSION_CHECK_KEY = 'last_permission_check_time';
// Storage key for if user has seen the permissions screen
const HAS_SEEN_PERMISSION_SCREEN_KEY = 'has_seen_permission_screen';

interface PermissionsContextValue {
  permissionState: PermissionState;
  loading: boolean;
  error: string | null;
  checkPermissions: () => Promise<PermissionState>;
  requestPermission: (type: PermissionType) => Promise<string>;
  requestAllPermissions: () => Promise<PermissionState>;
  openSettings: () => boolean;
  showPermissionAlert: (permission: PermissionType) => void;
  hasSeenPermissionScreen: boolean;
  setHasSeenPermissionScreen: (value: boolean) => void;
  shouldShowPermissionScreen: boolean;
  checkAndShowPermissionScreen: () => void;
}

// Create the context
const PermissionsContext = createContext<PermissionsContextValue | undefined>(undefined);

// Provider component
export function PermissionsProvider({ children }: { children: ReactNode }) {
  const permissions = usePermissions();
  const router = useRouter();
  const [hasSeenPermissionScreen, setHasSeenPermissionScreen] = useState(false);
  const [shouldShowPermissionScreen, setShouldShowPermissionScreen] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<number | null>(null);

  // Load permission screen state on mount
  useEffect(() => {
    const loadPermissionScreenState = async () => {
      try {
        const hasSeenScreen = await AsyncStorage.getItem(HAS_SEEN_PERMISSION_SCREEN_KEY);
        setHasSeenPermissionScreen(hasSeenScreen === 'true');
        
        const lastCheck = await AsyncStorage.getItem(LAST_PERMISSION_CHECK_KEY);
        if (lastCheck) {
          setLastCheckTime(parseInt(lastCheck, 10));
        }
      } catch (error) {
        console.error('Error loading permission screen state:', error);
      }
    };
    
    loadPermissionScreenState();
  }, []);

  // Determine if we should show the permission screen
  useEffect(() => {
    let isMounted = true;
    
    const determineIfShouldShowScreen = async () => {
      // Skip if still loading or user has all permissions
      if (permissions.loading || permissions.permissionState.allGranted) {
        if (isMounted) setShouldShowPermissionScreen(false);
        return;
      }

      // If user hasn't seen the screen yet, show it
      if (!hasSeenPermissionScreen) {
        if (isMounted) setShouldShowPermissionScreen(true);
        return;
      }

      // Check if it's time to re-check permissions (after the interval)
      const now = Date.now();
      if (!lastCheckTime || (now - lastCheckTime > PERMISSION_CHECK_INTERVAL)) {
        // If any permission is denied or undetermined, show the screen
        if (!permissions.permissionState.allGranted) {
          if (isMounted) setShouldShowPermissionScreen(true);
        }
        
        try {
          // Update the last check time regardless
          await AsyncStorage.setItem(LAST_PERMISSION_CHECK_KEY, now.toString());
          if (isMounted) setLastCheckTime(now);
        } catch (error) {
          console.error('Error saving last check time:', error);
        }
      } else {
        if (isMounted) setShouldShowPermissionScreen(false);
      }
    };

    if (!permissions.loading) {
      determineIfShouldShowScreen();
    }
    
    return () => {
      isMounted = false;
    };
  // Removing lastCheckTime from dependencies as it causes a loop
  // We're setting it inside this effect
  }, [permissions.loading, permissions.permissionState.allGranted, hasSeenPermissionScreen]);

  // Function to update hasSeenPermissionScreen in state and storage
  const updateHasSeenPermissionScreen = async (value: boolean) => {
    setHasSeenPermissionScreen(value);
    try {
      await AsyncStorage.setItem(HAS_SEEN_PERMISSION_SCREEN_KEY, value.toString());
    } catch (error) {
      console.error('Error saving permission screen state:', error);
    }
  };

  // Function to check permissions and redirect to permission screen if needed
  const checkAndShowPermissionScreen = () => {
    if (shouldShowPermissionScreen) {
      // Navigate using the more permissive string approach since this is a valid route
      // added to the stack in _layout.tsx
      router.push('permissions' as any);
    }
  };

  // Create the context value
  const contextValue = useMemo(() => ({
    ...permissions,
    hasSeenPermissionScreen,
    setHasSeenPermissionScreen: updateHasSeenPermissionScreen,
    shouldShowPermissionScreen,
    checkAndShowPermissionScreen,
  }), [
    // Extract only the specific properties we need from permissions
    // instead of the entire object to prevent unnecessary re-renders
    permissions.permissionState,
    permissions.loading,
    permissions.error,
    permissions.checkPermissions,
    permissions.requestPermission,
    permissions.requestAllPermissions,
    permissions.openSettings,
    permissions.showPermissionAlert,
    hasSeenPermissionScreen,
    shouldShowPermissionScreen,
    updateHasSeenPermissionScreen,
    checkAndShowPermissionScreen,
  ]);

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  );
}

// Custom hook to use the permissions context
export function usePermissionsContext() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissionsContext must be used within a PermissionsProvider');
  }
  return context;
}
