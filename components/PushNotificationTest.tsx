import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { requestNotificationsPermissions } from '@/utils/permissions';
import { useNotifications } from '@/hooks/useNotifications';

export function PushNotificationTest() {
  const { sendNotification } = useNotifications();
  const [title, setTitle] = useState('Test Notification');
  const [message, setMessage] = useState('This is a test push notification!');
  const [sending, setSending] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  // Check notification permissions when component mounts
  useEffect(() => {
    checkPermissions();
  }, []);
  
  // Function to check notification permissions
  const checkPermissions = async () => {
    const hasPermission = await requestNotificationsPermissions();
    setPermissionGranted(hasPermission);
  };

  const handleSendNotification = async () => {
    if (!title || !message) {
      Alert.alert('Error', 'Please enter both title and message');
      return;
    }
    
    // Check permissions before sending notification
    if (!permissionGranted) {
      const granted = await requestNotificationsPermissions();
      setPermissionGranted(granted);
      if (!granted) return;
    }

    try {
      setSending(true);
      await sendNotification(title, message, { type: 'system' });
      Alert.alert('Success', 'Notification sent successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
      console.error('Notification error:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notification Test</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter notification title"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={message}
          onChangeText={setMessage}
          placeholder="Enter notification message"
          multiline
          numberOfLines={3}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSendNotification}
        disabled={sending}
      >
        <Text style={styles.buttonText}>
          {sending ? 'Sending...' : 'Send Test Notification'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.note}>
        Note: On physical devices, this will send an actual push notification.
        On simulators, it will only create a local notification.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  note: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#888',
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
