import React from 'react';

interface AccessDeniedProps {
  userEmail?: string;
  userRole?: string;
  onRefresh: () => void;
  onDevLogin?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  userEmail,
  userRole,
  onRefresh,
  onDevLogin,
}) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return (
    <div className="min-h-screen bg-surface-container-low/40 flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 text-center animate-fade-in-up">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center text-on-primary">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-on-surface font-display flex items-center gap-1.5">
            Nuptia
            <span className="text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container">
              ADMIN
            </span>
          </span>
        </div>

        {/* Shield / Warning Icon */}
        <div className="w-16 h-16 rounded-2xl bg-primary-container/40 text-primary flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-on-surface mb-2">Akses Administrator Terbatas</h1>
        
        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
          {userEmail ? (
            <>
              Anda saat ini masuk sebagai <strong className="text-on-surface">{userEmail}</strong> (Role: <span className="text-primary font-medium">{userRole || 'customer'}</span>), namun akun ini belum memiliki hak akses Administrator.
            </>
          ) : (
            'Anda belum terautentikasi atau sesi login telah kedaluwarsa. Silakan masuk menggunakan akun Administrator.'
          )}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href="http://localhost:5173/#/login"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-95 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Masuk di Portal Nuptia (Port 5173)
          </a>

          <button
            onClick={onRefresh}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-surface-container-low text-on-surface text-sm font-medium hover:bg-surface-container transition-colors border border-outline-variant/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Periksa Ulang Izin Sesi
          </button>

          {isLocalhost && onDevLogin && (
            <div className="pt-3 border-t border-outline-variant/20">
              <button
                onClick={onDevLogin}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-primary bg-primary-container/30 hover:bg-primary-container/60 transition-colors"
              >
                ⚡ Masuk Cepat Mode Dev Admin (Localhost)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
