import React, { useState } from 'react';
import { Tab } from '../../types';
import { MENU_ITEMS_15, MenuItemDef } from './MenuGridModal';
import { Ic } from '../common/Icons';

interface EditorSidebarProps {
  activeTab: Tab;
  onSelectTab: (tab: Tab) => void;
  onOpenGridModal: () => void;
}

const CATEGORIES = [
  {
    key: 'mempelai',
    title: 'Mempelai & Acara',
    items: ['pengantin', 'acara', 'quote', 'kisah-cinta'] as Tab[],
  },
  {
    key: 'media',
    title: 'Desain & Media',
    items: ['tema', 'galeri', 'musik', 'story-ig'] as Tab[],
  },
  {
    key: 'tamu',
    title: 'Tamu & Interaksi',
    items: ['rsvp', 'ucapan', 'buku-tamu', 'kado'] as Tab[],
  },
  {
    key: 'distribusi',
    title: 'Distribusi & Pengaturan',
    items: ['streaming', 'kirim', 'setting'] as Tab[],
  },
];

export function EditorSidebar({ activeTab, onSelectTab, onOpenGridModal }: EditorSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const getDef = (id: Tab): MenuItemDef => {
    return MENU_ITEMS_15.find((m) => m.id === id) || MENU_ITEMS_15[0];
  };

  return (
    <aside
      className={`hidden lg:flex flex-col bg-surface-container-low border-r border-outline-variant/40 transition-all duration-300 flex-shrink-0 z-20 ${
        collapsed ? 'w-[74px]' : 'w-[236px]'
      }`}
    >
      {/* Top action: Open 3x5 Grid Modal */}
      <div className="p-3 border-b border-outline-variant/30">
        <button
          onClick={onOpenGridModal}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary-container/80 transition-all duration-200 font-bold text-xs shadow-2xs group ${
            collapsed ? 'px-0' : ''
          }`}
          title="Buka Menu Cepat (Grid 3x5)"
        >
          <span className="text-primary group-hover:scale-110 transition-transform">
            <Ic.Grid s={18} />
          </span>
          {!collapsed && <span>Semua Menu (3x5)</span>}
        </button>
      </div>

      {/* Categories & 15 Menu Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.key}>
            {!collapsed && (
              <p className="px-3 pb-1 text-[10px] font-bold tracking-wider text-on-surface-variant/80 uppercase font-display">
                {cat.title}
              </p>
            )}
            <div className="space-y-1">
              {cat.items.map((tabId) => {
                const def = getDef(tabId);
                const IconComp = def.Icon;
                const isActive = activeTab === tabId;
                const isKirim = tabId === 'kirim';

                return (
                  <button
                    key={tabId}
                    onClick={() => onSelectTab(tabId)}
                    title={def.label}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-xs font-bold'
                        : 'text-on-surface hover:bg-surface-container hover:text-primary'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                  >
                    <span
                      className={`flex-shrink-0 transition-transform ${
                        isActive ? 'text-on-primary' : isKirim ? 'text-amber-500' : 'text-on-surface-variant'
                      }`}
                    >
                      <IconComp s={19} />
                    </span>

                    {!collapsed && (
                      <span className="truncate flex-1 text-left font-display">
                        {def.label}
                      </span>
                    )}

                    {!collapsed && isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Toggle Collapse */}
      <div className="p-2 border-t border-outline-variant/30 flex items-center justify-end">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs transition-colors"
          title={collapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
        >
          <span className="transform transition-transform">
            {collapsed ? <Ic.ChevronRight s={16} /> : <Ic.ChevronLeft s={16} />}
          </span>
          {!collapsed && <span className="text-[11px] font-medium">Ciutkan Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
