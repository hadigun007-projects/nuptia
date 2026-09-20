import React, { useState, useMemo } from 'react';
import { AdminTemplate } from '../types';

interface TemplatesViewProps {
  templates: AdminTemplate[];
  onToggleActive: (templateId: string) => void;
  searchQuery: string;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  onToggleActive,
  searchQuery,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'Free' | 'Premium' | 'Exclusive'>('all');
  const [localSearch, setLocalSearch] = useState('');

  const activeSearch = searchQuery || localSearch;

  const categories = useMemo(() => {
    const set = new Set(templates.map((t) => t.category));
    return ['all', ...Array.from(set)];
  }, [templates]);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        t.tagline.toLowerCase().includes(activeSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(activeSearch.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const matchesTier = tierFilter === 'all' || t.tier === tierFilter;
      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [templates, activeSearch, categoryFilter, tierFilter]);

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Categories */}
          <span className="text-xs font-semibold text-on-surface-variant mr-1">Kategori:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${categoryFilter === c
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
            >
              {c === 'all' ? 'Semua Kategori' : c}
            </button>
          ))}

          <div className="h-4 w-px bg-outline-variant/30 mx-1 hidden sm:block" />

          {/* Tier */}
          <span className="text-xs font-semibold text-on-surface-variant mr-1">Tier:</span>
          {(['all', 'Free', 'Premium'] as const).map((tr) => (
            <button
              key={tr}
              onClick={() => setTierFilter(tr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tierFilter === tr
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
            >
              {tr === 'all' ? 'Semua' : tr}
            </button>
          ))}
        </div>

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
              placeholder="Cari tema..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((t) => (
          <div
            key={t.id}
            className={`rounded-3xl bg-surface-container-lowest border transition-all overflow-hidden flex flex-col ${t.isActive
              ? 'border-outline-variant/30 hover:border-primary/50'
              : 'border-outline-variant/20 opacity-70 bg-surface-container-low/40'
              }`}
          >
            {/* Cover Image Container */}
            <div className="relative h-44 w-full overflow-hidden bg-surface-container">
              <img
                src={t.cover}
                alt={t.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />

              {/* Status Badge */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.tier === 'Premium'
                    ? 'bg-primary text-on-primary'
                    : 'bg-emerald-600 text-white'
                    }`}
                >
                  {t.tier}
                </span>
                {t.isPopular && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    ★ Populer
                  </span>
                )}
                {t.isNew && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                    Baru
                  </span>
                )}
              </div>

              {/* Active / Inactive switch at top right */}
              <button
                onClick={() => onToggleActive(t.id)}
                className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md transition-colors ${t.isActive
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-stone-800/90 text-stone-200'
                  }`}
                title={t.isActive ? 'Nonaktifkan tema' : 'Aktifkan tema'}
              >
                {t.isActive ? '● Aktif' : '○ Nonaktif'}
              </button>

              {/* Color swatch dot */}
              <div
                className="absolute bottom-3 right-3 w-5 h-5 rounded-full border-2 border-white"
                style={{ backgroundColor: t.color }}
                title={`Warna Aksen: ${t.color}`}
              />
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  {t.category}
                </span>
                <h3 className="text-base font-bold text-on-surface mt-0.5">{t.name}</h3>
                <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">{t.tagline}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold text-on-surface">{t.usageCount}</span>
                  <span className="text-[11px]">undangan</span>
                </div>

                <button
                  onClick={() => onToggleActive(t.id)}
                  className={`text-[11px] font-semibold transition-colors ${t.isActive ? 'text-error hover:underline' : 'text-emerald-700 hover:underline'
                    }`}
                >
                  {t.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
