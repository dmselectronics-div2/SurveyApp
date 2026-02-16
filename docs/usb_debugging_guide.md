# React Native USB Debugging Guide

Follow these steps to run your app on a physical Android device.

## 1. Prepare Your Android Device

1.  **Enable Developer Options**:
    *   Go to **Settings** > **About phone**.
    *   Tap **Build number** 7 times until you see "You are now a developer!".
2.  **Enable USB Debugging**:
    *   Go to **Settings** > **System** > **Developer options** (or just **Developer options**).
    *   Scroll down and enable **USB debugging**.
3.  **Connect via USB**:
    *   Connect your phone to your PC with a USB cable.
    *   On your phone, you might see a prompt "Allow USB debugging?". Check "Always allow from this computer" and tap **Allow**.

## 2. Verify Connection

Open a terminal and run:
```sh
adb devices
```
*   **Success**: You should see your device ID followed by `device`.
    *   Example: `List of devices attached`
    *   `XXXXXXXXX       device`
*   **Unauthorized**: If you see `unauthorized`, check your phone for the "Allow USB debugging" prompt again.
*   **Empty**: Try a different USB cable or port, or install Universal ADB Drivers.

## 3. Run the App

1.  Make sure your Metro bundler is running in one terminal:
    ```sh
    npx react-native start
    ```
2.  In another terminal, run the app on your device:
    ```sh
    npx react-native run-android
    ```

## Troubleshooting

*   **ADB not found**: If `adb` command fails, you need to add Android platform-tools to your PATH.
    *   Usually located at: `%LOCALAPPDATA%\Android\Sdk\platform-tools`
*   **Device not found**: Ensure USB drivers for your specific phone brand are installed.
