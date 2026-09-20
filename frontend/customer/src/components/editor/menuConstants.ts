import React from 'react';
import { Tab } from '../../types';
import { Ic } from '../common/Icons';

export interface MenuItemDef {
  id: Tab;
  label: string;
  Icon: React.FC<{ s?: number; cls?: string }>;
  accent?: string;
  category: 'mempelai' | 'media' | 'tamu' | 'distribusi';
}

export const MENU_ITEMS_15: MenuItemDef[] = [
  // Row 1
  { id: 'pengantin', label: 'Pengantin', Icon: Ic.Pengantin, category: 'mempelai' },
  { id: 'tema', label: 'Tema', Icon: Ic.Tema, category: 'media' },
  { id: 'acara', label: 'Acara', Icon: Ic.Acara, category: 'mempelai' },
  // Row 2
  { id: 'galeri', label: 'Galeri', Icon: Ic.Galeri, category: 'media' },
  { id: 'musik', label: 'Musik', Icon: Ic.Musik, category: 'media' },
  { id: 'ucapan', label: 'Ucapan', Icon: Ic.Ucapan, category: 'tamu' },
  // Row 3
  { id: 'kado', label: 'Kado', Icon: Ic.Kado, category: 'tamu' },
  { id: 'rsvp', label: 'RSVP', Icon: Ic.RSVP, category: 'tamu' },
  { id: 'streaming', label: 'Streaming', Icon: Ic.Streaming, category: 'distribusi' },
  // Row 4
  { id: 'kisah-cinta', label: 'Kisah Cinta', Icon: Ic.KisahCinta, category: 'mempelai' },
  { id: 'story-ig', label: 'Story IG', Icon: Ic.StoryIG, category: 'media' },
  { id: 'quote', label: 'Quote', Icon: Ic.Quote, category: 'mempelai' },
  // Row 5
  { id: 'setting', label: 'Setting', Icon: Ic.Setting, category: 'distribusi' },
  { id: 'buku-tamu', label: 'Buku Tamu', Icon: Ic.BukuTamu, category: 'tamu' },
  { id: 'kirim', label: 'Kirim', Icon: Ic.Kirim, accent: '#FACC15', category: 'distribusi' },
];
