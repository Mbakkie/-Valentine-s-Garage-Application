import { useState, useEffect } from 'react';
import { subscribeToTasks } from '../services/checklistService';

/**
 * @param {string} checkInId  - Firestore document ID of the check-in
 */
const useChecklist = (checkInId) => {
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checkInId) return;

    const unsubscribe = subscribeToTasks(checkInId, (updatedTasks) => {
      setTasks(updatedTasks);
      setLoading(false);
    });

    return unsubscribe;
  }, [checkInId]);

  const grouped = tasks.reduce((acc, task) => {
    const cat = task.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(task);
    return acc;
  }, {});

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    critical: tasks.filter((t) => t.critical && !t.completed).length,
    percentage: tasks.length
      ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
      : 0,
  };

  return { tasks, loading, grouped, stats };
};

export default useChecklist;