// firebase.ts
import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Paste your actual keys from your Firebase console here:
const firebaseConfig = {
  apiKey: "AIzaSyBMCZtE1TzIGp7yZgYx2AXBUeq3SdkQoiA",
  authDomain: "devriser-chat.firebaseapp.com",
  projectId: "devriser-chat",
  storageBucket: "devriser-chat.firebasestorage.app",
  messagingSenderId: "481269442023",
  appId: "1:481269442023:web:350f0d35bdd39b32454942"
};

// Initialize the Firebase App instance
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent caching so it runs beautifully on your mobile device
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

