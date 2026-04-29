import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'turnow_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const session = await api.login(email, password);
      const authUser: User = {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
        tenantId: session.tenantId || undefined,
      };
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    
    // Redirect to landing after logout based on current domain
    const hostname = window.location.hostname;
    
    // In localhost, redirect to localhost:3000
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      window.location.href = 'http://localhost:3000';
      return;
    }
    
    // In Netlify, load from config file - detect by hostname starting with 'dev-' or containing 'dev'
    const isDev = hostname.startsWith('dev-') || hostname.includes('-dev');
    const configFile = isDev ? '/config.development.json' : '/config.json';
    
    fetch(configFile)
      .then(r => r.json())
      .then(cfg => {
        window.location.href = cfg.landingUrl || 'https://www.shiftya.online';
      })
      .catch(() => {
        window.location.href = 'https://www.shiftya.online';
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
