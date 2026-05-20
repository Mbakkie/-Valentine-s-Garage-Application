import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDFbvK8JErot7-YIJcE31sW0lnHXFln20U",
  authDomain: "valentine-s-32e58.firebaseapp.com",
  projectId: "valentine-s-32e58",
  storageBucket: "valentine-s-32e58.firebasestorage.app",
  messagingSenderId: "427250729053",
  appId: "1:427250729053:web:ee0abc55b3fa357b004db4",
  measurementId: "G-Z852B5THGB"
};

// Initialise Firebase app (singleton)
const app = initializeApp(firebaseConfig);

// Exported service instances used throughout the app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;