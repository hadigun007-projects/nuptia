import React from 'react';
import { Ic } from '../common/Icons';

interface DashboardTopBarProps {
  onOpenCreateModal: () => void;
}

export function DashboardTopBar({ onOpenCreateModal }: DashboardTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 bg-surface-container-low/95 backdrop-blur-md border-b border-outline-variant/40 shadow-xs">
      {/* Brand logo & workspace label */}
      <div className="flex items-center gap-3">
        <a href="#/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Ic.Heart s={15} cls="text-on-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-on-surface leading-none font-display">Nuptia</h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container">
                Customer Workspace
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">Kelola Undangan Pernikahanmu</p>
          </div>
        </a>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Create new invitation button */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 hover:bg-primary/95"
        >
          <Ic.Plus s={16} />
          <span className="inline">Buat Undangan Baru</span>
        </button>

        {/* User avatar chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/50">
          <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs shadow-xs border border-secondary/20">
            H
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-on-surface leading-tight">Hadiyah</span>
            <span className="text-[10px] text-on-surface-variant">Customer VIP</span>
          </div>
        </div>
      </div>
    </header>
  );
}
