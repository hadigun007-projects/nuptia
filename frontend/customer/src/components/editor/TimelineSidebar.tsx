import React from 'react';
import { Tab } from '../../types';
import { MENU_ITEMS_15, MenuItemDef } from './MenuGridModal';
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
  { id: 'tema', stepNumber: 2, label: 'Tema Desain', subLabel: 'Template & warna', isRequired: true },
  { id: 'acara', stepNumber: 3, label: 'Acara', subLabel: 'Akad & resepsi', isRequired: true },
  { id: 'quote', stepNumber: 4, label: 'Kata Mutiara', subLabel: 'Ayat suci / doa' },
  { id: 'galeri', stepNumber: 5, label: 'Galeri Foto', subLabel: 'Cover & album' },
  { id: 'musik', stepNumber: 6, label: 'Musik', subLabel: 'Lagu pengiring' },
  { id: 'kisah-cinta', stepNumber: 7, label: 'Kisah Cinta', subLabel: 'Linimasa asmara' },
  { id: 'rsvp', stepNumber: 8, label: 'RSVP', subLabel: 'Konfirmasi tamu' },
  { id: 'kado', stepNumber: 9, label: 'Kado & Rekening', subLabel: 'Amplop digital' },
  { id: 'streaming', stepNumber: 10, label: 'Streaming', subLabel: 'Siaran live online' },
  { id: 'story-ig', stepNumber: 11, label: 'Story IG', subLabel: 'Filter AR & hashtag' },
  { id: 'buku-tamu', stepNumber: 12, label: 'Buku Tamu', subLabel: 'Tamu VIP & QR' },
  { id: 'ucapan', stepNumber: 13, label: 'Ucapan', subLabel: 'Moderasi restu' },
  { id: 'setting', stepNumber: 14, label: 'Setting', subLabel: 'Slug & privasi' },
  { id: 'kirim', stepNumber: 15, label: 'Kirim', subLabel: 'WhatsApp & sebar' },
];

interface TimelineSidebarProps {
  activeTab: Tab;
  onSelectTab: (tab: Tab) => void;
  completedSteps?: Partial<Record<Tab, boolean>>;
  onOpenGridModal: () => void;
  isTimelineMode: boolean;
  onToggleMode: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function TimelineSidebar({
  activeTab,
  onSelectTab,
  completedSteps = {},
  onOpenGridModal,
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
      className={`hidden lg:flex flex-col bg-surface-container-low border-r border-outline-variant/40 transition-all duration-300 flex-shrink-0 z-20 select-none ${
        collapsed ? 'w-[76px]' : 'w-[264px]'
      }`}
    >
      {/* Top Header & Mode Switcher */}
      <div className="p-3 border-b border-outline-variant/30 space-y-2.5">
        {/* Quick Grid Modal Button */}
        <button
          onClick={onOpenGridModal}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary-container/80 text-on-primary-container hover:bg-primary-container transition-all duration-200 font-bold text-xs shadow-2xs group ${
            collapsed ? 'px-0' : ''
          }`}
          title="Buka Menu Cepat (Grid 3x5)"
        >
          <span className="text-primary group-hover:scale-110 transition-transform">
            <Ic.Grid s={17} />
          </span>
          {!collapsed && <span>Semua Menu (3x5)</span>}
        </button>

        {/* Mode Toggle Pill */}
        {!collapsed && (
          <div className="flex items-center p-1 rounded-xl bg-surface-container border border-outline-variant/40 text-[11px] font-semibold">
            <button
              onClick={() => {
                if (!isTimelineMode) onToggleMode();
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                isTimelineMode
                  ? 'bg-primary text-on-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Ic.Sparkles s={13} />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => {
                if (isTimelineMode) onToggleMode();
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                !isTimelineMode
                  ? 'bg-primary text-on-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Ic.Check s={13} />
              <span>Kategori</span>
            </button>
          </div>
        )}

        {/* Progress bar info */}
        {!collapsed && (
          <div className="pt-1 px-1 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-on-surface font-display">
                Langkah {currentStepNumber} dari {TIMELINE_STEPS.length}
              </span>
              <span className="font-extrabold text-primary font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(6, progressPercent)}%` }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant">
              {completedCount} dari 15 tahapan selesai diisi
            </p>
          </div>
        )}
      </div>

      {/* Timeline Stepper List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 relative">
        {/* Continuous Vertical Line */}
        <div
          className={`absolute top-4 bottom-8 w-0.5 bg-outline-variant/50 pointer-events-none transition-all ${
            collapsed ? 'left-[37px]' : 'left-[29px]'
          }`}
        />

        <div className="space-y-1 relative z-10">
          {TIMELINE_STEPS.map((step, idx) => {
            const def = getDef(step.id);
            const IconComp = def.Icon;
            const isActive = activeTab === step.id;
            const isCompleted = Boolean(completedSteps[step.id]);
            const isPast = idx < currentStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => onSelectTab(step.id)}
                title={`${step.stepNumber}. ${step.label} (${isCompleted ? 'Selesai' : step.isRequired ? 'Wajib' : 'Opsional'})`}
                className={`w-full flex items-center gap-3 p-2 rounded-xl text-xs transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-primary-container/40 border border-primary/25 shadow-2xs'
                    : 'hover:bg-surface-container/70 border border-transparent'
                } ${collapsed ? 'justify-center p-2.5' : ''}`}
              >
                {/* Step Node Circle on Timeline */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-primary text-on-primary ring-4 ring-primary/20 shadow-xs scale-105'
                      : isCompleted
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : isPast
                      ? 'bg-surface-container-high text-on-surface-variant border border-outline-variant'
                      : 'bg-surface-container text-on-surface-variant/70 border border-outline-variant/40'
                  }`}
                >
                  {isCompleted ? (
                    <Ic.Check s={14} />
                  ) : (
                    <span className="font-mono text-[11px]">{step.stepNumber}</span>
                  )}

                  {/* Pulsing indicator for active step */}
                  {isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-white animate-pulse" />
                  )}
                </div>

                {/* Step Details (when expanded) */}
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`truncate font-display leading-tight ${
                          isActive
                            ? 'font-bold text-primary'
                            : isCompleted
                            ? 'font-semibold text-on-surface'
                            : 'font-medium text-on-surface/85'
                        }`}
                      >
                        {step.label}
                      </span>

                      {/* Status Tag */}
                      {isCompleted ? (
                        <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                          ✓
                        </span>
                      ) : step.isRequired ? (
                        <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 text-[9px] font-bold">
                          Wajib
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded-md bg-surface-container-high text-on-surface-variant text-[9px]">
                          Opsi
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-on-surface-variant/80 group-hover:text-primary transition-colors">
                        <IconComp s={12} />
                      </span>
                      <p className="text-[10px] text-on-surface-variant truncate">
                        {step.subLabel}
                      </p>
                    </div>
                  </div>
                )}
              </button>
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
