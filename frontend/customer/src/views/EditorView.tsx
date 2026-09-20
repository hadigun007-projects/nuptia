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
    <div className="min-h-screen bg-surface flex flex-col items-center w-full">
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

      <div className="w-full max-w-7xl flex-1 flex flex-col relative shadow-none">
        <div className="flex flex-1 items-start">
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
        <main className="flex-1 min-w-0">
          <div className="flex min-h-full items-start">
            {/* Form Area */}
            <div className={`flex-1 p-4 pb-24 lg:pb-8 ${showPreview ? 'lg:max-w-[calc(100%-360px)]' : ''}`}>
              <div className="max-w-2xl mx-auto space-y-12">
                {/* ═══════════════ KATEGORI 1: MEMPELAI & ACARA ═══════════════ */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/30">
                    <span className="w-8 h-8 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-extrabold text-sm font-display">
                      1
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold text-on-surface font-display">
                        Mempelai & Acara
                      </h2>
                      <p className="text-xs text-on-surface-variant">
                        Profil kedua mempelai, jadwal acara, streaming, quote, dan kisah cinta
                      </p>
                    </div>
                  </div>

                  {/* 1. Pengantin */}
                  <section id="section-pengantin" className="scroll-mt-24">
                    <PengantinTab data={event} onChange={setEvent} showToast={showToast} />
                  </section>

                  {/* 2. Acara */}
                  <section id="section-acara" className="scroll-mt-24">
                    <AcaraTab data={event} onChange={setEvent} showToast={showToast} />
                  </section>

                  {/* 3. Streaming */}
                  <section id="section-streaming" className="scroll-mt-24">
                    <StreamingTab data={streaming} onChange={setStreaming} showToast={showToast} />
                  </section>

                  {/* 4. Quote */}
                  <section id="section-quote" className="scroll-mt-24">
                    <QuoteTab
                      quote={event.quote}
                      blessing={event.blessing}
                      onChangeQuote={(q) => setEvent({ ...event, quote: q })}
                      onChangeBlessing={(b) => setEvent({ ...event, blessing: b })}
                      showToast={showToast}
                    />
                  </section>

                  {/* 5. Kisah Cinta */}
                  <section id="section-kisah-cinta" className="scroll-mt-24">
                    <KisahCintaTab milestones={loveStory} onChange={setLoveStory} showToast={showToast} />
                  </section>
                </div>

                {/* ═══════════════ KATEGORI 2: DESAIN & MEDIA ═══════════════ */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/30">
                    <span className="w-8 h-8 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-extrabold text-sm font-display">
                      2
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold text-on-surface font-display">
                        Desain & Media
                      </h2>
                      <p className="text-xs text-on-surface-variant">
                        Pilihan tema desain, galeri foto, musik pengiring, dan filter Instagram
                      </p>
                    </div>
                  </div>

                  {/* 6. Tema */}
                  <section id="section-tema" className="scroll-mt-24">
                    <TemaTab theme={theme} onChange={setTheme} showToast={showToast} />
                  </section>

                  {/* 7. Galeri */}
                  <section id="section-galeri" className="scroll-mt-24">
                    <GaleriTab data={media} onChange={setMedia} showToast={showToast} />
                  </section>

                  {/* 8. Musik */}
                  <section id="section-musik" className="scroll-mt-24">
                    <MusikTab data={media} onChange={setMedia} showToast={showToast} />
                  </section>

                  {/* 9. Story IG */}
                  <section id="section-story-ig" className="scroll-mt-24">
                    <StoryIGTab data={social} onChange={setSocial} showToast={showToast} />
                  </section>
                </div>

                {/* ═══════════════ KATEGORI 3: TAMU & INTERAKSI ═══════════════ */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/30">
                    <span className="w-8 h-8 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-extrabold text-sm font-display">
                      3
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold text-on-surface font-display">
                        Tamu & Interaksi
                      </h2>
                      <p className="text-xs text-on-surface-variant">
                        Konfirmasi kehadiran (RSVP), buku tamu, ucapan doa restu, dan amplop digital
                      </p>
                    </div>
                  </div>

                  {/* 10. RSVP */}
                  <section id="section-rsvp" className="scroll-mt-24">
                    <RSVPTab
                      data={guests}
                      stats={invitation.stats}
                      onChange={setGuests}
                      showToast={showToast}
                    />
                  </section>

                  {/* 11. Buku Tamu */}
                  <section id="section-buku-tamu" className="scroll-mt-24">
                    <BukuTamuTab entries={guestBook} onChange={setGuestBook} showToast={showToast} />
                  </section>

                  {/* 12. Ucapan */}
                  <section id="section-ucapan" className="scroll-mt-24">
                    <UcapanTab
                      enabled={guests.greetingsEnabled}
                      greetings={greetingsList}
                      onToggleEnabled={(v) => setGuests({ ...guests, greetingsEnabled: v })}
                      onChangeGreetings={setGreetingsList}
                      showToast={showToast}
                    />
                  </section>

                  {/* 13. Kado */}
                  <section id="section-kado" className="scroll-mt-24">
                    <KadoTab data={guests} onChange={setGuests} showToast={showToast} />
                  </section>
                </div>

                {/* ═══════════════ KATEGORI 4: DISTRIBUSI & PENGATURAN ═══════════════ */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/30">
                    <span className="w-8 h-8 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-extrabold text-sm font-display">
                      4
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold text-on-surface font-display">
                        Distribusi & Pengaturan
                      </h2>
                      <p className="text-xs text-on-surface-variant">
                        Konfigurasi tautan unik (slug), status publikasi, dan pembagian ke tamu
                      </p>
                    </div>
                  </div>

                  {/* 14. Setting */}
                  <section id="section-setting" className="scroll-mt-24">
                    <SettingTab
                      slug={slug}
                      status={status}
                      settings={settings}
                      onChangeSlug={setSlug}
                      onChangeStatus={setStatus}
                      onChangeSettings={setSettings}
                      showToast={showToast}
                    />
                  </section>

                  {/* 15. Kirim */}
                  <section id="section-kirim" className="scroll-mt-24">
                    <KirimTab
                      title={invitation.title}
                      slug={slug}
                      groomNick={event.groomNick}
                      brideNick={event.brideNick}
                      showToast={showToast}
                    />
                  </section>
                </div>

                {/* Final Completion Banner Card */}
                <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-primary-container via-surface-container to-secondary-container/40 border border-outline-variant/30 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center mx-auto shadow-sm">
                    <Ic.Sparkles s={22} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-on-surface font-display">
                      Semua Data Undangan Telah Terisi!
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto mt-1">
                      Perubahan tersimpan otomatis secara real-time. Undangan siap dibagikan ke para tamu istimewa Anda.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${window.location.origin}/#/${slug || invitation.id}`;
                        if (navigator.clipboard) navigator.clipboard.writeText(url);
                        showToast('Link undangan berhasil disalin!', 'success');
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold active:scale-95 transition-all cursor-pointer shadow-xs"
                    >
                      <Ic.Link s={16} />
                      <span>Salin Link Undangan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPreview(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                    >
                      <Ic.Eye s={16} />
                      <span>Lihat Pratinjau</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Panel for Desktop */}
            {showPreview && (
              <aside className="hidden lg:block w-[360px] flex-shrink-0 sticky top-[57px] max-h-[calc(100vh-57px)] overflow-y-auto bg-surface">
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
    </div>
  );
}
