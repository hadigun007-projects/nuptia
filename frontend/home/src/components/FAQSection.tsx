'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { FAQ_DATA } from '../data/mockData';

export default function FAQSection() {
 const [openIndex, setOpenIndex] = useState<number | null>(0);

 const toggleAccordion = (index: number) => {
 setOpenIndex(openIndex === index ? null : index);
 };

  return (
    <section id="faq" className="py-24 pb-28 bg-[#FAF4EC] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Paling Sering Ditanyakan</span>
          </div>
 <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
 Gak Perlu Bingung, Semuanya Gampang!
 </h2>
 <p className="text-base text-stone-600 mt-4">
 Masih ada yang mau ditanyakan? Tim support kami super ramah dan siap memandu Anda.
 </p>
 </div>

 {/* Accordion List */}
 <div className="space-y-4">
 {FAQ_DATA.map((item, index) => {
 const isOpen = openIndex === index;

 return (
 <div
 key={item.id}
 className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
 isOpen
 ? 'bg-white border-rose-300 shadow-md ring-1 ring-rose-200'
 : 'bg-white/80 border-rose-100 hover:border-rose-200'
 }`}
 >
 <button
 onClick={() => toggleAccordion(index)}
 className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 transition-colors"
 >
 <span className="text-sm sm:text-base flex items-center gap-2">
 <span className="text-rose-500 font-serif">Q{index + 1}.</span>
 <span>{item.question}</span>
 </span>
 <div className={`w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-slate-600 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 bg-rose-100 text-rose-700' : ''}`}>
 <ChevronDown className="w-4 h-4" />
 </div>
 </button>

 {isOpen && (
 <div className="px-6 pb-6 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-rose-50 pt-4 animate-fade-in pl-11">
 {item.answer}
 </div>
 )}
 </div>
 );
 })}
 </div>

 {/* Cheerful WhatsApp Support Callout */}
 <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left shadow-xs">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center flex-shrink-0 shadow-md">
 <MessageCircle className="w-7 h-7 fill-white" />
 </div>
 <div>
 <h4 className="font-bold text-slate-900 text-base">Mau Tanya-Tanya Dulu Sambil Santai? </h4>
 <p className="text-xs text-stone-600 mt-1">CS kami fast-response dan siap nemenin kamu bikin undangan terbaik.</p>
 </div>
 </div>

 <a
 href="https://wa.me/6281234567890?text=Halo%20Nuptia,%20mau%20tanya%20seputar%20undangan%20pernikahan%20digital"
 target="_blank"
 rel="noopener noreferrer"
 className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-md whitespace-nowrap flex-shrink-0 active:scale-95"
 >
 Chat WhatsApp Kami 
 </a>
 </div>

 </div>
 </section>
 );
}
