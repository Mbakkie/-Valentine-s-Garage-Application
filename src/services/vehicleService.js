
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { createCheckInModel } from '../models/models';
import { DEFAULT_CHECKLIST } from '../constants/ChecklistItems';
import { createServiceTaskModel } from '../models/models';

const CHECK_INS = 'checkIns';
const TASKS_SUB = 'tasks';

/**
 * Upload a vehicle photo to Firebase Storage and return the download URL.
 * @param {string} localUri  - Local file URI from expo-image-picker
 * @param {string} plate     - Vehicle plate (used in file path)
 */
export const uploadVehiclePhoto = async (localUri, plate) => {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const filename = `vehicles/${plate}_${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
};

/**
 * Create a new check-in document and seed its tasks sub-collection.
 * @param {object} checkInData  - Fields from the check-in form
 * @param {string|null} photoUri - Optional local photo URI
 * @returns {string} The new document ID
 */
export const createCheckIn = async (checkInData, photoUri = null) => {
  let photoUrl = null;

  if (photoUri) {
    photoUrl = await uploadVehiclePhoto(photoUri, checkInData.truckPlate);
  }

  const model = createCheckInModel({ ...checkInData, photoUrl });
  const colRef = collection(db, CHECK_INS);
  const docRef = await addDoc(colRef, { ...model, createdAt: serverTimestamp() });

  const tasksColRef = collection(db, CHECK_INS, docRef.id, TASKS_SUB);
  const taskWrites = DEFAULT_CHECKLIST.map((item) =>
    addDoc(tasksColRef, createServiceTaskModel({
      taskId: item.id,
      category: item.category,
      task: item.task,
      critical: item.critical,
    }))
  );
  await Promise.all(taskWrites);

  return docRef.id;
};

/**
 * @param {string} checkInId
 */
export const getCheckIn = async (checkInId) => {
  const ref = doc(db, CHECK_INS, checkInId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getAllCheckIns = async () => {
  const q = query(collection(db, CHECK_INS), orderBy('checkInTime', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const getActiveCheckIns = async () => {
  const q = query(
    collection(db, CHECK_INS),
    where('status', 'in', ['checked_in', 'in_service']),
    orderBy('checkInTime', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Subscribe in real-time to all active check-ins.
 * @param {Function} callback  - Called with the array on every change
 * @returns Unsubscribe function
 */
export const subscribeToActiveCheckIns = (callback) => {
  const q = query(
    collection(db, CHECK_INS),
    where('status', 'in', ['checked_in', 'in_service']),
    orderBy('checkInTime', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

/**
 * Update the status of a check-in.
 * @param {string} checkInId
 * @param {'in_service'|'completed'|'checked_out'} status
 */
export const updateCheckInStatus = async (checkInId, status) => {
  const ref = doc(db, CHECK_INS, checkInId);
  await updateDoc(ref, { status, updatedAt: new Date().toISOString() });
};