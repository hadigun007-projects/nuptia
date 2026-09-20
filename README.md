# Nuptia - Platform Undangan Pernikahan Digital

Repositori monorepo platform pembuatan undangan pernikahan digital modern, responsif, dan elegan.

---

## Struktur Proyek

```
nuptia/
├── frontend/
│   ├── home/                # Landing page & showcase (Next.js 16 + Tailwind CSS)
│   ├── customer/            # Customer workspace & dashboard (React 19 + Vite + Tailwind CSS)
│   └── templates/           # Koleksi template undangan digital (Mobile-first HTML/CSS/JS)
│       └── wedding-rustic/  # Tema Rustic Warm Gold (Arya & Sarah)
├── backend/                 # Backend REST API service
├── deployment/              # Konfigurasi Nginx & Docker deployment
├── docker-compose.yml       # Orkestrasi Docker Compose
└── README.md                # Dokumentasi utama proyek
```

## Quick Start (Makefile)

Gunakan perintah `make` dari root direktori untuk menjalankan dan mengelola semua aplikasi secara praktis:

```bash
# 1. Instal seluruh dependensi
make install

# 2. Jalankan SEMUA aplikasi bersamaan (Home di port 3000 + Customer di port 5173)
make dev

# Atau jalankan aplikasi spesifik:
make dev-home       # Landing Page (Next.js 16) -> http://localhost:3000
make dev-customer   # Customer Dashboard (Vite) -> http://localhost:5173
make dev-template   # Template Wedding Rustic   -> http://localhost:8080

# Build semua aplikasi untuk produksi:
make build
```

---

## 1. Modul Customer Workspace (`frontend/customer/`)
Dashboard/portal terpadu bagi customer untuk mengelola undangan online mereka:
- Header top bar dengan status badge (Draft, Published, Live), status autosave cloud, tombol preview, dan aksi simpan.
- Desain modern Material You / M3 Expressive dengan palet Deep Berry Nuptia (`#A3158A`).
- Live Preview interaktif dengan switch device (Mobile, Tablet, Desktop).
- Modul detail acara, media studio (foto/galeri/musik), manajemen tamu, dan amplop digital.

**Menjalankan Customer Workspace:**
```bash
cd frontend/customer
npm install
npm run dev
```
Akses di browser: `http://localhost:5173`

---

## 2. Modul Home (`frontend/home/`)
Aplikasi landing page utama dengan fitur:
- Hero Section persuasif dengan mockup HP interaktif.
- Showcase tema undangan dengan filter kategori & preview live.
- Fitur unggulan, tabel paket harga, ribbon momen bahagia, testimoni, & FAQ.
- Branding Nuptia dengan palet hangat ceria dan logo signature hati magenta.

**Menjalankan Frontend Home:**
```bash
cd frontend/home
npm install
npm run dev
```
Akses di browser: `http://localhost:3000`

---

## 3. Modul Templates (`frontend/templates/`)
Koleksi template undangan pernikahan mandiri (*standalone mobile-first*):
- `frontend/templates/wedding-rustic/`: Tema krem hangat, taupe, dan aksen emas dengan cover gatekeeper, background music, countdown timer, Google Maps, RSVP real-time, dan amplop digital.

**Membuka Template:**
Cukup buka file `frontend/templates/wedding-rustic/index.html` langsung di peramban web atau gunakan local server:
```bash
npx serve frontend/templates/wedding-rustic
```

---

## 4. Deployment Produksi (Docker & Docker Compose)

Proyek ini siap di-deploy ke server produksi menggunakan Docker Compose dengan Nginx reverse proxy terintegrasi.

**Jalankan Cepat:**
```bash
# 1. Buat file konfigurasi lingkungan
cp .env.example .env

# 2. Build dan jalankan semua kontainer di background
docker compose up -d --build

# 3. Cek status kontainer
docker compose ps
```

Panduan lengkap instalasi di VPS, konfigurasi domain, SSL Let's Encrypt, dan troubleshooting dapat dibaca di **[DEPLOYMENT.md](file:///Users/hadiyahku/code/invite/DEPLOYMENT.md)**.
