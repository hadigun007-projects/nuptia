import React, { useRef } from 'react';
import { MediaData, GalleryItem } from '../../../types';
import { Card, SectionHead, M3Field, Skeleton } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface GaleriTabProps {
  data: MediaData;
  onChange: (d: MediaData) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function GaleriTab({ data, onChange, showToast }: GaleriTabProps) {
  const heroFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({ ...data, heroUrl: url });
    showToast('Foto cover utama berhasil diunggah!', 'success');
  }

  function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const loadingItems: GalleryItem[] = files.map((_, i) => ({
      id: `new-${Date.now()}-${i}`,
      url: '',
      caption: 'Foto kenangan',
      loading: true,
    }));
    onChange({ ...data, gallery: [...data.gallery, ...loadingItems] });
    files.forEach((file, i) => {
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        const itemId = loadingItems[i].id;
        onChange({
          ...data,
          gallery: data.gallery.map((g) => (g.id === itemId ? { ...g, url, loading: false } : g)),
        });
        if (i === files.length - 1) showToast(`${files.length} foto berhasil ditambahkan ke galeri!`, 'success');
      }, 500 + i * 200);
    });
  }

  function removeGallery(id: string) {
    onChange({ ...data, gallery: data.gallery.filter((g) => g.id !== id) });
    showToast('Foto dihapus dari galeri', 'info');
  }

  function updateCaption(id: string, caption: string) {
    onChange({
      ...data,
      gallery: data.gallery.map((g) => (g.id === id ? { ...g, caption } : g)),
    });
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Cover / Hero Utama */}
      <Card>
        <SectionHead
          title="Foto Sampul Utama (Hero Cover)"
          sub="Foto beresolusi tinggi yang ditampilkan paling pertama saat undangan dibuka"
        />
        <div
          className="relative rounded-2xl overflow-hidden bg-surface-container-high aspect-video cursor-pointer group border border-outline-variant/30"
          onClick={() => heroFileRef.current?.click()}
        >
          {data.heroUrl ? (
            <>
              <img src={data.heroUrl} alt="Hero cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 bg-black/70 text-white rounded-full px-4 py-2 text-xs font-bold">
                  <Ic.Upload s={16} /> Ganti Foto Sampul
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-on-surface-variant">
              <Ic.Upload s={32} cls="text-primary/60 mb-1" />
              <p className="text-xs font-bold">Klik untuk unggah foto sampul</p>
              <p className="text-[10px]">JPG, PNG, WEBP • Disarankan rasio 16:9 atau 9:16</p>
            </div>
          )}
        </div>
        <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
      </Card>

      {/* Album Galeri Pre-Wedding */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHead
            title="Album Foto Pre-Wedding"
            sub={`${data.gallery.length} foto kenangan tersimpan`}
          />
          <button
            type="button"
            onClick={() => galleryFileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold active:scale-95 transition-all"
          >
            <Ic.Plus s={15} /> Tambah Foto
          </button>
        </div>
        <input
          ref={galleryFileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleGalleryUpload}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.gallery.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-surface-container border border-outline-variant/30"
            >
              {item.loading ? (
                <Skeleton className="w-full h-full rounded-2xl" />
              ) : (
                <>
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-2.5">
                    <input
                      value={item.caption}
                      onChange={(e) => updateCaption(item.id, e.target.value)}
                      className="text-xs text-white bg-transparent border-b border-white/50 outline-none w-full placeholder:text-white/60 font-medium"
                      placeholder="Tulis caption foto..."
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGallery(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
                    title="Hapus Foto"
                  >
                    <Ic.Delete s={14} />
                  </button>
                </>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => galleryFileRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant/70 flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary-container/20 transition-all duration-200 cursor-pointer"
          >
            <Ic.Plus s={22} />
            <span className="text-xs font-bold font-display">Upload Foto</span>
          </button>
        </div>
      </Card>

      {/* Video Teaser */}
      <Card>
        <SectionHead
          title="Video Teaser / Pre-Wedding"
          sub="Tampilkan teaser video cinta kalian dari YouTube atau Vimeo"
        />
        <div className="space-y-3">
          <M3Field
            label="URL Video (YouTube / Vimeo)"
            value={data.videoUrl}
            onChange={(v) => onChange({ ...data, videoUrl: v })}
            placeholder="https://youtu.be/..."
          />
          {data.videoUrl && (
            <div className="w-full aspect-video rounded-2xl bg-inverse-surface flex items-center justify-center text-inverse-on-surface/70 overflow-hidden">
              <div className="text-center p-4">
                <Ic.Video s={32} cls="mx-auto mb-2 text-primary" />
                <p className="text-xs font-mono break-all">{data.videoUrl}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-[10px] font-bold">
                  Video Teaser Terhubung
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
