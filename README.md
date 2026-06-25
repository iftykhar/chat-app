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
- **Dual-user identity swap** — Easily toggle between two pre-configured accounts to test messaging, presence, and sound feedback from both viewpoints.
- **Live typing indicator** — Debounced presence tracking via a `presence` Firestore collection; only writes to the database on start-typing and stop-typing transitions (not on every keystroke).
- **Active heartbeat online status** — Updates your status in Firestore immediately upon logging in and maintains an active heartbeat every 15s. Instantly sets your status to offline when switching users or signing out.
- **Incoming message audio** — Plays a ping sound when a message arrives from the other user.
- **Offline persistence** — Firestore `persistentLocalCache` with offline access.
- **Cross-platform keyboard avoidance** — `KeyboardAvoidingView` configured for both iOS and Android.
- **Dark-themed chat UI** — Clean style tokens via `constants/Colors.ts` with wallpaper overlay and a detailed header showing the peer's presence state.

---

## User Identity Switching

The app features a built-in user identity switcher that makes simulating a two-way conversation seamless, even when testing on a single device.

### Supported Test Accounts
The identity switching is configured in the code for these two accounts (which must be created in your Firebase Console):
- `test@devriser.com`
- `userb@devriser.com`

### How the Swapping Flow Works:
1. When you click the **🔄 Switch** button in the chat header, the application:
   - Gracefully clears your active typing states.
   - Cleans up your online status in the database (sets `lastActive` to `0` and `typing` to `false` in the `presence` collection).
   - Terminates your active session via Firebase Auth (`signOut`).
2. The app redirects you to the Login Screen with the **alternate user's email address pre-filled** in the input field.
3. Simply enter the password for the alternate user to instantly log in and respond to the messages from the other side of the chat.

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
   - `test@devriser.com`
   - `userb@devriser.com`
   
   The password for both test accounts can be anything you choose during creation.

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

## Firestore Security Rules

The project includes a `firestore.rules` file with pre-configured security rules for production:

```javascript
// General rules:
// - /chats:  Any authenticated user can read all messages. Users can only create messages
//            with their own email as sender. No updates or deletes (immutable message log).
// - /presence: Users can only write to their own presence document (keyed by email).
//             Any authenticated user can read all presence docs.
```

### Deploy Rules

Run the Firebase CLI to deploy the security rules:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # Select your Firebase project
firebase deploy --only firestore:rules
```

Alternatively, copy the rules from `firestore.rules` into the Firebase Console under **Firestore Database → Rules** and publish them manually.

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
| `npm run typecheck`   | Run TypeScript type checking   |

---

## Project Structure

```
rn-chat-v54/
├── App.tsx                    # Main application entry point & screens
├── index.js                   # App registration entry point
├── components/
│   ├── LoginScreen.tsx         # Secure email/password login UI
│   ├── MessageBubble.tsx       # Message balloon component with status ticks
│   └── SplashScreen.tsx        # App loading splash screen
├── constants/
│   └── Colors.ts               # Palette and styling color design tokens
├── styles/
│   ├── AuthScreen.styles.ts    # Stylesheet for login form
│   ├── Bubble.styles.ts        # Stylesheet for chat bubbles
│   └── ChatScreen.styles.ts    # Stylesheet for main chat window
├── firebase.ts                 # Firebase App init & Auth/Firestore setup
├── firestore.rules             # Firestore security rules
├── metro.config.js             # Metro bundler config (Firebase CJS support)
├── eas.json                    # EAS Build configuration
├── tsconfig.json               # TypeScript configuration
├── app.json                    # Expo configuration
├── .env.example                # Environment variable template
├── .gitignore                  # Git ignore rules
└── package.json                # Dependencies, entry script definition
```

---

## How to Use

1. **Launch the app** — You will see the Login Screen. It defaults to  email field.
2. **Enter as one user** — Type the password  (or create a new account via the signup flow) and click Sign In.
3. **Send messages** — Type in the input bar and tap the send arrow.
4. **Swap identity** — Tap **🔄 Switch** in the header to log out and pre-fill the form with `userb@devriser.com` to swap identities.
5. **See typing indicators** — When typing on one device, the other device displays `💬 Someone is typing...` above the input bar.

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

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```
2. **Login to Expo Account:**
   ```bash
   eas login
   ```
3. **Initialize EAS Project:**
   ```bash
   eas project:init
   ```
4. **Configure Build Settings:**
   Create an `eas.json` file in the root with the following:
   ```json
   {
     "cli": {
       "version": ">= 10.0.0"
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal",
         "android": {
           "buildType": "apk"
         }
       },
       "production": {}
     },
     "submit": {
       "production": {}
     }
   }
   ```
5. **Build the APK:**
   ```bash
   eas build -p android --profile preview
   ```
   Once finished, EAS will provide a direct download link to the compiled `.apk` file. Download and place the file in the repository or add it to the release section.

---
## Live APK download link:
```bash
https://expo.dev/accounts/iftykhar101/projects/devriser-chat-app/builds/b34454bb-e1fc-4e0c-ab44-7ce340dbf17a
```

---

## 📽️ Video Demonstration
As part of the submission requirements:

Video Link:
```bash
https://drive.google.com/file/d/1ZSlzfpLJC0zTTvFwzCpYyzqRH4m8EUXj/view?usp=sharing`
```
