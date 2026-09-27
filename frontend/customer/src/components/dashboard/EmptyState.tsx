import React from 'react';
import { Ic } from '../common/Icons';

interface EmptyStateProps {
  isSearch: boolean;
  onReset: () => void;
  onCreateNew: () => void;
}

export function EmptyState({ isSearch, onReset, onCreateNew }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-3xl border border-dashed border-neutral-300 max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-[#fae8f3] text-[#9c177c] flex items-center justify-center mb-4">
        {isSearch ? <Ic.Search s={28} /> : <Ic.Heart s={28} />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
        {isSearch ? 'Tidak Ada Undangan Ditemukan' : 'Belum Ada Undangan Pernikahan'}
      </h3>
      <p className="text-xs sm:text-sm text-neutral-600 max-w-xs mt-1 leading-relaxed">
        {isSearch
          ? 'Coba gunakan kata kunci pencarian yang lain atau ubah filter status yang aktif.'
          : 'Mulai buat undangan pernikahan digital pertamamu dalam hitungan menit dan sebar dengan mudah.'}
      </p>

      <div className="mt-5 flex items-center gap-3">
        {isSearch ? (
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Reset Pencarian
          </button>
        ) : (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9c177c] hover:bg-[#851369] text-white text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer"
          >
            <Ic.Plus s={16} />
            <span>Buat Undangan Sekarang</span>
          </button>
        )}
      </div>
    </div>
  );
}
