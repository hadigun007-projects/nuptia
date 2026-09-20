import React from 'react';
import { EventData, EventSession } from '../../../types';
import { Card, SectionHead, M3Field } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface AcaraTabProps {
  data: EventData;
  onChange: (d: EventData) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function AcaraTab({ data, onChange, showToast }: AcaraTabProps) {
  const set = (k: keyof EventData) => (v: string) => onChange({ ...data, [k]: v });

  const sessions = data.sessions || [
    {
      id: 'ses-1',
      name: 'Akad Nikah',
      date: data.akadDate,
      time: data.akadTime,
      timezone: 'WIB',
      venue: data.venue,
      address: data.address,
      mapsUrl: data.mapsUrl,
    },
    {
      id: 'ses-2',
      name: 'Resepsi Pernikahan',
      date: data.resepsiDate,
      time: data.resepsiTime,
      timezone: 'WIB',
      venue: data.venue,
      address: data.address,
      mapsUrl: data.mapsUrl,
    },
  ];

  const handleAddSession = () => {
    const newSession: EventSession = {
      id: `ses-${Date.now()}`,
      name: 'Sesi Tambahan (Unduh Mantu / Pemberkatan)',
      date: data.resepsiDate || new Date().toISOString().split('T')[0],
      time: '19:00',
      timezone: 'WIB',
      venue: data.venue || '',
      address: data.address || '',
      mapsUrl: data.mapsUrl || '',
    };
    onChange({ ...data, sessions: [...sessions, newSession] });
    showToast('Sesi acara baru ditambahkan!', 'success');
  };

  const handleRemoveSession = (id: string) => {
    onChange({ ...data, sessions: sessions.filter((s) => s.id !== id) });
    showToast('Sesi acara dihapus', 'info');
  };

  const handleUpdateSession = (id: string, updates: Partial<EventSession>) => {
    const updated = sessions.map((s) => (s.id === id ? { ...s, ...updates } : s));
    onChange({ ...data, sessions: updated });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Sesi Akad Nikah */}
      <Card>
        <SectionHead
          title="Akad Nikah / Pemberkatan"
          sub="Waktu dan lokasi prosesi sakral ikrar pernikahan"
        />
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <M3Field
              label="Tanggal Akad"
              type="date"
              value={data.akadDate}
              onChange={set('akadDate')}
              required
            />
            <M3Field
              label="Waktu / Jam Akad"
              type="time"
              value={data.akadTime}
              onChange={set('akadTime')}
              required
            />
          </div>
        </div>
      </Card>

      {/* Sesi Resepsi */}
      <Card>
        <SectionHead
          title="Resepsi Pernikahan"
          sub="Waktu dan perayaan syukuran bersama keluarga & kerabat"
        />
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <M3Field
              label="Tanggal Resepsi"
              type="date"
              value={data.resepsiDate}
              onChange={set('resepsiDate')}
              required
            />
            <M3Field
              label="Waktu / Jam Resepsi"
              type="time"
              value={data.resepsiTime}
              onChange={set('resepsiTime')}
              required
            />
          </div>
        </div>
      </Card>

      {/* Lokasi & Venue Bersama */}
      <Card>
        <SectionHead
          title="Lokasi & Navigasi Venue"
          sub="Titik koordinat dan petunjuk arah untuk para tamu undangan"
        />
        <div className="space-y-3.5">
          <M3Field
            label="Nama Gedung / Tempat Venue"
            placeholder="Contoh: Ballroom Grand Mercure Jakarta"
            value={data.venue}
            onChange={set('venue')}
            required
          />
          <M3Field
            label="Alamat Lengkap Venue"
            placeholder="Jl. Hayam Wuruk No. 123, Jakarta Pusat..."
            value={data.address}
            onChange={set('address')}
            multiline
            rows={2}
          />
          <M3Field
            label="Link Google Maps"
            placeholder="https://maps.app.goo.gl/..."
            value={data.mapsUrl}
            onChange={set('mapsUrl')}
          />
        </div>
      </Card>

      {/* Sesi Tambahan Opsional */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHead
            title="Rangkaian Sesi Khusus"
            sub="Tambahkan sesi lain seperti Acara Adat, Lamaran, atau Unduh Mantu"
          />
          <button
            type="button"
            onClick={handleAddSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container text-on-primary-container text-xs font-bold hover:opacity-80 transition-opacity"
          >
            <Ic.Plus s={15} /> Tambah Sesi
          </button>
        </div>

        <div className="space-y-3">
          {sessions.map((s, idx) => (
            <div
              key={s.id}
              className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => handleUpdateSession(s.id, { name: e.target.value })}
                  className="font-bold text-xs sm:text-sm text-on-surface bg-transparent border-0 outline-none w-full focus:text-primary"
                />
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  {s.date} • {s.time} {s.timezone || 'WIB'} • {s.venue || data.venue || 'Venue'}
                </p>
              </div>

              {idx >= 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSession(s.id)}
                  className="w-7 h-7 rounded-full text-error hover:bg-error-container/40 flex items-center justify-center transition-colors"
                  title="Hapus Sesi"
                >
                  <Ic.Trash s={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
