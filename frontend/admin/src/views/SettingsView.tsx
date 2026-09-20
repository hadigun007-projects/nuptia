import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [platformName, setPlatformName] = useState('Nuptia Digital Invitation');
  const [supportEmail, setSupportEmail] = useState('support@nuptia.id');
  const [enableRegistration, setEnableRegistration] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-6 border-outline-variant/30">
        <h2 className="text-xl font-bold text-on-surface">Pengaturan Sistem</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="p-6 border-outline-variant/30 space-y-4">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Identitas Platform</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Nama Platform
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
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
                className="w-full px-3.5 py-2 text-xs bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Operational Controls */}
        <div className="p-6 border-outline-variant/30 space-y-4">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Kontrol Akses & Registrasi</h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-on-surface">Izinkan Pendaftaran Pengguna Baru</p>
                <p className="text-[11px] text-on-surface-variant">
                  Pengguna dapat membuat akun baru melalui formulir registrasi & Google Sign-In
                </p>
              </div>
              <input
                type="checkbox"
                checked={enableRegistration}
                onChange={(e) => setEnableRegistration(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-error">Mode Pemeliharaan (Maintenance Mode)</p>
                <p className="text-[11px] text-on-surface-variant">
                  Hanya administrator yang dapat mengakses aplikasi. Portal publik akan menampilkan pesan pemeliharaan.
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
        <div className="flex items-center justify-between">
          <div>
            {savedToast && (
              <span className="text-xs font-bold text-emerald-600 animate-toast">
                ✓ Pengaturan berhasil disimpan!
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:opacity-95 transition-opacity"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};
