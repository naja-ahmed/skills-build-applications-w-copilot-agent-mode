import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const profile = await ApiService.getUserProfile();
        setUser(profile);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      await ApiService.login(username, password);
      await checkAuth();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password1, password2) => {
    try {
      await ApiService.register(username, email, password1, password2);
      await checkAuth();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
