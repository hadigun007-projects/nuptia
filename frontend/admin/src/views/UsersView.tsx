import React, { useState, useMemo } from 'react';
import { AdminUser } from '../types';

interface UsersViewProps {
  users: AdminUser[];
  onToggleRole: (userId: string, newRole: 'customer' | 'admin') => void;
  onToggleStatus: (userId: string, newStatus: 'active' | 'suspended') => void;
  searchQuery: string;
}

export const UsersView: React.FC<UsersViewProps> = ({
  users,
  onToggleRole,
  onToggleStatus,
  searchQuery,
}) => {
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [localSearch, setLocalSearch] = useState('');

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
      suspended: users.filter((u) => u.status === 'suspended').length,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
          <p className="text-xs font-semibold text-on-surface-variant">Total Pengguna</p>
          <p className="text-xl font-black text-on-surface mt-1">{stats.total}</p>
        </div>
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
          <p className="text-xs font-semibold text-on-surface-variant">Customer</p>
          <p className="text-xl font-black text-primary mt-1">{stats.customers}</p>
        </div>
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
          <p className="text-xs font-semibold text-on-surface-variant">Administrator</p>
          <p className="text-xl font-black text-tertiary mt-1">{stats.admins}</p>
        </div>
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
          <p className="text-xs font-semibold text-on-surface-variant">Ditangguhkan</p>
          <p className="text-xl font-black text-error mt-1">{stats.suspended}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter Pills */}
          <span className="text-xs font-semibold text-on-surface-variant mr-1">Role:</span>
          {(['all', 'customer', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${
                roleFilter === r
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {r === 'all' ? 'Semua' : r}
            </button>
          ))}

          <div className="h-4 w-px bg-outline-variant/30 mx-1 hidden sm:block" />

          {/* Status Filter Pills */}
          <span className="text-xs font-semibold text-on-surface-variant mr-1">Status:</span>
          {(['all', 'active', 'suspended'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${
                statusFilter === s
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {s === 'all' ? 'Semua' : s === 'active' ? 'Aktif' : 'Suspended'}
            </button>
          ))}
        </div>

        {/* Local Search (if not searching from TopBar) */}
        {!searchQuery && (
          <div className="relative w-full md:w-56">
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
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'admin'
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
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-error/10 text-error'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'active' ? 'bg-emerald-500' : 'bg-error'
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

                    {/* Action buttons */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() =>
                            onToggleRole(u.id, u.role === 'admin' ? 'customer' : 'admin')
                          }
                          className="px-2 py-1 rounded-lg text-[11px] font-medium bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                          title="Ganti Role (Admin/Customer)"
                        >
                          {u.role === 'admin' ? 'Jadikan Customer' : 'Jadikan Admin'}
                        </button>
                        <button
                          onClick={() =>
                            onToggleStatus(
                              u.id,
                              u.status === 'active' ? 'suspended' : 'active'
                            )
                          }
                          className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                            u.status === 'active'
                              ? 'bg-error/10 text-error hover:bg-error/20'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                          title="Tangguhkan atau Aktifkan Akun"
                        >
                          {u.status === 'active' ? 'Suspend' : 'Aktifkan'}
                        </button>
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
