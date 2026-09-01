import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  initializeFirestore, 
  getFirestore, 
  Firestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export const initializeFirebase = () => {
  if (!firebaseConfig.apiKey) {
    return null;
  }
  try {
    if (!getApps().length) {
      const app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      try {
        db = initializeFirestore(app, {
          experimentalAutoDetectLongPolling: true,
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager()
          })
        });
      } catch (cacheErr) {
        console.warn("Falling back to memory cache for Firestore:", cacheErr);
        db = initializeFirestore(app, {
          experimentalAutoDetectLongPolling: true,
          localCache: memoryLocalCache()
        });
      }
      storage = getStorage(app);
      googleProvider = new GoogleAuthProvider();
    } else {
      const app = getApp();
      if (!auth) auth = getAuth(app);
      if (!db) db = getFirestore(app);
      if (!storage) storage = getStorage(app);
      if (!googleProvider) googleProvider = new GoogleAuthProvider();
    }
  } catch (err) {
    console.error("Error initializing Firebase:", err);
  }
  return { auth, db, storage, googleProvider };
};

export const getDB = (): Firestore | null => {
  const initialized = initializeFirebase();
  return initialized ? initialized.db : null;
};

export const getFirebaseStorage = (): FirebaseStorage | null => {
  const initialized = initializeFirebase();
  return initialized ? initialized.storage : null;
};

export const signInWithGoogle = async () => {
  try {
    const initialized = initializeFirebase();
    if (!initialized || !initialized.auth || !initialized.googleProvider) {
      throw new Error("Firebase is not configured.");
    }
    const result = await signInWithPopup(initialized.auth, initialized.googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, pass: string) => {
  const initialized = initializeFirebase();
  if (!initialized || !initialized.auth) throw new Error("Firebase not initialized");
  const result = await signInWithEmailAndPassword(initialized.auth, email, pass);
  return result.user;
};

export const signUpWithEmail = async (email: string, pass: string) => {
  const initialized = initializeFirebase();
  if (!initialized || !initialized.auth) throw new Error("Firebase not initialized");
  const result = await createUserWithEmailAndPassword(initialized.auth, email, pass);
  return result.user;
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



export const rollbackSecondaryUser = async (email: string, pass: string) => {
  if (!firebaseConfig.apiKey) return;
  try {
    const { deleteUser, signInWithEmailAndPassword } = await import('firebase/auth');
    const secondaryApp = getApps().find(app => app.name === "SecondaryApp") || initializeApp(firebaseConfig, "SecondaryApp");
    const secondaryAuth = getAuth(secondaryApp);
    const result = await signInWithEmailAndPassword(secondaryAuth, email.trim().toLowerCase(), pass);
    if (result.user) {
      await deleteUser(result.user);
    }
  } catch (err) {
    console.error("Rollback failed:", err);
  }
};

export const createSecondaryUser = async (email: string, pass: string) => {
  if (!firebaseConfig.apiKey) throw new Error("Firebase not initialized");
  const secondaryApp = getApps().find(app => app.name === "SecondaryApp") || initializeApp(firebaseConfig, "SecondaryApp");
  const secondaryAuth = getAuth(secondaryApp);
  const result = await createUserWithEmailAndPassword(secondaryAuth, email.trim().toLowerCase(), pass);
  await signOut(secondaryAuth);
  return result.user;
};
