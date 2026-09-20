import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tab, Device, Status, EventData, MediaData, GuestData } from '../types';
import { useInvitations } from '../hooks/useInvitations';
import { EditorTopBar } from '../components/editor/EditorTopBar';
import { NavigationRail, BottomNav } from '../components/editor/NavigationRail';
import { EventDetailsTab } from '../components/editor/tabs/EventDetailsTab';
import { MediaStudioTab } from '../components/editor/tabs/MediaStudioTab';
import { GuestManagementTab } from '../components/editor/tabs/GuestManagementTab';
import { PreviewPanel } from '../components/editor/preview/PreviewPanel';
import { Ic } from '../components/common/Icons';

interface EditorViewProps {
  invitationId: string;
  onBackToDashboard: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function EditorView({ invitationId, onBackToDashboard, showToast }: EditorViewProps) {
  const { getInvitation, updateInvitation } = useInvitations();
  const invitation = getInvitation(invitationId);

  // Fallback if invitation not found
  if (!invitation) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-error-container text-error flex items-center justify-center mb-4">
          <Ic.Close s={28} />
        </div>
        <h2 className="text-xl font-bold text-on-surface font-display">Undangan Tidak Ditemukan</h2>
        <p className="text-sm text-on-surface-variant max-w-sm mt-1">
          Undangan dengan ID <code className="text-primary font-mono text-xs">{invitationId}</code> tidak ditemukan atau telah dihapus.
        </p>
        <button
          onClick={onBackToDashboard}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-bold shadow hover:shadow-md transition-all"
        >
          <Ic.ArrowLeft s={16} />
          <span>Kembali ke Dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <EditorViewInner
      key={invitation.id}
      invitation={invitation}
      onUpdate={(updates) => updateInvitation(invitation.id, updates)}
      onBackToDashboard={onBackToDashboard}
      showToast={showToast}
    />
  );
}

function EditorViewInner({
  invitation,
  onUpdate,
  onBackToDashboard,
  showToast,
}: {
  invitation: NonNullable<ReturnType<ReturnType<typeof useInvitations>['getInvitation']>>;
  onUpdate: (updates: Partial<typeof invitation>) => void;
  onBackToDashboard: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}) {
  const [tab, setTab] = useState<Tab>('event');
  const [device, setDevice] = useState<Device>('mobile');
  const [status, setStatus] = useState<Status>(invitation.status);
  const [showPreview, setShowPreview] = useState(true);
  const [autoSaving, setAutoSaving] = useState(false);

  const [event, setEvent] = useState<EventData>(invitation.event);
  const [media, setMedia] = useState<MediaData>(invitation.media);
  const [guests, setGuests] = useState<GuestData>(invitation.guests);

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isFirstMount = useRef(true);

  // Auto-save debounced when event, media, guests, or status change
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    clearTimeout(autoSaveTimer.current);
    setAutoSaving(true);

    autoSaveTimer.current = setTimeout(() => {
      onUpdate({
        title: `${event.groomNick || 'Pria'} & ${event.brideNick || 'Wanita'}`,
        status,
        event,
        media,
        guests,
      });
      setAutoSaving(false);
    }, 1000);

    return () => clearTimeout(autoSaveTimer.current);
  }, [event, media, guests, status, onUpdate]);

  const handleManualSave = useCallback(() => {
    setAutoSaving(true);
    onUpdate({
      title: `${event.groomNick || 'Pria'} & ${event.brideNick || 'Wanita'}`,
      status,
      event,
      media,
      guests,
    });
    setTimeout(() => {
      setAutoSaving(false);
      showToast(`Undangan "${event.groomNick} & ${event.brideNick}" berhasil disimpan!`, 'success');
    }, 600);
  }, [event, status, media, guests, onUpdate, showToast]);

  const cycleStatus = useCallback(() => {
    const cycle: Status[] = ['Draft', 'Published', 'Live'];
    const next = cycle[(cycle.indexOf(status) + 1) % cycle.length];
    setStatus(next);
    onUpdate({ status: next });
    showToast(`Status undangan diubah ke ${next}`, next === 'Live' ? 'success' : 'info');
  }, [status, onUpdate, showToast]);

  return (
    <div className="flex flex-col h-screen bg-surface overflow-hidden">
      {/* Editor Top Bar */}
      <EditorTopBar
        title={`${event.groomNick || 'Mempelai'} & ${event.brideNick || 'Mempelai'}`}
        status={status}
        autoSaving={autoSaving}
        showPreview={showPreview}
        onBack={onBackToDashboard}
        onTogglePreview={() => setShowPreview((p) => !p)}
        onSave={handleManualSave}
        onChangeStatus={cycleStatus}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Rail for Desktop */}
        <NavigationRail active={tab} onChange={setTab} />

        {/* Main Editor Work Area */}
        <main className="flex-1 overflow-y-auto">
          <div className={`flex min-h-full ${showPreview ? 'lg:divide-x lg:divide-outline-variant/30' : ''}`}>
            {/* Form Area */}
            <div className={`flex-1 p-4 pb-24 lg:pb-6 ${showPreview ? 'lg:max-w-[calc(100%-340px)]' : ''}`}>
              <div className="max-w-2xl mx-auto">
                {tab === 'event' && <EventDetailsTab data={event} onChange={setEvent} />}
                {tab === 'media' && <MediaStudioTab data={media} onChange={setMedia} showToast={showToast} />}
                {tab === 'guests' && <GuestManagementTab data={guests} onChange={setGuests} showToast={showToast} />}
              </div>
            </div>

            {/* Preview Panel for Desktop */}
            {showPreview && (
              <aside className="hidden lg:block w-[340px] flex-shrink-0 overflow-y-auto bg-surface-container-low/60">
                <PreviewPanel
                  event={event}
                  media={media}
                  device={device}
                  onDeviceChange={setDevice}
                />
              </aside>
            )}
          </div>
        </main>
      </div>

      {/* Bottom Nav for Mobile */}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
