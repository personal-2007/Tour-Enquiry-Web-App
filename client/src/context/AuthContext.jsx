import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Verify session on app mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await authApi.getMe();
        if (res.data?.success && res.data?.data?.admin) {
          setAdmin(res.data.data.admin);
          localStorage.setItem('admin_user', JSON.stringify(res.data.data.admin));
        } else {
          setAdmin(null);
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }
      } catch {
        // If verify fails, clear local credentials
        setAdmin(null);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    if (response.data?.success && response.data?.data) {
      const { admin: adminData, token } = response.data.data;
      if (token) {
        localStorage.setItem('admin_token', token);
      }
      localStorage.setItem('admin_user', JSON.stringify(adminData));
      setAdmin(adminData);
      return response.data;
    }
    throw new Error(response.data?.message || 'Login failed.');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setAdmin(null);
    }
  };

  const value = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
