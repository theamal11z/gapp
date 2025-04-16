import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Platform, Linking, Alert } from 'react-native';
import Constants from 'expo-constants';

export type PermissionType = 'camera' | 'mediaLibrary' | 'notifications';
export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'limited';

export interface PermissionState {
  camera: PermissionStatus;
  mediaLibrary: PermissionStatus;
  notifications: PermissionStatus;
  allGranted: boolean;
}

export function usePermissions() {
  const [permissionState, setPermissionState] = useState<PermissionState>({
    camera: 'undetermined',
    mediaLibrary: 'undetermined',
    notifications: 'undetermined',
    allGranted: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if all required permissions are granted
  const updateAllGranted = useCallback((state: Partial<PermissionState>) => {
    // Create a new state object by merging current and new state
    const newState = { ...permissionState, ...state };
    const allGranted = 
      newState.camera === 'granted' &&
      newState.mediaLibrary === 'granted' &&
      newState.notifications === 'granted';
    
    return { ...newState, allGranted };
  // Don't include permissionState in the dependencies
  // This function is stable and doesn't need to be recreated when permissions change
  }, []);

  // Check the current status of all permissions
  const checkPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check camera permission
      const cameraPermission = await ImagePicker.getCameraPermissionsAsync();
      
      // Check media library permission
      const mediaLibraryPermission = await MediaLibrary.getPermissionsAsync();
      
      // Check notifications permission
      const notificationPermission = await Notifications.getPermissionsAsync();
      
      const newState = updateAllGranted({
        camera: cameraPermission.status,
        mediaLibrary: mediaLibraryPermission.status,
        notifications: notificationPermission.status,
      });
      
      setPermissionState(newState);
      return newState;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check permissions';
      setError(errorMessage);
      return permissionState;
    } finally {
      setLoading(false);
    }
  }, [permissionState, updateAllGranted]);

  // Request a specific permission
  const requestPermission = useCallback(async (type: PermissionType): Promise<PermissionStatus> => {
    try {
      let status: PermissionStatus = 'undetermined';
      
      switch (type) {
        case 'camera':
          const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
          status = cameraResult.status;
          break;
        
        case 'mediaLibrary':
          const mediaLibraryResult = await MediaLibrary.requestPermissionsAsync();
          status = mediaLibraryResult.status;
          break;
        
        case 'notifications':
          const notificationResult = await Notifications.requestPermissionsAsync();
          status = notificationResult.status;
          break;
      }
      
      // Update the permission state
      const updates = { [type]: status };
      const newState = updateAllGranted(updates as Partial<PermissionState>);
      setPermissionState(newState);
      
      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to request ${type} permission`;
      setError(errorMessage);
      return 'undetermined';
    }
  }, [updateAllGranted]);

  // Request all permissions at once
  const requestAllPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cameraStatus = await requestPermission('camera');
      const mediaLibraryStatus = await requestPermission('mediaLibrary');
      const notificationsStatus = await requestPermission('notifications');
      
      const newState = updateAllGranted({
        camera: cameraStatus,
        mediaLibrary: mediaLibraryStatus,
        notifications: notificationsStatus,
      });
      
      setPermissionState(newState);
      return newState;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request all permissions';
      setError(errorMessage);
      return permissionState;
    } finally {
      setLoading(false);
    }
  }, [permissionState, requestPermission, updateAllGranted]);

  // Open app settings
  const openSettings = useCallback(() => {
    try {
      Linking.openSettings();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open settings';
      setError(errorMessage);
      return false;
    }
  }, []);

  // Show alert for denied permission with option to open settings
  const showPermissionAlert = useCallback((permission: PermissionType) => {
    const permissionNames = {
      camera: 'Camera',
      mediaLibrary: 'Photos',
      notifications: 'Notifications'
    };
    
    Alert.alert(
      `${permissionNames[permission]} Permission Required`,
      `We need access to your ${permissionNames[permission].toLowerCase()} to enable this feature. Please grant permission in the app settings.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: openSettings }
      ]
    );
  }, [openSettings]);

  // Initialize permission checks on component mount
  useEffect(() => {
    // Only check on initial mount, not on re-renders
    let isMounted = true;
    const initialCheck = async () => {
      try {
        if (isMounted) await checkPermissions();
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    };
    
    initialCheck();
    
    return () => {
      isMounted = false;
    };
  // Run only on mount, not when checkPermissions changes to prevent loops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    permissionState,
    loading,
    error,
    checkPermissions,
    requestPermission,
    requestAllPermissions,
    openSettings,
    showPermissionAlert,
  };
}
