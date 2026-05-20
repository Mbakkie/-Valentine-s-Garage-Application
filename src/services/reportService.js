
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const CHECK_INS = 'checkIns';
const TASKS_SUB = 'tasks';

export const getEmployeeActivityReport = async () => {
  const checkInsSnap = await getDocs(
    query(collection(db, CHECK_INS), orderBy('checkInTime', 'desc'))
  );

  const report = {};

  for (const checkInDoc of checkInsSnap.docs) {
    const checkIn = checkInDoc.data();
    const tasksSnap = await getDocs(
      collection(db, CHECK_INS, checkInDoc.id, TASKS_SUB)
    );

    for (const taskDoc of tasksSnap.docs) {
      const task = taskDoc.data();
      if (!task.completed || !task.completedByUid) continue;

      const { completedByUid: uid, completedByName: name } = task;

      if (!report[uid]) {
        report[uid] = { name, tasksCompleted: 0, vehiclesWorkedOn: [] };
      }

      report[uid].tasksCompleted += 1;

      if (!report[uid].vehiclesWorkedOn.includes(checkIn.truckPlate)) {
        report[uid].vehiclesWorkedOn.push(checkIn.truckPlate);
      }
    }
  }

  return report;
};

/**
 * Returns all check-in records for a specific truck plate, ordered by date.
 * Each record is enriched with a task-completion summary.
 *
 * @param {string} truckPlate
 */
export const getVehicleHistory = async (truckPlate) => {
  const q = query(
    collection(db, CHECK_INS),
    where('truckPlate', '==', truckPlate.toUpperCase()),
    orderBy('checkInTime', 'desc')
  );
  const snap = await getDocs(q);

  const history = [];

  for (const d of snap.docs) {
    const checkIn = { id: d.id, ...d.data() };
    const tasksSnap = await getDocs(
      collection(db, CHECK_INS, d.id, TASKS_SUB)
    );
    const tasks = tasksSnap.docs.map((t) => t.data());
    const completedCount = tasks.filter((t) => t.completed).length;

    history.push({
      ...checkIn,
      totalTasks: tasks.length,
      completedTasks: completedCount,
    });
  }

  return history;
};

export const getDashboardSummary = async () => {
  const [allSnap, activeSnap] = await Promise.all([
    getDocs(collection(db, CHECK_INS)),
    getDocs(
      query(
        collection(db, CHECK_INS),
        where('status', 'in', ['checked_in', 'in_service'])
      )
    ),
  ]);

  return {
    totalCheckIns: allSnap.size,
    activeVehicles: activeSnap.size,
    completedToday: allSnap.docs.filter((d) => {
      const data = d.data();
      const today = new Date().toDateString();
      return (
        data.status === 'completed' &&
        new Date(data.checkInTime).toDateString() === today
      );
    }).length,
  };
};