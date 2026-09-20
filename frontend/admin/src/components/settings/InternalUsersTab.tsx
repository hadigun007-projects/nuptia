import React, { useState, useMemo } from 'react';
import { AdminUser, CreateInternalUserPayload, UserRole } from '../../types';

interface InternalUsersTabProps {
  currentUser: AdminUser | null;
  users: AdminUser[];
  onCreateInternalUser: (payload: CreateInternalUserPayload) => Promise<any>;
  onToggleRole: (userId: string, newRole: UserRole) => void;
  onToggleStatus: (userId: string, newStatus: 'active' | 'suspended') => void;
  onDeleteUser: (userId: string) => Promise<void>;
}

export const InternalUsersTab: React.FC<InternalUsersTabProps> = ({
  currentUser,
  users,
  onCreateInternalUser,
  onToggleRole,
  onToggleStatus,
  onDeleteUser,
}) => {
  // Filter only internal users (developer, admin, viewer)
  const internalUsers = useMemo(() => {
    return users.filter(
      (u) => u.role === 'admin' || u.role === 'developer' || u.role === 'viewer'
    );
  }, [users]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'developer' | 'admin' | 'viewer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [roleEditTarget, setRoleEditTarget] = useState<AdminUser | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateInternalUserPayload>({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Filtered internal list
  const filteredUsers = useMemo(() => {
    return internalUsers.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [internalUsers, search, roleFilter, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    return {
      total: internalUsers.length,
      active: internalUsers.filter((u) => u.status === 'active').length,
      developer: internalUsers.filter((u) => u.role === 'developer').length,
      admin: internalUsers.filter((u) => u.role === 'admin').length,
      viewer: internalUsers.filter((u) => u.role === 'viewer').length,
    };
  }, [internalUsers]);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'admin',
    });
    setFormError(null);
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Nama lengkap wajib diisi');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Email tidak valid');
      return;
    }
    if (formData.password.length < 6) {
      setFormError('Kata sandi minimal 6 karakter');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateInternalUser(formData);
      setShowAddModal(false);
    } catch (err: any) {
      setFormError(err.message || 'Gagal menambahkan user internal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await onDeleteUser(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // toast is handled in hook
    }
  };

  const generateRandomPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: pass }));
    setShowPassword(true);
  };

  return (
    <div className="space-y-6">
      {/* Action and Filter Bar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <span className="text-xs font-semibold text-on-surface-variant mr-1">Role:</span>
          {(['all', 'developer', 'admin', 'viewer'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${roleFilter === r
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
            >
              {r === 'all'
                ? 'Semua'
                : r === 'developer'
                  ? 'Developer'
                  : r === 'admin'
                    ? 'Admin'
                    : 'Viewer'}
            </button>
          ))}

          <div className="h-4 w-px bg-outline-variant/30 mx-1 hidden sm:block" />

          {/* Status Filter */}
          <span className="text-xs font-semibold text-on-surface-variant mr-1">Status:</span>
          {(['all', 'active', 'suspended'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${statusFilter === s
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
            >
              {s === 'all' ? 'Semua' : s === 'active' ? 'Aktif' : 'Suspended'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Input */}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari tim internal..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Add Internal User Button */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:opacity-95 transition-all shadow-none shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah User Internal</span>
          </button>
        </div>
      </div>

      {/* Internal Users Table */}
      <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/40 text-[11px] font-bold text-on-surface-variant tracking-wider uppercase">
                <th className="py-3.5 px-5">Nama</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Metode Auth</th>
                <th className="py-3.5 px-4">Terdaftar</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-2 text-on-surface-variant">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-sm">Tidak ada anggota tim internal ditemukan</p>
                    <p className="text-xs mt-1">Coba ganti filter atau tambahkan user internal baru.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelf =
                    Boolean(currentUser && (u.id === currentUser.id || u.email === currentUser.email));

                  return (
                    <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${u.role === 'developer'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'admin'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-amber-100 text-amber-800'
                              }`}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-on-surface truncate">{u.name}</p>
                            </div>
                            <p className="text-[11px] text-on-surface-variant truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        {u.role === 'developer' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                            Developer
                          </span>
                        ) : u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            Viewer
                          </span>
                        )}
                      </td>

                      {/* Status */}
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

                      {/* Provider */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-semibold text-on-surface-variant capitalize">
                          {u.authProvider === 'google' ? '🟢Google' : 'Password'}
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 text-on-surface-variant text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Change Role Button */}
                          <button
                            onClick={() => setRoleEditTarget(u)}
                            className="px-2 py-1 rounded-lg text-[11px] font-medium bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                            title="Ubah Role Internal"
                          >
                            Ubah Role
                          </button>

                          {/* Suspend / Activate Button (disabled for self) */}
                          <button
                            disabled={isSelf}
                            onClick={() =>
                              onToggleStatus(u.id, u.status === 'active' ? 'suspended' : 'active')
                            }
                            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${isSelf
                              ? 'opacity-40 cursor-not-allowed bg-surface-container text-on-surface-variant'
                              : u.status === 'active'
                                ? 'bg-error/10 text-error hover:bg-error/20'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            title={
                              isSelf
                                ? 'Tidak bisa mengubah status akun Anda sendiri'
                                : u.status === 'active'
                                  ? 'Suspend Akun'
                                  : 'Aktifkan Akun'
                            }
                          >
                            {u.status === 'active' ? 'Suspend' : 'Aktifkan'}
                          </button>

                          {/* Delete / Revoke Button (disabled for self) */}
                          <button
                            disabled={isSelf}
                            onClick={() => setDeleteTarget(u)}
                            className={`p-1 rounded-lg text-[11px] transition-colors ${isSelf
                              ? 'opacity-30 cursor-not-allowed text-on-surface-variant'
                              : 'text-error hover:bg-error/10'
                              }`}
                            title={isSelf ? 'Tidak bisa menghapus akun Anda sendiri' : 'Hapus User Internal'}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah User Internal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-outline-variant/30 max-w-lg w-full p-6 space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div>
                <h3 className="text-base font-bold text-on-surface">Tambah User Internal</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Tambahkan anggota tim pengelola sistem Nuptia.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="cth. Budi Kurniawan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Email Internal / Perusahaan
                </label>
                <input
                  type="email"
                  required
                  placeholder="cth. nama@nuptia.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Hak Akses / Role Internal
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${formData.role === 'admin'
                      ? 'border-primary bg-primary-container/20 text-on-surface font-bold'
                      : 'border-outline-variant/30 bg-surface-container-low text-on-surface-variant'
                      }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={formData.role === 'admin'}
                      onChange={() => setFormData({ ...formData, role: 'admin' })}
                      className="sr-only"
                    />
                    <div className="text-xs font-bold text-on-surface flex items-center gap-1">
                      🛡️ Admin
                    </div>
                    <div className="text-[10px] text-on-surface-variant mt-1 leading-tight">
                      CRUD operasional (tema, user, paket)
                    </div>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${formData.role === 'developer'
                      ? 'border-purple-600 bg-purple-50 text-on-surface font-bold'
                      : 'border-outline-variant/30 bg-surface-container-low text-on-surface-variant'
                      }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="developer"
                      checked={formData.role === 'developer'}
                      onChange={() => setFormData({ ...formData, role: 'developer' })}
                      className="sr-only"
                    />
                    <div className="text-xs font-bold text-purple-900 flex items-center gap-1">
                      ⚡ Developer
                    </div>
                    <div className="text-[10px] text-on-surface-variant mt-1 leading-tight">
                      Akses penuh (konfigurasi & logs)
                    </div>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${formData.role === 'viewer'
                      ? 'border-amber-600 bg-amber-50 text-on-surface font-bold'
                      : 'border-outline-variant/30 bg-surface-container-low text-on-surface-variant'
                      }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="viewer"
                      checked={formData.role === 'viewer'}
                      onChange={() => setFormData({ ...formData, role: 'viewer' })}
                      className="sr-only"
                    />
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1">
                      👁️ Viewer
                    </div>
                    <div className="text-[10px] text-on-surface-variant mt-1 leading-tight">
                      Hanya-baca analitik & operasional
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-on-surface-variant">
                    Kata Sandi Sementara
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Acak Sandi
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2 pr-10 text-xs bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:opacity-95 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ubah Role User Internal */}
      {roleEditTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-outline-variant/30 max-w-sm w-full p-5 space-y-4 animate-fade-in-up">
            <h3 className="text-sm font-bold text-on-surface">
              Ubah Role: {roleEditTarget.name}
            </h3>
            <p className="text-xs text-on-surface-variant">
              Pilih wewenang baru untuk akun <strong>{roleEditTarget.email}</strong>.
            </p>

            <div className="space-y-2">
              {(['developer', 'admin', 'viewer'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onToggleRole(roleEditTarget.id, r);
                    setRoleEditTarget(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-colors ${roleEditTarget.role === r
                    ? 'border-primary bg-primary-container/20 font-bold text-on-surface'
                    : 'border-outline-variant/30 hover:bg-surface-container text-on-surface-variant'
                    }`}
                >
                  <span className="text-xs capitalize font-semibold">
                    {r === 'developer'
                      ? '⚡ Developer (Super Admin)'
                      : r === 'admin'
                        ? '🛡️ Admin Operasional'
                        : '👁️ Viewer (Auditor)'}
                  </span>
                  {roleEditTarget.role === r && (
                    <span className="text-primary text-xs">✓ Aktif</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setRoleEditTarget(null)}
                className="px-4 py-1.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Hapus User */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-outline-variant/30 max-w-sm w-full p-5 space-y-4 animate-fade-in-up">
            <div className="w-10 h-10 rounded-2xl bg-error/10 text-error flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div>
              <h3 className="text-sm font-bold text-on-surface">Hapus User Internal?</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Apakah Anda yakin ingin menghapus akun tim <strong>{deleteTarget.name}</strong> ({deleteTarget.email})? Akses masuk ke console admin akan dicabut permanen.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-error text-on-error text-xs font-bold hover:opacity-95 transition-opacity"
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
