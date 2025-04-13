import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';

export type PushNotificationData = {
  title: string;
  body: string;
  data?: Record<string, any>;
};

// Check if device is capable of push notifications
export async function isPushNotificationsAvailable(): Promise<boolean> {
  // Physical device check
  const isPhysicalDevice = Device.isDevice;
  // Not web platform
  const isNotWeb = Platform.OS !== 'web';
  // Check if we're not in Expo Go or if we're in a dev client
  const isDevClient = Constants.executionEnvironment !== 'storeClient';
  
  // For logging purposes only - don't block functionality
  if (!isPhysicalDevice) {
    console.log('Push notifications require a physical device');
  }
  
  if (Constants.executionEnvironment === 'storeClient') {
    console.log('Full push notification support requires a development build');
  }
  
  // Return true if at least the basic conditions are met
  return isPhysicalDevice && isNotWeb;
}

// Register for push notifications and return the token
export async function registerForPushNotifications(): Promise<string | null> {
  let token: string | null = null;
  
  try {
    if (!await isPushNotificationsAvailable()) {
      return null; // Already logged in isPushNotificationsAvailable
    }
    
    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // Request permissions if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }
    
    try {
      // Get the token
      const response = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId || 'unknown',
      });
      token = response.data;
    } catch (tokenError) {
      // This might fail in Expo Go but we shouldn't crash
      console.log('Could not get push token:', tokenError);
      // We can still continue with local notifications
    }
    
    // Set up Android channel if needed
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      } catch (channelError) {
        console.log('Could not create notification channel:', channelError);
      }
    }
  } catch (error) {
    console.log('Error in registerForPushNotifications:', error);
  }
  
  return token;
}

// Save push token to user profile in Supabase
export async function savePushToken(userId: string, token: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ push_token: token })
      .eq('id', userId);
      
    if (error) {
      console.error('Error saving push token:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in savePushToken:', err);
    return false;
  }
}

// Send a local push notification
export async function sendLocalPushNotification(
  { title, body, data = {} }: PushNotificationData
): Promise<boolean> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Send immediately
    });
    return true;
  } catch (error) {
    console.log('Error sending local notification:', error);
    // This shouldn't block app functionality, so we handle the error gracefully
    return false;
  }
}

// Get the last notification response
export async function getLastNotificationResponse() {
  return await Notifications.getLastNotificationResponseAsync();
}

// Set up notification handlers
export function configurePushNotifications() {
  // Configure how notifications are presented when the app is in the foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// Add a notification listener
export function addNotificationListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

// Add a notification response listener
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

// Remove notification subscription
export function removeNotificationSubscription(
  subscription: Notifications.Subscription
) {
  Notifications.removeNotificationSubscription(subscription);
}
