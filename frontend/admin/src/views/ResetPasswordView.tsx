import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ResetPasswordViewProps {
  onSuccess: () => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onSuccess }) => {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Baca token dari URL hash: #/reset-password?token=xxx
  useEffect(() => {
    const hash = window.location.hash; // e.g. "#/reset-password?token=abc"
    const queryStart = hash.indexOf('?');
    if (queryStart !== -1) {
      const params = new URLSearchParams(hash.slice(queryStart + 1));
      setToken(params.get('token'));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }
    if (password !== confirm) {
      setError('Konfirmasi kata sandi tidak cocok');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || 'Gagal mereset kata sandi');
      }
      setDone(true);
      // Redirect ke login setelah 2 detik
      setTimeout(() => onSuccess(), 2500);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-md">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-on-surface font-display flex items-center gap-2">
            Nuptia
            <span className="text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container">ADMIN</span>
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-sm animate-fade-in-up">

          {/* No Token */}
          {!token ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface">Link Tidak Valid</h2>
                <p className="text-xs text-on-surface-variant mt-1">Token reset tidak ditemukan. Gunakan link dari email Anda.</p>
              </div>
              <button
                onClick={() => { window.location.hash = '#/'; }}
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:opacity-95 transition-opacity"
              >
                Kembali ke Login
              </button>
            </div>
          ) : done ? (
            /* Success */
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface">Kata Sandi Diperbarui!</h2>
                <p className="text-xs text-on-surface-variant mt-1">Mengalihkan ke halaman login...</p>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto" />
            </div>
          ) : (
            /* Form */
            <>
              <div className="mb-6">
                <h1 className="text-lg font-bold text-on-surface">Buat Kata Sandi Baru</h1>
                <p className="text-xs text-on-surface-variant mt-1">
                  Masukkan kata sandi baru untuk akun admin Anda. Minimal 6 karakter.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 flex items-start gap-2">
                  <svg className="w-4 h-4 text-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-medium text-error">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Password baru */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Kata Sandi Baru</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-3.5 py-2.5 pr-10 text-sm bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
                    />
                    <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d={showPassword
                            ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            : "M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a3 3 0 016 0M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Konfirmasi */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Konfirmasi Kata Sandi</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={isLoading}
                    className={`w-full px-3.5 py-2.5 text-sm bg-surface-container-low rounded-xl border text-on-surface focus:outline-none transition-colors disabled:opacity-60 ${confirm && confirm !== password ? 'border-error' : 'border-outline-variant/30 focus:border-primary'}`}
                  />
                  {confirm && confirm !== password && (
                    <p className="text-[11px] text-error mt-1">Kata sandi tidak cocok</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || (!!confirm && confirm !== password)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-on-primary/30 border-t-on-primary animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Kata Sandi Baru</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
