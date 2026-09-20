import React, { useState } from 'react';
import { CreateInvitationInput } from '../../types';
import { TEMPLATE_OPTIONS } from '../../data/seedData';
import { Ic } from '../common/Icons';
import { M3Field } from '../common/UIComponents';

interface CreateInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: CreateInvitationInput) => void;
}

export function CreateInvitationModal({ isOpen, onClose, onCreate }: CreateInvitationModalProps) {
  const [groomNick, setGroomNick] = useState('');
  const [brideNick, setBrideNick] = useState('');
  const [weddingDate, setWeddingDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().split('T')[0];
  });
  const [templateId, setTemplateId] = useState(TEMPLATE_OPTIONS[0].id);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groomNick.trim() || !brideNick.trim()) {
      setError('Mohon isi nama panggilan kedua mempelai');
      return;
    }
    setError('');
    onCreate({
      groomNick: groomNick.trim(),
      brideNick: brideNick.trim(),
      weddingDate,
      templateId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in-up">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-[28px] border border-outline-variant/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary">
              <Ic.Sparkles s={16} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-on-surface font-display">Buat Undangan Baru</h2>
              <p className="text-[11px] text-on-surface-variant font-medium">Langkah awal menciptakan undangan impian</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <Ic.Close s={18} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold flex items-center gap-2">
              <Ic.Close s={14} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-2">
              Nama Pasangan Mempelai
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <M3Field
                label="Nama Panggilan Pria"
                placeholder="Contoh: Reza"
                value={groomNick}
                onChange={setGroomNick}
                required
              />
              <M3Field
                label="Nama Panggilan Wanita"
                placeholder="Contoh: Hana"
                value={brideNick}
                onChange={setBrideNick}
                required
              />
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-2">
              Tanggal Pernikahan
            </span>
            <M3Field
              label="Tanggal Acara"
              type="date"
              value={weddingDate}
              onChange={setWeddingDate}
              required
            />
          </div>

          <div>
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-2">
              Pilihan Tema Desain Awal
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {TEMPLATE_OPTIONS.map((tpl) => {
                const isSelected = templateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateId(tpl.id)}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? 'border-primary bg-primary-container/30 ring-2 ring-primary/40'
                        : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tpl.color }}
                      />
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                          <Ic.Check s={12} />
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface font-display truncate">{tpl.name}</p>
                      <p className="text-[10px] text-on-surface-variant">{tpl.tagline}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold active:scale-95 transition-all duration-200"
            >
              <span>Buat & Buka Editor</span>
              <Ic.ArrowLeft s={15} cls="rotate-180" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
