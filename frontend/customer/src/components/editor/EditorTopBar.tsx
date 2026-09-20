import React, { useState, useRef, useEffect } from 'react';
import { Status, User } from '../../types';
import { Ic } from '../common/Icons';
import { STATUS_STYLES } from '../common/UIComponents';
import { useAuth } from '../../hooks/useAuth';

interface EditorTopBarProps {
  title: string;
  status: Status;
  showPreview: boolean;
  autoSaving?: boolean;
  onBackToDashboard: () => void;
  onTogglePreview: () => void;
  onManualSave: () => void;
  onChangeStatus: () => void;
  onNavigateToLogin?: () => void;
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

function EditorUserMenu({ user, onLogout, onLogin }: { user: User | null; onLogout: () => void; onLogin: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={onLogin}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
      >
        Masuk
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        id="editor-user-avatar-btn"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full hover:bg-surface-container px-2 py-1 transition-colors"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-outline-variant" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[11px] border border-primary/20">
            {getInitials(user.name)}
          </div>
        )}
        <span className="hidden sm:inline text-xs font-semibold text-on-surface">{user.name.split(' ')[0]}</span>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-surface-container-low border border-outline-variant/60 py-1.5 z-50"
          style={{ animation: 'fade-in-up 0.15s ease both' }}
        >
          <div className="px-3.5 py-2 border-b border-outline-variant/40">
            <p className="text-xs font-bold text-on-surface truncate">{user.name}</p>
            <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-error hover:bg-error-container/40 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}

export function EditorTopBar({
  title,
  status,
  showPreview,
  autoSaving,
  onBackToDashboard,
  onTogglePreview,
  onManualSave,
  onChangeStatus,
  onNavigateToLogin,
}: EditorTopBarProps) {
  const { user, logout } = useAuth();
  const statusMeta = STATUS_STYLES[status] || STATUS_STYLES.Draft;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-3 bg-surface-container-low/95 backdrop-blur-md border-b border-outline-variant/50">
      {/* Back Button */}
      <button
        onClick={onBackToDashboard}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-xs font-semibold"
        title="Kembali ke Daftar Undangan"
      >
        <Ic.ArrowLeft s={15} />
        <span className="hidden sm:inline">Daftar Undangan</span>
      </button>

      {/* Title & Brand */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
          <Ic.Heart s={15} cls="text-primary" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold text-on-surface leading-none font-display truncate">
              {title || 'Editor Undangan'}
            </h1>
          </div>
          <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 hidden xs:block">
            Nuptia Wedding Editor
          </p>
        </div>
      </div>

      {/* Toggle Preview button */}
      <button
        onClick={onTogglePreview}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-200 ${showPreview
          ? 'bg-primary-container text-on-primary-container border-primary/30'
          : 'bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high'
          }`}
      >
        <Ic.Eye s={15} />
        <span className="hidden sm:inline">Preview</span>
      </button>

      {/* Save button */}
      <button
        onClick={onManualSave}
        className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold active:scale-95 transition-all duration-200"
      >
        <Ic.Save s={15} />
        <span className="hidden sm:inline">{autoSaving ? 'Menyimpan...' : 'Simpan'}</span>
      </button>

      {/* User menu */}
      <EditorUserMenu
        user={user}
        onLogout={logout}
        onLogin={onNavigateToLogin ?? (() => (window.location.hash = '#/login'))}
      />
    </header>
  );
}
