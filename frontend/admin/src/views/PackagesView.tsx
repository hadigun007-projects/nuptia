import React, { useState } from 'react';
import { PackageTier } from '../types';

interface PackagesViewProps {
  packages: PackageTier[];
  onTogglePackage: (pkgId: string) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({ packages, onTogglePackage }) => {
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Paket Layanan & Harga</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${pkg.isPopular
              ? 'bg-primary/5 border-primary/40 ring-1 ring-primary/20'
              : 'bg-surface-container-lowest border-outline-variant/30'
              }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {pkg.isPopular ? '★ Paling Populer' : 'Paket Standar'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pkg.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                    }`}
                >
                  {pkg.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              <h3 className="text-xl font-black text-on-surface mt-2">{pkg.name}</h3>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-black text-on-surface">
                  {pkg.price === 0 ? 'Gratis' : `Rp ${pkg.price.toLocaleString('id-ID')}`}
                </span>
                <span className="text-xs text-on-surface-variant">/ {pkg.period}</span>
              </div>

              <div className="mt-5 space-y-2.5">
                {pkg.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-on-surface">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">
                <strong className="text-on-surface">{pkg.subscribersCount}</strong> pengguna aktif
              </span>

              <button
                onClick={() => onTogglePackage(pkg.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${pkg.isActive
                  ? 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  : 'bg-primary text-on-primary'
                  }`}
              >
                {pkg.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
