
import { useState, useEffect } from 'react';
import { subscribeToAuthChanges, getUserProfile } from '../services/authService';

/**
 * @returns {{
 *   user:    import('firebase/auth').User | null,
 *   profile: object | null,
 *   loading: boolean,
 * }}
 */
const useAuth = () => {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const prof = await getUserProfile(firebaseUser.uid);
          setProfile(prof);
        } catch {
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe; 
  }, []);

  return { user, profile, loading };
};

export default useAuth;