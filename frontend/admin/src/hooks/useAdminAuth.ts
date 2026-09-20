import { useState, useEffect, useCallback } from 'react';
import { AdminUser } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'nuptia_auth_token';
const USER_KEY = 'nuptia_user';

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
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

  const isAdmin = Boolean(user && user.role === 'admin');
  const isAuthenticated = Boolean(user && token);

  return {
    user,
    token,
    isAdmin,
    isAuthenticated,
    loading,
    logout,
    checkAuth,
    devSetAdmin,
  };
}
