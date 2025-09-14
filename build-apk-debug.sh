#!/bin/bash
# Script per build e generazione APK debug Ionic + Capacitor
# APK finale: android/app/build/outputs/apk/debug/ionic-anagrafica-test.apk

# 1. Build Angular/Ionic
echo "Building Angular/Ionic project..."
ionic build --prod || { echo "Build failed"; exit 1; }

# 2. Sincronizza Capacitor
echo "Syncing Capacitor Android platform..."
npx cap sync android || { echo "Capacitor sync failed"; exit 1; }

# 3. Compila APK debug
echo "Building APK debug..."
cd android || { echo "Android folder not found"; exit 1; }
./gradlew assembleDebug || { echo "APK build failed"; exit 1; }

# 4. Rinomina APK
APK_SOURCE="app/build/outputs/apk/debug/app-debug.apk"
APK_DEST="app/build/outputs/apk/debug/ionic-anagrafica-test.apk"

if [ -f "$APK_SOURCE" ]; then
    mv "$APK_SOURCE" "$APK_DEST"
    echo "APK built successfully at $APK_DEST"
else
    echo "APK source file not found!"
    exit 1
fi
