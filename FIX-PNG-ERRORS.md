# How to Fix the AAPT PNG Error

When you encounter the error:
```
ERROR: /home/expo/workingdir/build/android/app/build/generated/res/createBundleReleaseJsAndAssets/drawable-mdpi/assets_images_offline.png: AAPT: error: file failed to compile.
```

## Quick Solution
If you're building with EAS, run:

```bash
# For preview builds
eas build --platform android --profile preview --clear-cache

# For production builds
eas build --platform android --profile production --clear-cache
```

The `--clear-cache` flag ensures that stale builds and resources are removed.

## Manual Fixes

If the error persists, try one of these approaches:

1. Ensure the problematic image (offline.png) is properly formatted:
   - Open in an image editor and re-save as PNG with standard settings
   - Try a different PNG image in its place

2. We've already updated `app.json` to exclude this file from asset bundling with:
   ```
   "assetBundlePatterns": [
     "**/*",
     "!**/offline.png"
   ]
   ```

3. Modify any code that references this image to use a fallback image if it's not available.

## Additional EAS Build Command Options

```bash
# More debugging info during build
eas build --platform android --profile preview --non-interactive

# Build with specific Gradle tasks
eas build --platform android --profile preview --gradle-command=":app:assembleDebug"
```
