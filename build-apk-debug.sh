#!/bin/bash
# Script per build e generazione APK debug Ionic + Capacitor
# APK finale: android/app/build/outputs/apk/debug/ionic-anagrafica-test.apk

# 0. Avvio emulatore se non già in esecuzione
if adb devices | grep -q "emulator-"; then
    echo "Emulatore già in esecuzione."
    # Procedi normalmente, lascia scelta all'utente
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
else
    echo "Nessun emulatore in esecuzione. Avvio emulatore in uno script esterno..."
    bash ./start-emulator.sh
    # Forza scelta "no" alla domanda sulla ricreazione della cartella android
    if [ -d "android" ]; then
        echo "Procedo senza modificare la cartella android."
    else
        npx cap add android || { echo "Failed to add Capacitor Android platform"; exit 1; }
    fi
fi

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

# Funzione per installare APK con retry
install_apk() {
    APK_PATH="$1"
    MAX_RETRIES=3
    RETRY_DELAY=30
    COUNT=0

    while [ $COUNT -lt $MAX_RETRIES ]; do
        echo "Installazione APK (tentativo $((COUNT+1)))..."
        adb install -r "$APK_PATH" && { echo "APK installato correttamente!"; return 0; }
        echo "Installazione fallita, riprovo tra $RETRY_DELAY secondi..."
        sleep $RETRY_DELAY
        COUNT=$((COUNT+1))
    done

    echo "Installazione APK fallita dopo $MAX_RETRIES tentativi."
    exit 1
}

# 6. Installa APK con retry
install_apk "$APK_DEST"
