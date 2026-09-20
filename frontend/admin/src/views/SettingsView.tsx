import React, { useState } from 'react';
import { AdminUser, CreateInternalUserPayload, UserRole } from '../types';
import { InternalUsersTab } from '../components/settings/InternalUsersTab';

interface SettingsViewProps {
  currentUser?: AdminUser | null;
  users?: AdminUser[];
  onCreateInternalUser?: (payload: CreateInternalUserPayload) => Promise<any>;
  onToggleRole?: (userId: string, newRole: UserRole) => void;
  onToggleStatus?: (userId: string, newStatus: 'active' | 'suspended') => void;
  onDeleteUser?: (userId: string) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser = null,
  users = [],
  onCreateInternalUser = async () => {},
  onToggleRole = () => {},
  onToggleStatus = () => {},
  onDeleteUser = async () => {},
}) => {
  const [activeTab, setActiveTab] = useState<'system' | 'internal-users'>('system');
  const [platformName, setPlatformName] = useState('Nuptia Digital Invitation');
  const [supportEmail, setSupportEmail] = useState('support@nuptia.id');
  const [enableRegistration, setEnableRegistration] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const internalCount = users.filter(
    (u) => u.role === 'admin' || u.role === 'developer' || u.role === 'viewer'
  ).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-on-surface font-display tracking-tight">
            Pengaturan & Tim
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Konfigurasi platform global dan kelola akun tim pengelola internal Nuptia.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-surface-container-low border border-outline-variant/20 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'system'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Pengaturan Sistem</span>
          </button>

          <button
            onClick={() => setActiveTab('internal-users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'internal-users'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>User Internal</span>
            <span className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-md ${
              activeTab === 'internal-users'
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container text-on-surface-variant'
            }`}>
              {internalCount}
            </span>
          </button>
        </div>
      </div>

      {/* Tab: Internal Users Management */}
      {activeTab === 'internal-users' && (
        <InternalUsersTab
          currentUser={currentUser}
          users={users}
          onCreateInternalUser={onCreateInternalUser}
          onToggleRole={onToggleRole}
          onToggleStatus={onToggleStatus}
          onDeleteUser={onDeleteUser}
        />
      )}

      {/* Tab: System Configuration */}
      {activeTab === 'system' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* General Settings */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 space-y-4">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Identitas Platform
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Nama Platform
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Email Dukungan
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Operational Controls */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 space-y-4">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Kontrol Akses & Registrasi
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 cursor-pointer hover:bg-surface-container transition-colors">
                <div>
                  <p className="text-xs font-bold text-on-surface">Izinkan Pendaftaran Pengguna Baru</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Pengguna baru dapat membuat akun melalui formulir registrasi & Google Sign-In
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableRegistration}
                  onChange={(e) => setEnableRegistration(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 cursor-pointer hover:bg-surface-container transition-colors">
                <div>
                  <p className="text-xs font-bold text-error">Mode Pemeliharaan (Maintenance Mode)</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Hanya administrator dan developer yang dapat mengakses aplikasi. Portal publik akan menampilkan pesan pemeliharaan.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 accent-error rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Save button */}
          <div className="flex items-center justify-between p-2">
            <div>
              {savedToast && (
                <span className="text-xs font-bold text-emerald-600 animate-toast flex items-center gap-1.5">
                  ✓ Pengaturan sistem berhasil disimpan!
                </span>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:opacity-95 transition-opacity shadow-none"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
