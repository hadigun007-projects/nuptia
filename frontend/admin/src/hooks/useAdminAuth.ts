import { useState, useEffect, useCallback } from 'react';
import { AdminUser } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const AUTH_APP_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:5175';
const TOKEN_KEY = 'nuptia_auth_token';
const USER_KEY = 'nuptia_user';

function getInitialToken(): string | null {
  try {
    const hash = window.location.hash;
    if (hash && hash.includes('auth_token=')) {
      const cleanHash = hash.replace(/^#\/?/, '');
      const params = new URLSearchParams(cleanHash.startsWith('?') ? cleanHash.slice(1) : cleanHash);
      const handoffToken = params.get('auth_token');
      const targetRedirect = params.get('auth_redirect');
      if (handoffToken) {
        localStorage.setItem(TOKEN_KEY, handoffToken);
        const nextHash = targetRedirect
          ? targetRedirect.startsWith('/')
            ? `#${targetRedirect}`
            : `#/${targetRedirect}`
          : '#/';
        window.history.replaceState(null, '', window.location.pathname + window.location.search + nextHash);
        return handoffToken;
      }
    }
  } catch {
    // fallback to storage
  }
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(getInitialToken);

  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Validate session against backend /api/v1/auth/me
  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const userData: AdminUser = {
            ...json.data,
            status: json.data.status || 'active',
          };
          setUser(userData);
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
        }
      } else if (res.status === 401) {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    } catch {
      // Retain offline state if API is temporarily unreachable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = `${AUTH_APP_URL}/#/login`;
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error || json.message || 'Email atau kata sandi salah');
    }

    const { token: newToken, user: userData } = json.data;
    const enriched: AdminUser = { ...userData, status: userData.status || 'active' };

    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(enriched));
    setToken(newToken);
    setUser(enriched);
  }, []);

  // Development convenience: switch or promote current session to admin for local dev
  const devSetAdmin = useCallback(() => {
    const devAdmin: AdminUser = {
      id: 'admin-local-1',
      name: 'Super Admin Nuptia',
      email: 'admin@nuptia.id',
      role: 'admin',
      status: 'active',
      authProvider: 'email',
      createdAt: new Date().toISOString(),
    };
    setUser(devAdmin);
    setToken('dev-admin-token');
    localStorage.setItem(TOKEN_KEY, 'dev-admin-token');
    localStorage.setItem(USER_KEY, JSON.stringify(devAdmin));
  }, []);

  const isAdmin = Boolean(
    user && (user.role === 'admin' || user.role === 'developer' || user.role === 'viewer')
  );
  const isAuthenticated = Boolean(user && token);

  return {
    user,
    token,
    isAdmin,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth,
    devSetAdmin,
  };
}
