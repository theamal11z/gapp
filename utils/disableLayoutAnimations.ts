import { Platform } from 'react-native';
import Animated from 'react-native-reanimated';

/**
 * Disables Reanimated layout animations to prevent production crashes
 * related to null pointer dereference in LayoutAnimationsManager
 * 
 * Call this function as early as possible in your app lifecycle
 */
export const disableReanimatedLayoutAnimations = () => {
  try {
    // Only disable in production and on Android where the crashes occur
    if (__DEV__ === false && Platform.OS === 'android') {
      // @ts-ignore - Accessing internal API that's not fully typed
      if (Animated && typeof Animated.configureLayoutAnimations === 'function') {
        // @ts-ignore
        Animated.configureLayoutAnimations(() => false);
        console.log('[Reanimated] Layout animations disabled in production to prevent crashes');
      }
    }
  } catch (error) {
    console.warn('Failed to disable Reanimated layout animations:', error);
  }
};

export default disableReanimatedLayoutAnimations; 