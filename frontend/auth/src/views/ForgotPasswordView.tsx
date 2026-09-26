import React, { useState } from 'react';
import { BrandHeader } from '../components/BrandHeader';

interface ForgotPasswordViewProps {
  onSubmit: (email: string) => Promise<string>;
  onBackToLogin: () => void;
  isLoading: boolean;
  error: string | null;
  onErrorChange: (err: string | null) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onSubmit,
  onBackToLogin,
  isLoading,
  error,
  onErrorChange,
}) => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onErrorChange(null);

    if (!email.trim() || !email.includes('@')) {
      onErrorChange('Masukkan alamat email yang valid.');
      return;
    }

    try {
      const msg = await onSubmit(email);
      setSuccessMessage(msg);
    } catch {
      // Ditangani oleh error prop
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <BrandHeader subtitle="Pulihkan akses ke akun Nuptia Anda" />

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-sm">
        <h2 className="text-base font-bold text-on-surface mb-1">
          Lupa Kata Sandi?
        </h2>
        <p className="text-xs text-on-surface-variant mb-6">
          Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
        </p>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-error/10 border border-error/20 flex items-start gap-2.5 text-xs text-error font-medium animate-fade-in-up">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {successMessage ? (
          <div className="p-4 rounded-2xl bg-success-container/40 border border-success/30 text-center animate-fade-in-up space-y-3">
            <div className="w-10 h-10 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto text-lg font-bold">
              ✓
            </div>
            <p className="text-xs font-semibold text-on-surface">
              {successMessage}
            </p>
            <p className="text-[11px] text-on-surface-variant">
              Silakan periksa folder Inbox atau Spam email Anda.
            </p>
            <button
              type="button"
              onClick={onBackToLogin}
              className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Kembali ke Halaman Masuk
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Alamat Email Terdaftar
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-[#861071] active:scale-[0.99] text-on-primary font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Mengirim Tautan...</span>
                </>
              ) : (
                <span>Kirim Tautan Pemulihan</span>
              )}
            </button>

            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full py-2.5 text-center text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              ← Kembali ke Masuk
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
