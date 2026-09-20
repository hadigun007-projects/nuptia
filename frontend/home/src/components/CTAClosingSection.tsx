'use client';

import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CTAClosingSection() {
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF6B4A', '#F59E0B', '#FBBF24', '#10B981', '#EC4899'],
      });
    } catch (e) {}
  };

  return (
    <section
      id="buat"
      className="pt-36 pb-28 relative overflow-hidden text-white"
      style={{
        background: 'linear-gradient(180deg, #FAF4EC 0%, #EFE2D4 10%, #CBA992 22%, #865E47 38%, #4A3123 54%, #261914 72%, #17110E 100%)'
      }}
    >
      
      {/* Warm Ambient Blur Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-gradient-to-r from-rose-500/25 via-amber-500/20 to-orange-500/25 blur-3xl pointer-events-none -z-0"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/60 border border-amber-300/40 text-amber-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Langkah Awal Menuju Hari Bahagia</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-3xl mx-auto">
          Yuk, Wujudkan Undangan Pernikahan Impianmu Sekarang!
        </h2>

        <p className="text-base sm:text-lg text-rose-100/80 max-w-2xl mx-auto leading-relaxed">
          Gak perlu tunggu lama atau bingung mikir biaya. Coba dulu gratis bareng pasangan, pilih tema yang paling kalian suka, dan rasakan mudahnya berbagi kebahagiaan!
        </p>

        {/* Cheerful High-converting Button with Confetti */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#tema"
            onClick={triggerConfetti}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-cheerful-gradient hover:opacity-95 text-white font-extrabold text-base shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95 group"
          >
            <span>Bikin Undangan Saya Sekarang</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </a>

          <a
            href="https://wa.me/6281234567890?text=Halo%20Nuptia,%20saya%20mau%20konsultasi%20undangan%20pernikahan"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition"
          >
            <span>Tanya-Tanya via WhatsApp</span>
          </a>
        </div>

        {/* Micro Guarantees */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-rose-200/90 font-bold">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Gratis Coba 3 Hari
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Tanpa Kartu Kredit
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Dibantu Sampai Beres 100%
          </span>
        </div>

      </div>
    </section>
  );
}
