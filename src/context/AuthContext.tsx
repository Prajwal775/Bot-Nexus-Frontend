import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginApi } from '@/api/auth.api';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { access_token, refresh_token, user_id } = await loginApi(
        email,
        password
      );

      // ✅ success only
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user_id', String(user_id)); // 🔥 REQUIRED

      setIsAuthenticated(true);
    } catch (error) {
      // ❌ failure path
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_id'); // 🔥 ADD
      setIsAuthenticated(false);

      throw error; // 🔥 CRITICAL
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id'); // 🔥 ADD

     // 🧹 chat cleanup (🔥 IMPORTANT)
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('chat_messages_')) {
        localStorage.removeItem(key);
      }
    });

    sessionStorage.removeItem('botnexus_chat_session_id');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
