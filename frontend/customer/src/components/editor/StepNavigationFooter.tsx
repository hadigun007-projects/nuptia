import React from 'react';
import { Tab } from '../../types';
import { TIMELINE_STEPS } from './TimelineSidebar';
import { CATEGORY_STEPS } from './menuConstants';
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

  const currentCategory = CATEGORY_STEPS.find((c) => c.items.includes(currentTab)) || CATEGORY_STEPS[0];
  const itemIndexInCat = currentCategory.items.indexOf(currentTab);

  const nextCategory = nextStep ? CATEGORY_STEPS.find((c) => c.items.includes(nextStep.id)) : null;
  const isEnteringNewCategory = Boolean(nextCategory && nextCategory.key !== currentCategory.key);

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
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-all text-xs font-bold active:scale-95 cursor-pointer"
        >
          <Ic.ArrowLeft s={15} />
          <span>Sebelumnya: {prevStep.label}</span>
        </button>
      ) : (
        <div className="hidden sm:block text-[11px] text-on-surface-variant font-medium">
          Langkah pertama: Pengantin
        </div>
      )}

      {/* Center Category & Step Indicator */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Kategori {currentCategory.stepNumber} dari 4: {currentCategory.title}</span>
        </div>
        <div className="text-[11px] text-on-surface-variant font-medium mt-0.5 flex items-center gap-1">
          <span className="font-semibold text-on-surface font-display">{currentStep.label}</span>
          <span className="text-on-surface-variant/60">
            ({itemIndexInCat + 1} dari {currentCategory.items.length})
          </span>
        </div>
      </div>

      {/* Next / Finish Button */}
      {nextStep ? (
        <button
          type="button"
          onClick={handleNext}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary/95 transition-all text-xs sm:text-sm font-bold active:scale-95 group cursor-pointer shadow-xs"
        >
          <span>
            Lanjut: {nextStep.label}
            {isEnteringNewCategory && (
              <span className="hidden md:inline text-on-primary/80 font-normal ml-1">
                ({nextCategory?.title})
              </span>
            )}
          </span>
          <span className="group-hover:translate-x-1 transition-transform">
            <Ic.ArrowRight s={15} />
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-xs sm:text-sm font-bold active:scale-95 cursor-pointer shadow-xs"
        >
          <Ic.Check s={16} />
          <span>Selesai & Bagikan Undangan</span>
        </button>
      )}
    </div>
  );
}
