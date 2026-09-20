import React, { useState, useRef, useEffect } from 'react';
import { AdminRoute, AdminUser } from '../../types';

interface AdminTopBarProps {
  currentRoute: AdminRoute;
  user: AdminUser | null;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSidebarCollapsed: boolean;
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
  searchQuery,
  onSearchChange,
  isSidebarCollapsed,
}) => {
  const info = ROUTE_TITLES[currentRoute] || ROUTE_TITLES.dashboard;

  return (
    <header
      className={`sticky top-0 z-20 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 px-6 flex items-center justify-between transition-all duration-300 ${isSidebarCollapsed ? 'left-20' : 'left-64'
        }`}
    >
      {/* Title & Subtitle */}
      <div className="flex flex-col justify-center">
        <h1 className="text-base font-bold text-on-surface leading-tight">{info.title}</h1>
      </div>

      {/* Right Toolbar */}
      <div className="flex items-center gap-3">
        <AdminAvatarChip user={user} onLogout={onLogout} />
      </div>
    </header>
  );
};
