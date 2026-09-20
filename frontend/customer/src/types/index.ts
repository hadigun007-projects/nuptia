export type Tab =
  | 'pengantin'
  | 'tema'
  | 'acara'
  | 'galeri'
  | 'musik'
  | 'ucapan'
  | 'kado'
  | 'rsvp'
  | 'streaming'
  | 'kisah-cinta'
  | 'story-ig'
  | 'quote'
  | 'setting'
  | 'buku-tamu'
  | 'kirim'
  // Legacy aliases for backward compatibility
  | 'event'
  | 'media'
  | 'guests';

export type Device = 'mobile' | 'tablet' | 'desktop';
export type Status = 'Draft' | 'Published' | 'Live';

export interface PersonProfile {
  nick: string;
  full: string;
  parents: string;
  photoUrl?: string;
  instagram?: string;
  bio?: string;
}

export interface EventSession {
  id: string;
  name: string; // Akad Nikah, Resepsi, Pemberkatan, Unduh Mantu
  date: string;
  time: string;
  endTime?: string;
  timezone: string;
  venue: string;
  address: string;
  mapsUrl: string;
}

export interface EventData {
  groomNick: string;
  brideNick: string;
  groomFull: string;
  brideFull: string;
  groomParents: string;
  brideParents: string;
  groomPhoto?: string;
  bridePhoto?: string;
  groomInstagram?: string;
  brideInstagram?: string;
  groomBio?: string;
  brideBio?: string;
  akadDate: string;
  akadTime: string;
  resepsiDate: string;
  resepsiTime: string;
  venue: string;
  address: string;
  mapsUrl: string;
  quote: string;
  blessing: string;
  sessions?: EventSession[];
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  loading: boolean;
}

export interface MediaData {
  heroUrl: string;
  gallery: GalleryItem[];
  videoUrl: string;
  musicTitle: string;
  musicPlaying: boolean;
  musicUrl?: string;
  autoplay?: boolean;
}

export interface PhysicalGiftAddress {
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface GuestData {
  rsvpEnabled: boolean;
  greetingsEnabled: boolean;
  bankName: string;
  accountNo: string;
  accountHolder: string;
  ewalletType: string;
  ewalletNo: string;
  ewalletName: string;
  qrisUrl?: string;
  physicalGiftEnabled?: boolean;
  physicalGiftAddress?: PhysicalGiftAddress;
}

export interface LoveStoryMilestone {
  id: string;
  year: string;
  date: string;
  title: string;
  story: string;
  imageUrl?: string;
}

export interface StreamingConfig {
  enabled: boolean;
  platform: 'youtube' | 'zoom' | 'instagram' | 'custom';
  url: string;
  scheduleDate: string;
  scheduleTime: string;
  notes?: string;
}

export interface SocialConfig {
  igFilterUrl: string;
  hashtag: string;
  igGroom: string;
  igBride: string;
}

export interface GuestBookEntry {
  id: string;
  name: string;
  category: 'Keluarga' | 'Teman' | 'VIP' | 'Rekan Kerja';
  pax: number;
  status: 'Hadir' | 'Tidak Hadir' | 'Belum Konfirmasi';
  checkedIn: boolean;
  notes?: string;
}

export interface GreetingItem {
  id: string;
  name: string;
  relationship: string;
  message: string;
  createdAt: string;
  isPinned: boolean;
}

export interface InvitationSettings {
  customSlug: string;
  isPrivate: boolean;
  password?: string;
  searchEngineIndex: boolean;
  musicAutoplay: boolean;
}

export interface ThemeConfig {
  templateId: string;
  templateName: string;
  primaryColor: string;
  fontStyle: string;
}

export interface TemplateOption {
  id: string;
  slug?: string;
  name: string;
  tagline: string;
  color: string;
  cover: string;
  font: string;
  category?: string;
  tier?: string;
  rating?: number;
  description?: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface Toast {
  id: string;
  msg: string;
  type: 'success' | 'error' | 'info';
}

export interface InvitationStats {
  views: number;
  rsvpAttending: number;
  rsvpTotal: number;
  greetingsCount: number;
}

export interface Invitation {
  id: string;
  slug: string;
  title: string;
  templateId: string;
  templateName: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  stats: InvitationStats;
  event: EventData;
  media: MediaData;
  guests: GuestData;
  loveStory?: LoveStoryMilestone[];
  streaming?: StreamingConfig;
  social?: SocialConfig;
  guestBook?: GuestBookEntry[];
  greetingsList?: GreetingItem[];
  settings?: InvitationSettings;
  theme?: ThemeConfig;
}

export interface CreateInvitationInput {
  groomNick: string;
  brideNick: string;
  weddingDate: string;
  templateId?: string;
  templateName?: string;
}
