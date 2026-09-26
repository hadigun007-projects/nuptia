import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';

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
    // fallback
  }
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(getInitialToken);

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Validate session with backend on initial load
  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        if (isMounted) setLoading(false);
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
            if (isMounted) {
              setUser(json.data);
              localStorage.setItem(USER_KEY, JSON.stringify(json.data));
            }
          }
        } else if (res.status === 401) {
          // Token expired or invalid
          if (isMounted) {
            setUser(null);
            setToken(null);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      } catch {
        // Network offline, retain offline user state
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verifySession();
    return () => {
      isMounted = false;
    };
  }, []);

  const saveAuthSession = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setError(null);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Gagal masuk. Periksa email dan kata sandi.');
        }

        saveAuthSession(data.data.token, data.data.user);
        return data.data.user;
      } catch (err: any) {
        const msg = err.message || 'Terjadi kesalahan saat masuk';
        setError(msg);
        throw new Error(msg);
      }
    },
    [saveAuthSession]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<User> => {
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Gagal mendaftar akun.');
        }

        saveAuthSession(data.data.token, data.data.user);
        return data.data.user;
      } catch (err: any) {
        const msg = err.message || 'Terjadi kesalahan saat pendaftaran';
        setError(msg);
        throw new Error(msg);
      }
    },
    [saveAuthSession]
  );

  const loginWithGoogle = useCallback(
    async (credentialOrPayload: string | { email: string; name: string; picture?: string; sub: string }): Promise<User> => {
      setError(null);
      try {
        const body =
          typeof credentialOrPayload === 'string'
            ? { credential: credentialOrPayload }
            : credentialOrPayload;

        const res = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Gagal masuk dengan Google.');
        }

        saveAuthSession(data.data.token, data.data.user);
        return data.data.user;
      } catch (err: any) {
        const msg = err.message || 'Terjadi kesalahan saat Google Sign-In';
        setError(msg);
        throw new Error(msg);
      }
    },
    [saveAuthSession]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = `${AUTH_APP_URL}/#/login`;
  }, []);

  return {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
  };
}
