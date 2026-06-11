# 🎬 AUDIRA-CLIP-AI

![AUDIRA-CLIP-AI](https://img.shields.io/badge/Platform-AI_Video_Clipper-blue.svg)
![Architecture](https://img.shields.io/badge/Architecture-Microservices_Monorepo-success.svg)
![Framework](https://img.shields.io/badge/Tech-Next.js_|_NestJS_|_Turborepo-black.svg)

**AUDIRA-CLIP-AI** adalah *platform* berbasis Kecerdasan Buatan (AI) berskala *Enterprise* yang dirancang khusus untuk memotong, memproses, dan menambahkan subjudul (*subtitle*) pada video secara otomatis dengan akurasi dan performa tinggi.

---

## 👨‍💻 Author / Maintainer
**Agus Dwi R (Audira)**
> *Lead Architect & Main Developer*

---

## 🏗️ Arsitektur Proyek (Monorepo)
Proyek ini mengadopsi arsitektur **Turborepo** dengan pemisahan *Frontend* dan *Backend Microservices* yang sangat terukur (Scalable):

### 🌐 Frontend (Aplikasi)
- `apps/web`: Aplikasi utama berbasis **Next.js** (App Router) + Tailwind CSS + Fabric.js (Canvas Editor).
- `apps/admin`: Dasbor manajemen internal.

### ⚙️ Backend (Microservices)
Dibangun menggunakan kerangka kerja **NestJS**, terdiri dari 5 layanan mikro (Microservices):
1. **`video-service`**: Pengolahan video inti dan integrasi FFMPEG.
2. **`subtitle-service`**: Integrasi Whisper AI (OpenAI) untuk transkripsi dan generasi `.srt`/`.ass`.
3. **`user-service`**: Manajemen pengguna dan otentikasi.
4. **`notification-service`**: Sistem antrean (Queue) dan notifikasi.
5. **`analytics-service`**: Analisis data dan *Heatmap*.

### 🧰 Packages (Pustaka Bersama)
- `@audira/database`: Prisma ORM dan Skema PostgreSQL terpusat.
- `@audira/ui`: Komponen UI *(Design System)* yang dapat digunakan ulang.
- `@audira/sdk`: Pustaka klien (Axios/Fetch API) terpusat untuk komunikasi Frontend ke Backend.

---

## 🚀 Panduan Memulai Cepat (Quick Start)

### Persyaratan Sistem
- Node.js `v18+`
- PNPM `v8+`
- PostgreSQL Database
- FFMPEG terinstal di sistem operasi

### Instalasi
1. Klon repositori ini:
   ```bash
   git clone https://github.com/Audira141415/AUDIRA-CLIP-AI.git
   ```
2. Instal semua dependensi:
   ```bash
   pnpm install
   ```
3. Konfigurasi file `.env` di direktori utama sesuai kebutuhan.
4. Jalankan aplikasi (Frontend & Backend sekaligus):
   ```bash
   pnpm run dev
   ```

---

*Hak Cipta © 2026 AUDIRA-CLIP-AI oleh Agus Dwi R (Audira). Semua Hak Dilindungi.*
