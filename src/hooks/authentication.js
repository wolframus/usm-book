import { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile,  } from 'firebase/auth';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  const signUp = async (email, password, {displayName, photoURL}, callback) => {
    setLoading(true);
    setError('')
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(result.user, {photoURL,displayName,});
      
      setUser(result.user);
      setLoading(false);
      callback?.()
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const signIn = async (email, password, callback) => {
    setLoading(true);
    setError('')
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setLoading(false);
      callback?.()
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError('')
    try {
      await signOut(auth);
      setUser(null);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  return { user, error, loading, signUp, signIn, logout };
};

export default useAuth;
