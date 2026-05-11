import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { getStoredToken, setStoredToken } from '../lib/api';
import { authRepository } from '../repositories/authRepository';


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'turnow_user';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function buildUserFromSession(session: {
  accessToken: string;
  userId?: string;
  email?: string;
  fullName?: string;
  tenantId?: string | null;
  role?: User['role'];
}): User {
  const claims = decodeJwtPayload(session.accessToken);
  const role = (claims?.role as User['role'] | undefined) || session.role || 'CLIENT';

  return {
    id: (claims?.userId as string | undefined) || session.userId || '',
    email: (claims?.sub as string | undefined) || session.email || '',
    name: session.fullName || (claims?.fullName as string | undefined) || session.email || '',
    role,
    tenantId: (claims?.tenantId as string | null | undefined) || session.tenantId || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(STORAGE_KEY);
      const rawToken = getStoredToken();

      if (rawUser && rawToken) {
        setUser(JSON.parse(rawUser));
        setToken(rawToken);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setStoredToken(null);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setStoredToken(null);
    } finally {
      setIsReady(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const session = await authRepository.login(email, password);
      if (!session.accessToken) {
        return false;
      }

      const authUser = buildUserFromSession(session);
      setUser(authUser);
      setToken(session.accessToken);
      setStoredToken(session.accessToken);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    setStoredToken(null);

    // Forzar que después del logout volvamos al flujo de login
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user && !!token, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
