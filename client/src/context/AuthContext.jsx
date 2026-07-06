import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillforge_token'));
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('skillforge_token');
      if (savedToken) {
        try {
          const { data } = await api.get('/auth/me');
          if (data.success) setUser(data.user);
        } catch {
          localStorage.removeItem('skillforge_token');
          localStorage.removeItem('skillforge_user');
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('skillforge_token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.fullName.split(' ')[0]}! 👋`);
      return data.user;
    }
    throw new Error(data.message);
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    const { data } = await api.post('/auth/register', { fullName, email, password });
    if (data.success) {
      localStorage.setItem('skillforge_token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success('Account created! Welcome to SkillForge 🚀');
      return data.user;
    }
    throw new Error(data.message);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('skillforge_token');
    localStorage.removeItem('skillforge_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) setUser(data.user);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
