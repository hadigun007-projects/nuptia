'use client';

import React from 'react';

export default function FloralDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none">
      
      {/* 1. TOP-LEFT BOTANICAL WATERCOLOR (100% PNG Transparan, Tanpa Kotak Putih, Tidak Menabrak Background) */}
      <div className="absolute -top-10 -left-10 sm:-top-12 sm:-left-12 w-72 sm:w-[420px] lg:w-[480px] h-72 sm:h-[420px] lg:h-[480px] opacity-75 sm:opacity-85 pointer-events-none z-0">
        <img
          src="/botanical-corner.png"
          alt="Botanical Watercolor"
          className="w-full h-full object-contain -rotate-6"
        />
      </div>

    </div>
  );
}
