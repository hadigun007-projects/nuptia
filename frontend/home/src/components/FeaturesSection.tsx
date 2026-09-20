'use client';

import React from 'react';
import { Send, MessageSquareHeart, Music, Wallet, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { FEATURES_DATA } from '../data/mockData';

export default function FeaturesSection() {
 const getIcon = (name: string) => {
 switch (name) {
 case 'Send':
 return <Send className="w-6 h-6 text-rose-500" />;
 case 'MessageSquareHeart':
 return <MessageSquareHeart className="w-6 h-6 text-rose-500" />;
 case 'Music':
 return <Music className="w-6 h-6 text-amber-500" />;
 case 'Wallet':
 return <Wallet className="w-6 h-6 text-emerald-500" />;
 case 'MapPin':
 return <MapPin className="w-6 h-6 text-blue-500" />;
 default:
 return <Sparkles className="w-6 h-6 text-amber-500" />;
 }
 };

 return (
 <section id="fitur" className="py-24 bg-gradient-to-b from-[#FFF9F5] via-[#FFF6F0] to-[#FAF5EE] relative">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 {/* Section Header */}
 <div className="text-center max-w-3xl mx-auto mb-16">
 <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-widest mb-3">
 <span>Serba Praktis & Bikin Bahagia</span>
 </div>
 <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
 Fitur Ajaib yang Bikin Calon Pengantin & Tamu Happy!
 </h2>
 <p className="text-base text-stone-600 mt-4 leading-relaxed">
 Semua kemudahan tercanggih dalam satu link cantik. Gak perlu install aplikasi, langsung terbuka mulus di semua jenis smartphone.
 </p>
 </div>

 {/* Feature Cards Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {FEATURES_DATA.map(feature => (
 <div
 key={feature.id}
 className="p-8 rounded-3xl bg-white border border-rose-100/90 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 transform hover:-translate-y-1.5 group flex flex-col justify-between"
 >
 <div>
 <div className="flex items-center justify-between mb-6">
 <div className="w-14 h-14 rounded-2xl bg-rose-50 group-hover:bg-rose-100/70 border border-rose-100 flex items-center justify-center shadow-xs transition-colors">
 {getIcon(feature.iconName)}
 </div>
 <span className="text-[11px] font-extrabold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60 uppercase tracking-wider">
 {feature.highlight}
 </span>
 </div>

 <h3 className="font-serif text-xl font-bold text-slate-900 mb-3 group-hover:text-rose-600 transition-colors">
 {feature.title}
 </h3>

 <p className="text-sm text-stone-600 leading-relaxed">
 {feature.description}
 </p>
 </div>

 <div className="pt-6 mt-6 border-t border-stone-100 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
 <span>Langsung Aktif Sekali Klik</span>
 </div>
 </div>
 ))}
 </div>

 </div>
 </section>
 );
}
