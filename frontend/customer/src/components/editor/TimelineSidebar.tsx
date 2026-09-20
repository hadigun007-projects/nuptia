import React from 'react';
import { Tab } from '../../types';
import { MENU_ITEMS_15, MenuItemDef, CATEGORY_STEPS, CategoryDef } from './menuConstants';
import { Ic } from '../common/Icons';

export interface TimelineStepDef {
  id: Tab;
  stepNumber: number;
  label: string;
  subLabel: string;
  isRequired?: boolean;
}

export const TIMELINE_STEPS: TimelineStepDef[] = [
  { id: 'pengantin', stepNumber: 1, label: 'Pengantin', subLabel: 'Profil kedua mempelai', isRequired: true },
  { id: 'acara', stepNumber: 2, label: 'Acara', subLabel: 'Akad & resepsi', isRequired: true },
  { id: 'streaming', stepNumber: 3, label: 'Streaming', subLabel: 'Siaran live online' },
  { id: 'quote', stepNumber: 4, label: 'Quote', subLabel: 'Ayat suci / doa' },
  { id: 'kisah-cinta', stepNumber: 5, label: 'Kisah Cinta', subLabel: 'Linimasa asmara' },
  { id: 'tema', stepNumber: 6, label: 'Tema', subLabel: 'Template & warna', isRequired: true },
  { id: 'galeri', stepNumber: 7, label: 'Galeri', subLabel: 'Cover & album' },
  { id: 'musik', stepNumber: 8, label: 'Musik', subLabel: 'Lagu pengiring' },
  { id: 'story-ig', stepNumber: 9, label: 'Story IG', subLabel: 'Filter AR & hashtag' },
  { id: 'rsvp', stepNumber: 10, label: 'RSVP', subLabel: 'Konfirmasi tamu' },
  { id: 'buku-tamu', stepNumber: 11, label: 'Buku Tamu', subLabel: 'Tamu VIP & QR' },
  { id: 'ucapan', stepNumber: 12, label: 'Ucapan', subLabel: 'Moderasi restu' },
  { id: 'kado', stepNumber: 13, label: 'Kado', subLabel: 'Amplop digital' },
  { id: 'setting', stepNumber: 14, label: 'Setting', subLabel: 'Slug & privasi' },
  { id: 'kirim', stepNumber: 15, label: 'Kirim', subLabel: 'WhatsApp & sebar' },
];

interface TimelineSidebarProps {
  activeTab: Tab;
  onSelectTab: (tab: Tab) => void;
  completedSteps?: Partial<Record<Tab, boolean>>;
  visitedTabs?: Set<Tab>;
  isTimelineMode?: boolean;
  onToggleMode?: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function TimelineSidebar({
  activeTab,
  onSelectTab,
  completedSteps = {},
  visitedTabs,
  collapsed,
  onToggleCollapse,
}: TimelineSidebarProps) {
  // Find which category the active tab belongs to
  const activeCategoryIndex = CATEGORY_STEPS.findIndex((c) => c.items.includes(activeTab));
  const safeCatIndex = activeCategoryIndex >= 0 ? activeCategoryIndex : 0;
  const activeCategory = CATEGORY_STEPS[safeCatIndex];

  const getDef = (id: Tab): MenuItemDef => {
    return MENU_ITEMS_15.find((m) => m.id === id) || MENU_ITEMS_15[0];
  };

  return (
    <aside
      className={`hidden lg:flex flex-col bg-surface transition-all duration-300 flex-shrink-0 z-20 select-none sticky top-[57px] max-h-[calc(100vh-57px)] ${
        collapsed ? 'w-[74px]' : 'w-[250px]'
      }`}
    >
      {/* Top Header with 4-Phase Category Stepper Progress */}
      {!collapsed && (
        <div className="p-3 border-b border-outline-variant/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-primary font-display uppercase tracking-wider">
              Langkah {safeCatIndex + 1} dari 4
            </span>
            <span className="text-[10px] text-on-surface-variant font-semibold">
              {Math.round(((safeCatIndex + 1) / 4) * 100)}%
            </span>
          </div>
          <p className="text-xs font-extrabold text-on-surface font-display truncate">
            {activeCategory.title}
          </p>

          {/* 4-Segment Progress Bar */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {CATEGORY_STEPS.map((c, i) => (
              <div
                key={c.key}
                title={`Kategori ${i + 1}: ${c.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i < safeCatIndex
                    ? 'bg-primary'
                    : i === safeCatIndex
                    ? 'bg-primary animate-pulse'
                    : 'bg-surface-container-high'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main List: 4 Category Nodes with Sub-items */}
      <div className={`flex-1 overflow-y-auto py-3 space-y-4 ${collapsed ? 'px-1.5' : 'px-2'}`}>
        {CATEGORY_STEPS.map((cat, catIdx) => {
          const isCurrentCat = catIdx === safeCatIndex;
          const isPastCat = catIdx < safeCatIndex;
          const isFutureCat = catIdx > safeCatIndex;
          const isLastCat = catIdx === CATEGORY_STEPS.length - 1;

          // Check how many items in this category have been completed/visited
          const completedCount = cat.items.filter((id) => completedSteps[id]).length;
          const isCatFullyCompleted = completedCount === cat.items.length;

          return (
            <div
              key={cat.key}
              className={`relative ${
                collapsed && catIdx > 0 ? 'pt-2 mt-2 border-t border-outline-variant/20' : ''
              }`}
            >
              {/* Category Connecting Line (Only drawn when expanded to prevent slicing through icons) */}
              {!collapsed && !isLastCat && (
                <span
                  aria-hidden="true"
                  className={`absolute w-0.5 pointer-events-none transition-colors z-0 left-[15px] ${
                    isPastCat
                      ? 'bg-primary/50'
                      : isCurrentCat
                      ? 'bg-primary/25'
                      : 'bg-outline-variant/30'
                  }`}
                  style={{
                    top: '24px',
                    bottom: '-16px',
                  }}
                />
              )}

              {/* Category Bullet Header */}
              <div
                className={`flex items-center gap-2.5 relative z-10 ${
                  collapsed ? 'justify-center mb-2' : 'px-1 pb-1.5'
                }`}
              >
                {/* Category Timeline Node Circle */}
                <div
                  title={`Kategori ${cat.stepNumber}: ${cat.title}`}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 transition-all ${
                    isCurrentCat
                      ? 'bg-primary text-on-primary ring-3 ring-primary/25 shadow-xs scale-105'
                      : isPastCat || isCatFullyCompleted
                      ? 'bg-primary/15 text-primary border border-primary/30 font-bold'
                      : 'bg-surface-container-high text-on-surface-variant/60 border border-outline-variant/40'
                  }`}
                >
                  {isPastCat || isCatFullyCompleted ? (
                    <Ic.Check s={13} />
                  ) : (
                    cat.stepNumber
                  )}
                </div>

                {/* Category Title (visible when expanded) */}
                {!collapsed && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase font-display truncate ${
                        isCurrentCat
                          ? 'text-primary font-extrabold'
                          : isPastCat
                          ? 'text-on-surface/90'
                          : 'text-on-surface-variant/70'
                      }`}
                    >
                      {cat.title}
                    </span>
                    {isCatFullyCompleted && (
                      <span className="text-[9px] font-bold text-primary px-1 rounded bg-primary-container/40">
                        ✓
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Category Sub-items (Listed cleanly below category header) */}
              <div
                className={`space-y-1 ${
                  collapsed ? 'flex flex-col items-center' : 'pl-7'
                }`}
              >
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
                      className={`transition-all duration-150 ${
                        collapsed
                          ? `w-10 h-10 rounded-xl flex items-center justify-center ${
                              isActive
                                ? 'bg-primary text-on-primary font-bold shadow-xs'
                                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                            }`
                          : `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                              isActive
                                ? 'bg-primary text-on-primary font-bold shadow-xs'
                                : 'text-on-surface hover:bg-surface-container hover:text-primary'
                            }`
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 transition-transform ${
                          isActive
                            ? 'text-on-primary'
                            : isKirim
                            ? 'text-amber-500'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        <IconComp s={18} />
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
          );
        })}
      </div>

      {/* Bottom Toggle Collapse */}
      <div className="p-2 border-t border-outline-variant/30 flex items-center justify-end">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs transition-colors"
          title={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
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
