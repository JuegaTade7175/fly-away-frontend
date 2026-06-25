import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AuthResponse, User } from '../types';
import { ApiError, usersApi } from '../api';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  login: (data: AuthResponse) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'token';
const BOOKINGS_KEY = 'bookings';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(BOOKINGS_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await usersApi.current();
      setUser(userData);
    } catch (err) {
      setUser(null);
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
      }
    }
  }, [clearSession]);

  const login = useCallback(async (data: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    await fetchUser();
  }, [fetchUser]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <AuthContext.Provider value={{
      token,
      isAuthenticated: !!token,
      user,
      login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
