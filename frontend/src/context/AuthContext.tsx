import { createContext, useContext, useState, ReactNode } from 'react';
import { api, apiErrorMessage } from '../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('stockpro_user');
    return raw ? JSON.parse(raw) : null;
  });

  function persist(token: string, user: User) {
    localStorage.setItem('stockpro_token', token);
    localStorage.setItem('stockpro_user', JSON.stringify(user));
    setUser(user);
  }

  async function login(email: string, password: string) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      persist(data.token, data.user);
    } catch (err) {
      throw new Error(apiErrorMessage(err, 'Could not sign in.'));
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      persist(data.token, data.user);
    } catch (err) {
      throw new Error(apiErrorMessage(err, 'Could not create your account.'));
    }
  }

  function logout() {
    localStorage.removeItem('stockpro_token');
    localStorage.removeItem('stockpro_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
