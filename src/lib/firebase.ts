import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCftMyvPPk4xbkhPvY4-nF6U52fGwrdg0E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-studio-applet-webapp-1c801.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-studio-applet-webapp-1c801",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-studio-applet-webapp-1c801.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "466522840244",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:466522840244:web:180db27cb7967e631c4be1"
};

let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export const initializeFirebase = () => {
  if (!firebaseConfig.apiKey) {
    return null;
  }

  try {
    if (!getApps().length) {
      const app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app, 'ai-studio-menuflow-a3bfdf6d-9880-43ff-8121-c127a053c8f8');
      googleProvider = new GoogleAuthProvider();
    }
  } catch (err) {
    console.error("Error initializing Firebase:", err);
  }
  return { auth, db, googleProvider };
};

export const getDB = (): Firestore | null => {
  const initialized = initializeFirebase();
  return initialized ? initialized.db : null;
};

export const signInWithGoogle = async () => {
  try {
    const initialized = initializeFirebase();
    if (!initialized || !initialized.auth || !initialized.googleProvider) {
      throw new Error("Firebase is not configured in the environment variables (VITE_FIREBASE_API_KEY missing).");
    }
    const result = await signInWithPopup(initialized.auth, initialized.googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    const initialized = initializeFirebase();
    if (initialized && initialized.auth) {
      await signOut(initialized.auth);
    }
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};

