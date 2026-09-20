import React from 'react';

export const Ic = {
  /* ── 15 Reference Menu Icons ───────────────────────────────────── */
  // 1. Pengantin (Groom & Bride with heart)
  Pengantin: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      {/* Heart on top */}
      <path d="M12 4.2c-.8-1-2.2-1-2.9-.2-.7.8-.5 2 .4 2.8L12 9.2l2.5-2.4c.9-.8 1.1-2 .4-2.8-.7-.8-2.1-.8-2.9.2z" fill="currentColor" />
      {/* Groom (left) */}
      <circle cx="8" cy="11.5" r="2.2" />
      <path d="M5.5 21v-4.5a2.5 2.5 0 0 1 5 0V21" />
      <path d="M7 14.5l1 2 1-2" />
      {/* Bride (right) */}
      <circle cx="16" cy="11.5" r="2.2" />
      <path d="M13.5 21v-4a2.5 2.5 0 0 1 5 0V21" />
      <path d="M14.5 10.5c.5-1.5 2.5-1.5 3 0" />
      <path d="M15.2 16.5h1.6" />
    </svg>
  ),

  // 2. Tema (Canister with brushes & ruler)
  Tema: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      {/* Pot / Holder */}
      <path d="M6 13h12v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7z" />
      <path d="M5 13h14" />
      {/* Tools inside */}
      <path d="M8 13V5l2-2 2 2v8" />
      <path d="M9 5h1.5" />
      <path d="M14 13V6l2-2 2 2v7" />
      <path d="M15 6h1" />
      <path d="M11 13V8h2v5" />
    </svg>
  ),

  // 3. Acara (Calendar with heart on date)
  Acara: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="8" y1="2" x2="8" y2="5" />
      <line x1="16" y1="2" x2="16" y2="5" />
      {/* Heart inside calendar */}
      <path d="M12 13.8c-.5-.6-1.4-.6-1.8-.1-.4.5-.3 1.2.2 1.7L12 17l1.6-1.6c.5-.5.6-1.2.2-1.7-.4-.5-1.3-.5-1.8.1z" fill="currentColor" />
      <circle cx="7.5" cy="12.5" r=".7" fill="currentColor" />
      <circle cx="16.5" cy="12.5" r=".7" fill="currentColor" />
      <circle cx="7.5" cy="16.5" r=".7" fill="currentColor" />
      <circle cx="16.5" cy="16.5" r=".7" fill="currentColor" />
    </svg>
  ),

  // 4. Galeri (Double photo frame)
  Galeri: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <rect x="6" y="7" width="12" height="10" rx="1.5" />
      {/* Two people silhouette */}
      <circle cx="9.5" cy="10" r="1.3" />
      <circle cx="14.5" cy="10" r="1.3" />
      <path d="M7.5 15c.5-1.5 3.5-1.5 4 0" />
      <path d="M12.5 15c.5-1.5 3.5-1.5 4 0" />
    </svg>
  ),

  // 5. Musik (Notes with sparkle stars)
  Musik: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M9 18V7l9-2v11" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="15.5" cy="16" r="2.5" />
      <path d="M9 10l9-2" />
      {/* Sparkles */}
      <path d="M19 4l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z" fill="currentColor" />
      <path d="M4 8l.4.8.8.4-.8.4-.4.8-.4-.8-.8-.4.8-.4z" fill="currentColor" />
      <circle cx="19" cy="10" r=".8" fill="currentColor" />
    </svg>
  ),

  // 6. Ucapan (Speech bubble with 3 dots)
  Ucapan: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.5c4.7 0 8.5 3.8 8.5 8.5z" />
      <circle cx="8" cy="11.5" r="1.2" fill="currentColor" />
      <circle cx="12" cy="11.5" r="1.2" fill="currentColor" />
      <circle cx="16" cy="11.5" r="1.2" fill="currentColor" />
    </svg>
  ),

  // 7. Kado (Gift box with ribbon)
  Kado: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      {/* Box */}
      <rect x="4" y="9" width="16" height="12" rx="2" />
      <path d="M3 9h18" />
      <line x1="12" y1="9" x2="12" y2="21" />
      {/* Bow on top */}
      <path d="M12 9c-1.5-2-4-2.5-4-1s2 2.5 4 1z" />
      <path d="M12 9c1.5-2 4-2.5 4-1s-2 2.5-4 1z" />
    </svg>
  ),

  // 8. RSVP (Envelope card with heart)
  RSVP: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 9l9 6 9-6" />
      {/* Seal with heart */}
      <circle cx="12" cy="13" r="3.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 12c-.4-.5-1-.5-1.3-.1-.3.4-.2.9.2 1.3l1.1 1.1 1.1-1.1c.4-.4.5-.9.2-1.3-.3-.4-.9-.4-1.3.1z" fill="currentColor" />
    </svg>
  ),

  // 9. Streaming (Live monitor video broadcast)
  Streaming: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      {/* Monitor */}
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 18v3" />
      {/* Broadcast waves on top */}
      <path d="M9.5 4a3.5 3.5 0 0 1 5 0" />
      <path d="M11 5.5a1.5 1.5 0 0 1 2 0" />
      {/* Presenter inside */}
      <circle cx="12" cy="10.5" r="1.5" />
      <path d="M9.5 15c.5-1.5 4.5-1.5 5 0" />
    </svg>
  ),

  // 10. KisahCinta (Heart pierced with arrow)
  KisahCinta: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M12 20.2l-1.5-1.4C5.4 14.3 2 11.2 2 7.5 2 4.4 4.4 2 7.5 2c1.7 0 3.4.8 4.5 2.1C13.1 2.8 14.8 2 16.5 2 19.6 2 22 4.4 22 7.5c0 3.7-3.4 6.8-8.5 11.3L12 20.2z" />
      {/* Cupid's Arrow */}
      <line x1="3" y1="21" x2="21" y2="3" />
      <path d="M17 3h4v4" />
      <path d="M3 17v4h4" />
    </svg>
  ),

  // 11. StoryIG (Instagram Story camera with dashed ring)
  StoryIG: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      {/* Story ring */}
      <circle cx="12" cy="12" r="9" strokeDasharray="3 2" />
      {/* Camera inside */}
      <rect x="7" y="7.5" width="10" height="9" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="14.8" cy="9.8" r=".6" fill="currentColor" />
    </svg>
  ),

  // 12. Quote (Quotation marks in bubble)
  Quote: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      {/* Double quotes */}
      <path d="M8 8h2v3H8zm0 0c0-1.5 1-2 2-2" />
      <path d="M14 8h2v3h-2zm0 0c0-1.5 1-2 2-2" />
    </svg>
  ),

  // 13. Setting (Gear / cog)
  Setting: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),

  // 14. BukuTamu (Guestbook / address book)
  BukuTamu: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <rect x="5" y="3" width="16" height="18" rx="2" />
      {/* Spiral binder clips on left */}
      <path d="M3 6h4M3 10h4M3 14h4M3 18h4" />
      {/* Person profile on book */}
      <circle cx="13" cy="9.5" r="2" />
      <path d="M9.5 16c.5-2 5.5-2 6 0" />
    </svg>
  ),

  // 15. Kirim (Paper airplane with gold/yellow stroke)
  Kirim: ({ s = 24, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
      <line x1="22" y1="2" x2="11" y2="13" />
    </svg>
  ),

  /* ── General UI Icons ──────────────────────────────────────────── */
  Calendar: ({ s = 20, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-2 .9-2 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
    </svg>
  ),
  Image: ({ s = 20, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
    </svg>
  ),
  People: ({ s = 20, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  Eye: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  ),
  Save: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
    </svg>
  ),
  Upload: ({ s = 20, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
    </svg>
  ),
  Video: ({ s = 20, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
    </svg>
  ),
  Delete: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  ),
  Phone: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
    </svg>
  ),
  Tablet: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-2 14H5V6h14v12z" />
    </svg>
  ),
  Monitor: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
    </svg>
  ),
  Add: ({ s = 20, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  ),
  Play: ({ s = 20, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Pause: ({ s = 20, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ),
  Check: ({ s = 16, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  ),
  Close: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  ),
  Location: ({ s = 16, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  ),
  QR: ({ s = 20, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v2h2v-2zm0 4h-2v2h2v-2zm2-4h-2v2h2v-2zm0 4h-2v2h2v-2zm-4 4h2v-2h-2v2zm-2-4h-2v6h2v-2h2v-2h-2v-2zm0-2h2v2h-2v-2z" />
    </svg>
  ),
  Cloud: ({ s = 16, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
    </svg>
  ),
  Heart: ({ s = 14, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  ArrowLeft: ({ s = 20, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  ArrowRight: ({ s = 20, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Search: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Filter: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Plus: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Trash: ({ s = 16, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  Copy: ({ s = 16, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <rect width="13" height="13" x="9" y="9" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Link: ({ s = 16, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  ExternalLink: ({ s = 16, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  ),
  Edit: ({ s = 16, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  ),
  MoreVertical: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  ),
  Sparkles: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  ),
  Clock: ({ s = 16, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Users: ({ s = 16, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  MessageHeart: ({ s = 16, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M12 8c-1.5-1.5-3.5 0-3.5 1.5 0 2.5 3.5 4.5 3.5 4.5s3.5-2 3.5-4.5c0-1.5-2-3-3.5-1.5Z" />
    </svg>
  ),
  Layers: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Grid: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  ChevronLeft: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: ({ s = 18, cls = '' }: { s?: number; cls?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};
