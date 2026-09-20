import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans-modern",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif-luxury",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nuptia - Buat Undangan Pernikahan Digital Elegan dalam 5 Menit",
  description: "Platform nomor #1 pembuatan website undangan pernikahan digital modern, responsif, dan siap sebar via WhatsApp. Dilengkapi RSVP real-time, musik romantis, dan amplop digital.",
  keywords: ["undangan pernikahan digital", "wedding invitation online", "undangan digital website", "nuptia", "rsvp online", "amplop digital"],
  openGraph: {
    title: "Nuptia - Platform Undangan Pernikahan Digital Modern",
    description: "Sebar momen bahagia lebih praktis, mewah, dan berkesan dalam 5 menit.",
    type: "website",
    locale: "id_ID",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${playfairDisplay.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#FAFAF8] text-slate-900 antialiased selection:bg-amber-400/30">
        {children}
      </body>
    </html>
  );
}
