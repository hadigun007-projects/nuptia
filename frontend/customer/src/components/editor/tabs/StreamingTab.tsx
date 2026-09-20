import React from 'react';
import { StreamingConfig } from '../../../types';
import { Card, SectionHead, M3Field, M3Switch } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface StreamingTabProps {
  data?: StreamingConfig;
  onChange: (d: StreamingConfig) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube Live', icon: '▶' },
  { id: 'zoom', label: 'Zoom Meeting', icon: '📹' },
  { id: 'instagram', label: 'Instagram Live', icon: '📷' },
  { id: 'custom', label: 'Link Lainnya', icon: '🌐' },
] as const;

export function StreamingTab({ data, onChange, showToast }: StreamingTabProps) {
  const current = data || {
    enabled: false,
    platform: 'youtube',
    url: '',
    scheduleDate: '',
    scheduleTime: '08:00 WIB',
    notes: '',
  };

  const set = (k: keyof StreamingConfig) => (v: unknown) => {
    onChange({ ...current, [k]: v });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Toggle Utama Streaming */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <SectionHead
              title="Siaran Langsung (Live Streaming)"
              sub="Fasilitasi keluarga dan kerabat jauh untuk menyaksikan prosesi pernikahan virtual"
            />
          </div>
          <M3Switch
            checked={current.enabled}
            onChange={(v) => {
              set('enabled')(v);
              showToast(v ? 'Live streaming diaktifkan' : 'Live streaming dinonaktifkan', 'info');
            }}
          />
        </div>
      </Card>

      {current.enabled && (
        <>
          {/* Pemilihan Platform */}
          <Card>
            <SectionHead
              title="Platform Siaran Langsung"
              sub="Pilih layanan video streaming yang akan digunakan"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PLATFORMS.map((p) => {
                const isSelected = current.platform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => set('platform')(p.id)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary-container/40 text-primary font-bold ring-1 ring-primary'
                        : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <span className="text-lg block mb-1">{p.icon}</span>
                    <span className="text-xs font-display">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* URL dan Detail Jadwal */}
          <Card>
            <SectionHead
              title="Tautan & Jadwal Tayang"
              sub="Tautan video siaran langsung dan jam mulai tayang"
            />
            <div className="space-y-3.5">
              <M3Field
                label={`Tautan / Link ${current.platform.toUpperCase()}`}
                placeholder="Contoh: https://youtube.com/live/..."
                value={current.url}
                onChange={(v) => set('url')(v)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <M3Field
                  label="Tanggal Siaran"
                  type="date"
                  value={current.scheduleDate}
                  onChange={(v) => set('scheduleDate')(v)}
                />
                <M3Field
                  label="Jam Tayang"
                  placeholder="08:00 WIB"
                  value={current.scheduleTime}
                  onChange={(v) => set('scheduleTime')(v)}
                />
              </div>

              <M3Field
                label="Pesan / Catatan Pengantar"
                placeholder="Bagi Bapak/Ibu/Saudara/i yang berhalangan hadir secara tatap muka..."
                value={current.notes || ''}
                onChange={(v) => set('notes')(v)}
                multiline
                rows={3}
              />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
