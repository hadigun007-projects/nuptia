import React from 'react';
import { AdminRoute } from '../../types';

interface AdminTopBarProps {
  currentRoute: AdminRoute;
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

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  currentRoute,
  searchQuery,
  onSearchChange,
  isSidebarCollapsed,
}) => {
  const info = ROUTE_TITLES[currentRoute] || ROUTE_TITLES.dashboard;

  return (
    <header
      className={`sticky top-0 z-20 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 px-6 flex items-center justify-between transition-all duration-300 ${
        isSidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Title & Subtitle */}
      <div className="flex flex-col justify-center">
        <h1 className="text-base font-bold text-on-surface leading-tight">{info.title}</h1>
        <p className="text-xs text-on-surface-variant leading-tight hidden sm:block">{info.subtitle}</p>
      </div>

      {/* Right Toolbar */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative w-48 sm:w-64">
          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari cepat..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Live Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
          API Online
        </div>

        {/* Home / Customer Preview button */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          title="Buka Aplikasi Customer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors border border-outline-variant/30"
        >
          <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Lihat Customer
        </a>
      </div>
    </header>
  );
};
