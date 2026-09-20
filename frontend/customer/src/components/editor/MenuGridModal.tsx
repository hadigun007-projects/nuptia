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

interface MenuGridModalProps {
  isOpen: boolean;
  activeTab: Tab;
  onSelectTab: (tab: Tab) => void;
  onClose: () => void;
}

export function MenuGridModal({ isOpen, activeTab, onSelectTab, onClose }: MenuGridModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-[28px] shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-2xs">
              <Ic.Grid s={16} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-on-surface font-display leading-tight">
                Menu Editor Undangan
              </h2>
              <p className="text-[10px] text-on-surface-variant font-medium">Pilih menu untuk langsung mengedit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <Ic.Close s={18} />
          </button>
        </div>

        {/* 3x5 Reference Cards Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto bg-surface-container-lowest">
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {MENU_ITEMS_15.map((item) => {
              const IconComp = item.Icon;
              const isActive = activeTab === item.id;
              const isKirim = item.id === 'kirim';

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-[18px] transition-all duration-200 group active:scale-95 shadow-sm ${
                    isActive
                      ? 'bg-[#850D70] ring-3 ring-primary-container ring-offset-1 scale-[1.02]'
                      : 'bg-[#A3158A] hover:bg-[#91117A] hover:shadow-md'
                  }`}
                  style={{ minHeight: '88px' }}
                >
                  {/* Icon */}
                  <div className={`mb-1.5 transition-transform duration-200 group-hover:scale-110 ${
                    isKirim ? 'text-amber-300' : 'text-white'
                  }`}>
                    <IconComp s={26} />
                  </div>

                  {/* Label */}
                  <span className={`text-xs font-bold text-center leading-tight font-display tracking-wide ${
                    isKirim ? 'text-amber-300' : 'text-white'
                  }`}>
                    {item.label}
                  </span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-outline-variant/30 bg-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
          <span>Tekan tombol di atas untuk melompat ke seksi</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-surface-container hover:bg-surface-container-high transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
