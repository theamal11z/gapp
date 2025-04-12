#!/bin/bash

# Make sure EAS CLI is installed
if ! command -v eas &> /dev/null; then
  echo "EAS CLI not found. Installing..."
  npm install -g eas-cli
fi

# Login to EAS
echo "Logging in to EAS..."
eas login

# Create a new project first
echo "Creating EAS project..."
eas project:create

# Configure project
echo "Initializing EAS build configuration..."
eas build:configure

# Create a new build for Android with the preview profile
echo "Starting a new build for Android..."
eas build --platform android --profile preview

echo "Setup complete!" 