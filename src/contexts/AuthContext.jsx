/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    authAPI.getMe()
      .then(({ data }) => { if (mounted) setUser(data.user); })
      .catch(() => { if (mounted) setUser(null); })
      .finally(() => { if (mounted) setLoading(false); });

    const handleExpired = () => setUser(null);
    window.addEventListener('auth:expired', handleExpired);
    return () => { mounted = false; window.removeEventListener('auth:expired', handleExpired); };
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await authAPI.login(credentials);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const adminLogin = async (credentials) => {
    try {
      const { data } = await authAPI.adminLogin(credentials);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Admin login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authAPI.register(userData);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try { await authAPI.logout(); } finally { setUser(null); }
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), login, adminLogin, register, logout, updateUser }}>{!loading && children}</AuthContext.Provider>;
}

export default AuthContext;
