import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { Alert, Platform, Linking } from 'react-native';

/**
 * Request permission to access the camera and photo library
 * @returns Promise resolving to true if permissions were granted, false otherwise
 */
export async function requestMediaLibraryPermissions(): Promise<boolean> {
  // Request media library permissions
  const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (!libraryPermission.granted) {
    Alert.alert(
      "Permission Required",
      "This app needs access to your photo library to upload images.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Settings", onPress: () => Linking.openSettings() }
      ]
    );
    return false;
  }
  
  return true;
}

/**
 * Request permission to access the device camera
 * @returns Promise resolving to true if permissions were granted, false otherwise
 */
export async function requestCameraPermissions(): Promise<boolean> {
  // Request camera permissions
  const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  
  if (!cameraPermission.granted) {
    Alert.alert(
      "Permission Required",
      "This app needs access to your camera to take photos.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Settings", onPress: () => Linking.openSettings() }
      ]
    );
    return false;
  }
  
  return true;
}

/**
 * Request notification permissions
 * @returns Promise resolving to true if permissions were granted, false otherwise
 */
export async function requestNotificationsPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false; // Notifications not supported on web
  }
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  // If permission is not granted, request it
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    Alert.alert(
      "Permission Required",
      "Please enable notifications to receive order updates and special offers.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Settings", 
          onPress: () => {
            // Open settings directly
            Linking.openSettings();
          } 
        }
      ]
    );
    return false;
  }
  
  return true;
}

/**
 * Pick an image from the media library
 * @param allowsEditing Whether to allow editing the image
 * @returns Promise resolving to the selected asset or null if cancelled
 */
export async function pickImage(allowsEditing = true): Promise<ImagePicker.ImagePickerResult | null> {
  const hasPermission = await requestMediaLibraryPermissions();
  
  if (!hasPermission) {
    return null;
  }
  
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      return result;
    }
  } catch (error) {
    console.error('Error picking image:', error);
  }
  
  return null;
}

/**
 * Take a photo using the camera
 * @param allowsEditing Whether to allow editing the image
 * @returns Promise resolving to the captured asset or null if cancelled
 */
export async function takePhoto(allowsEditing = true): Promise<ImagePicker.ImagePickerResult | null> {
  const hasPermission = await requestCameraPermissions();
  
  if (!hasPermission) {
    return null;
  }
  
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      return result;
    }
  } catch (error) {
    console.error('Error taking photo:', error);
  }
  
  return null;
}
