'use client';

import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import PhoneMockup from './PhoneMockup';
import FloralDecorations from './FloralDecorations';
import confetti from 'canvas-confetti';

export default function HeroSection() {

 const triggerConfetti = () => {
 try {
 confetti({
 particleCount: 80,
 spread: 75,
 origin: { y: 0.6 },
 colors: ['#FF6B4A', '#F59E0B', '#FBBF24', '#10B981', '#EC4899']
 });
 } catch (e) { }
 };

 return (
 <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF4EC] to-[#FAF4EC]">

 {/* 1. Background Botanical Line-Art & Pastel Watercolor (Kualitas Tinggi Persis Gambar Referensi) */}
 <FloralDecorations />

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

 {/* SISI KIRI: Headline, Subheadline & Tombol Coral (Persis Gambar Referensi) */}
 <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

 {/* Headline Utama Persis Gambar Referensi */}
 <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
 Undangan Web yang Bikin Tamu Gak Enak Hati Kalo Gak Ngamplop
 </h1>

 {/* Sub-headline */}
 <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
 Bikin undangan pernikahan digital impianmu dalam 5 menit! Dilengkapi amplop digital & QRIS langsung ke rekening pribadi tanpa potongan, musik romantis autoplay, dan RSVP WhatsApp otomatis.
 </p>

 {/* Tombol Coral / Salmon Persis Gambar Referensi */}
 <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
 <a
 href="#testimoni"
 className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF7E65] to-[#FF6247] hover:from-[#FF6E52] hover:to-[#FF5436] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95"
 >
 <span>↓ Testimoni</span>
 </a>

 <a
 href="#buat"
 onClick={triggerConfetti}
 className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white hover:bg-stone-50 border-2 border-amber-300 text-slate-900 font-extrabold text-sm shadow-xs transition-all transform hover:-translate-y-0.5 active:scale-95"
 >
 <span>Mulai Buat Gratis</span>
 <ArrowRight className="w-4 h-4 text-amber-600" />
 </a>
 </div>
 </div>

 {/* SISI KANAN: Interactive Phone Mockup (Default) */}
 <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
 <PhoneMockup />
 </div>

 </div>
 </div>
 </section>
 );
}
