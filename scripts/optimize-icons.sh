#!/bin/bash

# Create a backup directory
mkdir -p assets/images/backup

# Backup original images
cp assets/images/icon.png assets/images/backup/icon.png.bak
cp assets/images/adaptive-icon.png assets/images/backup/adaptive-icon.png.bak
cp assets/images/splash.png assets/images/backup/splash.png.bak
cp assets/images/favicon.png assets/images/backup/favicon.png.bak

# Optimize icon.png (1024x1024 is recommended for app stores)
convert assets/images/icon.png -resize 1024x1024 -quality 90 -strip assets/images/icon.png.tmp
mv assets/images/icon.png.tmp assets/images/icon.png

# Optimize adaptive-icon.png (must be at least 108x108 dp, recommended 432x432)
convert assets/images/adaptive-icon.png -resize 432x432 -quality 90 -strip assets/images/adaptive-icon.png.tmp
mv assets/images/adaptive-icon.png.tmp assets/images/adaptive-icon.png

# Optimize splash.png (recommended 1242x2436)
convert assets/images/splash.png -resize 1242x2436 -quality 90 -strip assets/images/splash.png.tmp
mv assets/images/splash.png.tmp assets/images/splash.png

# Optimize favicon.png (192x192 is good for web)
convert assets/images/favicon.png -resize 192x192 -quality 90 -strip assets/images/favicon.png.tmp
mv assets/images/favicon.png.tmp assets/images/favicon.png

echo "Icon optimization complete!"
