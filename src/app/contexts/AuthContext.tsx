import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (profile: UserProfile, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      if (authData.email === email && authData.password === password) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          return;
        }
      }
    }
    throw new Error('Invalid credentials');
  };

  const register = async (profile: UserProfile, password: string) => {
    localStorage.setItem('user', JSON.stringify(profile));
    localStorage.setItem('auth', JSON.stringify({ email: profile.email, password }));
    setUser(profile);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (profile: UserProfile) => {
    localStorage.setItem('user', JSON.stringify(profile));
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
