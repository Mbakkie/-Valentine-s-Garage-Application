# Valentine’s Garage Application

A mobile-first Expo React Native application for vehicle check-in, mechanic service checklists, and admin reporting.

## Project Overview

This app provides:
- Staff login for mechanics and admins
- Vehicle check-in with odometer, condition, driver, notes, and optional photo evidence
- Real-time service checklists per vehicle visit
- Admin dashboard and reports
- Firebase backend for authentication, Firestore, and storage
- Web support via Expo Web

## Tech Stack

- Expo SDK 55
- React Native 0.83.6
- React 19.2.0
- Firebase v10
- React Navigation 6
- Expo Camera & Image Picker
- `react-native-web` for browser builds

## Prerequisites

- Node.js 18+ / 20+ installed
- npm available
- Expo CLI installed globally or via `npx`
- A Firebase project configured in `src/config/firebase.js`

## Setup

From the project root:

```bash
npm install
```

If you see Expo compatibility warnings, use the package versions defined in `package.json`.

## Run the app (Native Kotlin/Compose)

The app has been rewritten in native Kotlin using Jetpack Compose.

### Prerequisites (Native)

- Android Studio Iguana or newer
- Kotlin 1.9.0+
- `google-services.json` placed in `android/app/`
- **Accept Android SDK Licenses**: Run `sdkmanager --licenses` in your terminal if you haven't already.

### Build via Command Line

```bash
cd android
./gradlew assembleDebug
```

### Build via Android Studio

1. Open the `android/` folder in Android Studio.
2. Wait for Gradle sync to complete.
3. Select the `app` configuration and press **Run**.

## Run the app (Legacy React Native)

### Web

```bash
npx expo start --web --clear
```

If a port is already in use, accept the suggested alternate port or run with a specific port:

```bash
npx expo start --web --clear --port 8084
```

### Android / iOS

```bash
npx expo start
```

Then press `a` for Android or `i` for iOS in the Expo CLI interface.

## Project Structure

```text
App.js
src/
  components/
  config/
  constants/
  hooks/
  models/
  navigation/
  screens/
  services/
  utils/
```

- `App.js` — app entry point
- `src/navigation/AppNavigator.js` — navigation stacks and auth flow
- `src/hooks` — custom hooks for auth, vehicles, and checklists
- `src/screens` — UI screens grouped by auth, mechanic, and admin
- `src/services` — Firebase Firestore and Storage operations
- `src/config/firebase.js` — Firebase initialization

## Important Notes

- The app expects valid PNG assets in `assets/images/` for the Expo icon, splash, favicon, and adaptive icon.
- The current project already includes regenerated, valid PNG assets in `assets/images/`.
- If Expo Web fails with a `jimp-compact` CRC PNG error, delete `.expo`, then restart with `--clear`.
- If Expo prompts for a new port, allow it or specify one manually.

## Testing

```bash
npm test
```

## Troubleshooting

### Expo web CRC PNG error

If you see:

```text
Error: Crc error ... jimp-compact
```

Then one or more PNG files are corrupted.

Fix it by:
1. Re-saving `assets/images/icon.png`, `assets/images/splash.png`, `assets/images/favicon.png`, and `assets/images/adaptive-icon.png` as new PNG files.
2. Delete `.expo` if needed.
3. Restart with:

```bash
npx expo start --web --clear
```

### Port conflicts

If the port is already in use, either accept the alternate port or run:

```bash
npx expo start --web --clear --port 8084
```

## Presentation Tip

Open the app in a browser first if you need a quick demonstration, then switch to Expo Go for mobile if desired.

---
