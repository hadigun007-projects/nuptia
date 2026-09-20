export type Tab = 'event' | 'media' | 'guests';
export type Device = 'mobile' | 'tablet' | 'desktop';
export type Status = 'Draft' | 'Published' | 'Live';

export interface EventData {
  groomNick: string;
  brideNick: string;
  groomFull: string;
  brideFull: string;
  groomParents: string;
  brideParents: string;
  akadDate: string;
  akadTime: string;
  resepsiDate: string;
  resepsiTime: string;
  venue: string;
  address: string;
  mapsUrl: string;
  quote: string;
  blessing: string;
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
}

export interface CreateInvitationInput {
  groomNick: string;
  brideNick: string;
  weddingDate: string;
  templateId?: string;
  templateName?: string;
}
