import React, { useState } from 'react';
import { GuestBookEntry } from '../../../types';
import { Card, SectionHead, M3Field } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface BukuTamuTabProps {
  entries?: GuestBookEntry[];
  onChange: (g: GuestBookEntry[]) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const CATEGORIES = ['VIP', 'Keluarga', 'Teman', 'Rekan Kerja'] as const;

export function BukuTamuTab({ entries = [], onChange, showToast }: BukuTamuTabProps) {
  const [name, setName] = useState('');
  const [cat, setCat] = useState<typeof CATEGORIES[number]>('Teman');
  const [pax, setPax] = useState('2');
  const [search, setSearch] = useState('');

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGuest: GuestBookEntry = {
      id: `gb-${Date.now()}`,
      name: name.trim(),
      category: cat,
      pax: parseInt(pax, 10) || 1,
      status: 'Belum Konfirmasi',
      checkedIn: false,
    };

    onChange([newGuest, ...entries]);
    setName('');
    showToast(`Tamu "${newGuest.name}" berhasil ditambahkan ke buku tamu!`, 'success');
  };

  const handleToggleCheckIn = (id: string) => {
    const updated = entries.map((g) =>
      g.id === id ? { ...g, checkedIn: !g.checkedIn } : g
    );
    onChange(updated);
    showToast('Status check-in tamu diperbarui', 'info');
  };

  const handleDelete = (id: string) => {
    onChange(entries.filter((g) => g.id !== id));
    showToast('Data tamu dihapus', 'info');
  };

  const filtered = entries.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Pengantar & Statistik Singkat */}
      <Card>
        <SectionHead
          title="Buku Tamu & Daftar Undangan"
          sub="Kelola database tamu undangan yang diundang secara khusus"
        />
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span className="text-[10px] font-bold text-on-surface-variant">TOTAL TERDAFTAR</span>
            <p className="text-xl font-bold text-on-surface font-display">{entries.length}</p>
          </div>
          <div className="p-3 bg-primary-container/30 rounded-xl border border-primary/20">
            <span className="text-[10px] font-bold text-primary">KONFIRMASI HADIR</span>
            <p className="text-xl font-bold text-primary font-display">
              {entries.filter((e) => e.status === 'Hadir').length}
            </p>
          </div>
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span className="text-[10px] font-bold text-on-surface-variant">CHECK-IN VENUE</span>
            <p className="text-xl font-bold text-on-surface font-display">
              {entries.filter((e) => e.checkedIn).length}
            </p>
          </div>
        </div>
      </Card>

      {/* Form Tambah Tamu */}
      <Card>
        <SectionHead
          title="Tambah Tamu Undangan Baru"
          sub="Input nama tamu personal atau keluarga untuk digenerate tautan khususnya"
        />
        <form onSubmit={handleAddGuest} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <M3Field
                label="Nama Lengkap Tamu"
                placeholder="Contoh: Bpk. Bambang & Istri"
                value={name}
                onChange={setName}
                required
              />
            </div>
            <M3Field
              label="Jumlah Pax (Orang)"
              type="number"
              value={pax}
              onChange={setPax}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-on-surface mr-2">Kategori:</span>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  cat === c
                    ? 'bg-primary text-on-primary font-bold shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <Ic.Plus s={15} />
              <span>Simpan ke Buku Tamu</span>
            </button>
          </div>
        </form>
      </Card>

      {/* Tabel Tamu */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <SectionHead
            title="Daftar Nama Tamu"
            sub={`Menampilkan ${filtered.length} tamu`}
          />
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <Ic.Search s={14} />
            </span>
            <input
              type="text"
              placeholder="Cari nama tamu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-full bg-surface-container text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary w-48"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center py-6 text-xs text-on-surface-variant">
            Belum ada data tamu pada kategori ini.
          </p>
        ) : (
          <div className="divide-y divide-outline-variant/30">
            {filtered.map((g) => (
              <div
                key={g.id}
                className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-surface-container/50 rounded-xl transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface font-display truncate">{g.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container text-on-surface-variant">
                      {g.category}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">{g.pax} Pax</span>
                  </div>
                  <span className="text-[10px] text-primary mt-0.5 block font-medium">
                    Status: {g.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleCheckIn(g.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                      g.checkedIn
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {g.checkedIn ? '✓ Checked-In' : 'Check-In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(g.id)}
                    className="w-7 h-7 rounded-lg text-error hover:bg-error-container/40 flex items-center justify-center transition-colors"
                  >
                    <Ic.Trash s={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
