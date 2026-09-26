import React, { useState } from 'react';
import { BrandHeader } from '../components/BrandHeader';
import { GoogleButton } from '../components/GoogleButton';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleLogin: (credential: string) => Promise<void>;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  isLoading: boolean;
  error: string | null;
  onErrorChange: (err: string | null) => void;
  returnTo?: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onGoogleLogin,
  onSwitchToRegister,
  onForgotPassword,
  isLoading,
  error,
  onErrorChange,
  returnTo,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onErrorChange(null);

    if (!email.trim() || !email.includes('@')) {
      onErrorChange('Masukkan alamat email yang valid.');
      return;
    }
    if (password.length < 6) {
      onErrorChange('Kata sandi minimal 6 karakter.');
      return;
    }

    try {
      await onLogin(email, password);
    } catch {
      // Error sudah ditangani di hook/state
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      {/* Brand Header */}
      <BrandHeader subtitle="Satu pintu masuk untuk seluruh layanan Nuptia Platform" />

      {/* Main Card */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-sm">
        {/* Navigation Tabs (Masuk vs Daftar) */}
        <div className="flex bg-surface-container-low p-1 rounded-2xl mb-6">
          <button
            type="button"
            className="flex-1 py-2 text-xs font-bold rounded-xl bg-surface-container-lowest text-primary shadow-sm transition-all"
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="flex-1 py-2 text-xs font-semibold rounded-xl text-on-surface-variant hover:text-on-surface transition-all"
          >
            Daftar Akun
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-error/10 border border-error/20 flex items-start gap-2.5 text-xs text-error font-medium animate-fade-in-up">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Return To notification badge */}
        {returnTo && (
          <div className="mb-4 px-3 py-1.5 rounded-xl bg-secondary-container/40 text-on-secondary-container text-[11px] font-medium flex items-center gap-1.5">
            <span>↪</span>
            <span>Anda akan diarahkan kembali ke halaman sebelumnya setelah masuk.</span>
          </div>
        )}

        {/* Google OAuth Sign-in */}
        <div className="mb-5">
          <GoogleButton
            onSuccess={onGoogleLogin}
            onError={onErrorChange}
            disabled={isLoading}
          />
        </div>

        {/* Divider */}
        <div className="relative flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-outline-variant/25" />
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            atau dengan email
          </span>
          <div className="flex-1 h-px bg-outline-variant/25" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Alamat Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                tabIndex={-1}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Lupa kata sandi?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-outline-variant/50 bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs font-medium cursor-pointer"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-[#861071] active:scale-[0.99] text-on-primary font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Masuk ke Akun</span>
            )}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-on-surface-variant">
        <span>Belum punya akun Nuptia? </span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-bold text-primary hover:underline cursor-pointer"
        >
          Daftar sekarang gratis
        </button>
      </div>
    </div>
  );
};
