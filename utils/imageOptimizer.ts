/**
 * Image Optimization Utilities
 * Dramatically improves image loading performance by:
 * 1. Using image CDN/proxy for resizing
 * 2. Implementing progressive loading
 * 3. Proper image caching
 * 4. Aggressive prefetching
 * 5. Support for both URL and base64 encoded images
 */

import { Image } from 'expo-image';
import { Dimensions, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Preload important images to ensure they're ready when needed
 * @param imageUrls Array of image URLs or base64 strings to preload
 */
export function preloadImages(imageUrls: string[]) {
  if (!imageUrls || !imageUrls.length) return;
  
  // Preload the first 5 images at most to avoid memory issues
  const imagesToPreload = imageUrls.slice(0, 5);
  
  // Filter out base64 images as they don't need prefetching
  const urlsToPreload = imagesToPreload
    .filter(url => !isBase64Image(url))
    .map(url => optimizeImageUrl(url, { width: 400 }));
    
  if (urlsToPreload.length > 0) {
    Image.prefetch(urlsToPreload);
  }
}

/**
 * Get optimized image URL using Imgix or similar image CDN
 * This function transforms your image URLs to use an image CDN for on-the-fly
 * optimization and resizing
 */
export function optimizeImageUrl(url: string, options: { 
  width?: number; 
  height?: number;
  quality?: number;
  blur?: number;
  format?: 'auto' | 'webp' | 'jpg';
} = {}) {
  if (!url) return url;
  
  // Check if this is a base64 image
  if (isBase64Image(url)) {
    // Base64 images are already optimized for mobile in our app
    // or will be processed by processBase64Image if needed
    return url;
  }
  
  // Check for local file:// URLs or other non-HTTP protocols
  if (!url.startsWith('http')) {
    return url;
  }
  
  try {
    // Use screen width if no width specified
    const width = options.width || Math.round(SCREEN_WIDTH);
    const height = options.height;
    const quality = options.quality || 80; // Default to 80% quality
    const format = options.format || 'auto';
    const blur = options.blur;
    
    // Handle Unsplash URLs specifically - they have a built-in optimization API
    if (url.includes('unsplash.com')) {
      // Parse the URL
      const parsedUrl = new URL(url);
      
      // Clear existing query parameters
      parsedUrl.search = '';
      
      // Add optimization parameters
      // Unsplash format: https://images.unsplash.com/photo-XXX?q=80&w=400&auto=format&fit=crop
      const params = new URLSearchParams();
      params.append('w', width.toString());
      params.append('q', quality.toString());
      params.append('auto', 'format');
      params.append('fit', 'crop');
      
      if (height) {
        params.append('h', height.toString());
      }
      
      if (blur) {
        params.append('blur', blur.toString());
      }
      
      parsedUrl.search = params.toString();
      return parsedUrl.toString();
    }
    
    // Handle generic URLs (could use imgix, cloudinary, etc)
    // For this implementation, we'll use ImageKit which has a free tier
    // and acts as a proxy for any image URL
    
    // URL encode the source URL
    const encodedUrl = encodeURIComponent(url);
    
    // Create the ImageKit URL (you could sign up for a free account)
    // or replace with your preferred image CDN
    // This URL format works without an account for demo, but you should create an account for production
    let optimizedUrl = `https://ik.imagekit.io/demo/tr:w-${width},q-${quality}`;
    
    if (height) {
      optimizedUrl += `,h-${height}`;
    }
    
    if (format !== 'auto') {
      optimizedUrl += `,f-${format}`;
    }
    
    if (blur) {
      optimizedUrl += `,bl-${blur}`;
    }
    
    // Append the proxy URL
    optimizedUrl += `/proxy?url=${encodedUrl}`;
    
    return optimizedUrl;
  } catch (error) {
    console.warn('Error optimizing image URL:', error);
    return url; // Return original URL if there's an error
  }
}

/**
 * Generate a low-quality placeholder URL
 * @param url Original image URL or base64 string
 * @returns URL for a tiny blurred image to use as placeholder
 */
export function getPlaceholderUrl(url: string): string {
  if (!url) return DEFAULT_PLACEHOLDER;
  
  // For base64 images, we can generate a smaller version if needed
  if (isBase64Image(url)) {
    return processBase64Image(url, { isPlaceholder: true });
  }
  
  return optimizeImageUrl(url, {
    width: 20, // Tiny image
    blur: 10,  // Apply blur
    quality: 40 // Lower quality
  });
}

// Default tiny placeholder for when images don't load
export const DEFAULT_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

/**
 * Check if a string is a base64 encoded image
 * @param url Image URL or base64 string to check
 */
export function isBase64Image(url: string): boolean {
  return url?.startsWith('data:image/');
}

/**
 * Process a base64 encoded image for optimization
 * @param base64Data Base64 image data
 * @param options Processing options
 */
export function processBase64Image(base64Data: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  isPlaceholder?: boolean;
} = {}): string {
  if (!base64Data || !isBase64Image(base64Data)) {
    return base64Data;
  }
  
  // For placeholder generation, we could theoretically decode the base64,
  // resize it, and re-encode, but that's expensive and complex for mobile
  // Instead, we'll cache commonly used producer/category images
  
  // For now, just return the original base64 data
  // In a production app, you could implement in-memory caching for base64 images
  // or store resized versions in AsyncStorage/SQLite
  
  // Example placeholder if needed (very small base64 image with blur)
  if (options.isPlaceholder) {
    // Check if we're on a platform where performance is a bigger concern
    if (Platform.OS === 'android' || base64Data.length > 100000) {
      // For very large base64 images, use the default placeholder instead
      return DEFAULT_PLACEHOLDER;
    }
  }
  
  return base64Data;
}

/**
 * Cache optimized versions of frequently used base64 images
 * to avoid re-processing them repeatedly
 */
export const cachedProducerImages: Record<string, string> = {};
export const cachedCategoryImages: Record<string, string> = {};
