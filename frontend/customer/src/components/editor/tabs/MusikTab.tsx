import React, { useRef } from 'react';
import { MediaData } from '../../../types';
import { Card, SectionHead, M3Field, M3Switch } from '../../common/UIComponents';
import { Ic } from '../../common/Icons';

interface MusikTabProps {
  data: MediaData;
  onChange: (d: MediaData) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const SONG_CATALOG = [
  { title: 'A Thousand Years', artist: 'Christina Perri', duration: '4:45' },
  { title: 'Until I Found You', artist: 'Stephen Sanchez', duration: '2:57' },
  { title: 'Perfect', artist: 'Ed Sheeran', duration: '4:23' },
  { title: 'Akad', artist: 'Payung Teduh', duration: '4:18' },
  { title: 'Can\'t Help Falling in Love', artist: 'Kina Grannis', duration: '3:21' },
  { title: 'Kisah Romantis', artist: 'Glenn Fredly', duration: '4:02' },
  { title: 'Canon in D (Piano & Cello)', artist: 'Johann Pachelbel', duration: '3:40' },
];

export function MusikTab({ data, onChange, showToast }: MusikTabProps) {
  const audioFileRef = useRef<HTMLInputElement>(null);

  const handleSelectSong = (song: typeof SONG_CATALOG[0]) => {
    onChange({
      ...data,
      musicTitle: `${song.title} – ${song.artist}`,
      musicPlaying: false,
    });
    showToast(`Lagu diganti ke "${song.title}"!`, 'success');
  };

  const handleUploadAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({
        ...data,
        musicTitle: file.name.replace(/\.[^/.]+$/, ''),
        musicUrl: url,
        musicPlaying: false,
      });
      showToast(`Musik "${file.name}" berhasil diunggah!`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Player Aktif */}
      <Card>
        <SectionHead
          title="Musik Latar Aktif"
          sub="Soundtrack romantis yang mengiringi tamu saat membaca undangan"
        />

        <div className="p-4 bg-primary-container/40 rounded-2xl border border-primary/20 space-y-3">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => onChange({ ...data, musicPlaying: !data.musicPlaying })}
              className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all flex-shrink-0"
              title={data.musicPlaying ? 'Jeda Musik' : 'Putar Musik'}
            >
              {data.musicPlaying ? <Ic.Pause s={22} /> : <Ic.Play s={22} />}
            </button>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                {data.musicPlaying ? 'Sedang Memutar Preview' : 'Lagu Terpilih'}
              </span>
              <p className="text-sm font-extrabold text-on-surface font-display truncate">
                {data.musicTitle || 'Belum ada lagu dipilih'}
              </p>
              <div className="mt-1.5 h-1.5 bg-primary/20 rounded-full overflow-hidden">
                {data.musicPlaying ? (
                  <div className="h-full bg-primary rounded-full w-2/5 animate-pulse" />
                ) : (
                  <div className="h-full bg-primary/40 rounded-full w-1/4" />
                )}
              </div>
            </div>

            <span className="text-primary/70">
              <Ic.Musik s={26} />
            </span>
          </div>

          <div className="pt-2 border-t border-primary/15 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-on-surface">Putar Otomatis (Autoplay)</p>
              <p className="text-[10px] text-on-surface-variant">Musik otomatis mulai setelah tamu membuka pintu undangan</p>
            </div>
            <M3Switch
              checked={data.autoplay ?? true}
              onChange={(v) => onChange({ ...data, autoplay: v })}
            />
          </div>
        </div>

        <div className="mt-4">
          <M3Field
            label="Kustom Judul Lagu"
            value={data.musicTitle}
            onChange={(v) => onChange({ ...data, musicTitle: v })}
            placeholder="Ketik judul lagu kustom..."
          />
        </div>
      </Card>

      {/* Upload MP3 Sendiri */}
      <Card>
        <SectionHead
          title="Upload Lagu MP3 Kustom"
          sub="Gunakan lagu kenangan pribadi bersama pasangan"
        />
        <div
          onClick={() => audioFileRef.current?.click()}
          className="p-6 rounded-2xl border-2 border-dashed border-outline-variant/70 hover:border-primary hover:bg-primary-container/15 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
            <Ic.Upload s={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">Klik untuk pilih file audio MP3</p>
            <p className="text-[10px] text-on-surface-variant">Format .mp3, .wav • Maksimal ukuran 15 MB</p>
          </div>
        </div>
        <input ref={audioFileRef} type="file" accept="audio/*" className="hidden" onChange={handleUploadAudio} />
      </Card>

      {/* Katalog Lagu Populer */}
      <Card>
        <SectionHead
          title="Katalog Pilihan Lagu Pernikahan Populer"
          sub="Klik salah satu judul lagu untuk langsung menggunakannya"
        />
        <div className="divide-y divide-outline-variant/30">
          {SONG_CATALOG.map((song, idx) => {
            const isCurrent = data.musicTitle.includes(song.title);
            return (
              <div
                key={idx}
                onClick={() => handleSelectSong(song)}
                className={`py-3 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-primary-container/40 text-primary font-bold'
                    : 'hover:bg-surface-container text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-xs flex-shrink-0">
                    <Ic.Musik s={14} />
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-bold font-display truncate">{song.title}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-on-surface-variant font-mono">{song.duration}</span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                      Aktif
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
