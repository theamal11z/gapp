# hamro kitana

A mobile grocery delivery application built with React Native and Expo, using Supabase for backend services.

## Features

- User authentication with session persistence

## Contact & Support

- **Phone:** +9779820761411
- **WhatsApp:** +977982076141
- **Email:** hamrokiranastore@gmail.com

- Product browsing by categories
- Search functionality
- Shopping cart management
- Order placement and tracking
- User profile management
- Image upload functionality
- Wishlist
- Payment method integration

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Run on a specific platform:
```bash
# For Android
npm run android

# For iOS 
npm run ios
```

## Building Production APK

### Prerequisites

1. Make sure you have EAS CLI installed:
```bash
npm install -g eas-cli
```

2. Log in to your Expo account:
```bash
eas login
```

### Build Commands

#### Production Build
```bash
npm run build:android
```

This will create a production-ready APK with the following optimizations:
- ProGuard code shrinking and obfuscation
- Disabled layout animations to prevent crashes
- Optimized bundle size
- Properly configured permissions

#### Preview Build
For testing purposes, you can create a preview build:
```bash
npm run build:android:preview
```

## Important Production Considerations

1. **Authentication Persistence**: Users remain logged in between app sessions
2. **Layout Animation Fix**: Layout animations are disabled to prevent crashes on production builds
3. **Image Picker Permissions**: Properly configured for Android and iOS
4. **ProGuard Rules**: Custom rules to prevent code shrinking issues
5. **Error Handling**: Improved error handling and user feedback

## Troubleshooting

If you encounter issues with the app:

1. **Crash after login**: This issue has been fixed by disabling Reanimated layout animations
2. **Permission Errors**: Make sure you've accepted all permission requests when prompted
3. **Build Errors**: Check EAS build logs for details

## License

Private - All rights reserved. 