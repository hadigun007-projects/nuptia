import React from 'react';
import { AdminRoute, AdminUser } from '../../types';

interface AdminSidebarProps {
  currentRoute: AdminRoute;
  user: AdminUser | null;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: AdminRoute;
  label: string;
  hash: string;
  badge?: string;
  icon: React.ReactNode;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentRoute,
  user,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Ringkasan',
      hash: '#/',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'users',
      label: 'Pengguna',
      hash: '#/users',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 'invitations',
      label: 'Undangan',
      hash: '#/invitations',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'templates',
      label: 'Tema & Template',
      hash: '#/templates',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: 'packages',
      label: 'Paket Layanan',
      hash: '#/packages',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      hash: '#/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 bg-surface flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-outline-variant/20">
        <a href="#/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-lg shrink-0">
            N
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-on-surface">nuptia</span>
                <span className="text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] text-on-surface-variant font-medium">Console Manajemen</span>
            </div>
          )}
        </a>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
          title={isCollapsed ? 'Buka Menu' : 'Sembunyikan Menu'}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentRoute === item.id;
          return (
            <a
              key={item.id}
              href={item.hash}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary-container">
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Quick Customer Switch */}
      <div className="p-3 border-t border-outline-variant/20">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          title={isCollapsed ? 'Buka Web Customer (:5173)' : undefined}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-primary bg-primary-container/30 hover:bg-primary-container/60 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {!isCollapsed && <span className="truncate">Portal Customer (:5173)</span>}
        </a>
      </div>

      {/* User Profile / Logout */}
      <div className="p-3 border-t border-outline-variant/20 bg-surface">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-on-surface truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-on-surface-variant truncate">{user?.email || 'admin@nuptia.id'}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={onLogout}
              title="Keluar"
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
