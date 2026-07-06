import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'emenu-c1386',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

const initializeFirebase = () => {
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API key is missing. Please configure VITE_FIREBASE_API_KEY in the environment.');
  }

  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  }
};

export const signInWithGoogle = async () => {
  try {
    initializeFirebase();
    if (!auth || !googleProvider) throw new Error("Firebase not initialized");
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    if (auth) {
      await signOut(auth);
    }
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};
