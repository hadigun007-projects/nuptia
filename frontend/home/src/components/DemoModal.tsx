'use client';

import React from 'react';
import { X, ExternalLink, Sparkles, Check, Heart } from 'lucide-react';
import { TemplateItem } from '../data/mockData';

interface DemoModalProps {
  template: TemplateItem | null;
  onClose: () => void;
}

export default function DemoModal({ template, onClose }: DemoModalProps) {
  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full">
              {template.categoryLabel}
            </span>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              {template.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Banner & Preview */}
          <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-inner group">
            <img
              src={template.image}
              alt={template.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs font-medium text-amber-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Rating Pengguna {template.rating}/5.0</span>
              </span>
              <h4 className="font-serif text-2xl font-bold">{template.name}</h4>
              <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-lg">
                {template.description}
              </p>
            </div>
          </div>

          {/* Color Palettes & Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Palet Warna Utama</p>
              <div className="flex items-center gap-2">
                {template.accentColors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div
                      className="w-7 h-7 rounded-full border border-stone-300 shadow-xs"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-[11px] font-mono text-slate-500 uppercase">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Fitur Siap Pakai</p>
              <div className="text-xs text-slate-600 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Autoplay Musik Latar & Soundwave</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>RSVP Real-Time & Live Wishes</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Amplop Digital & Integrasi Google Maps</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-stone-100 bg-stone-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href="/demo/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-slate-800 text-xs sm:text-sm font-semibold transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka Undangan Demo Lengkap</span>
          </a>

          <a
            href="#buat"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-amber-500/25 transition"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Gunakan Tema {template.name}</span>
          </a>
        </div>

      </div>
    </div>
  );
}
