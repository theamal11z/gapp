# Setting up EAS Build for GroceryGuj

This guide will help you set up and use EAS Build for building your GroceryGuj app for iOS and Android.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo account (create one at https://expo.dev/signup)
- EAS CLI (`npm install -g eas-cli`)

## Getting Started

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to EAS**:
   ```bash
   eas login
   ```

3. **Initialize EAS for your project**:
   ```bash
   bash scripts/init-eas.sh
   ```
   This script will set up EAS and create your first build.

4. **Get your EAS Project ID**:
   After initialization, EAS will create a project ID. Copy this ID and update the `app.config.js` file:
   ```javascript
   // In app.config.js
   {
     extra: {
       eas: {
         projectId: "YOUR_PROJECT_ID_HERE"
       }
     }
   }
   ```

## Building Your App

We have configured multiple build profiles in `eas.json`:

### Android Builds

1. **Development Build** (for testing with Expo Go):
   ```bash
   npm run android:dev
   ```

2. **Preview Build** (internal testing APK):
   ```bash
   npm run android:preview
   ```

3. **Production Build** (for Google Play):
   ```bash
   npm run android:production
   ```

### iOS Builds

1. **Development Build** (for testing with Expo Go):
   ```bash
   npm run ios:dev
   ```

2. **Preview Build** (for TestFlight internal testing):
   ```bash
   npm run ios:preview
   ```

3. **Production Build** (for App Store):
   ```bash
   npm run ios:production
   ```

## Environment Variables

The app is configured to use environment variables from `.env` file and from the EAS Build environment:

- `EXPO_PUBLIC_SUPABASE_URL`: The URL of your Supabase instance
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

These are configured in the `eas.json` file and will be injected during the build process.

## Assets

Make sure your assets in `assets/images/` directory are properly configured:

- `icon.png`: App icon (1024×1024)
- `adaptive-icon.png`: Android adaptive icon (1024×1024)
- `splash.png`: Splash screen image
- `favicon.png`: Web favicon

## Troubleshooting

If you encounter build issues:

1. Check the EAS build logs: `eas build:list`
2. View specific build details: `eas build:view`
3. Check your Expo account's build dashboard: https://expo.dev/accounts/[your-username]/projects/[your-project]/builds

For more help, visit the [Expo documentation](https://docs.expo.dev/build/introduction/). 