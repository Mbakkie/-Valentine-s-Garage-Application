
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { createUserModel } from '../models/models';

const USERS_COLLECTION = 'users';

export const loginUser = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * @param {string} uid
 */
export const getUserProfile = async (uid) => {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

/**
 * @param {string} uid
 * @param {object} data  - Fields to set/merge in the user profile document
 */
export const setUserProfile = async (uid, data) => {
  const ref = doc(db, USERS_COLLECTION, uid);
  await setDoc(ref, data, { merge: true });
};

/**
 * @param {Function} callback
 */
export const subscribeToAuthChanges = (callback) =>
  onAuthStateChanged(auth, callback);

export const createMechanicProfile = async (uid, email, name) => {
  const profile = createUserModel(uid, email, name, 'mechanic');
  await setUserProfile(uid, profile);
  return profile;
};