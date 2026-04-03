"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProfile } from '../types/user';

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
    const rawAuth = localStorage.getItem(AUTH_KEY);
    if (!rawAuth) {
      throw new Error('Invalid credentials');
    }

    const authData = JSON.parse(rawAuth) as { email: string; password: string };
    if (authData.email !== email || authData.password !== password) {
      throw new Error('Invalid credentials');
    }

    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) {
      throw new Error('User profile not found');
    }

    const parsedUser = JSON.parse(rawUser) as UserProfile;
    setUser(parsedUser);
    setIsAuthenticated(true);
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
