import React from 'react';
import {
  EventData,
  MediaData,
  GuestData,
  LoveStoryMilestone,
  StreamingConfig,
  SocialConfig,
  GreetingItem,
} from '../../../types';
import { Ic } from '../../common/Icons';
import { formatDate, formatTime } from '../../common/UIComponents';

interface InvitePreviewProps {
  event: EventData;
  media: MediaData;
  guests?: GuestData;
  loveStory?: LoveStoryMilestone[];
  streaming?: StreamingConfig;
  social?: SocialConfig;
  greetingsList?: GreetingItem[];
}

export function InvitePreview({
  event,
  media,
  guests,
  loveStory,
  streaming,
  social,
  greetingsList,
}: InvitePreviewProps) {
  return (
    <div
      className="flex flex-col h-full bg-white font-body overflow-y-auto text-[#1B1B1F] scroll-smooth"
      style={{ fontSize: '11px' }}
    >
      {/* ── Cover Hero ─────────────────────────────────────────────── */}
      <div className="relative h-52 flex-shrink-0 bg-surface-container-high overflow-hidden">
        {media.heroUrl && (
          <img src={media.heroUrl} alt="Cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

        {/* Floating Music Disc */}
        {media.musicTitle && (
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[9px]">
            <span className={media.musicPlaying ? 'animate-spin' : ''}>
              <Ic.Musik s={11} />
            </span>
            <span className="max-w-[100px] truncate">{media.musicTitle}</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-center">
          <p className="text-[8px] opacity-80 mb-0.5 tracking-[2.5px] uppercase font-semibold">The Wedding of</p>
          <h2 className="text-xl font-extrabold font-display leading-tight tracking-tight">
            {event.groomNick || 'Mempelai Pria'} <span className="text-xs opacity-70">&</span> {event.brideNick || 'Mempelai Wanita'}
          </h2>
          <p className="text-[9px] opacity-90 mt-0.5">
            {event.akadDate || event.resepsiDate
              ? formatDate(event.akadDate || event.resepsiDate)
              : 'Tanggal Acara Belum Diatur'}
          </p>
        </div>
      </div>

      {/* ── Body Container ─────────────────────────────────────────── */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Quote / Ayat Suci */}
        {event.quote && (
          <div className="text-center p-3.5 bg-primary-container/25 rounded-2xl border border-primary/15">
            <p className="text-[9px] italic leading-relaxed text-on-primary-container/85">
              {event.quote}
            </p>
          </div>
        )}

        {/* Profile Mempelai Pria & Wanita */}
        <div className="text-center space-y-2.5">
          {/* Pria */}
          <div>
            {event.groomPhoto && (
              <img
                src={event.groomPhoto}
                alt="Groom"
                className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-primary/30 mb-1 shadow-xs"
              />
            )}
            <p className="text-[7px] text-on-surface-variant uppercase tracking-widest font-bold">Mempelai Pria</p>
            <p className="font-bold text-sm font-display text-primary">{event.groomNick || 'Mempelai Pria'}</p>
            <p className="text-[9px] text-on-surface-variant">{event.groomFull || 'Nama Lengkap Pria'}</p>
            <p className="text-[8px] text-on-surface-variant/70">{event.groomParents || 'Putra Bpk. & Ibu Mempelai'}</p>
            {event.groomInstagram && (
              <span className="inline-block mt-0.5 text-[8px] text-primary font-medium">
                @{event.groomInstagram.replace('@', '')}
              </span>
            )}
          </div>

          <div className="my-2 flex items-center gap-2">
            <div className="flex-1 h-px bg-outline-variant/40" />
            <Ic.Heart s={11} cls="text-primary" />
            <div className="flex-1 h-px bg-outline-variant/40" />
          </div>

          {/* Wanita */}
          <div>
            {event.bridePhoto && (
              <img
                src={event.bridePhoto}
                alt="Bride"
                className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-primary/30 mb-1 shadow-xs"
              />
            )}
            <p className="text-[7px] text-on-surface-variant uppercase tracking-widest font-bold">Mempelai Wanita</p>
            <p className="font-bold text-sm font-display text-primary">{event.brideNick || 'Mempelai Wanita'}</p>
            <p className="text-[9px] text-on-surface-variant">{event.brideFull || 'Nama Lengkap Wanita'}</p>
            <p className="text-[8px] text-on-surface-variant/70">{event.brideParents || 'Putri Bpk. & Ibu Mempelai'}</p>
            {event.brideInstagram && (
              <span className="inline-block mt-0.5 text-[8px] text-primary font-medium">
                @{event.brideInstagram.replace('@', '')}
              </span>
            )}
          </div>
        </div>

        {/* Jadwal Akad & Resepsi */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface-container rounded-2xl p-2.5 space-y-0.5 text-center">
            <p className="text-[7px] text-primary font-bold uppercase tracking-wider">Akad Nikah</p>
            <p className="font-bold text-[9px] text-on-surface">
              {event.akadDate ? formatDate(event.akadDate) : 'Belum diatur'}
            </p>
            <p className="text-[8px] text-on-surface-variant">{event.akadTime ? formatTime(event.akadTime) : '-'}</p>
          </div>

          <div className="bg-surface-container rounded-2xl p-2.5 space-y-0.5 text-center">
            <p className="text-[7px] text-secondary font-bold uppercase tracking-wider">Resepsi</p>
            <p className="font-bold text-[9px] text-on-surface">
              {event.resepsiDate ? formatDate(event.resepsiDate) : 'Belum diatur'}
            </p>
            <p className="text-[8px] text-on-surface-variant">{event.resepsiTime ? formatTime(event.resepsiTime) : '-'}</p>
          </div>
        </div>

        {/* Lokasi & Venue */}
        <div className="flex items-start gap-2 p-2.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
          <Ic.Location s={14} cls="text-primary mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-[9px]">{event.venue || 'Nama Gedung / Tempat Acara'}</p>
            <p className="text-[8px] text-on-surface-variant leading-tight mt-0.5">
              {event.address || 'Alamat lokasi pernikahan'}
            </p>
          </div>
        </div>

        {/* Live Streaming Banner */}
        {streaming?.enabled && (
          <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-center space-y-1.5">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[8px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE STREAMING
            </div>
            <p className="text-[9px] font-bold text-red-950">Siaran Langsung Acara Pernikahan</p>
            <p className="text-[8px] text-red-700 font-mono">
              {streaming.scheduleDate} • {streaming.scheduleTime}
            </p>
            <button
              type="button"
              className="w-full py-1.5 rounded-full bg-red-600 text-white text-[8px] font-bold shadow-xs hover:bg-red-700 transition-colors"
            >
              Tonton Siaran Langsung
            </button>
          </div>
        )}

        {/* Linimasa Kisah Cinta (Love Story) */}
        {loveStory && loveStory.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-outline-variant/30">
            <p className="text-center text-[8px] font-bold uppercase tracking-widest text-primary">
              Kisah Cinta Berdua
            </p>
            <div className="space-y-2">
              {loveStory.map((ls) => (
                <div key={ls.id} className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/25">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-[9px] text-on-surface">{ls.title}</p>
                    <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary-container">
                      {ls.year}
                    </span>
                  </div>
                  <p className="text-[8px] text-on-surface-variant leading-relaxed line-clamp-2">{ls.story}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Galeri Preview Grid */}
        {media.gallery && media.gallery.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-outline-variant/30">
            <p className="text-center text-[8px] font-bold uppercase tracking-widest text-primary">
              Galeri Kenangan
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {media.gallery.slice(0, 4).map((g) => (
                <img
                  key={g.id}
                  src={g.url}
                  alt={g.caption}
                  className="w-full h-16 object-cover rounded-xl shadow-2xs"
                />
              ))}
            </div>
          </div>
        )}

        {/* Instagram Story Filter & Hashtag */}
        {social?.hashtag && (
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200 text-center space-y-1">
            <p className="text-[8px] font-bold text-pink-700">Abadikan Momen di Instagram Story</p>
            <p className="text-[10px] font-black text-pink-900 font-display">{social.hashtag}</p>
          </div>
        )}

        {/* Amplop Digital / Kado */}
        {guests?.bankName && (
          <div className="p-3 bg-surface-container rounded-2xl border border-outline-variant/30 text-center space-y-1">
            <p className="text-[8px] font-bold text-primary uppercase tracking-wider">Tanda Kasih / Kado</p>
            <p className="text-[9px] font-bold">{guests.bankName}</p>
            <p className="text-[9px] font-mono tracking-wider font-semibold">{guests.accountNo}</p>
            <p className="text-[8px] text-on-surface-variant">a.n. {guests.accountHolder}</p>
          </div>
        )}

        {/* Doa & Ucapan Tamu */}
        {greetingsList && greetingsList.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-outline-variant/30">
            <p className="text-center text-[8px] font-bold uppercase tracking-widest text-primary">
              Doa & Ucapan Tamu
            </p>
            <div className="space-y-1.5">
              {greetingsList.slice(0, 2).map((gr) => (
                <div key={gr.id} className="p-2 bg-surface-container-low rounded-xl text-[8px] space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-on-surface">
                    <span>{gr.name}</span>
                    <span className="text-[7px] text-on-surface-variant">{gr.createdAt}</span>
                  </div>
                  <p className="text-on-surface-variant line-clamp-2">{gr.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tombol Konfirmasi RSVP */}
        <button
          type="button"
          className="w-full py-2.5 rounded-full bg-primary text-on-primary text-[10px] font-bold tracking-wide shadow hover:opacity-90 active:scale-98 transition-all"
        >
          Konfirmasi Kehadiran (RSVP)
        </button>
      </div>
    </div>
  );
}
