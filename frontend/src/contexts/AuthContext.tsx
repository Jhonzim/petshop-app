import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Roles, isRole, type AuthUser, type Role } from '../types/auth';

interface AuthContextState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

interface LoginCredentials {
  email: string;
  password: string;
  expectedRole: Role;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

const STORAGE_KEY = 'petbuddy:auth';

const AuthContext = createContext<AuthContextState | undefined>(undefined);

function loadStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as AuthUser;
    if (parsed?.token) {
      api.defaults.headers.common.Authorization = `Bearer ${parsed.token}`;
    }
    return parsed ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredUser());

  const applyAuthHeader = useCallback((authUser: AuthUser | null) => {
    if (authUser) {
      api.defaults.headers.common.Authorization = `Bearer ${authUser.token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, []);

  useEffect(() => {
    applyAuthHeader(user);
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [user, applyAuthHeader]);

  const logout = useCallback(() => {
    setUser(null);
    applyAuthHeader(null);
  }, [applyAuthHeader]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = useCallback(
    async ({ email, password, expectedRole }: LoginCredentials) => {
      const response = await api.post<LoginResponse>('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;

      if (!isRole(userData.role)) {
        throw new Error('Perfil de usuário inválido retornado pelo servidor.');
      }

      if (userData.role !== expectedRole) {
        throw new Error('Credenciais não correspondem ao perfil selecionado.');
      }

      const authUser: AuthUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        token
      };

      applyAuthHeader(authUser);
      setUser(authUser);
    },
    [applyAuthHeader]
  );

  const value = useMemo<AuthContextState>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider');
  }
  return context;
}

export function getRedirectForRole(role: Role) {
  return role === Roles.ADMIN ? '/admin/dashboard' : '/catalog';
}
