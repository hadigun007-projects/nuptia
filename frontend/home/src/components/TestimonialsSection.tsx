'use client';

import React from 'react';
import { Star, Heart } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/mockData';

export default function TestimonialsSection() {
 return (
 <section id="testimoni" className="py-24 bg-gradient-to-b from-[#FFF9F5] via-[#FFF7F2] to-[#FAF4EC] relative">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 {/* Section Header */}
 <div className="text-center max-w-3xl mx-auto mb-16">
 <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-widest mb-3">
 <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
 <span>Kisah Manis Pengantin Nuptia</span>
 </div>
 <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
 Cerita Bahagia dari Mereka yang Sudah Menikah
 </h2>
 <p className="text-base text-stone-600 mt-4 leading-relaxed">
 Ikut senang bisa menjadi bagian kecil dari hari paling bersejarah bagi ribuan pasangan di seluruh Indonesia.
 </p>
 </div>

 {/* Testimonials Grid */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {TESTIMONIALS_DATA.map(item => (
 <div
 key={item.id}
 className="p-8 rounded-3xl bg-white border border-rose-100 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group"
 >
 <div>
 <div className="flex items-center justify-between mb-4">
 {/* 5-Star Rating */}
 <div className="flex items-center gap-1 text-amber-400">
 {[...Array(item.rating)].map((_, i) => (
 <Star key={i} className="w-4 h-4 fill-amber-400" />
 ))}
 </div>

 {/* Reaction Emoji Badge */}
 <span className="text-xl group-hover:scale-125 transition-transform">
 {item.reactionEmoji}
 </span>
 </div>

 {/* Quote Text */}
 <p className="text-stone-700 text-sm sm:text-base leading-relaxed italic mb-6">
 "{item.quote}"
 </p>
 </div>

 {/* Author Details */}
 <div className="pt-5 border-t border-rose-100 flex items-center gap-3.5">
 <img
 src={item.image}
 alt={item.couple}
 className="w-13 h-13 rounded-full object-cover ring-2 ring-rose-400/60 shadow-xs"
 />
 <div>
 <h4 className="font-serif text-base font-extrabold text-slate-900 leading-tight">
 {item.couple}
 </h4>
 <p className="text-xs text-stone-500 mt-0.5">
 {item.city} • Tema: <strong className="text-rose-600 font-bold">{item.templateUsed}</strong>
 </p>
 </div>
 </div>
 </div>
 ))}
 </div>

 </div>
 </section>
 );
}
