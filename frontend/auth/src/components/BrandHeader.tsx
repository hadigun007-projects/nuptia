import React from 'react';

interface BrandHeaderProps {
  subtitle?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-6">
      {/* Brand Icon */}
      <div className="relative mb-3 group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-[#D63384] flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 transform transition-transform group-hover:scale-105 duration-200">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-surface" />
      </div>

      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-black tracking-tight text-on-surface font-display">
          Nuptia
        </h1>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container border border-primary/20">
          ID Single Sign-On
        </span>
      </div>

      {subtitle && (
        <p className="text-xs text-on-surface-variant mt-1.5 max-w-xs font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};
