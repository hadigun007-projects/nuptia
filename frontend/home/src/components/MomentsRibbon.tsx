'use client';

import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

const MOMENT_PHOTOS = [
 {
 url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
 title: 'The First Look',
 caption: 'Tatapan penuh cinta di pelaminan',
 tag: 'Momen Sakral'
 },
 {
 url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop',
 title: 'Golden Sunset Walk',
 caption: 'Langkah awal menuju masa depan bersama',
 tag: 'Prewedding Manis'
 },
 {
 url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop',
 title: 'Cincin Pengikat Janji',
 caption: 'Lambang kesetiaan seumur hidup',
 tag: 'The Vows'
 },
 {
 url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop',
 title: 'Genggaman Hangat',
 caption: 'Melewati suka dan duka berdua',
 tag: 'True Love'
 },
 {
 url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop',
 title: 'Bunga Kebahagiaan',
 caption: 'Doa restu dari para sahabat terkasih',
 tag: 'Bouquet Toss'
 },
 {
 url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
 title: 'Senyuman Pengantin',
 caption: 'Hari paling bahagia yang tak terlupakan',
 tag: 'Pure Joy'
 }
];

export default function MomentsRibbon() {
 // Duplicate photos array to enable seamless 50% translation infinite loop
 const duplicatedPhotos = [...MOMENT_PHOTOS, ...MOMENT_PHOTOS];

 return (
 <div className="relative py-14 bg-gradient-to-b from-[#FAF4EC] via-[#FDF9F5] to-[#FCFBF7] overflow-hidden">

 {/* Header Label */}
 <div className="max-w-7xl mx-auto px-4 text-center mb-6">
 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-rose-200/70 text-rose-800 text-xs font-bold uppercase tracking-widest shadow-2xs">
 <span>Setiap Detik yang Dirayakan Menjadi Kenangan Abadi</span>
 <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
 </div>
 </div>

 {/* Left & Right Soft Blur Gradient Masks */}
 <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#FAF4EC]/90 via-[#FAF4EC]/30 to-transparent z-20 pointer-events-none"></div>
 <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#FAF4EC]/90 via-[#FAF4EC]/30 to-transparent z-20 pointer-events-none"></div>

 {/* Infinite Horizontal Marquee Track */}
 <div className="animate-marquee gap-5 py-2">
 {duplicatedPhotos.map((photo, index) => (
 <div
 key={index}
 className="group relative w-64 sm:w-72 h-44 sm:h-48 rounded-2xl overflow-hidden bg-stone-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex-shrink-0 cursor-pointer border border-white"
 >
 <img
 src={photo.url}
 alt={photo.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
 />

 {/* Tag Badge */}
 <div className="absolute top-3 left-3 z-10">
 <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-extrabold text-slate-900 shadow-xs border border-white">
 {photo.tag}
 </span>
 </div>

 {/* Bottom Gradient Caption Overlay */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-4 text-white">
 <h4 className="font-serif text-sm sm:text-base font-bold text-amber-200 leading-tight">
 {photo.title}
 </h4>
 <p className="text-[11px] text-stone-200 line-clamp-1 mt-0.5">
 {photo.caption}
 </p>
 </div>
 </div>
 ))}
 </div>

 </div>
 );
}
