import { createContext, useContext, useState, useEffect } from 'react';
import * as API from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.validateToken().then(token => {
      if (token) {
        fetchCurrentUser();
      } else {
        setLoading(false);
      }
    });
  }, []);

  async function fetchCurrentUser() {
    try {
      const res = await fetch('https://gluteaddictsmedellin.co/wp-json/wp/v2/users/me', {
        headers: { Authorization: `Bearer ${API.getToken()}` },
      });
      const data = await res.json();
      setUser({
        id:    data.id,
        name:  data.name,
        email: data.email || data.slug,
        phone: data.meta?.rc_phone || '',
      });
    } catch {
      API.clearToken();
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const data = await API.login(email, password);
    setUser({
      id:    data.user_id,
      name:  data.user_display_name,
      email: data.user_email,
      phone: '',
    });
    return data;
  }

  async function register(name, email, password) {
    const data = await API.register(name, email, password);
    setUser({
      id:    data.user_id,
      name:  data.user_display_name,
      email: data.user_email,
      phone: '',
    });
    return data;
  }

  function logout() {
    API.logout();
    setUser(null);
  }

  function updateUser(updates) {
    setUser(prev => ({ ...prev, ...updates }));
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
