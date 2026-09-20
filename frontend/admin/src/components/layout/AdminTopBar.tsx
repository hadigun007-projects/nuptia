import React, { useState, useRef, useEffect } from 'react';
import { AdminRoute, AdminUser } from '../../types';

interface AdminTopBarProps {
  currentRoute: AdminRoute;
  user: AdminUser | null;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSidebarCollapsed: boolean;
  onToggleCollapse?: () => void;
}

const ROUTE_TITLES: Record<AdminRoute, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Ringkasan & Metrik',
    subtitle: 'Ikhtisar aktivitas dan performa platform Nuptia',
  },
  users: {
    title: 'Manajemen Pengguna',
    subtitle: 'Kelola akun customer, hak akses, dan status pengguna',
  },
  invitations: {
    title: 'Daftar Undangan',
    subtitle: 'Semua undangan digital yang dibuat oleh customer',
  },
  templates: {
    title: 'Tema & Katalog Desain',
    subtitle: 'Kelola preset desain tema, kategori, dan visibilitas',
  },
  packages: {
    title: 'Paket & Layanan',
    subtitle: 'Konfigurasi tier langganan dan fitur',
  },
  settings: {
    title: 'Pengaturan Sistem',
    subtitle: 'Konfigurasi global platform, API, dan integrasi',
  },
};

function AdminAvatarChip({
  user,
  onLogout,
}: {
  user: AdminUser | null;
  onLogout: () => void;
}) {
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

  if (!user) return null;

  const initials = user.name
    ? user.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('')
    : 'A';

  return (
    <div ref={ref} className="relative flex items-center gap-2 pl-3 border-l border-outline-variant/30">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full hover:bg-surface-container px-2 py-1 transition-colors cursor-pointer"
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
          <span className="text-xs font-bold text-on-surface leading-tight">
            {user.name.split(' ')[0]}
          </span>
          <span className="text-[10px] text-primary font-semibold capitalize">
            {user.role}
          </span>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`text-on-surface-variant transition-transform duration-200 ${open ? 'rotate-180' : ''
            }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 py-2 z-50 animate-fade-in-up">
          <div className="px-4 py-2.5 border-b border-outline-variant/30">
            <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
            <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container">
              Administrator
            </span>
          </div>

          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-on-surface hover:bg-surface-container transition-colors"
          >
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Buka Portal Customer (:5173)
          </a>

          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-error hover:bg-error/10 transition-colors border-t border-outline-variant/20 cursor-pointer"
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

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  currentRoute,
  user,
  onLogout,
  isSidebarCollapsed,
  onToggleCollapse,
}) => {
  const info = ROUTE_TITLES[currentRoute] || ROUTE_TITLES.dashboard;

  return (
    <header className="sticky top-0 z-20 w-full h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
      <div className="max-w-7xl w-full mx-auto h-full flex flex-row items-center">
        {/* Brand Header matching sidebar width */}
        <div
          className={`h-full flex items-center justify-between px-4 transition-all duration-300 flex-shrink-0 ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <a href="#/" className="flex items-center gap-2.5 overflow-hidden group">
            <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0 text-on-primary group-hover:scale-105 transition-transform duration-200">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-on-surface leading-none font-display">Nuptia</span>
                  <span className="text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container">
                    ADMIN
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant font-medium mt-0.5">Console Manajemen</span>
              </div>
            )}
          </a>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              title={isSidebarCollapsed ? 'Buka Menu' : 'Sembunyikan Menu'}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Title & Right Toolbar */}
        <div className="flex-1 h-full px-6 md:px-8 flex items-center justify-between">
          <div className="flex flex-col justify-center">
            <h1 className="text-base font-bold text-on-surface leading-tight">{info.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <AdminAvatarChip user={user} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  );
};
