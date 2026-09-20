import React from 'react';
import { ThemeConfig, TemplateOption } from '../../../types';
import { useTemplates } from '../../../hooks/useTemplates';
import { Card, SectionHead } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface TemaTabProps {
  theme: ThemeConfig;
  onChange: (t: ThemeConfig) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const COLOR_PRESETS = [
  { name: 'Deep Berry (Nuptia Signature)', hex: '#A3158A' },
  { name: 'Peach Blossom', hex: '#FF7E67' },
  { name: 'Golden Amber', hex: '#B45309' },
  { name: 'Sage Garden', hex: '#5A735D' },
  { name: 'Royal Purple', hex: '#6D28D9' },
  { name: 'Warm Terracotta', hex: '#C2410C' },
  { name: 'Classic Gold', hex: '#D4AF37' },
];

const FONT_OPTIONS = [
  { name: 'Nunito & Inter', label: 'Ceria & Modern (Default)', preview: 'The Wedding of Reza & Hana' },
  { name: 'Playfair & Inter', label: 'Klasik Elegan', preview: 'The Wedding of Reza & Hana' },
  { name: 'Cormorant & Inter', label: 'Romantis Minimalis', preview: 'The Wedding of Reza & Hana' },
  { name: 'Lora & Inter', label: 'Floral & Anggun', preview: 'The Wedding of Reza & Hana' },
];

export function TemaTab({ theme, onChange, showToast }: TemaTabProps) {
  const { templates, isLiveFromDB } = useTemplates();
  const currentTemplate =
    templates.find((t) => t.id === theme.templateId) || templates[0];

  const handleSelectTemplate = (tpl: TemplateOption) => {
    onChange({
      ...theme,
      templateId: tpl.id,
      templateName: tpl.name,
      primaryColor: tpl.color,
      fontStyle: tpl.font || theme.fontStyle,
    });
    showToast(`Tema diganti ke "${tpl.name}"!`, 'success');
  };

  const handleSelectColor = (hex: string) => {
    onChange({ ...theme, primaryColor: hex });
    showToast('Warna aksen tema diperbarui', 'info');
  };

  const handleSelectFont = (fontName: string) => {
    onChange({ ...theme, fontStyle: fontName });
    showToast(`Font diganti ke ${fontName}`, 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Pilihan Template */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <SectionHead
            title="Template Desain"
            sub="Pilih tema dasar visual untuk undangan pernikahan digitalmu"
          />
          {isLiveFromDB && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              PostgreSQL
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map((tpl) => {
            const isSelected = theme.templateId === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/40 bg-primary-container/20'
                    : 'border-outline-variant/40 bg-surface-container-low hover:border-primary/50'
                }`}
              >
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={tpl.cover}
                    alt={tpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Tier Badge */}
                  {tpl.tier && (
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          tpl.tier === 'exclusive'
                            ? 'bg-amber-500 text-white'
                            : tpl.tier === 'premium'
                            ? 'bg-purple-600 text-white'
                            : 'bg-black/50 text-white backdrop-blur-xs'
                        }`}
                      >
                        {tpl.tier}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2.5 right-2.5">
                    {isSelected ? (
                      <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center gap-1">
                        <Ic.Check s={12} /> Aktif
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] backdrop-blur-xs font-medium">
                        Pilih
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-on-surface font-display">{tpl.name}</h4>
                    <p className="text-[11px] text-on-surface-variant">{tpl.tagline}</p>
                  </div>
                  <span
                    className="w-5 h-5 rounded-full border border-white"
                    style={{ backgroundColor: tpl.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Palet Warna Aksen */}
      <Card>
        <SectionHead
          title="Warna Aksen Utama"
          sub="Kustomisasi warna tombol, judul, dan ornamen hiasan"
        />
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-2xl border-2 border-white flex-shrink-0"
              style={{ backgroundColor: theme.primaryColor || '#A3158A' }}
            />
            <div>
              <p className="text-xs font-bold text-on-surface">Warna Saat Ini: {theme.primaryColor || '#A3158A'}</p>
              <p className="text-[11px] text-on-surface-variant">Klik pilihan palet di bawah ini untuk mengganti</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {COLOR_PRESETS.map((col) => {
              const isPicked = theme.primaryColor?.toLowerCase() === col.hex.toLowerCase();
              return (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => handleSelectColor(col.hex)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    isPicked
                      ? 'border-primary bg-primary-container/40 text-on-surface font-bold ring-1 ring-primary'
                      : 'border-outline-variant/50 hover:bg-surface-container'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: col.hex }} />
                  <span>{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Tipografi */}
      <Card>
        <SectionHead
          title="Tipografi Font"
          sub="Gaya font yang digunakan pada judul dan teks isi undangan"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONT_OPTIONS.map((f) => {
            const isSelected = theme.fontStyle === f.name;
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => handleSelectFont(f.name)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary-container/30 ring-1 ring-primary font-semibold'
                    : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-on-surface">{f.name}</span>
                  {isSelected && <Ic.Check s={14} cls="text-primary" />}
                </div>
                <p className="text-[10px] text-on-surface-variant mb-2">{f.label}</p>
                <p className="text-xs italic text-primary/90">{f.preview}</p>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
