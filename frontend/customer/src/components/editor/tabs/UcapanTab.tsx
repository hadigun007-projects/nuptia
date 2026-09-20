import React, { useState } from 'react';
import { GreetingItem } from '../../../types';
import { Card, SectionHead, M3Field, M3Switch } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface UcapanTabProps {
  enabled: boolean;
  greetings: GreetingItem[];
  onToggleEnabled: (v: boolean) => void;
  onChangeGreetings: (g: GreetingItem[]) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function UcapanTab({
  enabled,
  greetings,
  onToggleEnabled,
  onChangeGreetings,
  showToast,
}: UcapanTabProps) {
  const [testName, setTestName] = useState('');
  const [testRel, setTestRel] = useState('Teman');
  const [testMsg, setTestMsg] = useState('');

  const list = greetings || [];

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || !testMsg.trim()) return;

    const newGreeting: GreetingItem = {
      id: `gr-${Date.now()}`,
      name: testName.trim(),
      relationship: testRel,
      message: testMsg.trim(),
      createdAt: 'Baru saja',
      isPinned: false,
    };

    onChangeGreetings([newGreeting, ...list]);
    setTestName('');
    setTestMsg('');
    showToast('Doa restu berhasil ditambahkan!', 'success');
  };

  const handleTogglePin = (id: string) => {
    const updated = list.map((g) => (g.id === id ? { ...g, isPinned: !g.isPinned } : g));
    onChangeGreetings(updated);
    showToast('Status pin ucapan diperbarui', 'info');
  };

  const handleDelete = (id: string) => {
    onChangeGreetings(list.filter((g) => g.id !== id));
    showToast('Ucapan dihapus', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Pengaturan Fitur Ucapan */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <SectionHead
              title="Buku Doa & Ucapan Tamu"
              sub="Izinkan tamu undangan menuliskan doa restu dan ucapan selamat secara digital"
            />
          </div>
          <M3Switch checked={enabled} onChange={onToggleEnabled} />
        </div>
      </Card>

      {/* Tambah Ucapan Manual / Uji Coba */}
      <Card>
        <SectionHead
          title="Tambah Ucapan Baru"
          sub="Simulasikan atau masukkan ucapan doa restu dari kerabat"
        />
        <form onSubmit={handleAddTest} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <M3Field
              label="Nama Pengirim"
              placeholder="Contoh: Om Farhan & Keluarga"
              value={testName}
              onChange={setTestName}
              required
            />
            <M3Field
              label="Hubungan / Relasi"
              placeholder="Contoh: Sahabat Kuliah / Rekan Kerja"
              value={testRel}
              onChange={setTestRel}
            />
          </div>
          <M3Field
            label="Pesan Doa Restu"
            placeholder="Tuliskan ucapan selamat dan doa untuk kedua mempelai..."
            value={testMsg}
            onChange={setTestMsg}
            multiline
            rows={3}
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold transition-all"
            >
              <Ic.Plus s={15} />
              <span>Simpan Ucapan</span>
            </button>
          </div>
        </form>
      </Card>

      {/* Daftar Moderasi Ucapan */}
      <Card>
        <SectionHead
          title="Moderasi Doa Restu Masuk"
          sub={`Total ${list.length} ucapan dari para tamu`}
        />

        {list.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant text-xs">
            <Ic.Ucapan s={32} cls="mx-auto mb-2 text-outline-variant" />
            <p className="font-semibold">Belum ada ucapan doa restu</p>
            <p className="text-[11px] mt-0.5">Ucapan dari tamu yang mengisi undangan akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.isPinned
                    ? 'bg-primary-container/20 border-primary/40'
                    : 'bg-surface-container-low border-outline-variant/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-on-surface font-display">{item.name}</h4>
                      {item.relationship && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container text-on-surface-variant">
                          {item.relationship}
                        </span>
                      )}
                      {item.isPinned && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">
                          Disematkan
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-mono">{item.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTogglePin(item.id)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-surface-container hover:bg-surface-container-high transition-colors"
                      title={item.isPinned ? 'Lepas Sematan' : 'Sematkan ke Atas'}
                    >
                      {item.isPinned ? 'Lepas' : 'Pin'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="w-7 h-7 rounded-lg text-error hover:bg-error-container/40 flex items-center justify-center transition-colors"
                      title="Hapus Ucapan"
                    >
                      <Ic.Trash s={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-on-surface leading-relaxed mt-2">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
