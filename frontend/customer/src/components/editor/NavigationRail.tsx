import React from 'react';
import { Tab } from '../../types';
import { Ic } from '../common/Icons';

export const NAV_ITEMS: { id: Tab; label: string; Icon: React.FC<{ s?: number; cls?: string }> }[] = [
  { id: 'event', label: 'Detail Event', Icon: Ic.Calendar },
  { id: 'media', label: 'Media Studio', Icon: Ic.Image },
  { id: 'guests', label: 'Tamu & Hadiah', Icon: Ic.People },
];

export function NavigationRail({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="hidden lg:flex flex-col items-center gap-1 w-20 pt-6 pb-4 bg-surface-container-low border-r border-outline-variant/40 flex-shrink-0">
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1.5 w-full py-3 px-1 rounded-2xl transition-all duration-200 ${
              isActive ? 'text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span
              className={`w-14 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                isActive ? 'bg-secondary-container' : ''
              }`}
            >
              <Icon s={20} />
            </span>
            <span className="text-[10px] font-semibold leading-tight text-center">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex bg-surface-container-low/95 backdrop-blur border-t border-outline-variant/40">
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-200 ${
              isActive ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <span
              className={`w-12 h-7 flex items-center justify-center rounded-full transition-all duration-200 ${
                isActive ? 'bg-primary-container' : ''
              }`}
            >
              <Icon s={20} />
            </span>
            <span className="text-[10px] font-semibold">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
