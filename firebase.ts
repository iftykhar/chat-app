
// firebase.ts

import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
// CRITICAL FIX: Add Auth initializers and React Native persistence storage mapping
// @ts-expect-error: getReactNativePersistence is not exported in the TS types for firebase/auth (but exists at runtime)
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Paste your actual keys from your Firebase console here:
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBMCZtE1TzIGp7yZgYx2AXBUeq3SdkQoiA",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "devriser-chat.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "devriser-chat",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "devriser-chat.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "481269442023",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:481269442023:web:350f0d35bdd39b32454942"
};

// Initialize the Firebase App instance
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent caching so it runs beautifully on your mobile device
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({}),
});

// CRITICAL FIX: Initialize and export Auth instance with mobile session persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});