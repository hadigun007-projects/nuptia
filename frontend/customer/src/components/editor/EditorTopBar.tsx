import React from 'react';
import { Status } from '../../types';
import { Ic } from '../common/Icons';
import { STATUS_STYLES } from '../common/UIComponents';

interface EditorTopBarProps {
  title: string;
  status: Status;
  autoSaving: boolean;
  showPreview: boolean;
  onBack: () => void;
  onTogglePreview: () => void;
  onSave: () => void;
  onChangeStatus: () => void;
  onOpenGridModal?: () => void;
}

export function EditorTopBar({
  title,
  status,
  autoSaving,
  showPreview,
  onBack,
  onTogglePreview,
  onSave,
  onChangeStatus,
  onOpenGridModal,
}: EditorTopBarProps) {
  const statusMeta = STATUS_STYLES[status] || STATUS_STYLES.Draft;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-3 bg-surface-container-low/95 backdrop-blur-md border-b border-outline-variant/50 shadow-xs">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-on-surface-variant bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 transition-colors mr-1"
        title="Kembali ke Daftar Undangan"
      >
        <Ic.ArrowLeft s={16} />
        <span className="hidden sm:inline">Daftar Undangan</span>
      </button>

      {/* Brand & Invitation Title */}
      <div className="flex items-center gap-2 mr-auto min-w-0">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-xs">
          <Ic.Heart s={14} cls="text-on-primary" />
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

      {/* Quick Menu Launcher (Grid 3x5) */}
      {onOpenGridModal && (
        <button
          onClick={onOpenGridModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary-container text-on-primary-container hover:bg-primary-container/80 transition-all shadow-2xs"
          title="Buka Menu 3x5"
        >
          <Ic.Grid s={15} />
          <span className="hidden md:inline">Menu (3x5)</span>
        </button>
      )}

      {/* Status cycle button */}
      <button
        onClick={onChangeStatus}
        title="Klik untuk mengubah status (Draft → Published → Live)"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:opacity-90 ${statusMeta.badge}`}
      >
        {status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />}
        {status}
      </button>

      {/* Autosave indicator */}
      {autoSaving ? (
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin-slow" />
          Menyimpan…
        </span>
      ) : (
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant">
          <Ic.Cloud s={14} cls="text-primary" /> Tersimpan
        </span>
      )}

      {/* Toggle Preview button */}
      <button
        onClick={onTogglePreview}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-200 ${
          showPreview
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
        className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
      >
        <Ic.Save s={15} />
        <span className="hidden sm:inline">Simpan</span>
      </button>
    </header>
  );
}
