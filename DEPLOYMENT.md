# Panduan Deployment Nuptia dengan Docker Compose

Panduan lengkap ini menjelaskan langkah demi langkah cara men-deploy proyek **Nuptia** ke server VPS (Virtual Private Server) maupun lingkungan lokal menggunakan **Docker** dan **Docker Compose**.

---

## Daftar Isi
1. [Arsitektur Kontainer](#1-arsitektur-kontainer)
2. [Prasyarat Server](#2-prasyarat-server)
3. [Instalasi Docker di VPS](#3-instalasi-docker-di-vps)
4. [Persiapan Repositori & Environment](#4-persiapan-repositori--environment)
5. [Menjalankan Aplikasi](#5-menjalankan-aplikasi)
6. [Konfigurasi Domain & HTTPS / SSL](#6-konfigurasi-domain--https--ssl)
7. [Prosedur Pembaruan (Redeploy)](#7-prosedur-pembaruan-redeploy)
8. [Persiapan Modul API Backend](#8-persiapan-modul-api-backend)
9. [Perintah Operasional Harian](#9-perintah-operasional-harian)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Arsitektur Kontainer

Stack kontainer terdiri dari:
- **`web` (`nuptia-web`)**:
  - Frontend Next.js 16 (React 19, Tailwind CSS v4) yang dibundel dalam mode **standalone** dengan multi-stage Docker build berbasis `node:20-alpine`.
  - Berjalan sebagai non-root user (`nextjs:1001`) untuk keamanan tingkat produksi.
  - Menyajikan halaman landing page SaaS sekaligus template statis (`/templates/wedding-rustic/`).
  - Dilengkapi *built-in healthcheck*.
- **`nginx` (`nuptia-nginx`)**:
  - Reverse proxy berbasis `nginx:1.27-alpine` di port 80 (HTTP) dan port 443 (HTTPS).
  - Mengaktifkan kompresi Gzip otomatis dan caching header performa tinggi untuk aset statis Next.js (`/_next/static/`) dan template undangan (`/templates/`).
- **`certbot` (Opsional)**:
  - Layanan otomatisasi sertifikat SSL gratis Let's Encrypt (dijalankan via profil Docker `--profile ssl`).

---

## 2. Prasyarat Server

Spesifikasi server VPS yang disarankan (misal: DigitalOcean, Linode, AWS Lightsail, IDCloudHost, DomaiNesia, dll.):
- **Sistem Operasi**: Ubuntu 22.04 LTS / 24.04 LTS atau Debian 12
- **RAM**: Minimal 1 GB (Disarankan 2 GB atau aktifkan 2 GB Swap jika RAM 1 GB agar proses build Next.js lancar)
- **CPU**: 1 vCPU atau lebih
- **Disk**: Minimal 15 GB SSD
- **Firewall / Security Group**: Buka port `22` (SSH), `80` (HTTP), dan `443` (HTTPS)

---

## 3. Instalasi Docker di VPS

Jika server Anda belum memiliki Docker dan Docker Compose, jalankan perintah berikut di terminal SSH VPS Anda:

```bash
# 1. Update paket sistem
sudo apt update && sudo apt upgrade -y

# 2. Instal Docker via skrip resmi Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Masukkan user aktif ke dalam grup docker (agar tidak perlu selalu sudo)
sudo usermod -aG docker $USER

# 4. Aktifkan perubahan grup (atau logout lalu login SSH kembali)
newgrp docker

# 5. Verifikasi instalasi
docker --version
docker compose version
```

> [!TIP]
> **Tambahkan Swap Memory (Sangat disarankan untuk VPS 1 GB RAM):**
> ```bash
> sudo fallocate -l 2G /swapfile
> sudo chmod 600 /swapfile
> sudo mkswap /swapfile
> sudo swapon /swapfile
> echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
> ```

---

## 4. Persiapan Repositori & Environment

1. **Clone repositori ke server:**
   ```bash
   cd /var/www # atau direktori pilihan Anda (misal ~/app)
   git clone <URL_REPOSITORI_ANDA> invite
   cd invite
   ```

2. **Salin dan sesuaikan variabel lingkungan:**
   ```bash
   cp .env.example .env
   ```

3. **Edit file `.env` jika diperlukan:**
   ```bash
   nano .env
   ```
   Isi default `.env`:
   ```dotenv
   NODE_ENV=production
   WEB_PORT=3000
   HTTP_PORT=80
   HTTPS_PORT=443
   DOMAIN=nuptia.id
   ```

---

## 5. Menjalankan Aplikasi

### Opsi A: Jalankan Lengkap dengan Nginx Reverse Proxy (Direkomendasikan untuk Produksi)

Perintah ini akan mem-build kontainer Next.js dan menjalankan Nginx di port 80:

```bash
docker compose up -d --build
```

Cek status kontainer:
```bash
docker compose ps
```

*Output yang diharapkan:*
```
NAME                   IMAGE                 STATUS                   PORTS
nuptia-web             invite-web            Up (healthy)             0.0.0.0:3000->3000/tcp
nuptia-nginx           nginx:1.27-alpine     Up                       0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

Sekarang Anda dapat membuka `http://<IP-VPS-ANDA>` atau domain Anda di browser.

### Opsi B: Hanya Menjalankan Service Web Saja (Tanpa Nginx Docker)
Jika server Anda sudah memiliki Nginx terpasang langsung di host OS, Anda bisa menjalankan kontainer web saja:
```bash
docker compose up -d --build web
```
Aplikasi akan dapat diakses di port `http://<IP-VPS-ANDA>:3000`.

---

## 6. Konfigurasi Domain & HTTPS / SSL

### Metode 1: Menggunakan Cloudflare SSL (Paling Cepat & Mudah)
1. Arahkan DNS **A Record** domain Anda (misal `@` dan `www`) ke IP Publik VPS Anda di dashboard Cloudflare.
2. Aktifkan **Proxy status (Orange Cloud)**.
3. Di menu SSL/TLS Cloudflare, pilih mode **Flexible** (atau **Full** jika Anda membuat sertifikat origin).
4. Selesai! Domain Anda otomatis memiliki HTTPS tanpa perlu konfigurasi certbot di server.

---

### Metode 2: Menggunakan Let's Encrypt / Certbot Langsung di Nginx Docker

1. Pastikan DNS A Record domain Anda sudah mengarah ke IP VPS.
2. Jalankan perintah pembuatan sertifikat pertama kali menggunakan container certbot:
   ```bash
   docker compose run --rm certbot certonly \
     --webroot \
     --webroot-path=/var/www/certbot \
     --email admin@domainanda.com \
     --agree-tos \
     --no-eff-email \
     -d domainanda.com -d www.domainanda.com
   ```

3. Buka file konfigurasi Nginx `nginx/conf.d/default.conf`:
   ```bash
   nano nginx/conf.d/default.conf
   ```
   Tambahkan blok SSL berikut di dalam file (atau aktifkan redirect HTTP ke HTTPS):
   ```nginx
   server {
       listen 80;
       listen [::]:80;
       server_name domainanda.com www.domainanda.com;

       location /.well-known/acme-challenge/ {
           root /var/www/certbot;
       }

       location / {
           return 301 https://$host$request_uri;
       }
   }

   server {
       listen 443 ssl http2;
       listen [::]:443 ssl http2;
       server_name domainanda.com www.domainanda.com;

       ssl_certificate /etc/letsencrypt/live/domainanda.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/domainanda.com/privkey.pem;

       # Konfigurasi proxy Next.js
       location / {
           proxy_pass http://nextjs_upstream;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location /_next/static/ {
           proxy_pass http://nextjs_upstream;
           expires 365d;
           add_header Cache-Control "public, max-age=31536000, immutable";
       }

       location /templates/ {
           proxy_pass http://nextjs_upstream;
           expires 7d;
           add_header Cache-Control "public, max-age=604800";
       }
   }
   ```

4. Reload Nginx:
   ```bash
   docker compose exec nginx nginx -s reload
   ```

5. Aktifkan service auto-renew certbot di background:
   ```bash
   docker compose --profile ssl up -d
   ```

---

## 7. Prosedur Pembaruan (Redeploy)

Ketika ada update kode baru di git, lakukan deployment ulang dengan langkah praktis berikut:

```bash
# 1. Masuk ke folder proyek
cd /var/www/invite

# 2. Ambil perubahan terbaru dari branch main
git pull origin main

# 3. Build ulang dan jalankan container baru di latar belakang
docker compose up -d --build

# 4. Bersihkan sisa build lama yang tidak terpakai
docker image prune -f
```

---

## 8. Persiapan Modul API Backend

Ketika modul `api/` sudah siap (misalnya berbasis Express / Fastify / NestJS):

1. Buat file `api/Dockerfile` dengan konfigurasi standar Node.js.
2. Buka `docker-compose.yml`, lalu hapus tanda komentar pada blok service `api`:
   ```yaml
   api:
     container_name: nuptia-api
     build:
       context: ./backend
       dockerfile: Dockerfile
     restart: unless-stopped
     environment:
       - NODE_ENV=production
       - PORT=5000
     ports:
       - "${API_PORT:-5000}:5000"
     networks:
       - app-network
   ```
3. Buka `nginx/conf.d/default.conf`, lalu aktifkan upstream dan routing lokasi `/api/`:
   ```nginx
   upstream api_upstream {
       server api:5000;
       keepalive 32;
   }

   # Di dalam blok server { ... }
   location /api/v1/ {
       proxy_pass http://api_upstream;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```
4. Jalankan `docker compose up -d --build`.

---

## 9. Perintah Operasional Harian

| Kebutuhan | Perintah |
| :--- | :--- |
| **Melihat Log Aplikasi Real-time** | `docker compose logs -f web` |
| **Melihat Log Nginx** | `docker compose logs -f nginx` |
| **Mengecek Status Kontainer** | `docker compose ps` |
| **Restart Semua Service** | `docker compose restart` |
| **Restart Service Tertentu** | `docker compose restart web` |
| **Menghentikan Semua Service** | `docker compose down` |
| **Cek Penggunaan Resource (RAM & CPU)** | `docker stats` |
| **Masuk ke Shell Kontainer Web** | `docker compose exec web sh` |

---

## 10. Troubleshooting

### 1. Pesan Error: `port is already allocated`
- **Penyebab**: Port 80 atau 3000 sedang dipakai oleh aplikasi lain (misalnya Apache atau Nginx bawaan host).
- **Solusi**: Matikan layanan host yang bertabrakan:
  ```bash
  sudo systemctl stop nginx # atau apache2
  sudo systemctl disable nginx
  ```
  Atau ubah port di file `.env` (misal `HTTP_PORT=8080`).

### 2. Proses Build Berhenti Tiba-tiba (`Killed` atau Exit Code 137)
- **Penyebab**: Server kehabisan memori RAM (*Out Of Memory* / OOM) saat Next.js melakukan compiling JavaScript.
- **Solusi**: Tambahkan Swap Memory 2GB seperti yang tertera pada panduan [Prasyarat Server](#2-prasyarat-server).

### 3. Kontainer Web Berstatus `unhealthy`
- **Cek detail log error**:
  ```bash
  docker compose logs --tail=100 web
  ```
- **Verifikasi konektivitas internal**:
  ```bash
  docker compose exec web wget -qO- http://localhost:3000/
  ```

### 4. Template Undangan Tidak Terbuka di Iframe / Browser
- Verifikasi bahwa file template telah ter-copy ke dalam image:
  ```bash
  docker compose exec web ls -la /app/public/templates
  ```
  Pastikan folder `wedding-rustic` tersedia di dalamnya.
