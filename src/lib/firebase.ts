import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Vercel deployment uses environment variables
let firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID,
};

// Fallback for local AI Studio environment
if (!firebaseConfig.apiKey) {
  // We use import.meta.glob so the Vercel build doesn't fail if the file is missing
  const localConfigs = import.meta.glob('../../firebase-applet-config.json', { eager: true });
  if (localConfigs['../../firebase-applet-config.json']) {
    const config = localConfigs['../../firebase-applet-config.json'] as any;
    firebaseConfig = config.default || config;
  }
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Explicitly ensure local persistence to fix random logouts and mobile safari issues
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});
