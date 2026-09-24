import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string, role?: 'user' | 'admin') => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (name?: string, email?: string, password?: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('shopease_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('shopease_token');
      const storedUser = localStorage.getItem('shopease_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with backend
          const freshUser = await api.getProfile();
          setUser(freshUser);
          localStorage.setItem('shopease_user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('[Auth] Session expired or invalid:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.login(email, password);
    setToken(res.token);
    setUser({
      _id: res._id,
      name: res.name,
      email: res.email,
      role: res.role,
      createdAt: res.createdAt,
    });
    localStorage.setItem('shopease_token', res.token);
    localStorage.setItem('shopease_user', JSON.stringify(res));
    return res;
  };

  const register = async (name: string, email: string, password: string, role?: 'user' | 'admin'): Promise<AuthResponse> => {
    const res = await api.register(name, email, password, role);
    setToken(res.token);
    setUser({
      _id: res._id,
      name: res.name,
      email: res.email,
      role: res.role,
      createdAt: res.createdAt,
    });
    localStorage.setItem('shopease_token', res.token);
    localStorage.setItem('shopease_user', JSON.stringify(res));
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shopease_token');
    localStorage.removeItem('shopease_user');
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const freshUser = await api.getProfile();
      setUser(freshUser);
      localStorage.setItem('shopease_user', JSON.stringify(freshUser));
    } catch (e) {
      console.error('[Auth] Failed to refresh profile:', e);
    }
  };

  const updateUser = async (name?: string, email?: string, password?: string): Promise<User> => {
    const updated = await api.updateProfile(name, email, password);
    setUser(updated);
    localStorage.setItem('shopease_user', JSON.stringify(updated));
    return updated;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
