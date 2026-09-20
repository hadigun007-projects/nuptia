import React from 'react';
import { SocialConfig } from '../../../types';
import { Card, SectionHead, M3Field } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface StoryIGTabProps {
  data?: SocialConfig;
  onChange: (s: SocialConfig) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function StoryIGTab({ data, onChange, showToast }: StoryIGTabProps) {
  const current = data || {
    igFilterUrl: '',
    hashtag: '#NuptiaWedding',
    igGroom: '',
    igBride: '',
  };

  const set = (k: keyof SocialConfig) => (v: string) => {
    onChange({ ...current, [k]: v });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Pengantar Fitur */}
      <Card>
        <SectionHead
          title="Integrasi Instagram Story"
          sub="Bagikan filter efek kamera IG dan tagar resmi hari bahagiamu kepada para tamu"
        />
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Tamu undangan dapat langsung mencoba filter efek Instagram khusus pernikahan kalian dan menggunakan
          hashtag resmi agar seluruh momen dokumentasi mudah ditemukan.
        </p>
      </Card>

      {/* Filter Instagram Effect */}
      <Card>
        <SectionHead
          title="Filter Efek Instagram"
          sub="Tautan langsung ke filter kamera Instagram Spark AR yang telah dibuat"
        />
        <div className="space-y-3.5">
          <M3Field
            label="Tautan Filter IG (URL)"
            placeholder="Contoh: https://instagram.com/ar/..."
            value={current.igFilterUrl}
            onChange={set('igFilterUrl')}
          />
          {current.igFilterUrl && (
            <div className="p-3 rounded-xl bg-primary-container/30 border border-primary/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-primary">Tautan Filter Aktif</span>
              <a
                href={current.igFilterUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-full bg-primary text-on-primary text-[11px] font-bold"
              >
                Coba Filter
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Hashtag & Mention Akun */}
      <Card>
        <SectionHead
          title="Tagar & Akun Pengantin"
          sub="Hashtag resmi serta username Instagram yang otomatis ditandai"
        />
        <div className="space-y-3.5">
          <M3Field
            label="Hashtag Resmi Pernikahan"
            placeholder="Contoh: #RezaHanaMenikah"
            value={current.hashtag}
            onChange={set('hashtag')}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <M3Field
              label="Username IG Mempelai Pria"
              placeholder="@rezapratama"
              value={current.igGroom}
              onChange={set('igGroom')}
            />
            <M3Field
              label="Username IG Mempelai Wanita"
              placeholder="@hananurafifah"
              value={current.igBride}
              onChange={set('igBride')}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
