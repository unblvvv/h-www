"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProfile } from '../../shared/types/user';
import { authApi } from './api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthInProgress: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (profile: UserProfile, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'shelter_user';

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '='));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const resolveProfileFromAuth = (res: { token?: string; user?: unknown }): UserProfile | null => {
  if (res.user && typeof res.user === 'object') {
    const user = res.user as Partial<UserProfile>;
    if (user.name && user.email) {
      return { name: user.name, email: user.email, phone: user.phone };
    }
  }

  if (res.token) {
    const payload = decodeJwtPayload(res.token);
    if (payload) {
      const name = String(payload.name ?? payload.username ?? '').trim();
      const email = String(payload.email ?? '').trim();
      if (name && email) {
        return { name, email };
      }
    }
  }

  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthInProgress, setIsAuthInProgress] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedUser = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem('token');

      if (token) {
        setIsAuthenticated(true);
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as UserProfile;
          setUser(parsedUser);
          setIsAuthenticated(true);
          setIsAuthInProgress(false);
          return;
        } catch {
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem('token');
        }
      }

      if (token) {
        try {
          const profileResponse = await authApi.getMe();
          const profile = profileResponse.data;
          localStorage.setItem(USER_KEY, JSON.stringify(profile));
          setUser(profile);
          setIsAuthenticated(true);
        } catch {
          localStorage.removeItem('token');
        }
      }

      setIsAuthInProgress(false);
    };

    void bootstrapAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsAuthInProgress(true);
    try {
      const res = await authApi.login({ email, password });
      const data = res.data;

      if (!data.token) throw new Error('Invalid credentials');

      localStorage.setItem('token', data.token);

      const profile = resolveProfileFromAuth(data);
      if (profile) {
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
        setUser(profile);
      } else {
        const profileResponse = await authApi.getMe();
        const fetchedProfile = profileResponse.data;
        localStorage.setItem(USER_KEY, JSON.stringify(fetchedProfile));
        setUser(fetchedProfile);
      }

      setIsAuthenticated(true);
    } finally {
      setIsAuthInProgress(false);
    }
  };

  const register = async (profile: UserProfile, password: string) => {
    setIsAuthInProgress(true);
    try {
      const res = await authApi.register({
        username: profile.name,
        email: profile.email,
        password,
      });

      const data = res.data;
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }

      localStorage.setItem(USER_KEY, JSON.stringify(profile));
      setUser(profile);
      setIsAuthenticated(true);
    } finally {
      setIsAuthInProgress(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
    setIsAuthInProgress(false);
  };

  const updateProfile = (profile: UserProfile) => {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthInProgress, user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
