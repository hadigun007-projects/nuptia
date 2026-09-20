import React from 'react';
import { Tab } from '../../types';
import { MENU_ITEMS_15, MenuItemDef } from './menuConstants';
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
  { id: 'quote', stepNumber: 4, label: 'Kata Mutiara', subLabel: 'Ayat suci / doa' },
  { id: 'kisah-cinta', stepNumber: 5, label: 'Kisah Cinta', subLabel: 'Linimasa asmara' },
  { id: 'tema', stepNumber: 6, label: 'Tema Desain', subLabel: 'Template & warna', isRequired: true },
  { id: 'galeri', stepNumber: 7, label: 'Galeri Foto', subLabel: 'Cover & album' },
  { id: 'musik', stepNumber: 8, label: 'Musik', subLabel: 'Lagu pengiring' },
  { id: 'story-ig', stepNumber: 9, label: 'Story IG', subLabel: 'Filter AR & hashtag' },
  { id: 'rsvp', stepNumber: 10, label: 'RSVP', subLabel: 'Konfirmasi tamu' },
  { id: 'buku-tamu', stepNumber: 11, label: 'Buku Tamu', subLabel: 'Tamu VIP & QR' },
  { id: 'ucapan', stepNumber: 12, label: 'Ucapan', subLabel: 'Moderasi restu' },
  { id: 'kado', stepNumber: 13, label: 'Kado & Rekening', subLabel: 'Amplop digital' },
  { id: 'setting', stepNumber: 14, label: 'Setting', subLabel: 'Slug & privasi' },
  { id: 'kirim', stepNumber: 15, label: 'Kirim', subLabel: 'WhatsApp & sebar' },
];

interface TimelineSidebarProps {
  activeTab: Tab;
  onSelectTab: (tab: Tab) => void;
  completedSteps?: Partial<Record<Tab, boolean>>;
  isTimelineMode: boolean;
  onToggleMode: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function TimelineSidebar({
  activeTab,
  onSelectTab,
  completedSteps = {},
  isTimelineMode,
  onToggleMode,
  collapsed,
  onToggleCollapse,
}: TimelineSidebarProps) {
  const currentStepIndex = TIMELINE_STEPS.findIndex((s) => s.id === activeTab);
  const currentStepNumber = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  // Calculate completed count
  const completedCount = TIMELINE_STEPS.filter((s) => completedSteps[s.id]).length;
  const progressPercent = Math.round((completedCount / TIMELINE_STEPS.length) * 100);

  const getDef = (id: Tab): MenuItemDef => {
    return MENU_ITEMS_15.find((m) => m.id === id) || MENU_ITEMS_15[0];
  };

  return (
    <aside
      className={`hidden lg:flex flex-col bg-surface transition-all duration-300 flex-shrink-0 z-20 select-none ${collapsed ? 'w-[76px]' : 'w-[264px] p-8 pt-4'
        }`}
    >
      {/* Timeline Stepper List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 relative">
        <div className="space-y-1 relative">
          {TIMELINE_STEPS.map((step, idx) => {
            const def = getDef(step.id);
            const IconComp = def.Icon;
            const isActive = activeTab === step.id;
            const isCompleted = Boolean(completedSteps[step.id]);
            const isPast = idx < currentStepIndex;
            const isLastStep = idx === TIMELINE_STEPS.length - 1;

            return (
              <div key={step.id} className="relative">
                {/* Connecting Line between nodes (hidden on the last item to prevent overflow) */}
                {!isLastStep && (
                  <span
                    aria-hidden="true"
                    className={`absolute w-0.5 pointer-events-none transition-colors z-0 bg-outline-variant/40 ${collapsed ? 'left-[29px]' : 'left-[21px]'
                      }`}
                    style={{
                      top: '26px',
                      bottom: '-6px',
                    }}
                  />
                )}

                <button
                  onClick={() => onSelectTab(step.id)}
                  title={`${step.label}${step.isRequired ? ' *' : ''}`}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl text-xs transition-all duration-200 group text-left relative z-10 hover:bg-surface-container/50 ${collapsed ? 'justify-center p-2.5' : ''
                    }`}
                >
                  {/* Step Node Circle on Timeline with Icon: Main color when active, gray when inactive */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all relative ${isActive
                      ? 'bg-primary text-on-primary scale-105 shadow-xs'
                      : 'bg-surface-container text-on-surface-variant/60 border border-outline-variant/30 group-hover:text-primary group-hover:border-primary/40'
                      }`}
                  >
                    <IconComp s={14} />
                  </div>

                  {/* Step Details (when expanded) */}
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`truncate font-display leading-tight ${isActive
                            ? 'font-bold text-primary'
                            : 'font-medium text-on-surface-variant group-hover:text-on-surface'
                            }`}
                        >
                          {step.label}
                          {step.isRequired && <span className="text-red-500 font-bold ml-1">*</span>}
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Action: Collapse Toggle */}
      <div className="p-2 border-t border-outline-variant/30 flex items-center justify-between">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs transition-colors"
          title={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
        >
          <span className="transform transition-transform">
            {collapsed ? <Ic.ChevronRight s={16} /> : <Ic.ChevronLeft s={16} />}
          </span>
          {!collapsed && <span className="text-[11px] font-medium">Ciutkan Linimasa</span>}
        </button>
      </div>
    </aside>
  );
}
