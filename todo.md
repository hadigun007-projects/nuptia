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
- [x] 3.1. Penyesuaian `frontend/admin`:
  - Perbarui `frontend/admin/src/hooks/useAdminAuth.ts` untuk menangkap `#auth_token=<TOKEN>&return_to=<URL>` saat startup, menyimpannya di `localStorage`, validasi sesi, lalu bersihkan URL hash.
  - Perbarui guard di `frontend/admin/src/App.tsx`: jika `!isAuthenticated`, redirect ke `http://localhost:5175/#/login?return_to=...`.
  - Update tombol `logout` agar mengarah ke `frontend/auth`.
- [x] 3.2. Penyesuaian `frontend/customer`:
  - Perbarui `frontend/customer/src/hooks/useAuth.ts` untuk menangkap token callback dari hash URL.
  - Ubah tombol "Masuk" dan rute login di `frontend/customer/src/App.tsx` agar diarahkan ke `http://localhost:5175/#/login?return_to=...`.
  - Update fungsi `logout` di customer.

### Fase 4: Integrasi Landing Page (`frontend/home`) & Dev Tooling (`Makefile`)
- [x] 4.1. Perbarui tombol "Masuk" dan CTA di `frontend/home/src/components/Navbar.tsx` agar mengarah ke `http://localhost:5175`.
- [x] 4.2. Perbarui `Makefile`:
  - Tambah target `dev-auth` (`npm --prefix frontend/auth run dev`).
  - Tambah target `build-auth` (`npm --prefix frontend/auth run build`).
  - Update `make install` agar menginstal node_modules di `frontend/auth`.
  - Update `make dev` agar menjalankan 5 proses konkuren (`HOME`, `CUSTOMER`, `ADMIN`, `AUTH`, `API`) dan membebaskan port 5175 di `make kill`.
  - Update target `build`, `start`, `prod`, dan `clean`.

### Fase 5: Pengujian & Validasi End-to-End
- [x] 5.1. Uji Login Akun Admin: pastikan login berhasil dan otomatis teralihkan ke Admin Console (port 5174) dengan sesi aktif.
- [x] 5.2. Uji Login Akun Customer: pastikan login berhasil dan otomatis teralihkan ke Customer Dashboard (port 5173) dengan sesi aktif.
- [x] 5.3. Uji Registrasi Akun Customer Baru: daftar dari tab Register &rarr; otomatis redirect ke portal customer.
- [x] 5.4. Uji Parameter `return_to`: akses URL spesifik admin saat unauthenticated &rarr; login &rarr; kembali ke halaman tujuan.
- [x] 5.5. Uji Alur Lupa Password & Reset Password melalui email / Mailpit.

---

# TODO: Migrasi Database & Seeder Undangan Customer (Hapus Hardcode & Integrasi API PostgreSQL)

### Fase 1: Domain Model & Database PostgreSQL (Go Backend)
- [x] 1.1. Buat file model `backend/internal/domain/invitation.go`:
  - Definisi struct GORM `Invitation` dengan primary key `id` (VARCHAR), `user_id` (UUID foreign key ke `users.id`), `template_id`, `slug` (unique index), `title`, `status`, dan statistik views/rsvp.
  - Definisi tipe struct modular untuk 15 tab form (`EventData`, `MediaData`, `GuestData`, `LoveStoryMilestone`, `StreamingConfig`, `SocialConfig`, `GuestBookEntry`, `GreetingItem`, `InvitationSettings`, `ThemeConfig`).
  - Implementasikan interface GORM serializer `json` atau `Scan`/`Value` untuk kolom modular agar tersimpan sebagai PostgreSQL `JSONB`.
- [x] 1.2. Daftarkan `&domain.Invitation{}` pada `AutoMigrate` di `backend/internal/database/postgres.go`.

### Fase 2: Database Seeder Undangan (`backend/internal/database/seeder.go`)
- [x] 2.1. Implementasikan fungsi seeder `SeedDefaultInvitations(db *gorm.DB) error` di `backend/internal/database/seeder.go`:
  - Siapkan 3 data undangan contoh lengkap (Reza & Hana, Dimas & Riana, Arya & Sarah) dengan 15 modul form detail.
  - Tautkan undangan ke akun customer seeder:
    - `dimas.aditya@gmail.com` &rarr; Undangan "Dimas & Riana" (`status: Published`)
    - `sarah.siti@yahoo.com` &rarr; Undangan "Arya & Sarah" (`status: Draft`)
    - `rian.pratama@gmail.com` &rarr; Undangan "Reza & Hana" (`status: Live`)
  - Terapkan logika idempotensi (cek berdasarkan slug / ID sebelum membuat baru).
- [x] 2.2. Daftarkan `SeedDefaultInvitations` ke CLI seeder di `backend/cmd/seed/main.go`.
- [x] 2.3. Tambahkan auto-seed undangan di `backend/cmd/api/main.go` saat server pertama kali berjalan dan tabel masih kosong.

### Fase 3: Repository & Service Layer Backend
- [x] 3.1. Buat `backend/internal/repository/invitation_repository.go`:
  - `FindByUserID(userID uuid.UUID) ([]domain.Invitation, error)`
  - `FindByID(id string, userID uuid.UUID) (*domain.Invitation, error)`
  - `FindBySlug(slug string) (*domain.Invitation, error)`
  - `Create(invitation *domain.Invitation) error`
  - `Update(invitation *domain.Invitation) error`
  - `Delete(id string, userID uuid.UUID) error`
  - `CountByUserID(userID uuid.UUID) (int64, error)`
- [x] 3.2. Buat `backend/internal/service/invitation_service.go`:
  - Validasi kepemilikan undangan berbasis `userID`.
  - Logika pembuatan undangan baru (generate ID dan unique slug).
  - Logika duplikasi undangan (generate slug baru, reset stats).
  - Logika pembaruan status undangan (`Draft` &rarr; `Published` &rarr; `Live`).

### Fase 4: REST API Handler & Routing Backend
- [ ] 4.1. Buat `backend/internal/handler/invitation_handler.go`:
  - `GetMyInvitations` (`GET /api/v1/invitations`) &rarr; Ambil daftar undangan milik user yang sedang login.
  - `GetInvitationByID` (`GET /api/v1/invitations/:id`) &rarr; Ambil detail 1 undangan.
  - `CreateInvitation` (`POST /api/v1/invitations`) &rarr; Buat undangan baru.
  - `UpdateInvitation` (`PUT /api/v1/invitations/:id`) &rarr; Simpan data form / auto-save.
  - `DeleteInvitation` (`DELETE /api/v1/invitations/:id`) &rarr; Hapus undangan.
  - `DuplicateInvitation` (`POST /api/v1/invitations/:id/duplicate`) &rarr; Duplikasi undangan.
  - `UpdateStatus` (`PATCH /api/v1/invitations/:id/status`) &rarr; Ubah status.
  - `GetPublicInvitationBySlug` (`GET /api/v1/invitations/public/:slug`) &rarr; Akses publik website undangan.
- [ ] 4.2. Daftarkan grup rute `/api/v1/invitations` di `backend/cmd/api/main.go` di bawah `AuthMiddleware(cfg.JWTSecret)`.
- [ ] 4.3. Uji coba endpoint API backend (jalankan seeder, uji request via curl / unit tests).

### Fase 5: Integrasi Frontend Customer (`frontend/customer`)
- [ ] 5.1. Refaktor `frontend/customer/src/hooks/useInvitations.ts`:
  - Hapus import dan pemakaian `INITIAL_INVITATIONS`.
  - Hapus persistensi ke `localStorage`.
  - Gunakan JWT token dari `useAuth` untuk fetch data undangan dari `GET /api/v1/invitations`.
  - Tambahkan state `loading` dan `error`.
  - Implementasikan operasi CRUD asynchronous (`createInvitation`, `createBlankInvitation`, `updateInvitation`, `deleteInvitation`, `duplicateInvitation`, `updateInvitationStatus`) yang langsung melakukan HTTP call ke backend REST API.
- [ ] 5.2. Bersihkan data hardcode `INITIAL_INVITATIONS` dari `frontend/customer/src/data/seedData.ts`.
- [ ] 5.3. Tambahkan visual loading state (skeleton loader) dan empty state yang interaktif di `DashboardView.tsx`.
- [ ] 5.4. Pastikan auto-save dan manual save di `EditorView.tsx` tersimpan langsung ke PostgreSQL via backend REST API.

### Fase 6: Pengujian End-to-End & Finalisasi
- [ ] 6.1. Jalankan `go build` pada backend untuk memastikan tidak ada error kompilasi.
- [ ] 6.2. Jalankan `npm --prefix frontend/customer run build` untuk memastikan tidak ada TypeScript/Vite error.
- [ ] 6.3. Uji coba login customer contoh (`dimas.aditya@gmail.com`) dan pastikan daftar undangan langsung tampil dari PostgreSQL.
- [ ] 6.4. Uji coba alur Buat Undangan Baru & Editor: pastikan data baru dan perubahan form berhasil tersimpan ke database.
- [ ] 6.5. Uji coba aksi kartu: ubah status, duplikasi, dan hapus undangan.
- [ ] 6.6. Commit dan push ke repository git (`main`).