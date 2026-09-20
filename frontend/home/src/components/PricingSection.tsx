'use client';

import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { PRICING_DATA } from '../data/mockData';
import confetti from 'canvas-confetti';

export default function PricingSection() {
 const [billingMode, setBillingMode] = useState<'single' | 'bundle'>('single');

 const triggerConfetti = () => {
 try {
 confetti({
 particleCount: 60,
 spread: 65,
 origin: { y: 0.7 },
 colors: ['#FF6B4A', '#F59E0B', '#FBBF24', '#10B981', '#EC4899']
 });
 } catch (e) {}
 };

 return (
 <section id="harga" className="py-24 bg-gradient-to-b from-[#FAF5EE] via-[#FCFBF7] to-[#FFF9F5] relative">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 {/* Section Header */}
 <div className="text-center max-w-3xl mx-auto mb-12">
 <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-widest mb-3">
 <Sparkles className="w-3.5 h-3.5 text-amber-600" />
 <span>Transparan, Hemat, & Bikin Tenang</span>
 </div>
 <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
 Pilihan Paket Manis yang Pas di Kantong
 </h2>
 <p className="text-base text-stone-600 mt-4 leading-relaxed">
 Tanpa biaya tambahan tersembunyi! Aktifkan sekali dan undang ratusan hingga ribuan sahabat tanpa batasan kuota.
 </p>

 {/* Cheerful Toggle Switch: Per-Undangan vs Bundle Organizer */}
 <div className="mt-8 inline-flex p-1.5 rounded-full bg-rose-100/60 border border-rose-200 shadow-inner">
 <button
 onClick={() => setBillingMode('single')}
 className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 ${
 billingMode === 'single'
 ? 'bg-white text-slate-900 shadow-sm'
 : 'text-stone-600 hover:text-slate-900'
 }`}
 >
 Bayar Per-Undangan 
 </button>
 <button
 onClick={() => setBillingMode('bundle')}
 className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all duration-200 ${
 billingMode === 'bundle'
 ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
 : 'text-stone-600 hover:text-slate-900'
 }`}
 >
 <span>Bundle Wedding Organizer </span>
 <span className="px-2 py-0.5 rounded-full bg-amber-300 text-amber-950 text-[10px] uppercase font-black tracking-wider">
 Hemat 40%
 </span>
 </button>
 </div>
 </div>

 {/* Pricing Cards Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
 {PRICING_DATA.map(plan => {
 const displayPrice = billingMode === 'single' ? plan.pricePerInvitation : plan.priceBundle;
 const originalPrice = billingMode === 'single' ? plan.originalPricePerInvitation : plan.originalPriceBundle;

 return (
 <div
 key={plan.id}
 className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
 plan.popular
 ? 'bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-white shadow-2xl border-2 border-amber-400 lg:-translate-y-3'
 : 'bg-white text-slate-900 shadow-sm border border-rose-100 hover:shadow-xl hover:border-rose-300'
 }`}
 >
 {/* Cheerful Badge */}
 {plan.badge && (
 <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${
 plan.popular
 ? 'bg-cheerful-gradient text-white ring-2 ring-white/20'
 : 'bg-rose-100 text-rose-800 border border-rose-200'
 }`}>
 {plan.badge}
 </div>
 )}

 <div>
 <div className="mb-6 pt-2">
 <h3 className={`font-serif text-2xl font-bold ${plan.popular ? 'text-amber-300' : 'text-slate-900'}`}>
 {plan.name}
 </h3>
 <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${plan.popular ? 'text-stone-300' : 'text-stone-600'}`}>
 {plan.description}
 </p>
 </div>

 {/* Pricing Display */}
 <div className="mb-8 pb-6 border-b border-stone-200/40">
 {originalPrice && (
 <span className={`text-xs line-through block mb-1 font-semibold ${plan.popular ? 'text-stone-400' : 'text-stone-400'}`}>
 {originalPrice}
 </span>
 )}
 <div className="flex items-baseline gap-1.5">
 <span className={`font-serif text-3xl sm:text-4xl font-black ${plan.popular ? 'text-amber-300' : 'text-slate-900'}`}>
 {displayPrice}
 </span>
 {displayPrice !== 'Rp 0' && billingMode === 'single' && (
 <span className={`text-xs ${plan.popular ? 'text-stone-300' : 'text-stone-500'}`}>
 / sekali bayar
 </span>
 )}
 </div>
 </div>

 {/* Features List */}
 <div className="space-y-3.5 mb-8">
 <p className={`text-xs font-extrabold uppercase tracking-wider ${plan.popular ? 'text-amber-300' : 'text-slate-800'}`}>
 Apa Saja yang Didapat:
 </p>
 {plan.features.map((feat, idx) => (
 <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
 <div className={`mt-0.5 rounded-full p-0.5 ${plan.popular ? 'bg-amber-400 text-slate-900' : 'bg-rose-100 text-rose-700'}`}>
 <Check className="w-3.5 h-3.5" />
 </div>
 <span className={plan.popular ? 'text-stone-200' : 'text-stone-700'}>
 {feat}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Card CTA */}
 <div className="pt-2">
 <a
 href="#buat"
 onClick={triggerConfetti}
 className={`w-full inline-flex items-center justify-center py-3.5 px-6 rounded-2xl font-extrabold text-xs sm:text-sm transition-all transform active:scale-95 shadow-md ${
 plan.popular
 ? 'bg-cheerful-gradient hover:opacity-95 text-white'
 : plan.ctaVariant === 'outline'
 ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
 : 'bg-slate-900 hover:bg-slate-800 text-white'
 }`}
 >
 {plan.ctaText}
 </a>
 </div>
 </div>
 );
 })}
 </div>

 {/* Cheerful Guarantee Banner */}
 <div className="mt-14 max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-200 flex items-center justify-center gap-3 text-center text-xs text-rose-950 shadow-xs">
 <Heart className="w-5 h-5 text-rose-500 flex-shrink-0 fill-rose-500" />
 <span>
 <strong>Garansi 100% Bahagia & Tenang:</strong> Tim support kami siap bantu setup via WhatsApp sampai undangan pernikahanmu beres sempurna! 
 </span>
 </div>

 </div>
 </section>
 );
}
