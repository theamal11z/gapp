import React, { useState } from 'react';
import { Image, ImageProps, ImageStyle } from 'expo-image';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Tiny 1x1 pixel transparent image as base64 for fast placeholder
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Define our enhanced props interface extending from expo-image props
interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: string | { uri: string } | any; // Using any to support custom source with headers
  thumbnailSource?: string;
  style?: any; // Using any to support both ViewStyle and ImageStyle
  showLoadingIndicator?: boolean;
  lowQualitySize?: number;
  priority?: 'low' | 'normal' | 'high';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  thumbnailSource,
  showLoadingIndicator = false,
  lowQualitySize = 10, // Default blur quality size (lower = more blurry but faster)
  priority = 'normal',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const uri = typeof source === 'string' ? source : source.uri;
  
  // Generate a low-quality preview URL if supported by your image service
  // This works with services like Cloudinary, Imgix, etc.
  // For demonstration, we're manipulating the URI with a size parameter
  const getThumbUrl = (url: string) => {
    if (thumbnailSource) return thumbnailSource;
    
    // Example logic to create thumbnail URLs - modify according to your image service
    try {
      const u = new URL(url);
      // This assumes your image URLs support width/quality parameters
      // Adjust this logic based on your image hosting service
      if (u.hostname.includes('cloudinary.com')) {
        return url.replace('/upload/', `/upload/w_${lowQualitySize},q_10/`);
      }
      return url;
    } catch (e) {
      return url;
    }
  };
  
  // Build optimal image delivery params
  let imageSource: any = { uri };
  if (typeof uri === 'string' && uri.startsWith('http')) {
    // Use custom source with headers for better caching
    // This is supported by expo-image but needs type casting
    imageSource = {
      uri,
      headers: {
        // Add Cache-Control header to ensure browser caches images properly
        'Cache-Control': 'max-age=31536000',
      },
    };
  }
  
  return (
    <View style={[styles.container, style as any]}>
      {showLoadingIndicator && isLoading && (
        <ActivityIndicator 
          size="small" 
          color="#2ECC71"
          style={styles.loader as any}  
        />
      )}
      
      <Image
        source={imageSource}
        style={[styles.image, style]}
        contentFit={props.contentFit || "cover"}
        transition={300}
        cachePolicy="memory-disk"
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        recyclingKey={uri}
        placeholder={{uri: thumbnailSource || PLACEHOLDER_IMAGE}}
        // Use the priority system - especially important for visible images
        priority={priority}
        // We'd want auto-adjust quality but it's not available
        // Commenting out unsupported prop
        // autoAdjustQuality
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#f9f9f9', // Light background while image loads
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
    zIndex: 1,
  }
});

export default OptimizedImage;
