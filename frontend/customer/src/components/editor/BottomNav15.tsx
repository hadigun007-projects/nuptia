import React, { useState } from 'react';
import { Tab } from '../../types';
import { MENU_ITEMS_15, CATEGORY_STEPS } from './menuConstants';
import { Ic } from '../common/Icons';

interface BottomNav15Props {
  activeTab: Tab;
  onSelectTab: (tab: Tab) => void;
}

export function BottomNav15({ activeTab, onSelectTab }: BottomNav15Props) {
  const [isOpen, setIsOpen] = useState(false);
  const currentIndex = MENU_ITEMS_15.findIndex((m) => m.id === activeTab);
  const currentDef = MENU_ITEMS_15[currentIndex] || MENU_ITEMS_15[0];
  const CurrentIcon = currentDef.Icon;

  const currentCategory =
    CATEGORY_STEPS.find((c) => c.items.includes(activeTab)) || CATEGORY_STEPS[0];

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + MENU_ITEMS_15.length) % MENU_ITEMS_15.length;
    onSelectTab(MENU_ITEMS_15[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % MENU_ITEMS_15.length;
    onSelectTab(MENU_ITEMS_15[nextIdx].id);
  };

  const handlePickSection = (id: Tab) => {
    setIsOpen(false);
    onSelectTab(id);
  };

  return (
    <>
      {/* Quick Jump Drawer Modal for Mobile */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-h-[75vh] bg-surface-container-lowest rounded-t-[32px] p-5 border-t border-outline-variant/40 flex flex-col space-y-4 overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <div>
                <h3 className="text-sm font-extrabold text-on-surface font-display">
                  Daftar Isi Formulir Undangan
                </h3>
                <p className="text-[11px] text-on-surface-variant">
                  Pilih bagian untuk langsung melompat ke posisi isian
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <Ic.Close s={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {CATEGORY_STEPS.map((cat) => (
                <div key={cat.key} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase font-display tracking-wider">
                    <span className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold">
                      {cat.stepNumber}
                    </span>
                    <span>{cat.title}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {cat.items.map((tabId) => {
                      const itemDef =
                        MENU_ITEMS_15.find((m) => m.id === tabId) || MENU_ITEMS_15[0];
                      const Icon = itemDef.Icon;
                      const isActive = activeTab === tabId;
                      return (
                        <button
                          key={tabId}
                          onClick={() => handlePickSection(tabId)}
                          className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                            isActive
                              ? 'text-primary font-bold bg-primary/10'
                              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                          }`}
                        >
                          <span
                            className={
                              isActive
                                ? 'text-primary'
                                : tabId === 'kirim'
                                ? 'text-amber-500'
                                : 'text-on-surface-variant'
                            }
                          >
                            <Icon s={16} />
                          </span>
                          <span className="truncate">{itemDef.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-3 py-2 bg-surface/95 backdrop-blur-md border-t border-outline-variant/40 shadow-lg">
        {/* Previous Section button */}
        <button
          onClick={handlePrev}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface active:scale-95 transition-all cursor-pointer"
          title="Bagian Sebelumnya"
        >
          <Ic.ChevronLeft s={20} />
        </button>

        {/* Center active section badge (clickable to open quick jump) */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/50 active:scale-95 transition-all cursor-pointer"
          title="Buka Daftar Isi Formulir"
        >
          <span className="text-primary">
            <CurrentIcon s={16} />
          </span>
          <div className="flex flex-col text-left">
            <span className="font-display text-xs font-bold text-on-surface truncate max-w-[130px]">
              {currentDef.label}
            </span>
            <span className="text-[9px] text-on-surface-variant font-medium">
              Kategori {currentCategory.stepNumber} • Ketuk untuk pilih
            </span>
          </div>
          <Ic.ChevronUp s={14} cls="text-on-surface-variant" />
        </button>

        {/* Next Section button */}
        <button
          onClick={handleNext}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface active:scale-95 transition-all cursor-pointer"
          title="Bagian Selanjutnya"
        >
          <Ic.ChevronRight s={20} />
        </button>
      </nav>
    </>
  );
}
