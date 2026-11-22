/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'smolinker_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const setSession = (userData) => {
    setUser(userData);
    setShowTable(false);
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const toggleTable = () => setShowTable((prev) => !prev);

  return (
    <AuthContext.Provider value={{ user, loading, setSession, showTable, setShowTable, toggleTable }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
