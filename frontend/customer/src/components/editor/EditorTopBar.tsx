import React from 'react';
import { Status } from '../../types';
import { Ic } from '../common/Icons';
import { STATUS_STYLES } from '../common/UIComponents';

interface EditorTopBarProps {
  title: string;
  status: Status;
  showPreview: boolean;
  onBack: () => void;
  onTogglePreview: () => void;
  onSave: () => void;
  onChangeStatus: () => void;
}

export function EditorTopBar({
  title,
  status,
  showPreview,
  onBack,
  onTogglePreview,
  onSave,
  onChangeStatus,
}: EditorTopBarProps) {
  const statusMeta = STATUS_STYLES[status] || STATUS_STYLES.Draft;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-3 bg-surface-container-low/95 backdrop-blur-md border-b border-outline-variant/50">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-xs font-semibold"
        title="Kembali ke Daftar Undangan"
      >
        <Ic.ArrowLeft s={15} />
        <span className="hidden sm:inline">Daftar Undangan</span>
      </button>

      {/* Title & Brand */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
          <Ic.Heart s={15} cls="text-primary" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold text-on-surface leading-none font-display truncate">
              {title || 'Editor Undangan'}
            </h1>
          </div>
          <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 hidden xs:block">
            Nuptia Wedding Editor
          </p>
        </div>
      </div>

      {/* Toggle Preview button */}
      <button
        onClick={onTogglePreview}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-200 ${showPreview
          ? 'bg-primary-container text-on-primary-container border-primary/30'
          : 'bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high'
          }`}
      >
        <Ic.Eye s={15} />
        <span className="hidden sm:inline">Preview</span>
      </button>

      {/* Save button */}
      <button
        onClick={onSave}
        className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold active:scale-95 transition-all duration-200"
      >
        <Ic.Save s={15} />
        <span className="hidden sm:inline">Simpan</span>
      </button>
    </header>
  );
}
