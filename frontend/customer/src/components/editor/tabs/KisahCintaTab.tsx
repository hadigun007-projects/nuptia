import React, { useState } from 'react';
import { LoveStoryMilestone } from '../../../types';
import { Card, SubCard, SectionHead, M3Field } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface KisahCintaTabProps {
  milestones?: LoveStoryMilestone[];
  onChange: (m: LoveStoryMilestone[]) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function KisahCintaTab({ milestones = [], onChange, showToast }: KisahCintaTabProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState('2024');
  const [newStory, setNewStory] = useState('');

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStory.trim()) return;

    const item: LoveStoryMilestone = {
      id: `ls-${Date.now()}`,
      year: newYear.trim() || '2024',
      date: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      title: newTitle.trim(),
      story: newStory.trim(),
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop',
    };

    onChange([...milestones, item]);
    setNewTitle('');
    setNewStory('');
    showToast('Momen kisah cinta baru berhasil ditambahkan!', 'success');
  };

  const handleDelete = (id: string) => {
    onChange(milestones.filter((m) => m.id !== id));
    showToast('Momen dihapus', 'info');
  };

  const handleUpdate = (id: string, updates: Partial<LoveStoryMilestone>) => {
    onChange(milestones.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Pengantar */}
      <Card>
        <SectionHead
          title="Kisah Cinta (Love Story)"
          sub="Bagikan perjalanan indah pertemuan dan komitmen kalian berdua kepada para tamu"
        />
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Tamu undangan sangat menyukai cerita manis di balik cinta kalian berdua. Susun linimasa momen berharga
          mulai dari perkenalan, masa pendekatan, lamaran, hingga hari pernikahan.
        </p>
      </Card>

      {/* Tambah Momen Baru */}
      <Card>
        <SectionHead
          title="Tambah Momen Cerita Baru"
          sub="Tuliskan babak baru perjalanan asmara kalian"
        />
        <form onSubmit={handleAddMilestone} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <M3Field
              label="Tahun"
              placeholder="Contoh: 2021"
              value={newYear}
              onChange={setNewYear}
            />
            <div className="sm:col-span-2">
              <M3Field
                label="Judul Momen"
                placeholder="Contoh: Pertemuan Pertama di Kampus"
                value={newTitle}
                onChange={setNewTitle}
                required
              />
            </div>
          </div>
          <M3Field
            label="Kisah Cerita Singkat"
            placeholder="Ceritakan bagaimana momen manis itu terjadi..."
            value={newStory}
            onChange={setNewStory}
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
              <span>Tambah Momen</span>
            </button>
          </div>
        </form>
      </Card>

      {/* Daftar Linimasa Momen */}
      <Card>
        <SectionHead
          title="Linimasa Perjalanan Cinta"
          sub={`${milestones.length} momen tersusun`}
        />

        {milestones.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant text-xs">
            <Ic.KisahCinta s={36} cls="mx-auto mb-2 text-outline-variant" />
            <p className="font-semibold">Belum ada linimasa kisah cinta</p>
            <p className="text-[11px] mt-0.5">Mulai tambahkan momen pertama di formulir atas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <SubCard
                key={m.id}
                icon={
                  <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                }
                badge={
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-bold text-xs">
                    {m.year}
                  </span>
                }
                action={
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    className="w-7 h-7 rounded-lg text-error hover:bg-error-container/40 flex items-center justify-center transition-colors"
                    title="Hapus Momen"
                  >
                    <Ic.Trash s={14} />
                  </button>
                }
              >
                <div className="space-y-2">
                  <M3Field
                    label="Judul Momen"
                    value={m.title}
                    onChange={(v) => handleUpdate(m.id, { title: v })}
                  />
                  <M3Field
                    label="Isi Cerita"
                    value={m.story}
                    onChange={(v) => handleUpdate(m.id, { story: v })}
                    multiline
                    rows={2}
                  />
                </div>
              </SubCard>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
