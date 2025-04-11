import React from 'react';
import { ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';

// This component wraps Animated.View and strips out any layout animation props
// to prevent crashes in production while maintaining other animations
export const SafeAnimatedView: React.FC<ViewProps & {
  entering?: any;
  exiting?: any;
  layout?: any; // This will be intentionally ignored
}> = ({
  layout, // Intentionally ignored to prevent crashes
  ...props
}) => {
  // Pass through all props except layout
  return <Animated.View {...props} />;
};

// Export a set of safe animation components that don't use layout animations
export const SafeAnimated = {
  View: SafeAnimatedView,
  // Add other components as needed
};

export default SafeAnimatedView; 