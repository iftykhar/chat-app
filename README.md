# DevRiser Chat

A real-time chat application built with **Expo SDK 54** and **Firebase Firestore**, featuring dual-user identity simulation, typing indicators, and audio notifications.

---

## Tech Stack

| Layer             | Technology                                    |
| ----------------- | --------------------------------------------- |
| Framework         | [Expo](https://expo.dev/) SDK 54 (Managed)    |
| UI                | React Native 0.81 + TypeScript                |
| Backend / Realtime| Firebase Firestore (with offline persistence) |
| Auth              | Firebase Auth (email/password, AsyncStorage)  |
| Audio             | `expo-audio` for incoming message pings       |
| State             | React hooks (`useState`, `useRef`, `useEffect`) |

## Features

- **Real-time messaging** — Messages sync instantly via Firestore `onSnapshot` listeners
- **Dual-user identity swap** — Toggle between `usera@devriser.com` and `userb@devriser.com` to simulate both sides of a conversation
- **Live typing indicator** — Debounced presence tracking via a `presence` Firestore collection; only writes to the database on start-typing and stop-typing transitions (not on every keystroke)
- **Incoming message audio** — Plays a ping sound when a message arrives from the other user
- **Offline persistence** — Firestore `persistentLocalCache` with multi-tab support for offline access
- **Cross-platform keyboard avoidance** — `KeyboardAvoidingView` configured for both iOS and Android
- **Dark-themed chat UI** — Clean style tokens via `constants/Colors.ts` with wallpaper overlay

---

## Firebase Setup

This project uses Firebase Firestore for real-time data sync and Firebase Auth for authentication. You need a Firebase project with **Firestore** and **Authentication** enabled.

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** and follow the prompts
3. Once created, click the **Web** icon (`</>`) to register a web app
4. Copy the Firebase config object shown

### 2. Enable Firestore

1. In the Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a region close to you

### 3. Enable Authentication

1. In the Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** sign-in
3. (Optional but recommended) Add two test users:
   - `usera@devriser.com`
   - `userb@devriser.com`

### 4. Create Required Firestore Collections

The app expects these collections:

- **`chats`** — Stores all messages with a composite index on `timestamp` ascending (required for the `orderBy` query)
- **`presence`** — Stores typing status per user (document ID = user email, fields: `typing: boolean`, `lastActive: timestamp`)

**Composite index** for the `chats` collection:

| Field       | Direction |
| ----------- | --------- |
| `timestamp` | Ascending |

You may be prompted to create this index automatically the first time the app runs and queries the collection.

---

## Environment Variables

The Firebase configuration is loaded from **Expo system environment variables** (prefixed with `EXPO_PUBLIC_`). These are read at build/start time.

### Setup

1. Copy the template below into a new `.env` file at the project root:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=1:your-app-id:web:your-hash
```

2. Fill in the values from your Firebase project's web app config (see step 1 above).

3. **Important:** The `.env` file is gitignored by default. Never commit it. Each developer must create their own.

> ⚠️ **Why `EXPO_PUBLIC_` prefix?**  
> Expo SDK 51+ requires public environment variables to be prefixed with `EXPO_PUBLIC_` so they are inlined at build time and accessible in the client bundle. Do not store secret keys here — these are client-side values.

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- An Android/iOS emulator or the Expo Go app on your device

### Install & Run

```bash
# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS), or press:
- `a` — Open on Android emulator
- `i` — Open on iOS simulator
- `w` — Open in web browser

### Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npx expo start`     | Start dev server               |
| `npx expo start --android` | Start and launch on Android |
| `npx expo start --ios`     | Start and launch on iOS    |
| `npx tsc --noEmit`   | Run TypeScript type checking   |

---

## Project Structure

```
rn-chat-v54/
├── App.tsx                    # Main application entry point
├── app/                       # Expo Router pages (file-based routing)
│   ├── (auth)/                # Auth-related routes
│   ├── (tabs)/                # Tab navigation routes
│   ├── chat/[id].tsx          # Individual chat screen
│   └── _layout.tsx            # Root layout
├── components/
│   ├── ChatHeader.tsx          # Chat header with user avatar & status
│   ├── LoginScreen.tsx         # Mock login / identity picker
│   ├── MessageBubble.tsx       # Chat bubble component
│   ├── MessageInput.tsx        # Text input & send button
│   └── SplashScreen.tsx        # Splash/loading screen
├── constants/
│   └── Colors.ts               # Design token color palette
├── styles/
│   ├── Bubble.styles.ts        # Message bubble styles
│   ├── ChatScreen.styles.ts    # Main chat screen styles
│   └── ...                     # Other component styles
├── types/
│   └── index.ts                # TypeScript interfaces (User, Message, etc.)
├── firebase.ts                 # Firebase initialization & config
├── app.json                    # Expo configuration
└── package.json                # Dependencies & scripts
```

---

## How to Use

1. **Launch the app** — You'll see a login screen with mock login buttons
2. **Enter as one user** — Tap "Enter as usera@devriser.com"
3. **Send messages** — Type in the input bar and tap the send arrow
4. **Swap identity** — Tap **🔄 Identity Swap** in the header to switch to `userb@devriser.com`
5. **See typing indicators** — When one user types, the other sees "Opponent node is typing..."
6. **Hear audio feedback** — An incoming ping plays when a message arrives from the other user

---

## Firebase Data Model

### `chats` Collection

| Field      | Type     | Description                      |
| ---------- | -------- | -------------------------------- |
| `id`       | string   | Auto-generated document ID       |
| `text`     | string   | Message content                  |
| `sender`   | string   | Sender's email address           |
| `timestamp`| number   | Unix timestamp in milliseconds   |
| `timeString`| string  | Formatted time (e.g., "05:46 PM")|

### `presence` Collection

| Field       | Type    | Description                          |
| ----------- | ------- | ------------------------------------ |
| `(doc ID)`  | string  | User's email address                 |
| `typing`    | boolean | Whether the user is currently typing |
| `lastActive`| number  | Unix timestamp of last activity      |

---

## Building an APK

To generate a standalone APK using Expo Application Services (EAS):

```bash
# Install EAS CLI if you haven't
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build a preview APK
eas build -p android --profile preview
```

> You'll need an **Expo account** and an **EAS Build profile** configured in `eas.json`. See the [EAS Build docs](https://docs.expo.dev/build/introduction/) for setup details.

---

## License

Private — for assessment purposes.
