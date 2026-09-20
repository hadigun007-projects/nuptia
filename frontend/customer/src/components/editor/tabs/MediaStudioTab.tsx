import React, { useRef } from 'react';
import { MediaData, GalleryItem } from '../../../types';
import { Card, SectionHead, M3Field, Skeleton } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface MediaStudioTabProps {
  data: MediaData;
  onChange: (d: MediaData) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function MediaStudioTab({ data, onChange, showToast }: MediaStudioTabProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({ ...data, heroUrl: url });
    showToast('Foto cover berhasil diunggah!', 'success');
  }

  function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const loadingItems: GalleryItem[] = files.map((_, i) => ({
      id: `new-${Date.now()}-${i}`,
      url: '',
      caption: 'Foto baru',
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
        if (i === files.length - 1) showToast(`${files.length} foto berhasil ditambahkan!`, 'success');
      }, 600 + i * 200);
    });
  }

  function removeGallery(id: string) {
    onChange({ ...data, gallery: data.gallery.filter((g) => g.id !== id) });
    showToast('Foto dihapus', 'info');
  }

  function updateCaption(id: string, caption: string) {
    onChange({
      ...data,
      gallery: data.gallery.map((g) => (g.id === id ? { ...g, caption } : g)),
    });
  }

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Hero Cover */}
      <Card>
        <SectionHead title="Foto Cover / Hero" sub="Rasio 16:9 atau 9:16 disarankan" />
        <div
          className="relative rounded-2xl overflow-hidden bg-surface-container-high aspect-video cursor-pointer group"
          onClick={() => fileRef.current?.click()}
        >
          {data.heroUrl ? (
            <>
              <img src={data.heroUrl} alt="Hero cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 bg-black/60 text-white rounded-full px-4 py-2 text-sm font-semibold">
                  <Ic.Upload s={18} /> Ganti Foto
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-on-surface-variant">
              <Ic.Upload s={32} cls="text-outline" />
              <p className="text-sm font-medium">Klik untuk unggah foto cover</p>
              <p className="text-xs">JPG, PNG, WEBP • maks 10 MB</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
      </Card>

      {/* Gallery */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHead title="Galeri Foto" sub={`${data.gallery.length} foto di galeri`} />
          <button
            onClick={() => galleryRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary-container text-on-primary-container text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            <Ic.Add s={18} /> Tambah
          </button>
        </div>
        <input
          ref={galleryRef}
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
              className="group relative rounded-2xl overflow-hidden aspect-square bg-surface-container"
            >
              {item.loading ? (
                <Skeleton className="w-full h-full rounded-2xl" />
              ) : (
                <>
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-2">
                    <input
                      value={item.caption}
                      onChange={(e) => updateCaption(item.id, e.target.value)}
                      className="text-xs text-white bg-transparent border-b border-white/50 outline-none w-full placeholder:text-white/60"
                      placeholder="Keterangan foto..."
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <button
                    onClick={() => removeGallery(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95"
                  >
                    <Ic.Delete s={14} />
                  </button>
                </>
              )}
            </div>
          ))}
          <button
            onClick={() => galleryRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary-container/30 transition-all duration-200 cursor-pointer"
          >
            <Ic.Add s={24} />
            <span className="text-xs font-medium">Tambah Foto</span>
          </button>
        </div>
      </Card>

      {/* Video */}
      <Card>
        <SectionHead title="Video" sub="YouTube, Vimeo, atau tautan langsung" />
        <div className="space-y-3">
          <M3Field
            label="URL Video (YouTube / Vimeo)"
            value={data.videoUrl}
            onChange={(v) => onChange({ ...data, videoUrl: v })}
            placeholder="https://youtu.be/..."
          />
          {data.videoUrl && (
            <div className="w-full aspect-video rounded-2xl bg-inverse-surface flex items-center justify-center text-inverse-on-surface/60 overflow-hidden">
              <div className="text-center">
                <Ic.Video s={32} cls="mx-auto mb-2 opacity-50" />
                <p className="text-xs opacity-60 break-all px-4">{data.videoUrl}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Music */}
      <Card>
        <SectionHead title="Musik Latar" sub="Diputar otomatis saat undangan dibuka" />
        <M3Field
          label="Judul Lagu"
          value={data.musicTitle}
          onChange={(v) => onChange({ ...data, musicTitle: v })}
          className="mb-3"
        />
        <div className="flex items-center gap-3 p-3 bg-primary-container rounded-2xl">
          <button
            onClick={() => onChange({ ...data, musicPlaying: !data.musicPlaying })}
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-95 transition-all duration-200"
          >
            {data.musicPlaying ? <Ic.Pause s={20} /> : <Ic.Play s={20} />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-primary-container truncate">
              {data.musicTitle || 'Pilih lagu...'}
            </p>
            <div className="mt-1.5 h-1 bg-primary/20 rounded-full overflow-hidden">
              {data.musicPlaying && (
                <div className="h-full bg-primary rounded-full w-1/3 transition-all duration-1000" />
              )}
            </div>
          </div>
          <Ic.Music s={20} cls="text-primary/60 flex-shrink-0" />
        </div>
      </Card>
    </div>
  );
}
