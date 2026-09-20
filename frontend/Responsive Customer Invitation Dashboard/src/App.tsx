import { useState, useCallback, useEffect, useRef } from 'react'

/* ── Types ─────────────────────────────────────────────────────────── */
type Tab = 'event' | 'media' | 'guests'
type Device = 'mobile' | 'tablet' | 'desktop'
type Status = 'Draft' | 'Published' | 'Live'
interface EventData {
  groomNick: string; brideNick: string
  groomFull: string; brideFull: string
  groomParents: string; brideParents: string
  akadDate: string; akadTime: string
  resepsiDate: string; resepsiTime: string
  venue: string; address: string; mapsUrl: string
  quote: string; blessing: string
}
interface GalleryItem { id: string; url: string; caption: string; loading: boolean }
interface MediaData { heroUrl: string; gallery: GalleryItem[]; videoUrl: string; musicTitle: string; musicPlaying: boolean }
interface GuestData {
  rsvpEnabled: boolean; greetingsEnabled: boolean
  bankName: string; accountNo: string; accountHolder: string
  ewalletType: string; ewalletNo: string; ewalletName: string
}
interface Toast { id: string; msg: string; type: 'success' | 'error' | 'info' }

/* ── Seed data ─────────────────────────────────────────────────────── */
const initEvent: EventData = {
  groomNick: 'Reza', brideNick: 'Hana',
  groomFull: 'Muhammad Reza Pratama, S.T.', brideFull: 'Hana Nur Afifah, S.Pd.',
  groomParents: 'Bpk. H. Agus Salim & Ibu Hj. Siti Aminah',
  brideParents: 'Bpk. Ir. Dede Supriatna & Ibu Dr. Ratna Dewi',
  akadDate: '2025-03-15', akadTime: '08:00',
  resepsiDate: '2025-03-15', resepsiTime: '11:00',
  venue: 'Ballroom Grand Mercure Jakarta',
  address: 'Jl. Hayam Wuruk No. 123, Jakarta Pusat 10120',
  mapsUrl: 'https://maps.google.com',
  quote: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya..." (QS. Ar-Rum: 21)',
  blessing: 'Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami.',
}
const initMedia: MediaData = {
  heroUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop&auto=format',
  gallery: [
    { id: '1', url: 'https://images.unsplash.com/photo-1583939411023-14783179e581?w=300&h=300&fit=crop', caption: 'Foto Pre-Wedding', loading: false },
    { id: '2', url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=300&h=300&fit=crop', caption: 'Karangan Bunga', loading: false },
    { id: '3', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&h=300&fit=crop', caption: 'Dekorasi Venue', loading: false },
    { id: '4', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=300&h=300&fit=crop', caption: 'Cincin Pernikahan', loading: false },
  ],
  videoUrl: 'https://youtu.be/dQw4w9WgXcQ',
  musicTitle: 'A Thousand Years – Christina Perri',
  musicPlaying: false,
}
const initGuests: GuestData = {
  rsvpEnabled: true, greetingsEnabled: true,
  bankName: 'Bank Central Asia (BCA)', accountNo: '1234 5678 90', accountHolder: 'Muhammad Reza Pratama',
  ewalletType: 'GoPay', ewalletNo: '0812 3456 7890', ewalletName: 'Reza Pratama',
}

/* ── Formatters ────────────────────────────────────────────────────── */
function formatDate(d: string) {
  if (!d) return '—'
  const dt = new Date(d + 'T00:00:00')
  return dt.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function formatTime(t: string) {
  if (!t) return '—'
  const [h, m] = t.split(':')
  return `${h}.${m} WIB`
}

/* ── SVG Icons ─────────────────────────────────────────────────────── */
const Ic = {
  Calendar: ({ s = 20, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-2 .9-2 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>,
  Image: ({ s = 20, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
  People: ({ s = 20, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  Eye: ({ s = 18, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>,
  Save: ({ s = 18, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>,
  Upload: ({ s = 20, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>,
  Music: ({ s = 20, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
  Video: ({ s = 20, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>,
  Delete: ({ s = 18, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>,
  Phone: ({ s = 18, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>,
  Tablet: ({ s = 18, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-2 14H5V6h14v12z"/></svg>,
  Monitor: ({ s = 18, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>,
  Add: ({ s = 20, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
  Play: ({ s = 20, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M8 5v14l11-7z"/></svg>,
  Pause: ({ s = 20, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>,
  Check: ({ s = 16, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  Close: ({ s = 18, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>,
  Location: ({ s = 16, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>,
  QR: ({ s = 20, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v2h2v-2zm0 4h-2v2h2v-2zm2-4h-2v2h2v-2zm0 4h-2v2h2v-2zm-4 4h2v-2h-2v2zm-2-4h-2v6h2v-2h2v-2h-2v-2zm0-2h2v2h-2v-2z"/></svg>,
  Cloud: ({ s = 16, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>,
  Heart: ({ s = 14, cls = '' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className={cls}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
}

/* ── M3 Text Field ─────────────────────────────────────────────────── */
function M3Field({ label, value, onChange, type = 'text', multiline = false, rows = 3, placeholder = '', className = '' }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; multiline?: boolean; rows?: number; placeholder?: string; className?: string
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0 || type === 'date' || type === 'time'
  const base = 'w-full bg-surface-container-high rounded-2xl border-0 outline-none text-sm text-on-surface transition-all duration-200'
  const ring = focused ? 'ring-2 ring-primary' : 'ring-1 ring-outline-variant'
  const labelCls = `absolute left-4 transition-all duration-200 pointer-events-none z-10 font-medium ${
    active ? 'top-2 text-[11px] text-primary' : 'top-1/2 -translate-y-1/2 text-sm text-on-surface-variant'
  }`
  return (
    <div className={`relative ${className}`}>
      <label className={labelCls}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          rows={rows} placeholder={focused ? placeholder : ''}
          className={`${base} ${ring} pt-6 pb-3 px-4 resize-none`} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ''}
          className={`${base} ${ring} pt-6 pb-3 px-4 h-14`} />
      )}
    </div>
  )
}

/* ── M3 Switch ─────────────────────────────────────────────────────── */
function M3Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} aria-checked={checked} role="switch"
      className={`relative flex items-center w-14 h-8 rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        checked ? 'bg-primary' : 'bg-outline'
      }`}>
      <span className={`absolute w-6 h-6 rounded-full shadow-md transition-all duration-300 ${
        checked ? 'left-7 bg-on-primary' : 'left-1 bg-surface-container-highest'
      }`} />
    </button>
  )
}

/* ── Skeleton ─────────────────────────────────────────────────────── */
const Skeleton = ({ className = '' }) => (
  <div className={`shimmer-bg rounded-xl ${className}`} />
)

/* ── Toast Container ─────────────────────────────────────────────── */
function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  const colors: Record<string, string> = {
    success: 'bg-inverse-surface text-inverse-on-surface',
    error: 'bg-error text-on-error',
    info: 'bg-inverse-surface text-inverse-on-surface',
  }
  const icons: Record<string, React.ReactNode> = {
    success: <Ic.Check s={16} />,
    error: <Ic.Close s={16} />,
    info: <Ic.Cloud s={16} />,
  }
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`animate-toast pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-full shadow-xl text-sm font-medium ${colors[t.type]}`}>
          <span className="opacity-80">{icons[t.type]}</span>
          <span>{t.msg}</span>
          <button onClick={() => dismiss(t.id)} className="ml-1 opacity-60 hover:opacity-100 transition-opacity"><Ic.Close s={14} /></button>
        </div>
      ))}
    </div>
  )
}

/* ── Top Bar ─────────────────────────────────────────────────────── */
const STATUS_STYLES: Record<Status, string> = {
  Draft: 'bg-surface-container-highest text-on-surface-variant border border-outline-variant',
  Published: 'bg-secondary-container text-on-secondary-container',
  Live: 'bg-primary-container text-on-primary-container',
}

function TopBar({ status, autoSaving, showPreview, onTogglePreview, onSave, onChangeStatus }: {
  status: Status; autoSaving: boolean; showPreview: boolean
  onTogglePreview: () => void; onSave: () => void; onChangeStatus: () => void
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6 py-3 bg-surface-container-low/90 backdrop-blur-md border-b border-outline-variant/50 shadow-sm">
      <div className="flex items-center gap-2 mr-auto">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Ic.Heart s={14} cls="text-on-primary" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-on-surface leading-none font-display">InvitoStudio</h1>
          <p className="text-[10px] text-on-surface-variant">Workspace Undangan</p>
        </div>
      </div>

      <button onClick={onChangeStatus}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:opacity-80 ${STATUS_STYLES[status]}`}>
        {status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />}
        {status}
      </button>

      {autoSaving ? (
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin-slow" />
          Menyimpan…
        </span>
      ) : (
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant">
          <Ic.Cloud s={14} cls="text-primary" /> Tersimpan
        </span>
      )}

      <button onClick={onTogglePreview}
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
          showPreview
            ? 'bg-primary-container text-on-primary-container border-primary/30'
            : 'bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high'
        }`}>
        <Ic.Eye s={16} /> <span className="hidden sm:inline">Preview</span>
      </button>

      <button onClick={onSave}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all duration-200">
        <Ic.Save s={16} /> <span className="hidden sm:inline">Simpan</span>
      </button>
    </header>
  )
}

/* ── Navigation Rail ─────────────────────────────────────────────── */
const NAV_ITEMS: { id: Tab; label: string; Icon: React.FC<{ s?: number; cls?: string }> }[] = [
  { id: 'event', label: 'Detail Event', Icon: Ic.Calendar },
  { id: 'media', label: 'Media Studio', Icon: Ic.Image },
  { id: 'guests', label: 'Tamu & Hadiah', Icon: Ic.People },
]

function NavigationRail({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="hidden lg:flex flex-col items-center gap-1 w-20 pt-6 pb-4 bg-surface-container-low border-r border-outline-variant/40 flex-shrink-0">
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button key={id} onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1.5 w-full py-3 px-1 rounded-2xl transition-all duration-200 ${
              isActive ? 'text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container'
            }`}>
            <span className={`w-14 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${isActive ? 'bg-secondary-container' : ''}`}>
              <Icon s={20} />
            </span>
            <span className="text-[10px] font-semibold leading-tight text-center">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex bg-surface-container-low/95 backdrop-blur border-t border-outline-variant/40">
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button key={id} onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-200 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`w-12 h-7 flex items-center justify-center rounded-full transition-all duration-200 ${isActive ? 'bg-primary-container' : ''}`}>
              <Icon s={20} />
            </span>
            <span className="text-[10px] font-semibold">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

/* ── Section Header ──────────────────────────────────────────────── */
function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-extrabold text-on-surface font-display">{title}</h2>
      {sub && <p className="text-sm text-on-surface-variant mt-0.5">{sub}</p>}
    </div>
  )
}

/* ── Card ────────────────────────────────────────────────────────── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-container-lowest rounded-[20px] p-5 shadow-sm border border-outline-variant/30 ${className}`}>
      {children}
    </div>
  )
}

/* ── Tab 1: Event Details ────────────────────────────────────────── */
function EventDetailsTab({ data, onChange }: { data: EventData; onChange: (d: EventData) => void }) {
  const set = (k: keyof EventData) => (v: string) => onChange({ ...data, [k]: v })
  return (
    <div className="space-y-5 animate-fade-in-up">
      <Card>
        <SectionHead title="Nama Pasangan" sub="Nama panggilan ditampilkan besar di undangan" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <M3Field label="Nama Panggilan Pria" value={data.groomNick} onChange={set('groomNick')} placeholder="Contoh: Reza" />
          <M3Field label="Nama Panggilan Wanita" value={data.brideNick} onChange={set('brideNick')} placeholder="Contoh: Hana" />
          <M3Field label="Nama Lengkap Pria" value={data.groomFull} onChange={set('groomFull')} />
          <M3Field label="Nama Lengkap Wanita" value={data.brideFull} onChange={set('brideFull')} />
          <M3Field label="Nama Orang Tua Pria" value={data.groomParents} onChange={set('groomParents')} />
          <M3Field label="Nama Orang Tua Wanita" value={data.brideParents} onChange={set('brideParents')} />
        </div>
      </Card>

      <Card>
        <SectionHead title="Waktu & Tanggal Acara" />
        <div className="space-y-4">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">Akad Nikah</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <M3Field label="Tanggal Akad" value={data.akadDate} onChange={set('akadDate')} type="date" />
            <M3Field label="Jam Akad" value={data.akadTime} onChange={set('akadTime')} type="time" />
          </div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider pt-1">Resepsi Pernikahan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <M3Field label="Tanggal Resepsi" value={data.resepsiDate} onChange={set('resepsiDate')} type="date" />
            <M3Field label="Jam Resepsi" value={data.resepsiTime} onChange={set('resepsiTime')} type="time" />
          </div>
        </div>
      </Card>

      <Card>
        <SectionHead title="Lokasi & Venue" />
        <div className="space-y-3">
          <M3Field label="Nama Gedung / Venue" value={data.venue} onChange={set('venue')} />
          <M3Field label="Alamat Lengkap" value={data.address} onChange={set('address')} multiline rows={2} />
          <M3Field label="Link Google Maps" value={data.mapsUrl} onChange={set('mapsUrl')} placeholder="https://maps.google.com/..." />
        </div>
      </Card>

      <Card>
        <SectionHead title="Pesan & Doa" sub="Tampil di awal undangan" />
        <div className="space-y-3">
          <M3Field label="Kutipan / Quote Pembuka" value={data.quote} onChange={set('quote')} multiline rows={4} />
          <M3Field label="Pesan Undangan" value={data.blessing} onChange={set('blessing')} multiline rows={3} />
        </div>
      </Card>
    </div>
  )
}

/* ── Tab 2: Media Studio ─────────────────────────────────────────── */
function MediaStudioTab({ data, onChange, showToast }: { data: MediaData; onChange: (d: MediaData) => void; showToast: (msg: string, type?: Toast['type']) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange({ ...data, heroUrl: url })
    showToast('Foto cover berhasil diunggah!', 'success')
  }

  function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const loadingItems: GalleryItem[] = files.map((_, i) => ({
      id: `new-${Date.now()}-${i}`, url: '', caption: 'Foto baru', loading: true,
    }))
    onChange({ ...data, gallery: [...data.gallery, ...loadingItems] })
    files.forEach((file, i) => {
      setTimeout(() => {
        const url = URL.createObjectURL(file)
        const itemId = loadingItems[i].id
        onChange({ ...data, gallery: data.gallery.map(g => g.id === itemId ? { ...g, url, loading: false } : g) })
        if (i === files.length - 1) showToast(`${files.length} foto berhasil ditambahkan!`, 'success')
      }, 600 + i * 200)
    })
  }

  function removeGallery(id: string) {
    onChange({ ...data, gallery: data.gallery.filter(g => g.id !== id) })
    showToast('Foto dihapus', 'info')
  }

  function updateCaption(id: string, caption: string) {
    onChange({ ...data, gallery: data.gallery.map(g => g.id === id ? { ...g, caption } : g) })
  }

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Hero Cover */}
      <Card>
        <SectionHead title="Foto Cover / Hero" sub="Rasio 16:9 atau 9:16 disarankan" />
        <div className="relative rounded-2xl overflow-hidden bg-surface-container-high aspect-video cursor-pointer group"
          onClick={() => fileRef.current?.click()}>
          {data.heroUrl ? (
            <>
              <img src={data.heroUrl} alt="Hero cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 bg-black/60 text-white rounded-full px-4 py-2 text-sm font-semibold">
                  <Ic.Upload s={18} /> Ganti Foto
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-on-surface-variant">
              <Ic.Upload s={32} cls="text-outline" />
              <p className="text-sm font-medium">Klik untuk unggah foto cover</p>
              <p className="text-xs">JPG, PNG, WEBP • maks 10 MB</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
      </Card>

      {/* Gallery */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHead title="Galeri Foto" sub={`${data.gallery.length} foto`} />
          <button onClick={() => galleryRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary-container text-on-primary-container text-sm font-semibold hover:opacity-80 transition-opacity">
            <Ic.Add s={18} /> Tambah
          </button>
        </div>
        <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.gallery.map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-square bg-surface-container">
              {item.loading ? (
                <Skeleton className="w-full h-full rounded-2xl" />
              ) : (
                <>
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-2">
                    <input value={item.caption} onChange={e => updateCaption(item.id, e.target.value)}
                      className="text-xs text-white bg-transparent border-b border-white/50 outline-none w-full placeholder:text-white/60"
                      placeholder="Keterangan foto..." onClick={e => e.stopPropagation()} />
                  </div>
                  <button onClick={() => removeGallery(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95">
                    <Ic.Delete s={14} />
                  </button>
                </>
              )}
            </div>
          ))}
          <button onClick={() => galleryRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary-container/30 transition-all duration-200 cursor-pointer">
            <Ic.Add s={24} />
            <span className="text-xs font-medium">Tambah Foto</span>
          </button>
        </div>
      </Card>

      {/* Video */}
      <Card>
        <SectionHead title="Video" sub="YouTube, Vimeo, atau link langsung" />
        <div className="space-y-3">
          <M3Field label="URL Video (YouTube / Vimeo)" value={data.videoUrl} onChange={v => onChange({ ...data, videoUrl: v })} placeholder="https://youtu.be/..." />
          {data.videoUrl && (
            <div className="w-full aspect-video rounded-2xl bg-inverse-surface flex items-center justify-center text-inverse-on-surface/60 overflow-hidden">
              <div className="text-center">
                <Ic.Video s={32} cls="mx-auto mb-2 opacity-50" />
                <p className="text-xs opacity-60 break-all px-4">{data.videoUrl}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Music */}
      <Card>
        <SectionHead title="Musik Latar" sub="Diputar otomatis saat undangan dibuka" />
        <M3Field label="Judul Lagu" value={data.musicTitle} onChange={v => onChange({ ...data, musicTitle: v })} className="mb-3" />
        <div className="flex items-center gap-3 p-3 bg-primary-container rounded-2xl">
          <button onClick={() => onChange({ ...data, musicPlaying: !data.musicPlaying })}
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow hover:shadow-md active:scale-95 transition-all duration-200">
            {data.musicPlaying ? <Ic.Pause s={20} /> : <Ic.Play s={20} />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-primary-container truncate">{data.musicTitle || 'Pilih lagu...'}</p>
            <div className="mt-1.5 h-1 bg-primary/20 rounded-full overflow-hidden">
              {data.musicPlaying && <div className="h-full bg-primary rounded-full w-1/3 transition-all duration-1000" />}
            </div>
          </div>
          <Ic.Music s={20} cls="text-primary/60 flex-shrink-0" />
        </div>
      </Card>
    </div>
  )
}

/* ── Tab 3: Guest & Gift Management ─────────────────────────────── */
function GuestManagementTab({ data, onChange, showToast }: { data: GuestData; onChange: (d: GuestData) => void; showToast: (msg: string, type?: Toast['type']) => void }) {
  const qrRef = useRef<HTMLInputElement>(null)
  const [qrPreview, setQrPreview] = useState('')

  function handleQr(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setQrPreview(URL.createObjectURL(file))
    showToast('QRIS berhasil diunggah!', 'success')
  }

  const set = (k: keyof GuestData) => (v: string | boolean) => onChange({ ...data, [k]: v })

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* RSVP & Greetings */}
      <Card>
        <SectionHead title="Fitur Interaktif" sub="Aktifkan atau nonaktifkan fitur tamu" />
        <div className="space-y-1">
          {([['rsvpEnabled', 'Konfirmasi Kehadiran (RSVP)', 'Tamu bisa mengkonfirmasi kehadiran mereka'], ['greetingsEnabled', 'Ucapan & Doa', 'Kolom ucapan selamat dari para tamu']] as const).map(([key, title, sub]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-outline-variant/30 last:border-0">
              <div>
                <p className="text-sm font-semibold text-on-surface">{title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{sub}</p>
              </div>
              <M3Switch checked={data[key]} onChange={v => set(key)(v)} />
            </div>
          ))}
        </div>
      </Card>

      {/* Bank Account */}
      <Card>
        <SectionHead title="Rekening Bank" sub="Untuk amplop digital / hadiah uang" />
        <div className="space-y-3">
          <M3Field label="Nama Bank" value={data.bankName} onChange={v => set('bankName')(v)} placeholder="Contoh: Bank Central Asia (BCA)" />
          <M3Field label="Nomor Rekening" value={data.accountNo} onChange={v => set('accountNo')(v)} placeholder="0000 0000 00" />
          <M3Field label="Nama Pemilik Rekening" value={data.accountHolder} onChange={v => set('accountHolder')(v)} />
          <button onClick={() => { navigator.clipboard?.writeText(data.accountNo); showToast('Nomor rekening disalin!', 'success') }}
            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/70 transition-colors mt-1">
            <Ic.Check s={14} /> Salin nomor rekening
          </button>
        </div>
      </Card>

      {/* E-Wallet */}
      <Card>
        <SectionHead title="Dompet Digital / E-Wallet" />
        <div className="space-y-3">
          <div className="flex gap-2">
            {['GoPay', 'OVO', 'Dana', 'ShopeePay'].map(w => (
              <button key={w} onClick={() => set('ewalletType')(w)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  data.ewalletType === w ? 'bg-primary text-on-primary shadow' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}>{w}</button>
            ))}
          </div>
          <M3Field label="Nomor E-Wallet" value={data.ewalletNo} onChange={v => set('ewalletNo')(v)} />
          <M3Field label="Nama Pemilik" value={data.ewalletName} onChange={v => set('ewalletName')(v)} />
        </div>
      </Card>

      {/* QRIS */}
      <Card>
        <SectionHead title="QRIS" sub="Upload gambar kode QR pembayaran" />
        <div className="flex gap-4 items-start">
          <div className="w-32 h-32 flex-shrink-0 rounded-2xl bg-surface-container-high border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors"
            onClick={() => qrRef.current?.click()}>
            {qrPreview ? (
              <img src={qrPreview} alt="QRIS" className="w-full h-full object-contain p-2" />
            ) : (
              <div className="text-center p-3">
                <Ic.QR s={32} cls="mx-auto text-on-surface-variant/50 mb-1" />
                <p className="text-[10px] text-on-surface-variant">Upload QRIS</p>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-on-surface mb-1">Unggah gambar QRIS</p>
            <p className="text-xs text-on-surface-variant mb-3">Format PNG atau JPG, ukuran maks 5 MB</p>
            <button onClick={() => qrRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-on-surface text-sm font-semibold border border-outline-variant hover:bg-surface-container-high transition-all duration-200">
              <Ic.Upload s={16} /> Pilih File
            </button>
          </div>
        </div>
        <input ref={qrRef} type="file" accept="image/*" className="hidden" onChange={handleQr} />
      </Card>
    </div>
  )
}

/* ── Invitation Preview ──────────────────────────────────────────── */
function InvitePreview({ event, media }: { event: EventData; media: MediaData }) {
  return (
    <div className="flex flex-col h-full bg-white font-body overflow-y-auto text-[#1B1B1F]" style={{ fontSize: '11px' }}>
      {/* Cover */}
      <div className="relative h-48 flex-shrink-0 bg-surface-container-high overflow-hidden">
        {media.heroUrl && <img src={media.heroUrl} alt="Cover" className="w-full h-full object-cover" />}
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
        <div className="text-center p-3 bg-primary-container/30 rounded-2xl">
          <p className="text-[9px] italic leading-relaxed text-on-primary-container/80 line-clamp-3">{event.quote}</p>
        </div>

        {/* Names */}
        <div className="text-center space-y-2">
          <p className="text-[8px] text-on-surface-variant uppercase tracking-widest">Mempelai Pria</p>
          <p className="font-bold text-sm font-display text-primary">{event.groomNick}</p>
          <p className="text-[9px] text-on-surface-variant">{event.groomFull}</p>
          <p className="text-[8px] text-on-surface-variant/70">{event.groomParents}</p>
          <div className="my-2 flex items-center gap-2">
            <div className="flex-1 h-px bg-outline-variant/50" />
            <Ic.Heart s={10} cls="text-primary" />
            <div className="flex-1 h-px bg-outline-variant/50" />
          </div>
          <p className="text-[8px] text-on-surface-variant uppercase tracking-widest">Mempelai Wanita</p>
          <p className="font-bold text-sm font-display text-primary">{event.brideNick}</p>
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
            <p className="font-semibold text-[10px]">{event.venue}</p>
            <p className="text-[9px] text-on-surface-variant leading-relaxed">{event.address}</p>
          </div>
        </div>

        {/* Blessing */}
        <div className="text-center pt-2 pb-4">
          <p className="text-[9px] text-on-surface-variant italic leading-relaxed">{event.blessing}</p>
        </div>

        {/* RSVP button */}
        <button className="w-full py-2.5 rounded-full bg-primary text-on-primary text-[10px] font-bold tracking-wide shadow">
          Konfirmasi Kehadiran
        </button>
      </div>
    </div>
  )
}

/* ── Preview Panel ───────────────────────────────────────────────── */
function PreviewPanel({ event, media, device, onDeviceChange }: {
  event: EventData; media: MediaData; device: Device; onDeviceChange: (d: Device) => void
}) {
  const frameStyles: Record<Device, { outer: string; inner: string; notch: boolean }> = {
    mobile: { outer: 'w-[220px] h-[440px] rounded-[32px] border-[10px] border-inverse-surface shadow-2xl', inner: 'rounded-[24px] overflow-hidden', notch: true },
    tablet: { outer: 'w-[320px] h-[430px] rounded-2xl border-[10px] border-inverse-surface shadow-2xl', inner: 'rounded-xl overflow-hidden', notch: false },
    desktop: { outer: 'w-[380px] h-[260px] rounded-xl border-[10px] border-inverse-surface shadow-2xl', inner: 'rounded-sm overflow-hidden', notch: false },
  }
  const f = frameStyles[device]

  return (
    <div className="flex flex-col items-center gap-4 pt-6 pb-8 px-4">
      {/* Device switcher */}
      <div className="flex items-center gap-1 bg-surface-container rounded-full p-1">
        {([['mobile', Ic.Phone], ['tablet', Ic.Tablet], ['desktop', Ic.Monitor]] as [Device, typeof Ic.Phone][]).map(([d, Icon]) => (
          <button key={d} onClick={() => onDeviceChange(d)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              device === d ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}>
            <Icon s={15} /> <span className="capitalize">{d}</span>
          </button>
        ))}
      </div>

      {/* Live badge */}
      <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
        Live Preview
      </div>

      {/* Device frame */}
      <div className={f.outer}>
        {f.notch && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-inverse-surface rounded-b-2xl z-10" />
        )}
        <div className={`${f.inner} w-full h-full bg-surface overflow-hidden`} style={{ position: 'relative' }}>
          <InvitePreview event={event} media={media} />
        </div>
      </div>

      <p className="text-xs text-on-surface-variant text-center max-w-[280px] leading-relaxed">
        Preview diperbarui secara otomatis setiap kali kamu mengubah data di form kiri.
      </p>
    </div>
  )
}

/* ── App ─────────────────────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState<Tab>('event')
  const [device, setDevice] = useState<Device>('mobile')
  const [status, setStatus] = useState<Status>('Draft')
  const [showPreview, setShowPreview] = useState(true)
  const [autoSaving, setAutoSaving] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [event, setEvent] = useState(initEvent)
  const [media, setMedia] = useState(initMedia)
  const [guests, setGuests] = useState(initGuests)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const showToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  const dismissToast = useCallback((id: string) => setToasts(t => t.filter(x => x.id !== id)), [])

  // Auto-save on change
  useEffect(() => {
    clearTimeout(autoSaveTimer.current)
    setAutoSaving(true)
    autoSaveTimer.current = setTimeout(() => setAutoSaving(false), 1400)
    return () => clearTimeout(autoSaveTimer.current)
  }, [event, media, guests])

  function handleSave() {
    setAutoSaving(true)
    setTimeout(() => {
      setAutoSaving(false)
      showToast('Undangan berhasil disimpan!', 'success')
    }, 900)
  }

  function cycleStatus() {
    const cycle: Status[] = ['Draft', 'Published', 'Live']
    const next = cycle[(cycle.indexOf(status) + 1) % cycle.length]
    setStatus(next)
    showToast(`Status berubah ke ${next}`, next === 'Live' ? 'success' : 'info')
  }

  // Extend onChange for media to support functional updates
  const setMediaFn = useCallback((updater: MediaData) => {
    setMedia(updater)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-surface overflow-hidden">
      <TopBar
        status={status} autoSaving={autoSaving} showPreview={showPreview}
        onTogglePreview={() => setShowPreview(p => !p)}
        onSave={handleSave} onChangeStatus={cycleStatus}
      />

      <div className="flex flex-1 overflow-hidden">
        <NavigationRail active={tab} onChange={setTab} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className={`flex min-h-full ${showPreview ? 'lg:divide-x lg:divide-outline-variant/30' : ''}`}>
            {/* Form area */}
            <div className={`flex-1 p-4 pb-24 lg:pb-6 ${showPreview ? 'lg:max-w-[calc(100%-340px)]' : ''}`}>
              <div className="max-w-2xl mx-auto">
                {tab === 'event' && <EventDetailsTab data={event} onChange={setEvent} />}
                {tab === 'media' && <MediaStudioTab data={media} onChange={setMediaFn} showToast={showToast} />}
                {tab === 'guests' && <GuestManagementTab data={guests} onChange={setGuests} showToast={showToast} />}
              </div>
            </div>

            {/* Preview panel */}
            {showPreview && (
              <aside className="hidden lg:block w-[340px] flex-shrink-0 overflow-y-auto bg-surface-container-low/60">
                <PreviewPanel event={event} media={media} device={device} onDeviceChange={setDevice} />
              </aside>
            )}
          </div>
        </main>
      </div>

      <BottomNav active={tab} onChange={setTab} />
      <ToastContainer toasts={toasts} dismiss={dismissToast} />
    </div>
  )
}
