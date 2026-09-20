import React from 'react';
import { Tab } from '../../types';
import { TIMELINE_STEPS } from './TimelineSidebar';
import { Ic } from '../common/Icons';

interface StepNavigationFooterProps {
  currentTab: Tab;
  onNavigateTab: (tab: Tab) => void;
  onCompleteCreation?: () => void;
}

export function StepNavigationFooter({
  currentTab,
  onNavigateTab,
  onCompleteCreation,
}: StepNavigationFooterProps) {
  const currentIndex = TIMELINE_STEPS.findIndex((s) => s.id === currentTab);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentStep = TIMELINE_STEPS[safeIndex];

  const prevStep = safeIndex > 0 ? TIMELINE_STEPS[safeIndex - 1] : null;
  const nextStep = safeIndex < TIMELINE_STEPS.length - 1 ? TIMELINE_STEPS[safeIndex + 1] : null;
  const isLast = safeIndex === TIMELINE_STEPS.length - 1;

  const handleNext = () => {
    if (nextStep) {
      onNavigateTab(nextStep.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (isLast && onCompleteCreation) {
      onCompleteCreation();
    }
  };

  const handlePrev = () => {
    if (prevStep) {
      onNavigateTab(prevStep.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-8 pt-5 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Back / Prev Button */}
      {prevStep ? (
        <button
          type="button"
          onClick={handlePrev}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-all text-xs font-bold active:scale-95 shadow-2xs"
        >
          <Ic.ArrowLeft s={15} />
          <span>Sebelumnya: {prevStep.label}</span>
        </button>
      ) : (
        <div className="hidden sm:block text-[11px] text-on-surface-variant font-medium">
          Langkah pertama: Pengantin
        </div>
      )}

      {/* Center step indicator */}
      <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
        <span className="font-mono text-primary font-bold">
          {safeIndex + 1} / {TIMELINE_STEPS.length}
        </span>
        <span className="hidden md:inline text-outline">•</span>
        <span className="hidden md:inline font-display">{currentStep.label}</span>
      </div>

      {/* Next / Finish Button */}
      {nextStep ? (
        <button
          type="button"
          onClick={handleNext}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary/95 transition-all text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 group"
        >
          <span>Lanjut ke: {nextStep.label}</span>
          <span className="group-hover:translate-x-1 transition-transform">
            <Ic.ArrowRight s={15} />
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95"
        >
          <Ic.Check s={16} />
          <span>Selesai & Bagikan Undangan</span>
        </button>
      )}
    </div>
  );
}
