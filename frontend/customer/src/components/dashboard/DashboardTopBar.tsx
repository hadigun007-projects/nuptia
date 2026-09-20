import React, { useState, useRef, useEffect } from 'react';
import { Ic } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';

interface DashboardTopBarProps {
  onOpenCreateModal: () => void;
  onNavigateToLogin: () => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function AvatarChip({ user, onLogout, onLogin }: { user: User | null; onLogout: () => void; onLogin: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={onLogin}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-on-surface text-xs font-bold hover:bg-surface-container transition-colors"
      >
        Masuk
      </button>
    );
  }

  const initials = getInitials(user.name);

  return (
    <div ref={ref} className="relative flex items-center gap-2 pl-2 border-l border-outline-variant/50">
      <button
        id="user-avatar-btn"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full hover:bg-surface-container px-2 py-1 transition-colors"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-outline-variant"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs border border-primary/20">
            {initials}
          </div>
        )}
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-on-surface leading-tight">{user.name.split(' ')[0]}</span>
          <span className="text-[10px] text-on-surface-variant capitalize">{user.role}</span>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={`text-on-surface-variant transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-surface-container-low border border-outline-variant/60 py-1.5 z-50"
          style={{ animation: 'fade-in-up 0.15s ease both' }}
        >
          <div className="px-4 py-2.5 border-b border-outline-variant/40">
            <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
            <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-error-container/40 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

export function DashboardTopBar({ onOpenCreateModal, onNavigateToLogin }: DashboardTopBarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between">
      {/* Brand logo & workspace label */}
      <div className="flex items-center gap-3">
        <a href="#/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Ic.Heart s={15} cls="text-on-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-on-surface leading-none font-display">Nuptia</h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container">
                Customer Workspace
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">Kelola Undangan Pernikahanmu</p>
          </div>
        </a>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Create new invitation button */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold active:scale-95 transition-all duration-200 hover:bg-primary/95"
        >
          <Ic.Plus s={16} />
          <span className="inline">Buat Undangan Baru</span>
        </button>

        {/* Dynamic user avatar + dropdown */}
        <AvatarChip
          user={user}
          onLogout={() => logout()}
          onLogin={onNavigateToLogin}
        />
      </div>
    </header>
  );
}
