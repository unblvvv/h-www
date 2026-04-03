"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProfile } from '../../shared/types/user';
import { authApi } from './api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (profile: UserProfile, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'shelter_user';
const AUTH_KEY = 'shelter_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem('token');

    if (token) {
      setIsAuthenticated(true);
    }

    if (!storedUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as UserProfile;
      setUser(parsedUser);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(AUTH_KEY);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const token = res.token;

    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (profile: UserProfile, password: string) => {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email: profile.email, password }));
    setUser(profile);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (profile: UserProfile) => {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
