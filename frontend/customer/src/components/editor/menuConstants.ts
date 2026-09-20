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
  // 1. Informasi Pokok
  { id: 'pengantin', label: 'Pengantin', Icon: Ic.Pengantin, category: 'mempelai' },
  { id: 'acara', label: 'Acara', Icon: Ic.Acara, category: 'mempelai' },
  { id: 'streaming', label: 'Streaming', Icon: Ic.Streaming, category: 'mempelai' },
  // 2. Cerita Mempelai
  { id: 'quote', label: 'Quote', Icon: Ic.Quote, category: 'mempelai' },
  { id: 'kisah-cinta', label: 'Kisah Cinta', Icon: Ic.KisahCinta, category: 'mempelai' },
  // 3. Desain & Multimedia
  { id: 'tema', label: 'Tema', Icon: Ic.Tema, category: 'media' },
  { id: 'galeri', label: 'Galeri', Icon: Ic.Galeri, category: 'media' },
  { id: 'musik', label: 'Musik', Icon: Ic.Musik, category: 'media' },
  { id: 'story-ig', label: 'Story IG', Icon: Ic.StoryIG, category: 'media' },
  // 4. Interaksi Tamu & Hadiah
  { id: 'rsvp', label: 'RSVP', Icon: Ic.RSVP, category: 'tamu' },
  { id: 'buku-tamu', label: 'Buku Tamu', Icon: Ic.BukuTamu, category: 'tamu' },
  { id: 'ucapan', label: 'Ucapan', Icon: Ic.Ucapan, category: 'tamu' },
  { id: 'kado', label: 'Kado', Icon: Ic.Kado, category: 'tamu' },
  // 5. Finalisasi & Distribusi
  { id: 'setting', label: 'Setting', Icon: Ic.Setting, category: 'distribusi' },
  { id: 'kirim', label: 'Kirim', Icon: Ic.Kirim, accent: '#FACC15', category: 'distribusi' },
];

export interface CategoryDef {
  key: 'mempelai' | 'media' | 'tamu' | 'distribusi';
  stepNumber: number;
  title: string;
  items: Tab[];
}

export const CATEGORY_STEPS: CategoryDef[] = [
  {
    key: 'mempelai',
    stepNumber: 1,
    title: 'Mempelai & Acara',
    items: ['pengantin', 'acara', 'streaming', 'quote', 'kisah-cinta'],
  },
  {
    key: 'media',
    stepNumber: 2,
    title: 'Desain & Media',
    items: ['tema', 'galeri', 'musik', 'story-ig'],
  },
  {
    key: 'tamu',
    stepNumber: 3,
    title: 'Tamu & Interaksi',
    items: ['rsvp', 'buku-tamu', 'ucapan', 'kado'],
  },
  {
    key: 'distribusi',
    stepNumber: 4,
    title: 'Distribusi & Pengaturan',
    items: ['setting', 'kirim'],
  },
];

