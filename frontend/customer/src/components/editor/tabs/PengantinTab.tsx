import React, { useRef } from 'react';
import { EventData } from '../../../types';
import { Card, SectionHead, M3Field } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface PengantinTabProps {
  data: EventData;
  onChange: (d: EventData) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function PengantinTab({ data, onChange, showToast }: PengantinTabProps) {
  const groomFileRef = useRef<HTMLInputElement>(null);
  const brideFileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof EventData) => (v: string) => onChange({ ...data, [k]: v });

  const handleGroomPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ ...data, groomPhoto: url });
      showToast('Foto mempelai pria diperbarui!', 'success');
    }
  };

  const handleBridePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ ...data, bridePhoto: url });
      showToast('Foto mempelai wanita diperbarui!', 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Mempelai Pria */}
      <Card>
        <SectionHead
          title="Mempelai Pria"
          sub="Informasi lengkap dan profil calon mempelai pria"
        />

        <div className="flex flex-col sm:flex-row items-center gap-5 mb-5 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
          <div
            onClick={() => groomFileRef.current?.click()}
            className="relative w-24 h-24 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0 cursor-pointer group border-2 border-primary/40 hover:border-primary transition-all"
          >
            {data.groomPhoto ? (
              <img src={data.groomPhoto} alt="Groom" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant text-[10px]">
                <Ic.Pengantin s={28} cls="text-primary/70 mb-1" />
                <span>Foto Pria</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
              Ubah
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h4 className="text-sm font-bold text-on-surface font-display">
              {data.groomNick ? `Calon Pengantin: ${data.groomNick}` : 'Foto Profil Mempelai Pria'}
            </h4>
            <p className="text-xs text-on-surface-variant">
              Format JPG, PNG, atau WEBP. Disarankan foto portrait rasio 1:1.
            </p>
            <button
              type="button"
              onClick={() => groomFileRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
            >
              <Ic.Upload s={14} />
              <span>Unggah Foto</span>
            </button>
          </div>
          <input ref={groomFileRef} type="file" accept="image/*" className="hidden" onChange={handleGroomPhoto} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <M3Field
            label="Nama Panggilan Pria"
            placeholder="Contoh: Reza"
            value={data.groomNick}
            onChange={set('groomNick')}
            required
          />
          <M3Field
            label="Nama Lengkap & Gelar"
            placeholder="Muhammad Reza Pratama, S.T."
            value={data.groomFull}
            onChange={set('groomFull')}
          />
          <M3Field
            label="Nama Orang Tua Pria"
            placeholder="Bpk. H. Agus Salim & Ibu Hj. Siti Aminah"
            value={data.groomParents}
            onChange={set('groomParents')}
          />
          <M3Field
            label="Akun Instagram (Opsional)"
            placeholder="@rezapratama"
            value={data.groomInstagram || ''}
            onChange={set('groomInstagram')}
          />
        </div>
        <div className="mt-3.5">
          <M3Field
            label="Bio Singkat / Profil Pria (Opsional)"
            placeholder="Putra pertama yang bersahaja dan pekerja keras..."
            value={data.groomBio || ''}
            onChange={set('groomBio')}
            multiline
            rows={2}
          />
        </div>
      </Card>

      {/* Mempelai Wanita */}
      <Card>
        <SectionHead
          title="Mempelai Wanita"
          sub="Informasi lengkap dan profil calon mempelai wanita"
        />

        <div className="flex flex-col sm:flex-row items-center gap-5 mb-5 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
          <div
            onClick={() => brideFileRef.current?.click()}
            className="relative w-24 h-24 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0 cursor-pointer group border-2 border-primary/40 hover:border-primary transition-all"
          >
            {data.bridePhoto ? (
              <img src={data.bridePhoto} alt="Bride" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant text-[10px]">
                <Ic.Pengantin s={28} cls="text-primary/70 mb-1" />
                <span>Foto Wanita</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
              Ubah
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h4 className="text-sm font-bold text-on-surface font-display">
              {data.brideNick ? `Calon Pengantin: ${data.brideNick}` : 'Foto Profil Mempelai Wanita'}
            </h4>
            <p className="text-xs text-on-surface-variant">
              Format JPG, PNG, atau WEBP. Disarankan foto portrait rasio 1:1.
            </p>
            <button
              type="button"
              onClick={() => brideFileRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
            >
              <Ic.Upload s={14} />
              <span>Unggah Foto</span>
            </button>
          </div>
          <input ref={brideFileRef} type="file" accept="image/*" className="hidden" onChange={handleBridePhoto} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <M3Field
            label="Nama Panggilan Wanita"
            placeholder="Contoh: Hana"
            value={data.brideNick}
            onChange={set('brideNick')}
            required
          />
          <M3Field
            label="Nama Lengkap & Gelar"
            placeholder="Hana Nur Afifah, S.Pd."
            value={data.brideFull}
            onChange={set('brideFull')}
          />
          <M3Field
            label="Nama Orang Tua Wanita"
            placeholder="Bpk. Ir. Dede Supriatna & Ibu Dr. Ratna Dewi"
            value={data.brideParents}
            onChange={set('brideParents')}
          />
          <M3Field
            label="Akun Instagram (Opsional)"
            placeholder="@hananurafifah"
            value={data.brideInstagram || ''}
            onChange={set('brideInstagram')}
          />
        </div>
        <div className="mt-3.5">
          <M3Field
            label="Bio Singkat / Profil Wanita (Opsional)"
            placeholder="Putri bungsu yang ceria dan penuh kasih sayang..."
            value={data.brideBio || ''}
            onChange={set('brideBio')}
            multiline
            rows={2}
          />
        </div>
      </Card>
    </div>
  );
}
