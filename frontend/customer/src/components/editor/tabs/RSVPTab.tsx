import React from 'react';
import { GuestData, InvitationStats } from '../../../types';
import { Card, SectionHead, M3Field, M3Switch } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface RSVPTabProps {
  data: GuestData;
  stats?: InvitationStats;
  onChange: (d: GuestData) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function RSVPTab({ data, stats, onChange }: RSVPTabProps) {
  const attending = stats?.rsvpAttending || 0;
  const total = stats?.rsvpTotal || 0;
  const notAttending = Math.max(0, total - attending);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Pengaturan Utama RSVP */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <SectionHead
              title="Konfirmasi Kehadiran Tamu (RSVP)"
              sub="Fitur bagi tamu untuk menyatakan kesediaan hadir pada acara pernikahan"
            />
          </div>
          <M3Switch
            checked={data.rsvpEnabled}
            onChange={(v) => onChange({ ...data, rsvpEnabled: v })}
          />
        </div>
      </Card>

      {/* Ringkasan Konfirmasi Masuk */}
      <Card>
        <SectionHead
          title="Ringkasan Data Kehadiran Tamu"
          sub="Statistik konfirmasi kehadiran tamu secara real-time"
        />
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Respon</span>
            <p className="text-xl sm:text-2xl font-extrabold text-on-surface font-display mt-1">{total}</p>
            <span className="text-[10px] text-on-surface-variant">Tamu merespons</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-primary-container/30 border border-primary/20 text-center">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Pasti Hadir</span>
            <p className="text-xl sm:text-2xl font-extrabold text-primary font-display mt-1">{attending}</p>
            <span className="text-[10px] text-primary/80">Tamu & pendamping</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Berhalangan</span>
            <p className="text-xl sm:text-2xl font-extrabold text-on-surface-variant font-display mt-1">{notAttending}</p>
            <span className="text-[10px] text-on-surface-variant">Tamu berhalangan</span>
          </div>
        </div>
      </Card>

      {/* Detail Form RSVP */}
      <Card>
        <SectionHead
          title="Konfigurasi Form RSVP"
          sub="Atur batasan dan opsi pertanyaan yang muncul pada formulir"
        />
        <div className="space-y-4">
          <M3Field
            label="Batas Waktu Konfirmasi (Deadline)"
            type="date"
            value="2025-03-10"
            onChange={() => {}}
          />

          <div className="space-y-2 pt-2 border-t border-outline-variant/30">
            <p className="text-xs font-bold text-on-surface">Pilihan Jawaban pada Form:</p>
            <div className="space-y-1.5 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Ya, Saya Akan Hadir (dengan opsi jumlah pax pendamping)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Maaf, Saya Berhalangan Hadir (langsung diarahkan ke doa restu)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Masih Ragu / Belum Pasti</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
