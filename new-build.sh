#!/bin/bash

# 0. Gestione cartella android
if [ -d "android" ]; then
    read -p "La cartella 'android' esiste già. Vuoi aggiornarla cancellando la vecchia cartella e ricreandola? (s/n): " scelta
    if [[ "$scelta" =~ ^[sS]$ ]]; then
        echo "Rimozione della vecchia cartella android..."
        rm -rf android || { echo "Impossibile rimuovere la cartella android"; exit 1; }
        npx cap add android || { echo "Failed to add Capacitor Android platform"; exit 1; }
    else 
        echo "Procedo senza modificare la cartella android."
    fi
else
    npx cap add android || { echo "Failed to add Capacitor Android platform"; exit 1; }
fi

# 1. Build Angular/Ionic
echo "Building Angular/Ionic project..."
ionic build --prod || { echo "Build failed"; exit 1; }
# per buildare con mock bisogna scrivere ionic build --configuration=production-mock

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
