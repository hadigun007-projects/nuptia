import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AdminUser, UserRole } from '../types';

interface UsersViewProps {
  users: AdminUser[];
  onToggleRole: (userId: string, newRole: UserRole) => void;
  onToggleStatus: (userId: string, newStatus: 'active' | 'suspended') => void;
  searchQuery: string;
}

export const UsersView: React.FC<UsersViewProps> = ({
  users,
  onToggleRole,
  onToggleStatus,
  searchQuery,
}) => {
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'admin' | 'developer' | 'viewer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [localSearch, setLocalSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    if (!openMenuId) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuId]);

  const activeSearch = searchQuery || localSearch;

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(activeSearch.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, activeSearch, roleFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      customers: users.filter((u) => u.role === 'customer').length,
      admins: users.filter((u) => u.role === 'admin').length,
      developers: users.filter((u) => u.role === 'developer').length,
      viewers: users.filter((u) => u.role === 'viewer').length,
      suspended: users.filter((u) => u.status === 'suspended').length,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">

          {/* Role Filter Dropdown */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
              className="pl-3 pr-7 py-1.5 text-xs font-semibold rounded-xl border border-outline-variant/30 bg-surface-container text-on-surface appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">Semua Role</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
              <option value="viewer">Viewer</option>
            </select>
            <svg className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="pl-3 pr-7 py-1.5 text-xs font-semibold rounded-xl border border-outline-variant/30 bg-surface-container text-on-surface appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="suspended">Suspended</option>
            </select>
            <svg className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Local Search (if not searching from TopBar) */}
        {!searchQuery && (
          <div className="relative w-full sm:w-52">
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
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Cari nama/email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/40 text-[11px] font-bold text-on-surface-variant tracking-wider uppercase">
                <th className="py-3.5 px-5">Pengguna</th>
                <th className="py-3.5 px-4">Provider</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Undangan</th>
                <th className="py-3.5 px-4">Terdaftar</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                    <p className="font-semibold text-sm">Tidak ada pengguna ditemukan</p>
                    <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau filter yang dipilih.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                    {/* Name & Email */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-on-surface truncate">{u.name}</p>
                          <p className="text-[11px] text-on-surface-variant truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Auth Provider */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-semibold text-on-surface-variant capitalize">
                        {u.authProvider === 'google' ? '🟢 Google' : '✉️ Email'}
                      </span>
                    </td>

                    {/* Role Pill */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'admin'
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-surface-container text-on-surface-variant'
                          }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-error/10 text-error'
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-error'
                            }`}
                        />
                        {u.status === 'active' ? 'Aktif' : 'Suspended'}
                      </span>
                    </td>

                    {/* Invitation Count */}
                    <td className="py-3.5 px-4 text-center font-semibold text-on-surface">
                      {u.invitationCount ?? 0}
                    </td>

                    {/* Registration Date */}
                    <td className="py-3.5 px-4 text-on-surface-variant text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions — Kebab Menu */}
                    <td className="py-3.5 px-5 text-right">
                      <div
                        className="relative inline-block"
                        ref={openMenuId === u.id ? menuRef : null}
                      >
                        {/* Trigger ⋮ */}
                        <button
                          onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
                          title="Opsi"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="4" r="1.5" />
                            <circle cx="10" cy="10" r="1.5" />
                            <circle cx="10" cy="16" r="1.5" />
                          </svg>
                        </button>

                        {/* Dropdown */}
                        {openMenuId === u.id && (
                          <div className="absolute right-0 top-8 z-50 w-48 rounded-2xl bg-surface border border-outline-variant/30 shadow-xl py-1.5 animate-fade-in-up origin-top-right">

                            {/* Toggle Role */}
                            <button
                              onClick={() => {
                                onToggleRole(u.id, u.role === 'admin' ? 'customer' : 'admin');
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high transition-colors"
                            >
                              <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              {u.role === 'admin' ? 'Jadikan Customer' : 'Jadikan Admin'}
                            </button>

                            {/* Suspend / Aktifkan */}
                            <button
                              onClick={() => {
                                onToggleStatus(u.id, u.status === 'active' ? 'suspended' : 'active');
                                setOpenMenuId(null);
                              }}
                              className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-colors ${
                                u.status === 'active'
                                  ? 'text-amber-700 hover:bg-amber-50'
                                  : 'text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {u.status === 'active' ? (
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                              {u.status === 'active' ? 'Suspend Akun' : 'Aktifkan Akun'}
                            </button>

                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
