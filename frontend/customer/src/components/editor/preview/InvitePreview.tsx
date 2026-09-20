import React from 'react';
import { EventData, MediaData } from '../../../types';
import { Ic } from '../../common/Icons';
import { formatDate, formatTime } from '../../common/UIComponents';

interface InvitePreviewProps {
  event: EventData;
  media: MediaData;
}

export function InvitePreview({ event, media }: InvitePreviewProps) {
  return (
    <div
      className="flex flex-col h-full bg-white font-body overflow-y-auto text-[#1B1B1F]"
      style={{ fontSize: '11px' }}
    >
      {/* Cover */}
      <div className="relative h-48 flex-shrink-0 bg-surface-container-high overflow-hidden">
        {media.heroUrl && (
          <img src={media.heroUrl} alt="Cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-center">
          <p className="text-[9px] opacity-80 mb-0.5 tracking-[2px] uppercase">The Wedding of</p>
          <p className="text-lg font-extrabold font-display leading-tight">
            {event.groomNick || 'Reza'} <span className="text-xs opacity-70">&</span> {event.brideNick || 'Hana'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Quote */}
        {event.quote && (
          <div className="text-center p-3 bg-primary-container/30 rounded-2xl">
            <p className="text-[9px] italic leading-relaxed text-on-primary-container/80 line-clamp-3">
              {event.quote}
            </p>
          </div>
        )}

        {/* Names */}
        <div className="text-center space-y-2">
          <p className="text-[8px] text-on-surface-variant uppercase tracking-widest">Mempelai Pria</p>
          <p className="font-bold text-sm font-display text-primary">{event.groomNick || 'Reza'}</p>
          <p className="text-[9px] text-on-surface-variant">{event.groomFull}</p>
          <p className="text-[8px] text-on-surface-variant/70">{event.groomParents}</p>

          <div className="my-2 flex items-center gap-2">
            <div className="flex-1 h-px bg-outline-variant/50" />
            <Ic.Heart s={10} cls="text-primary" />
            <div className="flex-1 h-px bg-outline-variant/50" />
          </div>

          <p className="text-[8px] text-on-surface-variant uppercase tracking-widest">Mempelai Wanita</p>
          <p className="font-bold text-sm font-display text-primary">{event.brideNick || 'Hana'}</p>
          <p className="text-[9px] text-on-surface-variant">{event.brideFull}</p>
          <p className="text-[8px] text-on-surface-variant/70">{event.brideParents}</p>
        </div>

        {/* Akad */}
        <div className="bg-surface-container rounded-2xl p-3 space-y-1">
          <p className="text-[8px] text-primary font-bold uppercase tracking-wider">Akad Nikah</p>
          <p className="font-semibold text-[10px] text-on-surface">{formatDate(event.akadDate)}</p>
          <p className="text-[9px] text-on-surface-variant">{formatTime(event.akadTime)}</p>
        </div>

        {/* Resepsi */}
        <div className="bg-surface-container rounded-2xl p-3 space-y-1">
          <p className="text-[8px] text-secondary font-bold uppercase tracking-wider">Resepsi</p>
          <p className="font-semibold text-[10px] text-on-surface">{formatDate(event.resepsiDate)}</p>
          <p className="text-[9px] text-on-surface-variant">{formatTime(event.resepsiTime)}</p>
        </div>

        {/* Venue */}
        <div className="flex items-start gap-2">
          <Ic.Location s={12} cls="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-[10px]">{event.venue || 'Lokasi Acara'}</p>
            <p className="text-[9px] text-on-surface-variant leading-relaxed">{event.address}</p>
          </div>
        </div>

        {/* Blessing */}
        {event.blessing && (
          <div className="text-center pt-2 pb-4">
            <p className="text-[9px] text-on-surface-variant italic leading-relaxed">{event.blessing}</p>
          </div>
        )}

        {/* RSVP button */}
        <button
          type="button"
          className="w-full py-2.5 rounded-full bg-primary text-on-primary text-[10px] font-bold tracking-wide shadow hover:opacity-90"
        >
          Konfirmasi Kehadiran
        </button>
      </div>
    </div>
  );
}
