import { createContext, useContext, useState, useEffect } from 'react';
import * as API from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = API.getUser();
    if (savedUser) {
      API.validateToken().then(token => {
        if (token) {
          setUser(savedUser);
        } else {
          API.clearUser();
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const data = await API.login(email, password);
    setUser({
      id:    data.id,
      name:  data.name,
      email: email,
      phone: data.meta?.rc_phone || '',
    });
    return data;
  }

  async function register(name, email, password) {
    const data = await API.register(name, email, password);
    setUser({
      id:    data.id,
      name:  data.name,
      email: email,
      phone: '',
    });
    return data;
  }

  function logout() {
    API.logout();
    setUser(null);
  }

  function updateUser(updates) {
    const updated = { ...user, ...updates };
    setUser(updated);
    API.setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {loading
        ? <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: 14 }}>⏳ Cargando...</div>
        : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
