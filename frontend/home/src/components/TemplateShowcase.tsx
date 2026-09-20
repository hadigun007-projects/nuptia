'use client';

import React, { useState } from 'react';
import { Eye, Heart, Sparkles, Star } from 'lucide-react';
import { TEMPLATES_DATA, TemplateItem } from '../data/mockData';
import DemoModal from './DemoModal';

type CategoryFilter = 'semua' | 'cheerful' | 'minimalis' | 'adat' | 'floral' | 'modern';

export default function TemplateShowcase() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('semua');
  const [selectedDemo, setSelectedDemo] = useState<TemplateItem | null>(null);

  const filteredTemplates = activeCategory === 'semua'
    ? TEMPLATES_DATA
    : TEMPLATES_DATA.filter(t => t.category === activeCategory);

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: 'semua', label: 'Semua Tema' },
    { key: 'cheerful', label: 'Ceria & Pastel' },
    { key: 'minimalis', label: 'Minimalis' },
    { key: 'adat', label: 'Adat Nusantara' },
    { key: 'floral', label: 'Floral Garden' },
    { key: 'modern', label: 'Modern Luxury' },
  ];

  return (
    <section id="tema" className="py-24 bg-gradient-to-b from-[#FCFBF7] via-[#FCFBF7] to-[#FFF9F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-100/90 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Koleksi Desain Penuh Cinta & Kebahagiaan</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Pilih Desain Cantik yang Bikin Hari Bahagiamu Makin Bersinar
          </h2>
          <p className="text-base text-stone-600 mt-4 leading-relaxed">
            Semua tema siap pakai dan gampang banget diedit! Dari gaya pastel ceria, sakral adat nusantara, sampai kemewahan modern yang memukau.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${activeCategory === cat.key
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md scale-105'
                : 'bg-white hover:bg-rose-50/50 text-stone-700 border border-amber-200/70 shadow-2xs'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="group bg-white rounded-3xl border border-rose-100/80 overflow-hidden shadow-xs hover:shadow-2xl hover:border-rose-300 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div className="relative h-80 overflow-hidden bg-stone-100">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase text-slate-900 shadow-xs border border-white">
                    {template.categoryLabel}
                  </span>
                  {template.isPopular && (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
                      Paling Favorit
                    </span>
                  )}
                  {template.isNew && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
                      Desain Baru
                    </span>
                  )}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{template.rating}</span>
                </div>

                {/* Hover Quick Overlay */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                  <button
                    onClick={() => setSelectedDemo(template)}
                    className="px-6 py-3 rounded-full bg-white text-slate-900 font-extrabold text-xs shadow-xl hover:bg-rose-50 transition transform hover:scale-105 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-rose-500" />
                    <span>Intip Demo Live</span>
                  </button>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Palette Swatches */}
                  <div className="flex items-center gap-1.5 mb-2.5">
                    {template.accentColors.map((color, idx) => (
                      <span
                        key={idx}
                        className="w-4 h-4 rounded-full border border-stone-200 shadow-2xs"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                    <span className="text-[11px] text-stone-500 font-medium ml-1">Palet Harmonis</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    {template.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-5 mt-5 border-t border-rose-100/70 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedDemo(template)}
                    className="text-xs font-bold text-slate-700 hover:text-rose-600 transition flex items-center gap-1.5 py-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Lihat Contoh</span>
                  </button>

                  <a
                    href="#buat"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-cheerful-gradient hover:text-white text-rose-700 text-xs font-bold transition shadow-2xs"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Pakai Tema Ini</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Helper */}
        <div className="mt-14 text-center">
          <p className="text-sm text-stone-600">
            Mau request kombinasi warna khusus atau ornamen unik?{' '}
            <a href="#faq" className="text-rose-600 font-bold underline hover:text-rose-700">
              Tim desainer kami siap bantu wujudkan!
            </a>
          </p>
        </div>

      </div>

      {/* Interactive Demo Modal */}
      <DemoModal
        template={selectedDemo}
        onClose={() => setSelectedDemo(null)}
      />
    </section>
  );
}
