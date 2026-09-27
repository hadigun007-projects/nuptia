import React, { useState, useRef, useEffect } from 'react';
import { Ic } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';

interface DashboardTopBarProps {
  onOpenCreateModal: () => void;
  onNavigateToLogin: () => void;
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

  const displayName = user?.name ? user.name.split(' ')[0].toLowerCase() : 'hadi';
  const roleName = 'Customer';
  const initial = user?.name ? user.name.trim()[0].toUpperCase() : 'H';

  return (
    <div ref={ref} className="relative">
      <button
        id="user-avatar-btn"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-full hover:bg-neutral-50 py-1 px-1.5 transition-colors cursor-pointer"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-[#fae8f3]"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#fae8f3] text-[#9c177c] flex items-center justify-center font-bold text-sm flex-shrink-0">
            {initial}
          </div>
        )}
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold text-neutral-900 leading-tight">{displayName}</span>
          <span className="text-xs text-neutral-500 leading-tight mt-0.5">{roleName}</span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          className={`text-neutral-500 transition-transform duration-200 ml-0.5 ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white border border-neutral-200 py-1.5 z-50 shadow-lg"
          style={{ animation: 'fade-in-up 0.15s ease both' }}
        >
          <div className="px-4 py-2.5 border-b border-neutral-100">
            <p className="text-sm font-bold text-neutral-900 truncate">{user?.name || 'Hadi'}</p>
            <p className="text-xs text-neutral-500 truncate">{user?.email || 'hadi@nuptia.id'}</p>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/70">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand logo & workspace label */}
        <div className="flex items-center gap-3">
          <a href="#/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#9c177c] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Ic.Heart s={18} cls="text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-neutral-900 leading-none tracking-tight font-display">
                  Nuptia
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fae8f3] text-[#9c177c]">
                  Customer Workspace
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-normal mt-1">
                Kelola Undangan Pernikahanmu
              </p>
            </div>
          </a>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Create new invitation button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9c177c] hover:bg-[#851369] text-white text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-none cursor-pointer"
          >
            <Ic.Plus s={16} />
            <span>Buat Undangan Baru</span>
          </button>

          {/* Vertical divider */}
          <div className="h-8 w-px bg-neutral-200 hidden sm:block" />

          {/* Dynamic user avatar + dropdown */}
          <AvatarChip
            user={user}
            onLogout={() => logout()}
            onLogin={onNavigateToLogin}
          />
        </div>
      </div>
    </header>
  );
}

