import React, { useState } from 'react';
import { BrandHeader } from '../components/BrandHeader';

interface ResetPasswordViewProps {
  token: string;
  onSubmit: (token: string, password: string) => Promise<string>;
  onSuccess: () => void;
  isLoading: boolean;
  error: string | null;
  onErrorChange: (err: string | null) => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({
  token,
  onSubmit,
  onSuccess,
  isLoading,
  error,
  onErrorChange,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onErrorChange(null);

    if (!token.trim()) {
      onErrorChange('Token pengaturan ulang kata sandi tidak ditemukan atau tidak valid.');
      return;
    }
    if (password.length < 6) {
      onErrorChange('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      onErrorChange('Konfirmasi kata sandi baru tidak sesuai.');
      return;
    }

    try {
      await onSubmit(token, password);
      setIsDone(true);
      setTimeout(onSuccess, 2000);
    } catch {
      // Ditangani oleh error prop
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <BrandHeader subtitle="Buat kata sandi baru yang aman untuk akun Anda" />

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-sm">
        <h2 className="text-base font-bold text-on-surface mb-1">
          Atur Ulang Kata Sandi
        </h2>
        <p className="text-xs text-on-surface-variant mb-6">
          Masukkan kata sandi baru Anda di bawah ini untuk memperbarui keamanan akun.
        </p>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-error/10 border border-error/20 flex items-start gap-2.5 text-xs text-error font-medium animate-fade-in-up">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {isDone ? (
          <div className="p-4 rounded-2xl bg-success-container/40 border border-success/30 text-center animate-fade-in-up space-y-3">
            <div className="w-10 h-10 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto text-lg font-bold">
              ✓
            </div>
            <p className="text-xs font-semibold text-on-surface">
              Kata sandi Anda berhasil diperbarui!
            </p>
            <p className="text-[11px] text-on-surface-variant">
              Mengalihkan ke halaman masuk dalam beberapa detik...
            </p>
            <button
              type="button"
              onClick={onSuccess}
              className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Masuk Sekarang
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Kata Sandi Baru
              </label>
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
                  {showPassword ? 'Tutup' : 'Lihat'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
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
                  <span>Menyimpan Kata Sandi...</span>
                </>
              ) : (
                <span>Simpan Kata Sandi Baru</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
