# Modul Templates - Koleksi Template Undangan Digital

Direktori ini berisi berbagai desain dan tema template undangan pernikahan digital interaktif berbasis web (*mobile-first*).

---

## Daftar Tema Tersedia

### 1. `wedding-rustic/` (Arya & Sarah)
- **Kategori**: Romantic & Warm Taupe
- **Palet Warna**: Krem hangat (`#FAF4EC`), taupe hangat, dan aksen emas.
- **Fitur**:
  - Cover gatekeeper dengan partikel kelopak bunga & nama tamu dinamis (`?to=...`).
  - Pemutar audio background terpadu (*vinyl player*).
  - Kutipan suci QS. Ar-Rum: 21 & monogram mempelai.
  - Detail acara (Akad & Resepsi) dengan tombol Google Maps & Google Calendar.
  - Form RSVP & buku tamu (*guestbook*) real-time via `localStorage`.
  - Amplop digital / wedding gift (BCA, Mandiri) dengan tombol salin nomor rekening.

---

## Cara Menjalankan & Meninjau Template

Setiap template bersifat *standalone* (HTML, CSS, JS murni tanpa dependensi bundler):
1. Buka file `index.html` dari masing-masing folder tema langsung di peramban web (*double-click*), atau
2. Jalankan melalui local server:
   ```bash
   # Dari dalam folder templates/wedding-rustic/
   npx serve .
   ```

---

## Panduan Menambahkan Tema Baru

Untuk membuat tema undangan baru:
1. Buat direktori baru di dalam `templates/`, misal `templates/floral-garden/`.
2. Sertakan struktur berkas standar:
   ```
   templates/[nama-tema]/
   ├── index.html        # Markup utama dengan meta tags & semantik mobile-first
   ├── css/
   │   └── style.css     # Styling tema, animasi, dan kustomisasi warna
   ├── js/
   │   └── app.js        # Logika countdown, RSVP, audio player, dan salin teks
   └── assets/           # Gambar ilustrasi atau file audio lokal (opsional)
   ```
3. Daftarkan metadata tema baru pada file `home/src/data/mockData.ts` dan `api/src/data/mockDatabase.ts`.
