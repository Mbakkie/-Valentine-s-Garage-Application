import { useState, useEffect } from 'react';
import { subscribeToActiveCheckIns } from '../services/vehicleService';

const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToActiveCheckIns((data) => {
      setVehicles(data);
      setLoading(false);
    });

    const handleError = (err) => {
      setError(err.message);
      setLoading(false);
    };

    try {
    } catch (err) {
      handleError(err);
    }

    return unsubscribe;
  }, []);

  return { vehicles, loading, error };
};

export default useVehicles;