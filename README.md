# LoAI

A Local AI chat app for Android and iOS that runs completely offline. No cloud, no API
Built with Expo and [llama.rn](https://github.com/mybigday/llmana.rn), a React Native wrapper around [llama.cpp](https://github.com/ggerganov/llama.cpp). I also used Following docs, [Pixl-react-app](https://pixl.hackclub.com/docs/react-native) and [Expo-Docs](https://docs.expo.dev/tutorial/create-your-first-app/)

## What it does

- Downloads a GGUF model once, then works with no internet connection
- Streams response token by token in a dark themed chat UI (will be changeable in the future)
- Detects broken downloads and auto-downloads them again

## Requirements

- Node.js 18 or newer
- JDK 17 (JDK 21 does not support the Android gradle plugin)
- Python3
- Android Studio with NDK and CMake installed (Addons)
- XCode if you want to build for iOS
- 16GB RAM minimum, 32GB recommended (for compiling)
- An ARM64 Android Phone, emulators can work but will be slow.

## Setup 

Install JDK 17 from [Microsoft OpenJDK](https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-17) or [Eclipse Temurin](https://adoptium.net/temurin/releases/?version=17). During install, enable both "Set JAVA_HOME variable" and "Add to PATH".

Install Android Studio, then open the SDK Manager and install these under the SDK Tools tab:
- NDK (Side by side)
- CMake
- Android SDK Build-Tools 35


## npx create-expo-app LoAI
## cd LoAI
## npx expo install llama.rn expo-file-system expo-dev-client