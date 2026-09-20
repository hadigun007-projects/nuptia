import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Tab,
  Device,
  Status,
  EventData,
  MediaData,
  GuestData,
  LoveStoryMilestone,
  StreamingConfig,
  SocialConfig,
  GuestBookEntry,
  GreetingItem,
  InvitationSettings,
  ThemeConfig,
} from '../types';
import { useInvitations } from '../hooks/useInvitations';
import { EditorTopBar } from '../components/editor/EditorTopBar';
import { EditorSidebar } from '../components/editor/EditorSidebar';
import { BottomNav15 } from '../components/editor/BottomNav15';
import { PreviewPanel } from '../components/editor/preview/PreviewPanel';
import { StepNavigationFooter } from '../components/editor/StepNavigationFooter';
import { Ic } from '../components/common/Icons';

// 15 Form Tabs
import { PengantinTab } from '../components/editor/tabs/PengantinTab';
import { TemaTab } from '../components/editor/tabs/TemaTab';
import { AcaraTab } from '../components/editor/tabs/AcaraTab';
import { GaleriTab } from '../components/editor/tabs/GaleriTab';
import { MusikTab } from '../components/editor/tabs/MusikTab';
import { UcapanTab } from '../components/editor/tabs/UcapanTab';
import { KadoTab } from '../components/editor/tabs/KadoTab';
import { RSVPTab } from '../components/editor/tabs/RSVPTab';
import { StreamingTab } from '../components/editor/tabs/StreamingTab';
import { KisahCintaTab } from '../components/editor/tabs/KisahCintaTab';
import { StoryIGTab } from '../components/editor/tabs/StoryIGTab';
import { QuoteTab } from '../components/editor/tabs/QuoteTab';
import { SettingTab } from '../components/editor/tabs/SettingTab';
import { BukuTamuTab } from '../components/editor/tabs/BukuTamuTab';
import { KirimTab } from '../components/editor/tabs/KirimTab';

interface EditorViewProps {
  invitationId: string;
  isNew?: boolean;
  initialTimelineMode?: boolean;
  onBackToDashboard: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onNavigateToLogin?: () => void;
}

export function EditorView({
  invitationId,
  isNew = false,
  initialTimelineMode = false,
  onBackToDashboard,
  showToast,
  onNavigateToLogin,
}: EditorViewProps) {
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
          className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-bold transition-all"
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
      isNew={isNew}
      initialTimelineMode={initialTimelineMode}
      onUpdate={(updates) => updateInvitation(invitation.id, updates)}
      onBackToDashboard={onBackToDashboard}
      showToast={showToast}
      onNavigateToLogin={onNavigateToLogin}
    />
  );
}

function EditorViewInner({
  invitation,
  isNew = false,
  initialTimelineMode = false,
  onUpdate,
  onBackToDashboard,
  showToast,
  onNavigateToLogin,
}: {
  invitation: NonNullable<ReturnType<ReturnType<typeof useInvitations>['getInvitation']>>;
  isNew?: boolean;
  initialTimelineMode?: boolean;
  onUpdate: (updates: Partial<typeof invitation>) => void;
  onBackToDashboard: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onNavigateToLogin?: () => void;
}) {
  const [tab, setTab] = useState<Tab>('pengantin');
  const [device, setDevice] = useState<Device>('mobile');
  const [status, setStatus] = useState<Status>(invitation.status);
  const [showPreview, setShowPreview] = useState(true);
  const [autoSaving, setAutoSaving] = useState(false);

  // 15 Modules State
  const [event, setEvent] = useState<EventData>(invitation.event);
  const [media, setMedia] = useState<MediaData>(invitation.media);
  const [guests, setGuests] = useState<GuestData>(invitation.guests);
  const [slug, setSlug] = useState<string>(invitation.slug);
  const [loveStory, setLoveStory] = useState<LoveStoryMilestone[]>(invitation.loveStory || []);
  const [streaming, setStreaming] = useState<StreamingConfig>(
    invitation.streaming || {
      enabled: false,
      platform: 'youtube',
      url: '',
      scheduleDate: invitation.event.akadDate || '',
      scheduleTime: '08:00 WIB',
    }
  );
  const [social, setSocial] = useState<SocialConfig>(
    invitation.social || {
      igFilterUrl: '',
      hashtag: `#${invitation.event.groomNick}${invitation.event.brideNick}Menikah`,
      igGroom: '',
      igBride: '',
    }
  );
  const [guestBook, setGuestBook] = useState<GuestBookEntry[]>(invitation.guestBook || []);
  const [greetingsList, setGreetingsList] = useState<GreetingItem[]>(invitation.greetingsList || []);
  const [settings, setSettings] = useState<InvitationSettings>(
    invitation.settings || {
      customSlug: invitation.slug,
      isPrivate: false,
      password: '',
      searchEngineIndex: true,
      musicAutoplay: true,
    }
  );
  const [theme, setTheme] = useState<ThemeConfig>(
    invitation.theme || {
      templateId: invitation.templateId,
      templateName: invitation.templateName,
      primaryColor: '#A3158A',
      fontStyle: 'Nunito & Inter',
    }
  );

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isFirstMount = useRef(true);

  // Auto-save debounced when data changes
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
        slug,
        event,
        media,
        guests,
        loveStory,
        streaming,
        social,
        guestBook,
        greetingsList,
        settings,
        theme,
      });
      setAutoSaving(false);
    }, 1000);

    return () => clearTimeout(autoSaveTimer.current);
  }, [
    event,
    media,
    guests,
    status,
    slug,
    loveStory,
    streaming,
    social,
    guestBook,
    greetingsList,
    settings,
    theme,
    onUpdate,
  ]);

  const handleManualSave = useCallback(() => {
    setAutoSaving(true);
    onUpdate({
      title: `${event.groomNick || 'Pria'} & ${event.brideNick || 'Wanita'}`,
      status,
      slug,
      event,
      media,
      guests,
      loveStory,
      streaming,
      social,
      guestBook,
      greetingsList,
      settings,
      theme,
    });
    setTimeout(() => {
      setAutoSaving(false);
      showToast(`Undangan "${event.groomNick} & ${event.brideNick}" berhasil disimpan!`, 'success');
    }, 600);
  }, [
    event,
    status,
    slug,
    media,
    guests,
    loveStory,
    streaming,
    social,
    guestBook,
    greetingsList,
    settings,
    theme,
    onUpdate,
    showToast,
  ]);

  const cycleStatus = useCallback(() => {
    const cycle: Status[] = ['Draft', 'Published', 'Live'];
    const next = cycle[(cycle.indexOf(status) + 1) % cycle.length];
    setStatus(next);
    onUpdate({ status: next });
    showToast(`Status undangan diubah ke ${next}`, next === 'Live' ? 'success' : 'info');
  }, [status, onUpdate, showToast]);

  // Normalize legacy tab names
  const activeNormalizedTab: Tab =
    tab === 'event' ? 'pengantin' : tab === 'media' ? 'galeri' : tab === 'guests' ? 'kado' : tab;

  const [timelineMode, setTimelineMode] = useState<boolean>(initialTimelineMode || isNew);
  const [visitedTabs, setVisitedTabs] = useState<Set<Tab>>(() => new Set([activeNormalizedTab]));

  useEffect(() => {
    setVisitedTabs((prev) => {
      if (prev.has(activeNormalizedTab)) return prev;
      const next = new Set(prev);
      next.add(activeNormalizedTab);
      return next;
    });
  }, [activeNormalizedTab]);

  const completedSteps = useMemo<Partial<Record<Tab, boolean>>>(() => {
    return {
      pengantin: Boolean(event.groomNick?.trim() && event.brideNick?.trim()),
      tema: Boolean(theme.templateId || invitation.templateId),
      acara: Boolean(event.venue?.trim() || event.akadDate?.trim() || event.resepsiDate?.trim()),
      quote: Boolean(event.quote?.trim()),
      galeri: Boolean(media.gallery && media.gallery.length > 0),
      musik: Boolean(media.musicTitle?.trim()),
      'kisah-cinta': Boolean(loveStory && loveStory.length > 0),
      rsvp: Boolean(guests.rsvpEnabled),
      kado: Boolean(guests.accountNo?.trim() || guests.ewalletNo?.trim()),
      streaming: Boolean(streaming.enabled && streaming.url?.trim()),
      'story-ig': Boolean(social.hashtag?.trim() || social.igFilterUrl?.trim()),
      'buku-tamu': Boolean(guestBook && guestBook.length > 0),
      ucapan: Boolean(guests.greetingsEnabled),
      setting: Boolean(settings.customSlug?.trim() || slug?.trim()),
      kirim: false,
    };
  }, [event, theme, media, loveStory, guests, streaming, social, guestBook, settings, slug, invitation.templateId]);

  return (
    <div className="flex flex-col h-screen bg-surface overflow-hidden">
      {/* Top Navbar */}
      <EditorTopBar
        title={invitation.title}
        status={status}
        autoSaving={autoSaving}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview((p) => !p)}
        onBackToDashboard={onBackToDashboard}
        onManualSave={handleManualSave}
        onChangeStatus={cycleStatus}
        onNavigateToLogin={onNavigateToLogin}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Hierarchical 15-menu Sidebar / Timeline Stepper for Desktop */}
        <EditorSidebar
          activeTab={activeNormalizedTab}
          onSelectTab={setTab}
          isTimelineMode={timelineMode}
          onToggleMode={() => setTimelineMode((m) => !m)}
          completedSteps={completedSteps}
          visitedTabs={visitedTabs}
        />

        {/* Main Editor Work Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="flex min-h-full">
            {/* Form Area */}
            <div className={`flex-1 p-4 pb-24 lg:pb-8 ${showPreview ? 'lg:max-w-[calc(100%-360px)]' : ''}`}>
              <div className="max-w-2xl mx-auto">
                {/* 1. Pengantin */}
                {activeNormalizedTab === 'pengantin' && (
                  <PengantinTab data={event} onChange={setEvent} showToast={showToast} />
                )}

                {/* 2. Tema */}
                {activeNormalizedTab === 'tema' && (
                  <TemaTab theme={theme} onChange={setTheme} showToast={showToast} />
                )}

                {/* 3. Acara */}
                {activeNormalizedTab === 'acara' && (
                  <AcaraTab data={event} onChange={setEvent} showToast={showToast} />
                )}

                {/* 4. Galeri */}
                {activeNormalizedTab === 'galeri' && (
                  <GaleriTab data={media} onChange={setMedia} showToast={showToast} />
                )}

                {/* 5. Musik */}
                {activeNormalizedTab === 'musik' && (
                  <MusikTab data={media} onChange={setMedia} showToast={showToast} />
                )}

                {/* 6. Ucapan */}
                {activeNormalizedTab === 'ucapan' && (
                  <UcapanTab
                    enabled={guests.greetingsEnabled}
                    greetings={greetingsList}
                    onToggleEnabled={(v) => setGuests({ ...guests, greetingsEnabled: v })}
                    onChangeGreetings={setGreetingsList}
                    showToast={showToast}
                  />
                )}

                {/* 7. Kado */}
                {activeNormalizedTab === 'kado' && (
                  <KadoTab data={guests} onChange={setGuests} showToast={showToast} />
                )}

                {/* 8. RSVP */}
                {activeNormalizedTab === 'rsvp' && (
                  <RSVPTab
                    data={guests}
                    stats={invitation.stats}
                    onChange={setGuests}
                    showToast={showToast}
                  />
                )}

                {/* 9. Streaming */}
                {activeNormalizedTab === 'streaming' && (
                  <StreamingTab data={streaming} onChange={setStreaming} showToast={showToast} />
                )}

                {/* 10. Kisah Cinta */}
                {activeNormalizedTab === 'kisah-cinta' && (
                  <KisahCintaTab milestones={loveStory} onChange={setLoveStory} showToast={showToast} />
                )}

                {/* 11. Story IG */}
                {activeNormalizedTab === 'story-ig' && (
                  <StoryIGTab data={social} onChange={setSocial} showToast={showToast} />
                )}

                {/* 12. Quote */}
                {activeNormalizedTab === 'quote' && (
                  <QuoteTab
                    quote={event.quote}
                    blessing={event.blessing}
                    onChangeQuote={(q) => setEvent({ ...event, quote: q })}
                    onChangeBlessing={(b) => setEvent({ ...event, blessing: b })}
                    showToast={showToast}
                  />
                )}

                {/* 13. Setting */}
                {activeNormalizedTab === 'setting' && (
                  <SettingTab
                    slug={slug}
                    status={status}
                    settings={settings}
                    onChangeSlug={setSlug}
                    onChangeStatus={setStatus}
                    onChangeSettings={setSettings}
                    showToast={showToast}
                  />
                )}

                {/* 14. Buku Tamu */}
                {activeNormalizedTab === 'buku-tamu' && (
                  <BukuTamuTab entries={guestBook} onChange={setGuestBook} showToast={showToast} />
                )}

                {/* 15. Kirim */}
                {activeNormalizedTab === 'kirim' && (
                  <KirimTab
                    title={invitation.title}
                    slug={slug}
                    groomNick={event.groomNick}
                    brideNick={event.brideNick}
                    showToast={showToast}
                  />
                )}

                {/* Step Navigation Footer for sequential timeline flow */}
                <StepNavigationFooter
                  currentTab={activeNormalizedTab}
                  onNavigateTab={setTab}
                  onCompleteCreation={() => {
                    showToast('Seluruh tahapan undangan telah selesai ditinjau!', 'success');
                    setShowPreview(true);
                  }}
                />
              </div>
            </div>

            {/* Live Preview Panel for Desktop */}
            {showPreview && (
              <aside className="hidden lg:block w-[360px] flex-shrink-0 overflow-y-auto bg-surface">
                <PreviewPanel
                  event={event}
                  media={media}
                  guests={guests}
                  loveStory={loveStory}
                  streaming={streaming}
                  social={social}
                  greetingsList={greetingsList}
                  device={device}
                  onDeviceChange={setDevice}
                />
              </aside>
            )}
          </div>
        </main>
      </div>

      {/* Bottom Nav for Mobile */}
      <BottomNav15
        activeTab={activeNormalizedTab}
        onSelectTab={setTab}
      />
    </div>
  );
}
