import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MomentsRibbon from '@/components/MomentsRibbon';
import TemplateShowcase from '@/components/TemplateShowcase';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import CTAClosingSection from '@/components/CTAClosingSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FCFBF7] text-slate-900 selection:bg-rose-400/30 selection:text-slate-950">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Hero Section dengan Mockup HP Interaktif, Floral Backdrop & Floating Polaroids */}
      <HeroSection />

      {/* Pita Galeri Momen Indah Berjalan (Infinite Marquee) */}
      <MomentsRibbon />

      {/* Template Showcase dengan Filter Kategori & Modal Demo */}
      <TemplateShowcase />

      {/* Fitur Unggulan */}
      <FeaturesSection />

      {/* Pricing Table dengan Toggle Per-Undangan vs Bundle Organizer */}
      <PricingSection />

      {/* Testimoni Nyata Pasangan Pengantin */}
      <TestimonialsSection />

      {/* FAQ Accordion Interaktif */}
      <FAQSection />

      {/* High-Converting Closing CTA Banner */}
      <CTAClosingSection />

      {/* Footer Komprehensif */}
      <Footer />
    </main>
  );
}
