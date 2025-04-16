import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator
} from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { usePermissions, PermissionType } from '@/hooks/usePermissions';

// Define the permission items with icons and descriptions
const PERMISSIONS = [
  {
    key: 'camera',
    title: 'Camera',
    description: 'Used to take photos for your profile and product scanning',
    icon: 'camera',
    color: '#4CAF50',
  },
  {
    key: 'mediaLibrary',
    title: 'Photos',
    description: 'Access to choose images from your photo library',
    icon: 'images',
    color: '#2196F3',
  },
  {
    key: 'notifications',
    title: 'Notifications',
    description: 'Receive updates about your orders and offers',
    icon: 'notifications',
    color: '#FF9800',
  },
];

export default function PermissionsScreen() {
  const router = useRouter();
  const segments = useSegments();
  const {
    permissionState,
    loading,
    requestPermission,
    requestAllPermissions,
    openSettings,
  } = usePermissions();

  const [requestedAll, setRequestedAll] = useState(false);
  const [processingItem, setProcessingItem] = useState<string | null>(null);

  // Check if we need to redirect the user
  useEffect(() => {
    // If all permissions are granted, redirect to the main app
    if (permissionState.allGranted && !loading && requestedAll) {
      // Use a type-safe approach instead of string literals
      if (segments.some(segment => segment === '(tabs)')) {
        router.replace('/(tabs)');
      } else {
        router.replace('/');
      }
    }
  }, [permissionState.allGranted, loading, requestedAll, router, segments]);

  // Handle requesting a single permission
  const handleRequestPermission = async (type: PermissionType) => {
    setProcessingItem(type);
    await requestPermission(type);
    setProcessingItem(null);
  };

  // Handle requesting all permissions at once
  const handleRequestAllPermissions = async () => {
    setRequestedAll(true);
    await requestAllPermissions();
  };

  // Handle opening settings
  const handleOpenSettings = () => {
    openSettings();
  };

  // Determine if any permission is denied (vs undetermined)
  const hasDeniedPermissions = Object.entries(permissionState)
    .filter(([key]) => key !== 'allGranted')
    .some(([_, status]) => status === 'denied');

  if (loading && !processingItem) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A4A4A" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>App Permissions</Text>
        <Text style={styles.subtitle}>
          GroceryGuj needs the following permissions to provide you with the best experience
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {PERMISSIONS.map((item) => {
          const status = permissionState[item.key as PermissionType];
          const isProcessing = processingItem === item.key;
          
          return (
            <View key={item.key} style={styles.permissionCard}>
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={28} color="white" />
              </View>
              
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionTitle}>{item.title}</Text>
                <Text style={styles.permissionDescription}>{item.description}</Text>
                
                <View style={styles.statusContainer}>
                  {status === 'granted' ? (
                    <View style={styles.statusRow}>
                      <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                      <Text style={[styles.statusText, { color: '#4CAF50' }]}>Granted</Text>
                    </View>
                  ) : status === 'denied' ? (
                    <View style={styles.statusRow}>
                      <Ionicons name="close-circle" size={18} color="#F44336" />
                      <Text style={[styles.statusText, { color: '#F44336' }]}>Denied</Text>
                    </View>
                  ) : (
                    <View style={styles.statusRow}>
                      <Ionicons name="ellipsis-horizontal-circle" size={18} color="#FF9800" />
                      <Text style={[styles.statusText, { color: '#FF9800' }]}>Not set</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.permissionButton,
                  status === 'granted' && styles.permissionButtonDisabled,
                ]}
                onPress={() => 
                  status === 'denied' 
                    ? handleOpenSettings() 
                    : handleRequestPermission(item.key as PermissionType)
                }
                disabled={status === 'granted' || isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : status === 'granted' ? (
                  <Ionicons name="checkmark" size={22} color="white" />
                ) : status === 'denied' ? (
                  <Text style={styles.buttonText}>Settings</Text>
                ) : (
                  <Text style={styles.buttonText}>Allow</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        {hasDeniedPermissions ? (
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={handleOpenSettings}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.allowAllButton}
            onPress={handleRequestAllPermissions}
            disabled={permissionState.allGranted || loading}
          >
            {loading && requestedAll ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.allowAllText}>
                {permissionState.allGranted 
                  ? 'All Permissions Granted' 
                  : 'Allow All Permissions'}
              </Text>
            )}
          </TouchableOpacity>
        )}
        
        {!permissionState.allGranted && (
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => {
              // Use a type-safe approach instead of string literals
              if (segments.some(segment => segment === '(tabs)')) {
                router.replace('/(tabs)');
              } else {
                router.replace('/');
              }
            }}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4A4A4A',
    fontFamily: 'Poppins-Regular',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
    marginBottom: 8,
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginLeft: 4,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    height: 40,
  },
  permissionButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  footer: {
    padding: 24,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },

  allowAllButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowAllText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  settingsButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  skipText: {
    color: '#757575',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
});
