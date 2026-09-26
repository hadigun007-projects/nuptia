import React from 'react';
import { RedirectState } from '../types';

interface RedirectBridgeProps {
  state: RedirectState;
}

export const RedirectBridge: React.FC<RedirectBridgeProps> = ({ state }) => {
  const isAdmin = state.targetRole.toLowerCase().includes('admin');

  return (
    <div className="fixed inset-0 z-50 bg-surface/95 backdrop-blur-md flex items-center justify-center p-6 animate-scale-in">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-2xl text-center flex flex-col items-center">
        {/* Animated Icon Badge */}
        <div className="relative mb-5">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all animate-pulse-subtle ${
              isAdmin
                ? 'bg-gradient-to-tr from-primary to-[#701A75] text-on-primary'
                : 'bg-gradient-to-tr from-[#0284C7] to-primary text-white'
            }`}
          >
            {isAdmin ? (
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success ring-2 ring-surface flex items-center justify-center text-white text-[10px] font-bold">
            ✓
          </div>
        </div>

        {/* Status Text */}
        <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant mb-2">
          Peran Teridentifikasi: {state.targetRole}
        </span>
        <h2 className="text-xl font-bold text-on-surface font-display mb-1">
          Autentikasi Berhasil
        </h2>
        <p className="text-xs text-on-surface-variant max-w-xs mb-6">
          Menyiapkan sesi aman dan mengalihkan Anda ke{' '}
          <strong className="text-on-surface">{state.targetName}</strong>...
        </p>

        {/* Progress Bar / Spinner */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full animate-[shimmer_1.2s_infinite]" style={{ width: '85%' }} />
          </div>
          <span className="text-[11px] text-on-surface-variant flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Mengalihkan browser...
          </span>
        </div>
      </div>
    </div>
  );
};
