import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, setToken, clearToken } from './api.js';

const AuthCtx = createContext(null);

const STORAGE_KEY = 'ga_user';

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setToken(parsed.token);
        setUser(parsed);
      }
    } catch (_) {}
    setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await apiLogin(email, password);
    const u = {
      token:   data.token,
      email:   data.user_email,
      name:    data.user_display_name,
      phone:   '',
    };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return u;
  }

  async function register(name, email, password) {
    const data = await apiRegister(name, email, password);
    const u = {
      token:   data.token,
      email:   data.user_email,
      name:    data.user_display_name || name,
      phone:   '',
    };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return u;
  }

  function logout() {
    clearToken();
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  function updateUser(fields) {
    const updated = { ...user, ...fields };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {!loading && children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
