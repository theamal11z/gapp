import React from 'react';
import { Image } from 'expo-image';
import type { ImageProps } from 'expo-image';

// Simple wrapper around expo-image with optimal settings for fast loading
export default function FastImage(props: ImageProps) {
  return (
    <Image
      {...props}
      cachePolicy="memory-disk" // Aggressive caching for faster loading
      transition={props.transition || 100} // Faster transition (default was 300ms)
      recyclingKey={typeof props.source === 'object' && 'uri' in props.source ? props.source.uri : undefined} // Helps with recycling views
      placeholder={props.placeholder || { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' }}
    />
  );
}
