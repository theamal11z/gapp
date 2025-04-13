import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, StyleProp, ImageStyle, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { 
  optimizeImageUrl, 
  getPlaceholderUrl, 
  DEFAULT_PLACEHOLDER, 
  isBase64Image,
  processBase64Image 
} from '@/utils/imageOptimizer';

interface FastImageLoaderProps {
  uri: string | null | undefined;
  style?: any; // Using any to avoid TypeScript conflicts between ViewStyle and ImageStyle
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  showLoader?: boolean;
  width?: number;
  height?: number;
  priority?: 'low' | 'normal' | 'high';
  quality?: number;
}

export default function FastImageLoader({
  uri,
  style,
  contentFit = 'cover',
  showLoader = false,
  width,
  height,
  priority = 'normal',
  quality = 80
}: FastImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMounted = useRef(true);
  
  // Determine the cache policy based on priority
  const cachePolicy = priority === 'high' ? 'memory-disk' : 'disk';
  
  // Calculate the transition time based on priority
  const transitionDuration = (() => {
    switch (priority) {
      case 'high': return 0; // Immediate display for high priority
      case 'normal': return 100;
      case 'low': return 200;
      default: return 100;
    }
  })();
  
  // Get placeholder & optimized image URLs based on image type
  const isBase64 = uri ? isBase64Image(uri) : false;
  
  // Handle differently based on image type (base64 or URL)
  const placeholderUrl = uri 
    ? isBase64 
      ? processBase64Image(uri, { isPlaceholder: true }) 
      : getPlaceholderUrl(uri) 
    : DEFAULT_PLACEHOLDER;
    
  const optimizedUrl = uri 
    ? isBase64 
      ? uri // Base64 images are passed through directly
      : optimizeImageUrl(uri, { width, height, quality }) 
    : null;
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // If no URI is provided, show placeholder with blur
  if (!optimizedUrl) {
    return (
      <View style={[styles.container, style]}>
        <Image
          source={DEFAULT_PLACEHOLDER}
          style={styles.image}
          contentFit={contentFit}
        />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, style as any]}>
      {/* Placeholder blur image */}
      <Image
        source={{ uri: placeholderUrl }}
        style={[
          styles.image,
          styles.placeholder,
          isLoading ? styles.visible : styles.hidden
        ]}
        contentFit={contentFit}
        transition={0}
      />
      
      {/* Main optimized image */}
      <Image
        source={{ uri: optimizedUrl }}
        style={[
          styles.image,
          styles.mainImage,
          isLoading ? styles.hidden : styles.visible
        ]}
        contentFit={contentFit}
        cachePolicy={cachePolicy}
        recyclingKey={optimizedUrl}
        transition={transitionDuration}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => {
          if (isMounted.current) {
            setIsLoading(false);
            setError(false);
          }
        }}
        onError={() => {
          if (isMounted.current) {
            setError(true);
            setIsLoading(false);
          }
        }}
      />
      
      {/* Loading indicator (optional) */}
      {showLoader && isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#2ECC71" />
        </View>
      )}
    </View>
  );
}

// Using any for container style to avoid TypeScript errors with ImageStyle vs ViewStyle
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  mainImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
});
