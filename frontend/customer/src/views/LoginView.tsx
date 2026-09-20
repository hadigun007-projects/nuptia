import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

// ─── Google Identity Services type shim ──────────────────────────────────────
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: Record<string, unknown>
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

// ─── Google Client ID ─────────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '123456789-placeholder.apps.googleusercontent.com';

// ─── Icon helpers (inline SVG) ────────────────────────────────────────────────
const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconEye = ({ open }: { open: boolean }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
);

const IconGoogle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const IconSpinner = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// ─── Floral / decorative SVG for branding side ────────────────────────────────
const FloralDecoration = () => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
    <circle cx="80" cy="80" r="200" fill="white" />
    <circle cx="420" cy="420" r="160" fill="white" />
    <circle cx="400" cy="100" r="80" fill="white" />
    <circle cx="100" cy="400" r="100" fill="white" />
  </svg>
);

// ─── Ring SVG decoration ──────────────────────────────────────────────────────
const RingDecoration = () => (
  <div className="absolute bottom-8 right-8 opacity-20 pointer-events-none" aria-hidden="true">
    <svg width="220" height="120" viewBox="0 0 220 120" fill="none">
      <circle cx="70" cy="60" r="55" stroke="white" strokeWidth="8" />
      <circle cx="150" cy="60" r="55" stroke="white" strokeWidth="8" />
    </svg>
  </div>
);

// ─── Dot pattern ─────────────────────────────────────────────────────────────
const DotPattern = () => (
  <div className="absolute inset-0 pointer-events-none opacity-5" aria-hidden="true"
    style={{
      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }} />
);

// ─── Input field ─────────────────────────────────────────────────────────────
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  autoComplete?: string;
  required?: boolean;
  suffix?: React.ReactNode;
  disabled?: boolean;
}

function InputField({
  id, label, type, value, onChange, placeholder, icon, autoComplete, required, suffix, disabled,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-on-surface">
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-on-surface-variant pointer-events-none">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-surface-container border border-outline-variant text-on-surface text-sm
            placeholder:text-on-surface-variant/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
            transition-all duration-200 disabled:opacity-60"
        />
        {suffix && (
          <span className="absolute right-3 text-on-surface-variant">{suffix}</span>
        )}
      </div>
    </div>
  );
}

// ─── Main LoginView ───────────────────────────────────────────────────────────
interface LoginViewProps {
  onSuccess: () => void;
  onBack?: () => void;
}

type AuthMode = 'login' | 'register';

export function LoginView({ onSuccess, onBack }: LoginViewProps) {
  const { login, register, loginWithGoogle, loading: authLoading } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Animate panel on mode change
  const [animKey, setAnimKey] = useState(0);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setAnimKey((k) => k + 1);
    setErrorMsg('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
  };

  // Load Google Identity Services script
  useEffect(() => {
    if (document.getElementById('google-gsi-script')) {
      setGoogleLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Google button
  useEffect(() => {
    if (!googleLoaded || !window.google) return;
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          setIsSubmitting(true);
          setErrorMsg('');
          try {
            await loginWithGoogle(response.credential);
            setSuccessMsg('Berhasil masuk dengan Google!');
            setTimeout(onSuccess, 800);
          } catch (err: any) {
            setErrorMsg(err.message || 'Gagal masuk dengan Google.');
          } finally {
            setIsSubmitting(false);
          }
        },
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-btn-container'),
        {
          type: 'standard',
          shape: 'rectangular',
          theme: 'outline',
          text: 'continue_with',
          size: 'large',
          width: 400,
          logo_alignment: 'left',
        }
      );
    } catch {
      // Google GSI not available
    }
  }, [googleLoaded, loginWithGoogle, onSuccess]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg('');
      setSuccessMsg('');

      if (mode === 'register') {
        if (!name.trim()) return setErrorMsg('Nama lengkap wajib diisi.');
        if (password.length < 6) return setErrorMsg('Kata sandi minimal 6 karakter.');
        if (password !== confirmPassword) return setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      }

      setIsSubmitting(true);
      try {
        if (mode === 'login') {
          await login(email, password);
          setSuccessMsg('Berhasil masuk! Mengalihkan...');
        } else {
          await register(name.trim(), email, password);
          setSuccessMsg('Akun berhasil dibuat! Mengalihkan...');
        }
        setTimeout(onSuccess, 800);
      } catch (err: any) {
        setErrorMsg(err.message || 'Terjadi kesalahan. Coba lagi.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [mode, name, email, password, confirmPassword, login, register, onSuccess]
  );

  // Demo / offline dev bypass
  const handleDemoLogin = useCallback(() => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg('Masuk sebagai tamu demo...');
      setTimeout(onSuccess, 600);
    }, 600);
  }, [onSuccess]);

  const isBusy = isSubmitting || authLoading;

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'var(--font-body)' }}>
      {/* ── LEFT: Branding panel (hidden on mobile) ─────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden lg:w-[52%] xl:w-[55%] p-12"
        style={{
          background: 'linear-gradient(145deg, #6B0052 0%, #A3158A 45%, #C4178F 70%, #8B1070 100%)',
        }}
      >
        <FloralDecoration />
        <DotPattern />
        <RingDecoration />

        {/* Back link */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors w-fit z-10"
          >
            <IconArrowLeft />
            Kembali ke Beranda
          </button>
        )}

        {/* Center content */}
        <div className="flex flex-col gap-6 z-10">
          {/* Logo badge */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="rgba(255,255,255,0.9)" />
              </svg>
            </div>
            <span className="text-white font-extrabold text-2xl tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Nuptia
            </span>
          </div>

          <div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4"
              style={{ fontFamily: 'var(--font-display)' }}>
              Buat Undangan<br />
              <span style={{ color: 'rgba(255,210,240,0.95)' }}>Pernikahan yang</span><br />
              Sempurna
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Ratusan template elegan, desain personal, dan kirim ke ribuan tamu dengan mudah.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-2">
            {['✨ 100+ Template Elegan', '📨 Kirim via WhatsApp', '📊 Pantau RSVP Real-time', '🎵 Musik Pengiring'].map((f) => (
              <span
                key={f}
                className="text-xs font-semibold text-white/90 px-3.5 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)' }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonial card */}
        <div
          className="z-10 p-5 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
        >
          <p className="text-white/90 text-sm italic leading-relaxed">
            "Nuptia membuat kami bisa mengirim undangan ke 500 tamu dalam hitungan menit. Hasilnya sangat elegan!"
          </p>
          <p className="text-white/60 text-xs font-semibold mt-3">— Anita & Budi, Januari 2026</p>
        </div>
      </div>

      {/* ── RIGHT: Form panel ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-surface overflow-y-auto">
        {/* Mobile back link */}
        {onBack && (
          <div className="w-full max-w-md mb-6 lg:hidden">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm font-medium transition-colors"
            >
              <IconArrowLeft />
              Kembali
            </button>
          </div>
        )}

        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#A3158A' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="white" />
            </svg>
          </div>
          <span className="font-extrabold text-xl text-on-surface" style={{ fontFamily: 'var(--font-display)' }}>Nuptia</span>
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-7">
            <h2 className="text-2xl font-extrabold text-on-surface mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}
            </h2>
            <p className="text-sm text-on-surface-variant">
              {mode === 'login'
                ? 'Selamat datang kembali di Nuptia 💐'
                : 'Bergabung dan mulai buat undangan impianmu'}
            </p>
          </div>

          {/* Animated form wrapper */}
          <div
            key={animKey}
            style={{ animation: 'fade-in-up 0.25s ease both' }}
          >
            {/* Google Sign-In */}
            <div className="mb-5">
              <div
                id="google-btn-container"
                className="w-full flex justify-center"
                aria-label="Masuk dengan Google"
              />
              {/* Fallback Google button when GSI is not configured */}
              {!googleLoaded && (
                <button
                  type="button"
                  disabled
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface-variant text-sm font-semibold opacity-60 cursor-not-allowed"
                >
                  <IconGoogle />
                  Lanjutkan dengan Google
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="text-xs text-on-surface-variant font-medium px-1">
                atau dengan email
              </span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {mode === 'register' && (
                <InputField
                  id="auth-name"
                  label="Nama Lengkap"
                  type="text"
                  value={name}
                  onChange={setName}
                  placeholder="Nama lengkap Anda"
                  icon={<IconUser />}
                  autoComplete="name"
                  required
                  disabled={isBusy}
                />
              )}

              <InputField
                id="auth-email"
                label="Alamat Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="contoh@email.com"
                icon={<IconMail />}
                autoComplete="email"
                required
                disabled={isBusy}
              />

              <InputField
                id="auth-password"
                label="Kata Sandi"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                placeholder={mode === 'register' ? 'Minimal 6 karakter' : 'Kata sandi Anda'}
                icon={<IconLock />}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                disabled={isBusy}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="p-0.5 rounded hover:text-primary transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    <IconEye open={showPassword} />
                  </button>
                }
              />

              {mode === 'register' && (
                <InputField
                  id="auth-confirm-password"
                  label="Konfirmasi Kata Sandi"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Ulangi kata sandi Anda"
                  icon={<IconLock />}
                  autoComplete="new-password"
                  required
                  disabled={isBusy}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="p-0.5 rounded hover:text-primary transition-colors"
                      tabIndex={-1}
                      aria-label="Toggle confirm password"
                    >
                      <IconEye open={showConfirmPassword} />
                    </button>
                  }
                />
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-end -mt-1">
                  <button
                    type="button"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
              )}

              {/* Error / success message */}
              {errorMsg && (
                <div
                  className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ background: '#F9DEDC', color: '#B3261E' }}
                  role="alert"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5"
                    stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ background: '#E8F5E9', color: '#2E7D32' }}
                  role="status"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {successMsg}
                </div>
              )}

              {/* Submit button */}
              <button
                id="btn-auth-submit"
                type="submit"
                disabled={isBusy}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-on-primary flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 mt-1"
                style={{ background: '#A3158A' }}
              >
                {isBusy ? (
                  <>
                    <IconSpinner />
                    {mode === 'login' ? 'Masuk...' : 'Membuat akun...'}
                  </>
                ) : mode === 'login' ? (
                  'Masuk ke Akun'
                ) : (
                  'Buat Akun Sekarang'
                )}
              </button>
            </form>

            {/* Switch mode link */}
            <p className="text-center text-sm text-on-surface-variant mt-5">
              {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-primary font-bold hover:underline"
              >
                {mode === 'login' ? 'Daftar Sekarang' : 'Masuk'}
              </button>
            </p>

            {/* Demo / guest bypass */}
            <div className="mt-6 pt-5 border-t border-outline-variant/60 text-center">
              <button
                onClick={handleDemoLogin}
                disabled={isBusy}
                className="text-xs text-on-surface-variant hover:text-on-surface underline underline-offset-2 transition-colors disabled:opacity-50"
              >
                Masuk sebagai Tamu / Mode Demo
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-on-surface-variant/60 mt-10 text-center">
          © 2026 Nuptia · Dengan ❤️ untuk pasangan Indonesia
        </p>
      </div>
    </div>
  );
}
