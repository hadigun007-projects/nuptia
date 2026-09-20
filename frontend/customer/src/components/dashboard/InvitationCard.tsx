import React, { useState, useRef, useEffect } from 'react';
import { Invitation, Status } from '../../types';
import { Ic } from '../common/Icons';
import { STATUS_STYLES, formatDate } from '../common/UIComponents';

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
  const statusMeta = STATUS_STYLES[status] || STATUS_STYLES.Draft;

  const cycleStatus = () => {
    const cycle: Status[] = ['Draft', 'Published', 'Live'];
    const next = cycle[(cycle.indexOf(status) + 1) % cycle.length];
    onChangeStatus(invitation.id, next);
  };

  return (
    <div className="group flex flex-col bg-surface-container-lowest rounded-[24px] border border-outline-variant/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Card Cover Header */}
      <div className="relative h-44 sm:h-48 w-full bg-surface-container overflow-hidden">
        <img
          src={media?.heroUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop'}
          alt={invitation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Status Badge & Template Chip */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <button
              onClick={cycleStatus}
              title="Klik untuk ubah status"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 ${statusMeta.badge}`}
            >
              {status === 'Live' && <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />}
              {status}
            </button>
          </div>

          <div className="pointer-events-auto">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/40 backdrop-blur-md text-white border border-white/20">
              {invitation.templateName || 'Modern Template'}
            </span>
          </div>
        </div>

        {/* Couple Names on Image */}
        <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
          <h2 className="text-xl sm:text-2xl font-extrabold font-display leading-tight drop-shadow-sm">
            {invitation.title}
          </h2>
          <p className="text-xs text-white/90 truncate mt-0.5">
            {event.groomNick} & {event.brideNick} • {event.venue || 'Venue Acara'}
          </p>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Date & Location */}
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
            <span className="text-primary flex-shrink-0">
              <Ic.Calendar s={15} />
            </span>
            <span className="truncate">{formatDate(event.akadDate || event.resepsiDate)}</span>
          </div>

          <div className="flex items-start gap-2 text-xs text-on-surface-variant">
            <span className="text-primary flex-shrink-0 mt-0.5">
              <Ic.Location s={15} />
            </span>
            <span className="line-clamp-1">{event.venue} — {event.address}</span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex items-center gap-3 border-t border-outline-variant/30 text-[11px] text-on-surface-variant">
            <div className="flex items-center gap-1">
              <Ic.Eye s={13} cls="text-primary" />
              <span>{stats?.views || 0} Dilihat</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Ic.People s={13} cls="text-secondary" />
              <span>{stats?.rsvpAttending || 0} RSVP</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Ic.Heart s={12} cls="text-primary" />
              <span>{stats?.greetingsCount || 0} Doa</span>
            </div>
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="pt-3 border-t border-outline-variant/30 flex items-center gap-2">
          {/* Primary Edit Button */}
          <button
            onClick={() => onEdit(invitation.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-bold shadow-xs hover:shadow-md hover:bg-primary/95 active:scale-98 transition-all duration-200"
          >
            <Ic.Edit s={15} />
            <span>Edit Undangan</span>
          </button>

          {/* Secondary Preview Button */}
          <button
            onClick={() => onPreview(invitation)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-container text-on-surface text-xs sm:text-sm font-semibold border border-outline-variant/40 hover:bg-surface-container-high active:scale-98 transition-all duration-200"
            title="Lihat Preview"
          >
            <Ic.Eye s={15} />
            <span className="hidden xs:inline">Preview</span>
          </button>

          {/* More actions dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/40 transition-colors"
              title="Aksi Lainnya"
            >
              <Ic.MoreVertical s={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-48 py-1.5 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 z-30 animate-fade-in-up">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onCopyLink(invitation);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container text-left transition-colors"
                >
                  <Ic.Copy s={15} cls="text-primary" />
                  <span>Salin Link Undangan</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    cycleStatus();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container text-left transition-colors"
                >
                  <Ic.Cloud s={15} cls="text-secondary" />
                  <span>Ganti Status ({status})</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate(invitation.id);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container text-left transition-colors"
                >
                  <Ic.Plus s={15} cls="text-tertiary" />
                  <span>Duplikat Undangan</span>
                </button>

                <div className="my-1 border-t border-outline-variant/30" />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (window.confirm(`Yakin ingin menghapus undangan "${invitation.title}"?`)) {
                      onDelete(invitation.id);
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-error hover:bg-error-container/40 text-left transition-colors"
                >
                  <Ic.Trash s={15} cls="text-error" />
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
