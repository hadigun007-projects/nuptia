import React from 'react';
import { Tab } from '../../types';
import { MENU_ITEMS_15 } from './menuConstants';
import { Ic } from '../common/Icons';

interface BottomNav15Props {
  activeTab: Tab;
  onSelectTab: (tab: Tab) => void;
}

export function BottomNav15({ activeTab, onSelectTab }: BottomNav15Props) {
  const currentIndex = MENU_ITEMS_15.findIndex((m) => m.id === activeTab);
  const currentDef = MENU_ITEMS_15[currentIndex] || MENU_ITEMS_15[0];
  const CurrentIcon = currentDef.Icon;

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + MENU_ITEMS_15.length) % MENU_ITEMS_15.length;
    onSelectTab(MENU_ITEMS_15[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % MENU_ITEMS_15.length;
    onSelectTab(MENU_ITEMS_15[nextIdx].id);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between px-3 py-2 bg-surface-container-low/95 backdrop-blur border-t border-outline-variant/40 shadow-lg">
      {/* Previous Tab button */}
      <button
        onClick={handlePrev}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
        title="Menu Sebelumnya"
      >
        <Ic.ChevronLeft s={20} />
      </button>

      {/* Center active tab info badge */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary font-bold text-xs shadow-md">
        <span className="text-on-primary">
          <CurrentIcon s={17} />
        </span>
        <span className="font-display max-w-[140px] truncate">{currentDef.label}</span>
      </div>

      {/* Next Tab button */}
      <button
        onClick={handleNext}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
        title="Menu Selanjutnya"
      >
        <Ic.ChevronRight s={20} />
      </button>
    </nav>
  );
}
