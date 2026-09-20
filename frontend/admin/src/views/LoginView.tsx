import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Masukkan alamat email yang valid');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Gagal masuk, periksa email dan kata sandi Anda');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-sm">

        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-md">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-on-surface font-display flex items-center gap-2">
            Nuptia
            <span className="text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container">
              ADMIN
            </span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-sm animate-fade-in-up">
          <div className="mb-6">
            <h1 className="text-lg font-bold text-on-surface">Masuk ke Console</h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Khusus tim internal Nuptia. Gunakan akun administrator Anda.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 flex items-start gap-2">
              <svg className="w-4 h-4 text-error shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-medium text-error leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Email Internal
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@nuptia.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-60 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-on-primary/30 border-t-on-primary animate-spin" />
                  <span>Memvalidasi...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-on-surface-variant mt-6">
          Hanya untuk tim internal Nuptia. Akses tidak sah akan dicatat.
        </p>
      </div>
    </div>
  );
};
