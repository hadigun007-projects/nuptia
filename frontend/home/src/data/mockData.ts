export interface TemplateItem {
 id: string;
 name: string;
 category: 'minimalis' | 'adat' | 'floral' | 'modern' | 'cheerful';
 categoryLabel: string;
 image: string;
 accentColors: string[];
 isPopular?: boolean;
 isNew?: boolean;
 rating: number;
 previewUrl: string;
 description: string;
}

export interface FeatureItem {
 id: string;
 title: string;
 description: string;
 iconName: string;
 highlight: string;
}

export interface PricingPlan {
 id: string;
 name: string;
 badge?: string;
 pricePerInvitation: string;
 originalPricePerInvitation?: string;
 priceBundle: string;
 originalPriceBundle?: string;
 description: string;
 popular?: boolean;
 features: string[];
 ctaText: string;
 ctaVariant: 'primary' | 'secondary' | 'outline';
}

export interface TestimonialItem {
 id: string;
 couple: string;
 date: string;
 city: string;
 image: string;
 templateUsed: string;
 quote: string;
 rating: number;
 reactionEmoji: string;
}

export interface FAQItem {
 id: string;
 question: string;
 answer: string;
}

export const TEMPLATES_DATA: TemplateItem[] = [
 {
 id: 'cheerful-peach-blossom',
 name: 'Blush & Peach Blossom ',
 category: 'cheerful',
 categoryLabel: 'Ceria & Pastel',
 image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
 accentColors: ['#FFF1EE', '#FF7E67', '#FFB3A7'],
 isPopular: true,
 isNew: true,
 rating: 5.0,
 previewUrl: '/?theme=peach',
 description: 'Penuh energi cinta dan kehangatan! Perpaduan warna peach manis, coral hangat, dan ilustrasi bunga bermekaran.'
 },
 {
 id: 'cheerful-sunshine-daisy',
 name: 'Sunshine Meadow ',
 category: 'cheerful',
 categoryLabel: 'Ceria & Pastel',
 image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
 accentColors: ['#FEF9E7', '#F59E0B', '#10B981'],
 isNew: true,
 rating: 4.9,
 previewUrl: '/?theme=sunshine',
 description: 'Cerah ceria seperti pagi yang cerah! Sentuhan kuning madu cerah berpadu dedaunan segar untuk pesta outdoor yang santai & asyik.'
 },
 {
 id: 'minimalist-ivory',
 name: 'Seraphina Ivory ',
 category: 'minimalis',
 categoryLabel: 'Minimalis',
 image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
 accentColors: ['#FAF7F2', '#8C7E74', '#C5A059'],
 isPopular: true,
 rating: 4.9,
 previewUrl: '/?theme=seraphina',
 description: 'Sentuhan elegan minimalis dengan font serif modern, tipografi lapang, dan aksen emas lembut.'
 },
 {
 id: 'adat-jawa-surakarta',
 name: 'Pratama Keraton ',
 category: 'adat',
 categoryLabel: 'Adat Nusantara',
 image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
 accentColors: ['#2A2017', '#B8860B', '#F5EBE1'],
 rating: 5.0,
 previewUrl: '/?theme=keraton',
 description: 'Nuansa sakral adat Jawa klasik dipadu ornamen batik & foil emas kontemporer.'
 },
 {
 id: 'botanical-sage',
 name: 'Verdant Garden ',
 category: 'floral',
 categoryLabel: 'Floral Pastel',
 image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop',
 accentColors: ['#E9EFE9', '#5A735D', '#D4AF37'],
 rating: 4.8,
 previewUrl: '/?theme=verdant',
 description: 'Palet warna sage green pastel berhias ilustrasi daun eucalyptus dan mawar putih lembut.'
 },
 {
 id: 'modern-noir-gold',
 name: 'Midnight Glamour ',
 category: 'modern',
 categoryLabel: 'Modern Luxury',
 image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
 accentColors: ['#1A1A1A', '#D4AF37', '#E5C378'],
 rating: 4.9,
 previewUrl: '/?theme=midnight',
 description: 'Kemewahan monokrom gelap dengan detail tipografi emas berkilau dan glassmorphism eksklusif.'
 }
];

export const FEATURES_DATA: FeatureItem[] = [
 {
 id: 'wa-share',
 title: 'Sebar via WhatsApp 1-Klik ',
 description: 'Tinggal ketik daftar tamu, langsung jadi link khusus dengan sapaan hangat terpersonalisasi. Kirim ke ratusan sahabat tanpa rasa lelah!',
 iconName: 'Send',
 highlight: 'Kilat & Otomatis'
 },
 {
 id: 'rsvp-realtime',
 title: 'RSVP & Doa Restu Real-Time ',
 description: 'Notifikasi konfirmasi kehadiran tamu langsung masuk ke dashboard dengan gelembung doa penuh cinta. Hitung porsi katering jadi tenang!',
 iconName: 'MessageSquareHeart',
 highlight: 'Update Live '
 },
 {
 id: 'background-music',
 title: 'Soundtrack Cinta Berdua ',
 description: 'Pilih lagu pernikahan romantis dari katalog ceria kami atau upload lagu kenangan berdua. Musik terputar manis saat undangan dibuka!',
 iconName: 'Music',
 highlight: 'Autoplay Ramah HP'
 },
 {
 id: 'digital-envelope',
 title: 'Amplop Digital & QRIS 0% Potongan ',
 description: 'Tamu yang berhalangan hadir tetap bisa kirim tanda kasih cashless langsung ke rekening bank atau e-wallet tanpa biaya admin sepeser pun.',
 iconName: 'Wallet',
 highlight: '100% Milik Anda'
 },
 {
 id: 'maps-navigation',
 title: 'Panduan Lokasi Anti-Nyasar ',
 description: 'Satu sentuhan langsung membuka rute Google Maps & Waze. Tamu undangan sampai di venue resepsi dengan senyum lebar tepat waktu.',
 iconName: 'MapPin',
 highlight: 'Akurasi Titik GPS'
 },
 {
 id: 'gallery-lovestory',
 title: 'Kisah Cinta & Galeri Manis ',
 description: 'Ceritakan linimasa perjalanan dari awal jadian sampai hari H. Pajang album foto prewedding kualitas HD yang bikin semua terharu.',
 iconName: 'Sparkles',
 highlight: 'Resolusi Tajam'
 }
];

export const PRICING_DATA: PricingPlan[] = [
 {
 id: 'trial',
 name: 'Paket Kencan Pertama (Trial)',
 badge: 'Coba Gratis 3 Hari ',
 pricePerInvitation: 'Rp 0',
 priceBundle: 'Rp 0',
 description: 'Bikin dulu sepuasnya tanpa bayar apa pun! Cocok buat coba editor dan intip tampilannya bareng pasangan.',
 popular: false,
 features: [
 'Masa aktif 3 hari',
 'Maksimal 50 nama tamu',
 'Pilihan 3 template dasar',
 'RSVP & Buku Tamu Interaktif',
 'Watermark Nuptia'
 ],
 ctaText: 'Coba Gratis Sekarang ',
 ctaVariant: 'outline'
 },
 {
 id: 'basic',
 name: 'Paket Akad Manis (Basic)',
 badge: 'Intimate Wedding ',
 pricePerInvitation: 'Rp 79.000',
 originalPricePerInvitation: 'Rp 129.000',
 priceBundle: 'Rp 349.000 / 5 Undangan',
 originalPriceBundle: 'Rp 599.000',
 description: 'Pilihan pas dan hemat buat intimate wedding atau lamaran yang hangat dan penuh keakraban.',
 popular: false,
 features: [
 'Masa aktif 6 bulan',
 'Tamu undangan tanpa batas',
 'Akses ke 20+ template ceria & estetik',
 'Personalisasi nama via WhatsApp',
 'RSVP & Doa Real-time',
 'Musik Latar & Navigasi Maps',
 'Amplop Digital (1 Rekening)',
 'Tanpa Watermark'
 ],
 ctaText: 'Pilih Paket Manis ',
 ctaVariant: 'secondary'
 },
 {
 id: 'premium',
 name: 'Paket Resepsi Impian (Premium VIP)',
 badge: 'Paling Laris & Favorit ',
 pricePerInvitation: 'Rp 149.000',
 originalPricePerInvitation: 'Rp 249.000',
 priceBundle: 'Rp 599.000 / 5 Undangan',
 originalPriceBundle: 'Rp 999.000',
 description: 'Solusi VIP tanpa kompromi! Semua fitur ajaib terbuka, aktif selamanya, bikin hari bahagiamu tak terlupakan.',
 popular: true,
 features: [
 'Masa aktif SELAMANYA ',
 'Tamu undangan tanpa batas',
 'Buka SEMUA 50+ tema eksklusif',
 'Amplop Digital Multi-Rekening & QRIS',
 'Upload Custom Musik MP3 & Video Teaser',
 'Countdown Timer & Save to Calendar',
 'Love Story & Galeri Foto HD (Unlimited)',
 'Export Data RSVP ke Excel / CSV',
 'Dukungan Prioritas WhatsApp 24/7'
 ],
 ctaText: 'Ambil Promo VIP Sekarang ',
 ctaVariant: 'primary'
 }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
 {
 id: '1',
 couple: 'Arya & Sarah',
 date: '24 Oktober 2026',
 city: 'Jakarta',
 image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&auto=format&fit=crop',
 templateUsed: 'Blush & Peach Blossom',
 quote: 'Teman-teman kami pada heboh karena undangannya cantik dan cheerful banget! Pas lagu kami keputar otomatis, vibes bahagianya langsung nular ke semua orang ',
 rating: 5,
 reactionEmoji: ''
 },
 {
 id: '2',
 couple: 'Dimas & Riana',
 date: '12 September 2026',
 city: 'Bandung',
 image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop',
 templateUsed: 'Sunshine Meadow',
 quote: 'Gak sampai 10 menit beneran langsung jadi link siap sebar! Fitur WhatsApp 1-klik bikin kirim undangan ke 400 orang berasa santai sambil ngopi sore.',
 rating: 5,
 reactionEmoji: ''
 },
 {
 id: '3',
 couple: 'Kevin & Jessica',
 date: '8 Agustus 2026',
 city: 'Surabaya',
 image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop',
 templateUsed: 'Seraphina Ivory',
 quote: 'Dashboard RSVP-nya nolong banget buat catering! Ditambah fitur amplop digitalnya gampang disalin, banyak sahabat yang kirim hadiah sebelum hari H.',
 rating: 5,
 reactionEmoji: ''
 }
];

export const FAQ_DATA: FAQItem[] = [
 {
 id: 'faq-1',
 question: 'Beneran bisa jadi dalam 5 menit?',
 answer: 'Beneran dong! Pilih tema favorit, ketik nama kalian berdua, tentukan waktu & lokasi akad resepsi, lalu undangan siap disebarkan seketika. Gak perlu mikirin coding sama sekali!'
 },
 {
 id: 'faq-2',
 question: 'Kalau ada perubahan jam atau lokasi acara, apakah bisa diedit?',
 answer: 'Tentu bisa banget! Kapan pun ada perubahan jadwal atau foto baru, tinggal login ke dashboard dan ubah data. Link yang sudah disebar ke tamu akan otomatis ter-update seketika.'
 },
 {
 id: 'faq-3',
 question: 'Gimana caranya amplop digital bisa tanpa potongan 0%?',
 answer: 'Karena tamu mentransfer langsung ke nomor rekening bank atau e-wallet (BCA, Mandiri, GoPay, QRIS) milik Anda sendiri. Kami tidak menahan atau memotong uang tanda kasih sepeser pun!'
 },
 {
 id: 'faq-4',
 question: 'Bisa bikin nama tamu beda-beda di setiap link undangan?',
 answer: 'Bisa banget! Dengan fitur Generator WhatsApp kami, sistem akan otomatis menambahkan nama tamu seperti "Kepada Yth. Sahabatku Dimas" di bagian cover undangan secara otomatis.'
 },
 {
 id: 'faq-5',
 question: 'Boleh coba dulu sebelum bayar?',
 answer: 'Pasti boleh! Anda bisa langsung coba Paket Trial Gratis 3 hari untuk mencoba semua menu, melihat preview langsung di HP, dan memastikan kalian berdua puas sebelum memutuskan bayar.'
 },
 {
 id: 'faq-6',
 question: 'Saya Wedding Organizer, ada harga khusus buat banyak klien?',
 answer: 'Ada dong! Paket Bundle Wedding Organizer memberikan diskon hingga 40% plus dashboard multi-klien untuk mengelola puluhan undangan pernikahan klien Anda dengan rapi dan profesional.'
 }
];
