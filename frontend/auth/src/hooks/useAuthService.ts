import { useState, useCallback } from 'react';
import { AuthResponse, RedirectState, User } from '../types';
import { API_BASE_URL, resolveRedirectTarget } from '../config/env';

export function useAuthService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectState, setRedirectState] = useState<RedirectState | null>(null);

  /**
   * Menangani pengalihan mulus setelah sukses autentikasi
   */
  const handleAuthSuccess = useCallback(
    (authData: AuthResponse, returnTo?: string | null) => {
      const { user, token } = authData;
      const target = resolveRedirectTarget(user, token, returnTo);

      setRedirectState({
        isRedirecting: true,
        targetName: target.targetName,
        targetRole: target.targetRole,
        targetUrl: target.targetUrl,
      });

      // Berikan delay 900ms agar user melihat animasi transisi status akun
      setTimeout(() => {
        window.location.href = target.targetUrl;
      }, 900);
    },
    []
  );

  /**
   * Login dengan Email & Kata Sandi
   */
  const login = useCallback(
    async (email: string, password: string, returnTo?: string | null): Promise<User> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || json.message || 'Email atau kata sandi tidak cocok.');
        }

        handleAuthSuccess(json.data, returnTo);
        return json.data.user;
      } catch (err: any) {
        const msg = err.message || 'Terjadi kesalahan saat masuk ke sistem.';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  /**
   * Pendaftaran Akun Customer Baru
   */
  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      returnTo?: string | null
    ): Promise<User> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || json.message || 'Gagal mendaftarkan akun baru.');
        }

        handleAuthSuccess(json.data, returnTo);
        return json.data.user;
      } catch (err: any) {
        const msg = err.message || 'Terjadi kesalahan saat pendaftaran akun.';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  /**
   * Login via Google ID Token
   */
  const loginWithGoogle = useCallback(
    async (
      credentialOrPayload: string | { email: string; name: string; picture?: string; sub: string },
      returnTo?: string | null
    ): Promise<User> => {
      setLoading(true);
      setError(null);
      try {
        const body =
          typeof credentialOrPayload === 'string'
            ? { credential: credentialOrPayload }
            : credentialOrPayload;

        const res = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || json.message || 'Gagal masuk dengan Google.');
        }

        handleAuthSuccess(json.data, returnTo);
        return json.data.user;
      } catch (err: any) {
        const msg = err.message || 'Terjadi kesalahan saat autentikasi Google.';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  /**
   * Permintaan Tautan Lupa Kata Sandi
   */
  const requestForgotPassword = useCallback(async (email: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || json.message || 'Gagal mengirim instruksi pemulihan.');
      }
      return json.message || 'Instruksi pemulihan telah dikirim ke email Anda.';
    } catch (err: any) {
      const msg = err.message || 'Terjadi gangguan saat memproses lupa kata sandi.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset Kata Sandi Baru dengan Token
   */
  const resetPassword = useCallback(
    async (token: string, password: string): Promise<string> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ token: token.trim(), password }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || json.message || 'Token tidak valid atau sudah kedaluwarsa.');
        }
        return json.message || 'Kata sandi berhasil diperbarui.';
      } catch (err: any) {
        const msg = err.message || 'Gagal mengatur ulang kata sandi.';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    setError,
    redirectState,
    login,
    register,
    loginWithGoogle,
    requestForgotPassword,
    resetPassword,
  };
}
