'use client';

import React from 'react';

export default function FloatingPolaroids() {
 return (
 <>
 {/* POLAROID UTAMA (PERSIS SEPERTI GAMBAR REFERENSI USER) */}
 <div className="hidden lg:block absolute -top-10 -left-16 sm:-left-24 z-20 animate-float-polaroid-1 pointer-events-auto group">
 <div className="relative w-48 sm:w-56 bg-white p-3 sm:p-3.5 pb-6 sm:pb-7 rounded-xl shadow-2xl border border-stone-200/90 -rotate-3 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1">
 
 {/* 1. Yellow/Mustard Masking Tape / Washi Tape di Atas */}
 <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-6 sm:h-7 bg-[#F6CE57]/90 backdrop-blur-xs border-y border-amber-400/40 shadow-xs z-30 flex items-center justify-center">
 <div className="w-full h-[1px] bg-amber-400/30"></div>
 </div>

 {/* 2. Golden Line Art Leaves Sprouting from Top-Left Corner (Persis referensi) */}
 <div className="absolute -top-8 -left-8 w-20 h-20 pointer-events-none z-10">
 <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
 {/* Batang Cabang Emas */}
 <path d="M70 70 Q40 40 10 10" stroke="#DCA234" strokeWidth="1.6" strokeLinecap="round" />
 {/* Daun Emas 1 */}
 <path
 d="M45 45 C30 25, 45 10, 60 25 C75 40, 60 55, 45 45 Z"
 stroke="#DCA234"
 strokeWidth="1.4"
 fill="#FDF0C8"
 />
 <path d="M45 45 Q53 35 60 25" stroke="#DCA234" strokeWidth="1" />
 {/* Daun Emas 2 */}
 <path
 d="M25 25 C10 15, 15 -5, 30 5 C45 15, 35 35, 25 25 Z"
 stroke="#DCA234"
 strokeWidth="1.4"
 fill="#FDF0C8"
 />
 </svg>
 </div>

 {/* 3. Golden Line Art Leaves Sprouting from Bottom-Right Corner (Persis referensi) */}
 <div className="absolute -bottom-10 -right-8 w-24 h-24 pointer-events-none z-10">
 <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
 {/* Batang Bawah Emas */}
 <path d="M20 20 Q50 60 85 90" stroke="#DCA234" strokeWidth="1.6" strokeLinecap="round" />
 {/* Daun Bawah 1 */}
 <path
 d="M45 50 C60 40, 75 55, 65 70 C55 85, 40 70, 45 50 Z"
 stroke="#DCA234"
 strokeWidth="1.4"
 fill="#FDF0C8"
 />
 <path d="M45 50 Q55 60 65 70" stroke="#DCA234" strokeWidth="1" />
 {/* Daun Bawah 2 */}
 <path
 d="M65 70 C80 60, 95 75, 85 90 C75 105, 60 90, 65 70 Z"
 stroke="#DCA234"
 strokeWidth="1.4"
 fill="#FDF0C8"
 />
 </svg>
 </div>

 {/* 4. Foto Momen Pernikahan (Groom in Suit, Bride holding bouquet) */}
 <div className="relative w-full h-44 sm:h-52 rounded-md overflow-hidden bg-stone-100 shadow-inner">
 <img
 src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"
 alt="Momen Indah Mempelai"
 className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
 />
 </div>

 {/* Caption Halus Minimalis */}
 <div className="mt-2 text-center">
 <p className="font-serif text-xs font-bold text-slate-800 tracking-wide">
 Arya & Sarah
 </p>
 <p className="text-[10px] text-stone-500 font-medium tracking-widest uppercase">
 24 • 10 • 2026
 </p>
 </div>
 </div>
 </div>

 {/* POLAROID KEDUA: Di Sisi Kanan Bawah */}
 <div className="hidden xl:block absolute -bottom-12 -right-14 z-20 animate-float-polaroid-2 pointer-events-auto group">
 <div className="relative w-44 bg-white p-2.5 pb-5 rounded-xl shadow-2xl border border-stone-200/90 rotate-4 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2">
 {/* Washi Tape */}
 <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#F6CE57]/90 backdrop-blur-xs border-y border-amber-400/40 shadow-xs z-30"></div>
 
 <div className="relative w-full h-36 rounded-md overflow-hidden bg-stone-100 shadow-inner">
 <img
 src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop"
 alt="Cincin & Bunga"
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 />
 </div>

 <div className="mt-1.5 text-center">
 <p className="font-serif text-[11px] font-bold text-slate-800 tracking-wide">
 The Sacred Vows 
 </p>
 </div>
 </div>
 </div>
 </>
 );
}
