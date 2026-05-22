import { useState, useEffect } from 'react';
import { subscribeToActiveCheckIns } from '../services/vehicleService';

const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
  let unsubscribe;
  try {
    unsubscribe = subscribeToActiveCheckIns((data) => {
      setVehicles(data);
      setLoading(false);
    });
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
  return () => unsubscribe?.();
}, []);
  return { vehicles, loading, error };
};

export default useVehicles;