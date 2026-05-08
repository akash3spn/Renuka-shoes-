import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

const isEnvValid = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'your_api_key' && import.meta.env.VITE_FIREBASE_API_KEY.length > 10 && !import.meta.env.VITE_FIREBASE_API_KEY.includes('your');

const firebaseConfig = {
  apiKey: isEnvValid ? import.meta.env.VITE_FIREBASE_API_KEY : firebaseConfigJson.apiKey,
  authDomain: isEnvValid ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN : firebaseConfigJson.authDomain,
  projectId: isEnvValid ? import.meta.env.VITE_FIREBASE_PROJECT_ID : firebaseConfigJson.projectId,
  storageBucket: isEnvValid ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET : firebaseConfigJson.storageBucket,
  messagingSenderId: isEnvValid ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID : firebaseConfigJson.messagingSenderId,
  appId: isEnvValid ? import.meta.env.VITE_FIREBASE_APP_ID : firebaseConfigJson.appId,
  firestoreDatabaseId: isEnvValid ? import.meta.env.VITE_FIREBASE_DATABASE_ID : firebaseConfigJson.firestoreDatabaseId,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Explicitly ensure local persistence to fix random logouts and mobile safari issues
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});
