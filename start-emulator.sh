#!/bin/bash

EMULATOR_PATH="C:/Android/emulator"
AVD_NAME="Pixel_8_API_36"

# Avvia l'emulatore
cd "$EMULATOR_PATH" || { echo "Cartella emulator non trovata"; exit 1; }
echo "Avvio emulatore $AVD_NAME..."
./emulator -avd "$AVD_NAME" -netdelay none -netspeed full &

# Timeout massimo in secondi
TIMEOUT=120
ELAPSED=0
INTERVAL=2

# Trova il serial dell'emulatore appena avviato
SERIAL=""
while [ -z "$SERIAL" ] && [ $ELAPSED -lt $TIMEOUT ]; do
    SERIAL=$(adb devices | grep emulator | awk '{print $1}')
    [ -z "$SERIAL" ] && sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

if [ -z "$SERIAL" ]; then
    echo "Emulatore non trovato entro $TIMEOUT secondi."
    exit 1
fi

# Attendere completamento boot
boot_completed=""
ELAPSED=0
while [ "$boot_completed" != "1" ] && [ $ELAPSED -lt $TIMEOUT ]; do
    boot_completed=$(adb -s "$SERIAL" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')
    [ "$boot_completed" != "1" ] && sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
    echo "Boot emulator: ${boot_completed:-0}"
done

if [ "$boot_completed" != "1" ]; then
    echo "Timeout: Emulatore non ha completato il boot entro $TIMEOUT secondi."
    exit 1
fi

echo "Emulatore pronto."
