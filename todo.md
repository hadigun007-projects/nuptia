1. buatkan ui admin internal
2. simpan daftar paket di database
3. buatkan role admin, viewer dan developer
    - admin bisa crud yang terkait operasional
    - viewer hanya bisa lihat yang terkait operasional
    - developer bisa akses semua termasuk log dan configrasi aplikasi
4. buatkan modul notifikasi untuk admin dan customer (SSE)
5. simulasikan daftar user baru
6. buatkan fitur lupa password untuk admin

---

# TODO: Proyek Frontend Auth Terpusat (`frontend/auth`) & Role-Based Redirection

### Fase 1: Backend & Konfigurasi Environment
- [x] 1.1. Tambahkan `http://localhost:5175` ke `ALLOWED_ORIGINS` di `backend/internal/config/config.go` dan `.env.example`.
- [x] 1.2. Tambahkan variabel konfigurasi `AUTH_APP_URL` di backend config (default `http://localhost:5175`).
- [x] 1.3. Perbarui link reset password email di `backend/internal/service/auth_service.go` agar mengarah ke `frontend/auth` (`http://localhost:5175/#/reset-password?token=...`).

### Fase 2: Inisialisasi & Setup Proyek Baru `frontend/auth`
- [x] 2.1. Buat folder proyek `frontend/auth/` beserta file konfigurasi:
  - `package.json` (React 19, Vite, Tailwind CSS v4, TypeScript).
  - `vite.config.ts` (konfigurasi dev server port 5175 & alias `@/`).
  - `tsconfig.json` & `tsconfig.node.json`.
  - `index.html` (Title, viewport, meta tags Nuptia Auth).
  - `src/index.css` (Tailwind v4 tokens, design system nuansa Nuptia, glassmorphism, dan animasi).
- [x] 2.2. Buat definisi tipe data di `src/types/index.ts` (User, Role, AuthResponse, RedirectionState).
- [x] 2.3. Buat konfigurasi target URL di `src/config/env.ts` (API_URL: 5000, ADMIN_URL: 5174, CUSTOMER_URL: 5173).
- [x] 2.4. Buat custom hook & API service di `src/hooks/useAuthService.ts`:
  - Login (email & password).
  - Register (customer baru).
  - Google Sign-In handler.
  - Forgot Password & Reset Password.
  - Logika evaluasi role (`admin` / `developer` / `viewer` vs `customer`) dan formulasi URL redirect callback.
- [x] 2.5. Buat komponen UI:
  - `BrandHeader.tsx` (Branding & Logo Nuptia).
  - `GoogleButton.tsx` (Tombol masuk via Google).
  - `RedirectBridge.tsx` (Animasi transisi halus saat proses pengalihan ke dashboard).
- [x] 2.6. Buat halaman/views:
  - `LoginView.tsx` (Tab Masuk, validasi, toggle password, forgot password link).
  - `RegisterView.tsx` (Tab Pendaftaran akun customer baru).
  - `ForgotPasswordView.tsx` (Form permintaan link reset kata sandi).
  - `ResetPasswordView.tsx` (Form input kata sandi baru berbasis token URL).
- [x] 2.7. Hubungkan seluruh views dan router hash di `src/App.tsx` lengkap dengan pembacaan query param `return_to`.

### Fase 3: Integrasi Token Handoff di `frontend/admin` & `frontend/customer`
- [ ] 3.1. Penyesuaian `frontend/admin`:
  - Perbarui `frontend/admin/src/hooks/useAdminAuth.ts` untuk menangkap `#auth_token=<TOKEN>&return_to=<URL>` saat startup, menyimpannya di `localStorage`, validasi sesi, lalu bersihkan URL hash.
  - Perbarui guard di `frontend/admin/src/App.tsx`: jika `!isAuthenticated`, redirect ke `http://localhost:5175/#/login?return_to=...`.
  - Update tombol `logout` agar mengarah ke `frontend/auth`.
- [ ] 3.2. Penyesuaian `frontend/customer`:
  - Perbarui `frontend/customer/src/hooks/useAuth.ts` untuk menangkap token callback dari hash URL.
  - Ubah tombol "Masuk" dan rute login di `frontend/customer/src/App.tsx` agar diarahkan ke `http://localhost:5175/#/login?return_to=...`.
  - Update fungsi `logout` di customer.

### Fase 4: Integrasi Landing Page (`frontend/home`) & Dev Tooling (`Makefile`)
- [ ] 4.1. Perbarui tombol "Masuk" dan CTA di `frontend/home/src/components/Navbar.tsx` agar mengarah ke `http://localhost:5175`.
- [ ] 4.2. Perbarui `Makefile`:
  - Tambah target `dev-auth` (`npm --prefix frontend/auth run dev`).
  - Tambah target `build-auth` (`npm --prefix frontend/auth run build`).
  - Update `make install` agar menginstal node_modules di `frontend/auth`.
  - Update `make dev` agar menjalankan 5 proses konkuren (`HOME`, `CUSTOMER`, `ADMIN`, `AUTH`, `API`) dan membebaskan port 5175 di `make kill`.
  - Update target `build`, `start`, `prod`, dan `clean`.

### Fase 5: Pengujian & Validasi End-to-End
- [ ] 5.1. Uji Login Akun Admin: pastikan login berhasil dan otomatis teralihkan ke Admin Console (port 5174) dengan sesi aktif.
- [ ] 5.2. Uji Login Akun Customer: pastikan login berhasil dan otomatis teralihkan ke Customer Dashboard (port 5173) dengan sesi aktif.
- [ ] 5.3. Uji Registrasi Akun Customer Baru: daftar dari tab Register &rarr; otomatis redirect ke portal customer.
- [ ] 5.4. Uji Parameter `return_to`: akses URL spesifik admin saat unauthenticated &rarr; login &rarr; kembali ke halaman tujuan.
- [ ] 5.5. Uji Alur Lupa Password & Reset Password melalui email / Mailpit.