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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem('token');

    if (token) {
      setIsAuthenticated(true);
    }

    if (!storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser) as UserProfile;
      setUser(parsedUser);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('token');
    }
  }, []);

const login = async (email: string, password: string) => {
  const res = await authApi.login({ email, password });

  if (!res.token) throw new Error('Invalid credentials');

  localStorage.setItem('token', res.token);

  if (res.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    setUser(res.user);
  }

  setIsAuthenticated(true);
};
  

  const register = async (profile: UserProfile, password: string) => {
    await authApi.register({
      username: profile.name, // мапимо під бек
      email: profile.email,
      password,
    });

    // зберігаємо профіль локально після успішної реєстрації
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem(USER_KEY);
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
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}