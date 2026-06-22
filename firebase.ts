// // firebase.ts
// import { initializeApp } from "firebase/app";
// import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// // Paste your actual keys from your Firebase console here:
// const firebaseConfig = {
//   apiKey: "AIzaSyBMCZtE1TzIGp7yZgYx2AXBUeq3SdkQoiA",
//   authDomain: "devriser-chat.firebaseapp.com",
//   projectId: "devriser-chat",
//   storageBucket: "devriser-chat.firebasestorage.app",
//   messagingSenderId: "481269442023",
//   appId: "1:481269442023:web:350f0d35bdd39b32454942"
// };

// // Initialize the Firebase App instance
// const app = initializeApp(firebaseConfig);

// // Initialize Firestore with persistent caching so it runs beautifully on your mobile device
// export const db = initializeFirestore(app, {
//   localCache: persistentLocalCache({
//     tabManager: persistentMultipleTabManager(),
//   }),
// });


// firebase.ts

import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
// CRITICAL FIX: Add Auth initializers and React Native persistence storage mapping
// @ts-expect-error: getReactNativePersistence is not exported in the TS types for firebase/auth (but exists at runtime)
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Paste your actual keys from your Firebase console here:
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize the Firebase App instance
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent caching so it runs beautifully on your mobile device
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// CRITICAL FIX: Initialize and export Auth instance with mobile session persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});