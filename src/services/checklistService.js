
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  buildTaskCompletionUpdate,
  buildTaskNoteUpdate,
} from '../models/models';

const CHECK_INS = 'checkIns';
const TASKS_SUB = 'tasks';

const tasksColRef = (checkInId) =>
  collection(db, CHECK_INS, checkInId, TASKS_SUB);

/**
 * Helper — reference to a single task document.
 */
const taskDocRef = (checkInId, taskDocId) =>
  doc(db, CHECK_INS, checkInId, TASKS_SUB, taskDocId);

/**
 * Fetch all tasks for a given check-in (one-time read).
 * @param {string} checkInId
 */
export const getTasksForCheckIn = async (checkInId) => {
  const snap = await getDocs(tasksColRef(checkInId));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Subscribe to real-time task updates for a check-in.
 * This is the primary mechanism for collaborative ticking.
 *
 * @param {string}   checkInId
 * @param {Function} callback   Called with updated task array on every change
 * @returns Unsubscribe function — call on component unmount
 */
export const subscribeToTasks = (checkInId, callback) => {
  const q = query(tasksColRef(checkInId));
  return onSnapshot(q, (snap) => {
    const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Sort by category then task name for consistent display order
    tasks.sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.task.localeCompare(b.task);
    });
    callback(tasks);
  });
};

/**
 * Toggle a task as completed by the current mechanic.
 * If the task is already completed, it will be marked incomplete again
 * (undo support).
 *
 * @param {string} checkInId
 * @param {string} taskDocId   - Firestore document ID of the task
 * @param {object} task        - Current task data (to inspect `completed`)
 * @param {object} user        - Current user: { uid, name }
 */
export const toggleTaskCompletion = async (checkInId, taskDocId, task, user) => {
  const ref = taskDocRef(checkInId, taskDocId);

  if (task.completed) {
    // Undo completion
    await updateDoc(ref, {
      completed: false,
      completedByUid: null,
      completedByName: null,
      completedAt: null,
      updatedAt: new Date().toISOString(),
    });
  } else {
    // Mark complete
    await updateDoc(ref, buildTaskCompletionUpdate(user));
  }
};

/**
 * Save or update the mechanic's note for a specific task.
 *
 * @param {string} checkInId
 * @param {string} taskDocId
 * @param {string} note
 */
export const saveTaskNote = async (checkInId, taskDocId, note) => {
  const ref = taskDocRef(checkInId, taskDocId);
  await updateDoc(ref, buildTaskNoteUpdate(note));
};