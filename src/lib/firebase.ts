import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

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
      db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
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

