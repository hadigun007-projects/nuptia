import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ForgotPasswordViewProps {
  onBack: () => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Masukkan alamat email yang valid');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) throw new Error('Terjadi kesalahan server');
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim permintaan reset');
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
          {sent ? (
            /* Success State */
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface">Email Terkirim!</h2>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Jika email <strong>{email}</strong> terdaftar, link reset kata sandi telah dikirim.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-primary-container/20 border border-primary/20">
                <p className="text-xs text-on-surface font-semibold">Development Mode</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Cek email di{' '}
                  <a href="http://localhost:8025" target="_blank" rel="noreferrer"
                    className="text-primary underline font-semibold">
                    Mailpit → localhost:8025
                  </a>
                </p>
              </div>
              <button
                onClick={onBack}
                className="w-full py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
              >
                ← Kembali ke Login
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="mb-6">
                <h1 className="text-lg font-bold text-on-surface">Lupa Kata Sandi?</h1>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Masukkan email akun admin Anda. Kami akan kirimkan link untuk membuat kata sandi baru.
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
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    Email Internal
                  </label>
                  <input
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-95 transition-opacity disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-on-primary/30 border-t-on-primary animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <span>Kirim Link Reset</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="w-full py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  ← Kembali ke Login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
