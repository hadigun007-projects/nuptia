import React from 'react';
import { InvitationSettings, Status } from '../../../types';
import { Card, SectionHead, M3Field, M3Switch } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface SettingTabProps {
  slug: string;
  status: Status;
  settings?: InvitationSettings;
  onChangeSlug: (s: string) => void;
  onChangeStatus: (s: Status) => void;
  onChangeSettings: (cfg: InvitationSettings) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function SettingTab({
  slug,
  status,
  settings,
  onChangeSlug,
  onChangeStatus,
  onChangeSettings,
  showToast,
}: SettingTabProps) {
  const current = settings || {
    customSlug: slug,
    isPrivate: false,
    password: '',
    searchEngineIndex: true,
    musicAutoplay: true,
  };

  const setCfg = (k: keyof InvitationSettings) => (v: unknown) => {
    onChangeSettings({ ...current, [k]: v });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Tautan / URL Slug */}
      <Card>
        <SectionHead
          title="Tautan Undangan (URL Slug)"
          sub="Alamat tautan website yang akan dibuka oleh tamu undangan"
        />
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant bg-surface-container p-3 rounded-xl border border-outline-variant/30">
            <span className="text-primary font-bold">nuptia.id/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                onChangeSlug(val);
                setCfg('customSlug')(val);
              }}
              className="bg-transparent border-0 outline-none text-on-surface font-bold flex-1"
              placeholder="nama-pasangan"
            />
          </div>
          <p className="text-[11px] text-on-surface-variant">
            Gunakan huruf kecil, angka, dan tanda hubung (-). Contoh: <code>reza-dan-hana</code>
          </p>
        </div>
      </Card>

      {/* Status Publikasi */}
      <Card>
        <SectionHead
          title="Status Publikasi Undangan"
          sub="Tentukan apakah undangan siap dilihat publik atau masih dalam tahap penyusunan"
        />
        <div className="grid grid-cols-3 gap-3">
          {(['Draft', 'Published', 'Live'] as Status[]).map((st) => {
            const isSelected = status === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => {
                  onChangeStatus(st);
                  showToast(`Status undangan diubah ke ${st}`, st === 'Live' ? 'success' : 'info');
                }}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'border-primary bg-primary-container/40 text-primary font-bold ring-1 ring-primary'
                    : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  {st === 'Live' && <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />}
                  <span className="text-xs font-display">{st}</span>
                </div>
                <span className="text-[10px] text-on-surface-variant block">
                  {st === 'Draft' ? 'Hanya Anda' : st === 'Published' ? 'Siap Sebar' : 'Tayang Online'}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Proteksi Privasi & Kata Sandi */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <SectionHead
              title="Proteksi Kata Sandi (Private)"
              sub="Tamu wajib memasukkan kode sandi sebelum dapat membuka undangan"
            />
          </div>
          <M3Switch
            checked={current.isPrivate}
            onChange={(v) => {
              setCfg('isPrivate')(v);
              showToast(v ? 'Proteksi sandi diaktifkan' : 'Proteksi sandi dimatikan', 'info');
            }}
          />
        </div>

        {current.isPrivate && (
          <div className="pt-3 border-t border-outline-variant/30 space-y-2">
            <M3Field
              label="Kata Sandi / Kode Akses"
              placeholder="Contoh: pernikahan2025"
              value={current.password || ''}
              onChange={(v) => setCfg('password')(v)}
            />
            <p className="text-[11px] text-on-surface-variant">
              Tamu undangan harus memasukkan kata sandi ini pada layar pembuka pintu undangan.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
