'use client';

import React from 'react';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#17110E] via-[#140E0C] to-[#0E0A08] text-stone-300 pt-16 pb-12 relative">
      {/* Soft Luminous Hairline Divider */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 {/* Main Footer Columns */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
 
 {/* Brand & Manifesto */}
 <div className="lg:col-span-2 space-y-4">
 <a href="#" className="flex items-center gap-2.5 group">
 <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-amber-300 flex items-center justify-center text-white shadow-md">
 <Heart className="w-5 h-5 fill-white" />
 </div>
 <span className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-1">
 Nuptia
 <span className="w-2 h-2 rounded-full bg-rose-500"></span>
 </span>
 </a>
 
 <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
 Platform layanan pembuatan undangan pernikahan digital modern terdepan di Indonesia. Dibuat dengan segenap cinta untuk menghubungkan kebahagiaan Anda bersama keluarga dan sahabat terdekat.
 </p>

 {/* Social Media Links */}
 <div className="flex items-center gap-3 pt-2">
 <a
 href="https://instagram.com"
 target="_blank"
 rel="noopener noreferrer"
 className="w-9 h-9 rounded-full bg-stone-800 hover:bg-rose-500 hover:text-white flex items-center justify-center text-stone-400 transition"
 aria-label="Instagram"
 >
 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
 </svg>
 </a>
 <a
 href="https://youtube.com"
 target="_blank"
 rel="noopener noreferrer"
 className="w-9 h-9 rounded-full bg-stone-800 hover:bg-rose-500 hover:text-white flex items-center justify-center text-stone-400 transition"
 aria-label="YouTube"
 >
 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
 <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
 </svg>
 </a>
 <a
 href="https://tiktok.com"
 target="_blank"
 rel="noopener noreferrer"
 className="w-9 h-9 rounded-full bg-stone-800 hover:bg-rose-500 hover:text-white flex items-center justify-center text-stone-400 transition"
 aria-label="TikTok"
 >
 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
 <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
 </svg>
 </a>
 </div>
 </div>

 {/* Column 2: Navigasi Produk */}
 <div className="space-y-3">
 <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400">Navigasi Seru</h4>
 <ul className="space-y-2 text-xs sm:text-sm">
 <li><a href="#tema" className="hover:text-white transition">Koleksi Tema </a></li>
 <li><a href="#fitur" className="hover:text-white transition">Fitur Canggih </a></li>
 <li><a href="#harga" className="hover:text-white transition">Paket Hemat </a></li>
 <li><a href="#testimoni" className="hover:text-white transition">Kisah Bahagia </a></li>
 <li><a href="#faq" className="hover:text-white transition">Tanya Jawab (FAQ) </a></li>
 </ul>
 </div>

 {/* Column 3: Kategori Tema */}
 <div className="space-y-3">
 <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400">Pilihan Tema</h4>
 <ul className="space-y-2 text-xs sm:text-sm">
 <li><a href="#tema" className="hover:text-white transition">Ceria & Pastel </a></li>
 <li><a href="#tema" className="hover:text-white transition">Minimalis Modern </a></li>
 <li><a href="#tema" className="hover:text-white transition">Adat Jawa & Sunda </a></li>
 <li><a href="#tema" className="hover:text-white transition">Floral Garden </a></li>
 <li><a href="#tema" className="hover:text-white transition">Modern Luxury </a></li>
 </ul>
 </div>

 {/* Column 4: Kontak & Dukungan */}
 <div className="space-y-3">
 <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400">Hubungi Kami</h4>
 <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
 <li className="flex items-center gap-2">
 <Phone className="w-4 h-4 text-amber-400" />
 <span>+62 812-3456-7890</span>
 </li>
 <li className="flex items-center gap-2">
 <Mail className="w-4 h-4 text-amber-400" />
 <span>halo@nuptia.id</span>
 </li>
 <li className="flex items-start gap-2">
 <MapPin className="w-4 h-4 text-amber-400 mt-0.5" />
 <span>Senayan City Tower Lt. 18, Jakarta Pusat</span>
 </li>
 </ul>
 </div>

 </div>

 {/* Bottom Bar: Copyright */}
 <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
 <p>© 2026 Nuptia Indonesia. Dibuat dengan penuh untuk momen terindahmu.</p>
 
 <div className="flex items-center gap-4 text-[11px]">
 <a href="#" className="hover:text-stone-300 transition">Kebijakan Privasi</a>
 <span>•</span>
 <a href="#" className="hover:text-stone-300 transition">Syarat & Ketentuan</a>
 <span>•</span>
 <a href="#" className="hover:text-stone-300 transition">Panduan Keamanan</a>
 </div>
 </div>

 </div>
 </footer>
 );
}
