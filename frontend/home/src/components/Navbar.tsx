'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const triggerConfetti = () => {
        try {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.1, x: 0.9 },
                colors: ['#FF6B4A', '#F59E0B', '#FBBF24', '#10B981', '#EC4899']
            });
        } catch (e) { }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[#FCFBF7]/92 backdrop-blur-md shadow-sm border-b border-amber-100 py-3.5'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                {/* Brand Logo */}
                <a href="#" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-2xl bg-[#A3158A] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-all duration-300">
                        <Heart className="w-5 h-5 fill-white text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                            Nuptia
                        </span>
                    </div>
                </a>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-8">
                    <a
                        href="#tema"
                        className="text-sm font-medium text-slate-700 hover:text-rose-600 transition-colors"
                    >
                        Tema Ceria & Elegan
                    </a>
                    <a
                        href="#fitur"
                        className="text-sm font-medium text-slate-700 hover:text-rose-600 transition-colors"
                    >
                        Fitur
                    </a>
                    <a
                        href="#harga"
                        className="text-sm font-medium text-slate-700 hover:text-rose-600 transition-colors"
                    >
                        Harga Hemat
                    </a>
                    <a
                        href="#testimoni"
                        className="text-sm font-medium text-slate-700 hover:text-rose-600 transition-colors"
                    >
                        Kisah Bahagia
                    </a>
                    <a
                        href="#faq"
                        className="text-sm font-medium text-slate-700 hover:text-rose-600 transition-colors"
                    >
                        FAQ
                    </a>
                </nav>

                {/* Action Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <a
                        href={process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:5175'}
                        className="text-sm font-semibold text-slate-700 hover:text-rose-600 px-3 py-2 transition-colors"
                    >
                        Masuk
                    </a>
                    <a
                        href="#buat"
                        onClick={triggerConfetti}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cheerful-gradient text-white text-sm font-bold shadow-md hover:shadow-rose-500/25 transition-all transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 group"
                    >
                        <span>Coba Gratis</span>
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-amber-100/60 transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-amber-200/80 px-4 pt-4 pb-6 space-y-4 shadow-xl animate-fade-in">
                    <nav className="flex flex-col space-y-3">
                        <a
                            href="#tema"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base font-medium text-slate-800 hover:text-rose-600 py-1"
                        >
                            Tema Ceria & Elegan
                        </a>
                        <a
                            href="#fitur"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base font-medium text-slate-800 hover:text-rose-600 py-1"
                        >
                            Fitur Lengkap
                        </a>
                        <a
                            href="#harga"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base font-medium text-slate-800 hover:text-rose-600 py-1"
                        >
                            Paket Harga
                        </a>
                        <a
                            href="#testimoni"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base font-medium text-slate-800 hover:text-rose-600 py-1"
                        >
                            Kisah Bahagia
                        </a>
                        <a
                            href="#faq"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base font-medium text-slate-800 hover:text-rose-600 py-1"
                        >
                            FAQ
                        </a>
                    </nav>

                    <div className="pt-4 border-t border-amber-100 flex flex-col gap-3">
                        <a
                            href={process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:5175'}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-center py-2.5 text-sm font-semibold text-slate-700 rounded-xl border border-stone-300 hover:bg-stone-50"
                        >
                            Masuk Akun
                        </a>
                        <a
                            href="#buat"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                triggerConfetti();
                            }}
                            className="text-center py-3 text-sm font-bold text-white rounded-xl bg-cheerful-gradient shadow-md"
                        >
                            Mulai Buat Gratis Sekarang
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
