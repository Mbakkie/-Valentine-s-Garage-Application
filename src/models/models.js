/**
 * User document — stored in the `users` collection.
 * @param {string} uid   - Firebase Auth UID
 * @param {string} email
 * @param {string} name  - Display name
 * @param {'admin'|'mechanic'} role
 */
export const createUserModel = (uid, email, name, role = 'mechanic') => ({
  uid,
  email,
  name,
  role,
  createdAt: new Date().toISOString(),
  active: true,
});

/**
 * CheckIn document — stored in `checkIns` collection.
 * Captures the state of a truck when it arrives at the garage.
 *
 * @param {string} truckPlate        - Registration number / plate
 * @param {string} truckModel        - Make and model
 * @param {number} odometerReading   - Current km reading
 * @param {string} condition         - 'excellent'|'good'|'fair'|'poor'|'critical'
 * @param {string} driverName        - Name of driver handing in the vehicle
 * @param {string} notes             - Optional remarks at check-in
 * @param {string} photoUrl          - Firebase Storage URL for evidence photo
 * @param {string} checkedInByUid    - UID of mechanic who performed check-in
 * @param {string} checkedInByName   - Display name of that mechanic
 */
export const createCheckInModel = ({
  truckPlate,
  truckModel,
  odometerReading,
  condition,
  driverName = '',
  notes = '',
  photoUrl = null,
  checkedInByUid,
  checkedInByName,
}) => ({
  truckPlate: truckPlate.toUpperCase().trim(),
  truckModel,
  odometerReading: Number(odometerReading),
  condition,
  driverName,
  notes,
  photoUrl,
  checkedInByUid,
  checkedInByName,
  status: 'checked_in',  
  checkInTime: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * ServiceTask document — stored in `checkIns/{checkInId}/tasks` sub-collection.
 * One document per checklist item per vehicle visit.
 *
 * @param {string}  taskId      - References DEFAULT_CHECKLIST[n].id
 * @param {string}  category    - Task category label
 * @param {string}  task        - Human-readable task description
 * @param {boolean} critical    - Whether this task is safety-critical
 */
export const createServiceTaskModel = ({ taskId, category, task, critical }) => ({
  taskId,
  category,
  task,
  critical,
  completed: false,
  completedByUid: null,
  completedByName: null,
  completedAt: null,
  note: '',
  updatedAt: new Date().toISOString(),
});

export const buildTaskCompletionUpdate = ({ uid, name }) => ({
  completed: true,
  completedByUid: uid,
  completedByName: name,
  completedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const buildTaskNoteUpdate = (note) => ({
  note,
  updatedAt: new Date().toISOString(),
});