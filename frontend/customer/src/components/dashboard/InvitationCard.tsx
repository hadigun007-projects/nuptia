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

  const cycleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cycle: Status[] = ['Draft', 'Published', 'Live'];
    const next = cycle[(cycle.indexOf(status) + 1) % cycle.length];
    onChangeStatus(invitation.id, next);
  };

  return (
    <div
      onClick={() => onEdit(invitation.id)}
      className="group relative flex flex-col bg-white rounded-[32px] overflow-hidden border border-neutral-200/80 hover:border-neutral-300 transition-all duration-300 cursor-pointer shadow-none hover:shadow-xl select-none"
    >
      {/* Top Cover Image Area */}
      <div className="relative h-60 sm:h-64 w-full bg-neutral-100 overflow-hidden">
        <img
          src={media?.heroUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop&auto=format'}
          alt={invitation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      </div>

      {/* Bottom White Info Box with Rounded-t-[24px] overlapping photo */}
      <div className="relative -mt-6 bg-white rounded-t-[24px] rounded-b-[32px] p-5 space-y-2.5 z-10 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
        {/* Row 1: Date */}
        <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-neutral-800 font-semibold">
          <span className="text-[#9c177c] flex-shrink-0">
            <Ic.Calendar s={16} />
          </span>
          <span>{formatDate(event.akadDate || event.resepsiDate)}</span>
        </div>

        {/* Row 2: Location */}
        <div className="flex items-center gap-2.5 text-xs text-neutral-600 font-normal">
          <span className="text-[#9c177c] flex-shrink-0">
            <Ic.Location s={16} />
          </span>
          <span className="truncate pr-4">{event.venue} — {event.address}</span>
        </div>

        {/* Row 3: Stats & Setting Button in bottom-right */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-2.5 text-[11px] sm:text-xs text-neutral-600">
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

          {/* Setting / Options Button in bottom-right corner */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Pengaturan Undangan"
            >
              <Ic.MoreVertical s={16} />
            </button>

            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-full mb-2 w-48 py-1.5 bg-white rounded-2xl border border-neutral-200 z-50 shadow-xl"
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onPreview(invitation);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                >
                  <Ic.Eye s={15} cls="text-[#9c177c]" />
                  <span>Lihat Preview</span>
                </button>

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
                  onClick={(e) => {
                    setMenuOpen(false);
                    cycleStatus(e);
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


