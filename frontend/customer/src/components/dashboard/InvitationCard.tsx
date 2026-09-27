import React, { useState, useRef, useEffect } from 'react';
import { Invitation, Status } from '../../types';
import { Ic } from '../common/Icons';
import { formatDate } from '../common/UIComponents';

interface InvitationCardProps {
  invitation: Invitation;
  onEdit: (id: string) => void;
  onPreview: (invitation: Invitation) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: Status) => void;
  onCopyLink: (invitation: Invitation) => void;
}

export function InvitationCard({
  invitation,
  onEdit,
  onPreview,
  onDuplicate,
  onDelete,
  onChangeStatus,
  onCopyLink,
}: InvitationCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const { event, media, stats, status } = invitation;

  const cycleStatus = () => {
    const cycle: Status[] = ['Draft', 'Published', 'Live'];
    const next = cycle[(cycle.indexOf(status) + 1) % cycle.length];
    onChangeStatus(invitation.id, next);
  };

  return (
    <div className="group flex flex-col bg-white rounded-3xl border border-neutral-200/90 overflow-hidden transition-all duration-300 shadow-none">
      {/* Card Cover Header */}
      <div className="relative h-52 sm:h-56 w-full bg-neutral-100 overflow-hidden">
        <img
          src={media?.heroUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop&auto=format'}
          alt={invitation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        {/* Status Badge & Template Chip */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">
            {status === 'Live' && (
              <button
                onClick={cycleStatus}
                title="Klik untuk ubah status"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fae8f3] text-[#9c177c] transition-all hover:scale-105 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#9c177c]" />
                <span>Live</span>
              </button>
            )}
            {status === 'Published' && (
              <button
                onClick={cycleStatus}
                title="Klik untuk ubah status"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fef3c7] text-[#92400e] transition-all hover:scale-105 cursor-pointer"
              >
                <span>Published</span>
              </button>
            )}
            {status === 'Draft' && (
              <button
                onClick={cycleStatus}
                title="Klik untuk ubah status"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#f3f4f6]/95 text-[#4b5563] transition-all hover:scale-105 cursor-pointer"
              >
                <span>Draft</span>
              </button>
            )}
          </div>

          <div className="pointer-events-auto">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/40 backdrop-blur-md text-white/95 border border-white/10">
              {invitation.templateName || 'Modern Template'}
            </span>
          </div>
        </div>

        {/* Couple Names on Image */}
        <div className="absolute bottom-3.5 left-4 right-4 text-white">
          <h2 className="text-2xl font-bold font-display leading-tight tracking-tight text-white drop-shadow-sm">
            {invitation.title}
          </h2>
          <p className="text-xs text-white/80 font-normal truncate mt-1">
            {invitation.title} • {event.venue || 'Venue Acara'}
          </p>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2">
          {/* Date */}
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-800 font-medium">
            <span className="text-[#9c177c] flex-shrink-0">
              <Ic.Calendar s={16} />
            </span>
            <span>{formatDate(event.akadDate || event.resepsiDate)}</span>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600">
            <span className="text-[#9c177c] flex-shrink-0 mt-0.5">
              <Ic.Location s={16} />
            </span>
            <span className="truncate">{event.venue} — {event.address}</span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 pt-1">
            <div className="flex items-center gap-1.5">
              <Ic.Eye s={14} cls="text-[#9c177c]" />
              <span>{stats?.views || 0} Dilihat</span>
            </div>
            <span className="text-neutral-400">•</span>
            <div className="flex items-center gap-1.5">
              <Ic.People s={14} cls="text-neutral-700" />
              <span>{stats?.rsvpAttending || 0} RSVP</span>
            </div>
            <span className="text-neutral-400">•</span>
            <div className="flex items-center gap-1.5">
              <Ic.Heart s={13} cls="text-[#9c177c]" />
              <span>{stats?.greetingsCount || 0} Doa</span>
            </div>
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="pt-2 flex items-center gap-2">
          {/* Primary Edit Button */}
          <button
            onClick={() => onEdit(invitation.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#9c177c] hover:bg-[#851369] text-white text-xs sm:text-sm font-bold active:scale-[0.98] transition-all cursor-pointer"
          >
            <Ic.Edit s={15} />
            <span>Edit Undangan</span>
          </button>

          {/* Preview Button */}
          <button
            onClick={() => onPreview(invitation)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 active:scale-[0.98] transition-all flex-shrink-0 cursor-pointer"
            title="Lihat Preview"
          >
            <Ic.Eye s={16} />
          </button>

          {/* More actions dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 active:scale-[0.98] transition-all flex-shrink-0 cursor-pointer"
              title="Aksi Lainnya"
            >
              <Ic.MoreVertical s={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-48 py-1.5 bg-white rounded-2xl border border-neutral-200 z-30 shadow-lg">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onCopyLink(invitation);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                >
                  <Ic.Copy s={15} cls="text-[#9c177c]" />
                  <span>Salin Link Undangan</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    cycleStatus();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                >
                  <Ic.Cloud s={15} cls="text-[#9c177c]" />
                  <span>Ganti Status ({status})</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate(invitation.id);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                >
                  <Ic.Plus s={15} cls="text-[#9c177c]" />
                  <span>Duplikat Undangan</span>
                </button>

                <div className="my-1 border-t border-neutral-100" />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (window.confirm(`Yakin ingin menghapus undangan "${invitation.title}"?`)) {
                      onDelete(invitation.id);
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer"
                >
                  <Ic.Trash s={15} cls="text-red-600" />
                  <span>Hapus Undangan</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

