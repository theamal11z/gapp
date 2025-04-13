import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
// Import only what we need from supabase directly to avoid circular dependencies
import type { Notification as NotificationType } from '@/lib/supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationContextProps {
  notifications: NotificationType[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  sendPushNotification: (title: string, body: string, data?: any) => Promise<void>;
  expoPushToken: string | null;
  registerForPushNotifications: () => Promise<string | null>;
}

export const NotificationContext = createContext<NotificationContextProps | null>(null);

// Internal hook for context consumers
export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const { user } = useAuth();

  // Register for push notifications
  const registerForPushNotifications = async (): Promise<string | null> => {
    let token: string | null = null;
    
    try {
      // Check if running in Expo Go
      const isExpoGo = Constants.executionEnvironment === 'storeClient';
      
      // Check if this is a physical device
      if (!Constants.isDevice) {
        console.log('Push notifications require a physical device');
        return null;
      }
      
      // Check permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      // If no permission, request it
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      // If still no permission, return null
      if (finalStatus !== 'granted') {
        console.log('Push notification permission not granted');
        return null;
      }
      
      // Try to get the token, handling potential Expo Go limitations
      try {
        const tokenResponse = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId || 'unknown',
        });
        token = tokenResponse.data;
        
        // Store the token
        setExpoPushToken(token);
        
        // If user is authenticated, save token to database
        if (user) {
          await supabase
            .from('profiles')
            .update({ push_token: token })
            .eq('id', user.id);
        }
      } catch (tokenError) {
        console.log('Unable to get push token:', tokenError);
        if (isExpoGo) {
          console.log('Full push notification functionality requires a development build');
        }
        return null;
      }
    } catch (error) {
      console.log('Push notification setup error:', error);
      return null;
    }
  
    // Required for Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return token || null;
  };

  // Function to send a push notification
  const sendPushNotification = async (title: string, body: string, data: any = {}) => {
    try {
      // Save notification to database if user is logged in (do this first)
      if (user) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          title,
          message: body,
          type: data.type || 'system',
          read: false
        });
      }
      
      // If we don't have a token, we can still do local notifications
      const notificationContent = {
        title,
        body,
        data,
      };
      
      // Schedule local notification
      try {
        await Notifications.scheduleNotificationAsync({
          content: notificationContent,
          trigger: null, // Send immediately
        });
      } catch (error) {
        console.log('Local notification failed:', error);
        // Even if push fails, we already saved to DB
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Function to mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
      
    // Update local state
    setNotifications(
      notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  // Get notifications when user changes
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data && !error) {
        setNotifications(data);
      }
    };
    
    fetchNotifications();
    
    // Register for push notifications
    registerForPushNotifications();
    
    // Subscribe to new notifications
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new as NotificationType, ...prev]);
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Subscribe to notification events
  useEffect(() => {
    let subscription: Notifications.Subscription | null = null;
    let responseSubscription: Notifications.Subscription | null = null;
    
    try {
      subscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
      });

      responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response received:', response);
        // Handle notification response (e.g., navigate to specific screen)
      });
    } catch (error) {
      console.log('Could not set up notification listeners:', error);
    }

    return () => {
      if (subscription) {
        try {
          Notifications.removeNotificationSubscription(subscription);
        } catch (e) { /* ignore cleanup errors */ }
      }
      if (responseSubscription) {
        try {
          Notifications.removeNotificationSubscription(responseSubscription); 
        } catch (e) { /* ignore cleanup errors */ }
      }
    };
  }, []);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    sendPushNotification,
    expoPushToken,
    registerForPushNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
