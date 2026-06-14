<div align="center">

<img src="https://img.shields.io/badge/AUDIRA-CLIP%20AI-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek05LjUgMTYuNXYtOWw3IDQuNS03IDQuNXoiLz48L3N2Zz4=&logoColor=white" alt="AUDIRA CLIP AI"/>

# 🎬 AUDIRA CLIP AI

### *AI-Powered Video Clipping & Content Repurposing Platform*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Backend-e0234e?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-Workspace-f69220?style=flat-square&logo=pnpm)](https://pnpm.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=flat-square&logo=docker)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-dc382d?style=flat-square&logo=redis)](https://redis.io/)

<br/>

> **Platform SaaS enterprise production-ready** yang mengubah video panjang menjadi konten viral secara otomatis menggunakan kecerdasan buatan. Didukung oleh AI mutakhir seperti OpenAI, Whisper, Gemini, dan Claude.

<br/>

[🚀 Demo](#) · [📖 Dokumentasi](#-dokumentasi) · [🐛 Laporkan Bug](https://github.com/Audira141415/AUDIRA-CLIP-AI/issues) · [💡 Request Fitur](https://github.com/Audira141415/AUDIRA-CLIP-AI/issues)

</div>

---

## 📸 Tampilan Aplikasi

> Platform dengan desain **Neo-Brutalism Dark** + **Glassmorphism** + **Cyberpunk** — terinspirasi dari CapCut, Linear, Notion, dan Vercel.

```
🖥️  Dashboard     →  Metrik video, clip, storage, AI usage secara real-time
📚  Library       →  Manajemen video dengan grid/list/timeline view
✂️  AI Clipper    →  Deteksi momen viral, emosional, lucu secara otomatis
🎬  Editor        →  Timeline editor profesional multi-track
💬  Subtitle      →  Subtitle AI otomatis (ID/EN/JP/ZH/AR) dengan 5 preset
🔁  Reframe       →  AI reframing cerdas untuk semua rasio aspek
🖼️  Thumbnail     →  AI thumbnail generator
📤  Renders       →  Antrean rendering cloud
👥  Team          →  Kolaborasi tim real-time
📊  Analytics     →  Analitik mendalam konten & pengguna
🤖  AI Copilot    →  Asisten AI interaktif dengan natural language
⚙️  Settings      →  Manajemen akun, API key, billing, team
```

---

## ✨ Fitur Unggulan

### 🤖 AI-Powered Intelligence
| Fitur | Deskripsi |
|-------|-----------|
| **AI Scene Detection** | Deteksi otomatis pergantian adegan |
| **Viral Moment Detection** | Identifikasi momen berpotensi viral |
| **AI Speaker Recognition** | Pengenalan pembicara secara otomatis |
| **AI Face Tracking** | Pelacakan wajah real-time untuk reframing |
| **AI Subtitle Generation** | Transkripsi & subtitle 5 bahasa (Whisper) |
| **AI Reframing** | Smart crop untuk TikTok, Reels, YouTube Shorts |
| **AI Copilot** | Asisten percakapan natural untuk semua operasi |
| **Thumbnail AI** | Generate thumbnail menarik secara otomatis |

### 🎬 Video Processing
| Fitur | Deskripsi |
|-------|-----------|
| **FFmpeg Engine** | Pemrosesan video high-performance |
| **Cloud Rendering** | Rendering terdistribusi via queue (Redis + Bull) |
| **Multi-format Export** | MP4, MOV, WebM, dan lebih banyak lagi |
| **Social Media Export** | TikTok, Instagram Reels, YouTube Shorts |

### 🏗️ Enterprise Ready
| Fitur | Deskripsi |
|-------|-----------|
| **Multi-tenant** | Isolasi data antar tenant yang sempurna |
| **RBAC** | Role-Based Access Control granular |
| **Audit Logs** | Jejak audit lengkap setiap aksi |
| **2FA** | Autentikasi dua faktor |
| **Rate Limiting** | Perlindungan API dari abuse |

---

## 🛠️ Technology Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend (`apps/web`)
- **Next.js 16** — React framework
- **React 20** — UI library
- **TypeScript** — Type safety
- **TailwindCSS v5** — Styling
- **Shadcn UI** — Component library
- **Framer Motion** — Animasi
- **Zustand** — State management
- **TanStack Query** — Data fetching
- **Socket.io Client** — Realtime

</td>
<td valign="top" width="50%">

### Backend (`services/`)
- **NestJS** — Node.js framework
- **PostgreSQL 15** — Primary database
- **Redis 7** — Cache & message queue
- **Prisma ORM** — Database toolkit
- **Socket.io** — WebSocket realtime
- **Bull Queue** — Job processing
- **JWT + OAuth** — Authentication
- **Docker + K8s** — Infrastructure

</td>
</tr>
<tr>
<td valign="top">

### AI & Processing
- **OpenAI GPT** — Language AI
- **Whisper** — Speech-to-text
- **Google Gemini** — Multimodal AI
- **Anthropic Claude** — AI Copilot
- **FFmpeg** — Video processing
- **Remotion** — Programmatic video
- **Python AI Engine** — Core ML tasks

</td>
<td valign="top">

### Infrastructure
- **Docker Compose** — Local development
- **Kubernetes** — Production orchestration
- **Terraform** — Infrastructure as Code
- **GitHub Actions** — CI/CD pipeline
- **Cloudflare R2** — Object storage
- **MinIO** — Self-hosted storage

</td>
</tr>
</table>

---

## 🏛️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  Next.js 16 (Web) │ Admin Panel │ Mobile App            │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / WebSocket
┌────────────────────────▼────────────────────────────────┐
│                   API GATEWAY                            │
│         Rate Limiting │ Auth │ Load Balancing            │
└──┬────────┬──────────┬────────┬──────────┬──────────────┘
   │        │          │        │          │
   ▼        ▼          ▼        ▼          ▼
┌──────┐ ┌──────┐ ┌───────┐ ┌──────┐ ┌────────┐
│Auth  │ │Video │ │  AI   │ │Render│ │Subtitle│  ... (microservices)
│Svc   │ │Svc   │ │  Svc  │ │Svc   │ │Svc     │
└──┬───┘ └──┬───┘ └───┬───┘ └──┬───┘ └───┬────┘
   │        │          │        │          │
   └────────┴──────────┴────────┴──────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
     ┌──────▼──────┐          ┌───────▼──────┐
     │ PostgreSQL  │          │    Redis      │
     │ (Primary DB)│          │ (Cache+Queue) │
     └─────────────┘          └──────────────┘
```

---

## 📁 Struktur Monorepo

```
audira-clip-ai/
│
├── apps/
│   ├── web/              # Frontend utama (Next.js 16)
│   ├── admin/            # Admin dashboard (NestJS + Next.js)
│   └── mobile/           # Mobile app (React Native)
│
├── services/
│   ├── api-gateway/      # API gateway & routing
│   ├── auth-service/     # Autentikasi & otorisasi
│   ├── video-service/    # Manajemen & pemrosesan video
│   ├── ai-service/       # Integrasi AI & ML
│   ├── rendering-service/# Cloud rendering queue
│   ├── subtitle-service/ # Subtitle AI (Whisper)
│   ├── billing-service/  # Billing & subscription
│   ├── analytics-service/# Analitik & metrik
│   └── notification-service/ # Push & email notifikasi
│
├── packages/             # Shared libraries (monorepo)
│   ├── ui/               # Shared UI components
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Shared React hooks
│   ├── sdk/              # Client SDK
│   └── config/           # Shared configurations
│
├── ai-engine/            # Python AI processing core
│   ├── main.py           # Entry point
│   ├── tracker.py        # Object/face tracking
│   ├── api.py            # FastAPI interface
│   └── benchmark.py      # Performance benchmarks
│
├── database/
│   ├── prisma/           # Prisma schema & migrations
│   └── seeders/          # Database seeders
│
├── infrastructure/
│   ├── docker/           # Dockerfile configurations
│   ├── kubernetes/       # K8s manifests
│   ├── terraform/        # Infrastructure as Code
│   └── monitoring/       # Prometheus, Grafana
│
├── tests/
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
│
├── .github/workflows/    # CI/CD pipelines
├── docker-compose.yml    # Local dev environment
├── turbo.json            # Turborepo config
└── pnpm-workspace.yaml   # PNPM workspace config
```

---

## 🚀 Quick Start

### Prasyarat

Pastikan tools berikut terinstall di sistem Anda:

- **Node.js** `>= 20.x`
- **pnpm** `>= 9.0.0`
- **Docker** & **Docker Compose**
- **Python** `>= 3.11` (untuk AI Engine)
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/Audira141415/AUDIRA-CLIP-AI.git
cd AUDIRA-CLIP-AI
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` dan isi konfigurasi yang diperlukan:

```env
# Database
DATABASE_URL="postgresql://audira:audirapassword@localhost:5455/audira_db"

# Redis
REDIS_URL="redis://localhost:6379"

# Auth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Services
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="..."
ANTHROPIC_API_KEY="..."

# Storage (Cloudflare R2 / MinIO)
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="audira-videos"
```

### 4. Jalankan Database & Redis

```bash
docker-compose up -d
```

### 5. Jalankan Database Migration

```bash
cd database
npx prisma migrate dev
npx prisma db seed
```

### 6. Jalankan Aplikasi

```bash
# Jalankan semua service sekaligus (via Turborepo)
pnpm dev

# Atau jalankan individual:
cd apps/web && pnpm dev        # Frontend: http://localhost:3000
cd services/api-gateway && pnpm dev  # API: http://localhost:4000
```

### 7. Jalankan AI Engine & Kebutuhan Model AI

Untuk mencegah membengkaknya ukuran repositori, **Model AI (seperti model Whisper yang berukuran besar hingga ~3GB) TIDAK DISERTAKAN dalam repository ini**.

Ketika Anda menjalankan *AI Engine* pertama kali, sistem (`faster-whisper`) akan secara otomatis mengunduh model dari sumber resminya (Hugging Face) dan menyimpannya di folder `ai-engine/models/`. Pastikan Anda memiliki koneksi internet yang stabil saat pertama kali memproses video.

```bash
cd ai-engine
pip install -r requirements.txt
python api.py
# AI Engine berjalan di http://localhost:8000
```

> 💡 **Tip:** Gunakan `start.bat` (Windows) untuk menjalankan semua service sekaligus secara otomatis.

---

## 🖥️ Rekomendasi Server (Hardware Requirements)

Mengingat aplikasi ini menjalankan **AI Video Processing** dan **Computer Vision** (FFmpeg, Whisper AI, Mediapipe Face Tracking), performa server sangat menentukan seberapa cepat antrean diproses.

### Minimum (Untuk Development/Coba-coba)
- **CPU**: 4-Core Processor (Intel i5 / AMD Ryzen 5)
- **RAM**: 8 GB
- **Storage**: 50 GB SSD
- **GPU**: Tidak wajib (akan menggunakan CPU *rendering*, cukup lambat)

### Rekomendasi Standar (Untuk Produksi Skala Kecil)
- **CPU**: 8-Core Processor (Intel i7 / AMD Ryzen 7 atau sekelas AWS t3.xlarge)
- **RAM**: 16 GB - 32 GB
- **Storage**: 250 GB NVMe SSD
- **GPU**: NVIDIA GPU (RTX 3060 / T4) dengan VRAM 8GB+ (Untuk akselerasi Faster-Whisper & FFmpeg NVENC)

### Rekomendasi Enterprise (Produksi Skala Besar & Cepat)
- **CPU**: 16-Core+ (AMD EPYC / Intel Xeon)
- **RAM**: 64 GB+
- **Storage**: 1 TB+ NVMe SSD (dan terhubung ke Cloud Storage seperti S3/R2)
- **GPU**: NVIDIA RTX 4090, A10g, atau A100 (Untuk memproses banyak model secara paralel tanpa bottleneck)

> **Catatan:** Jika Anda menjalankan tanpa GPU, sistem otomatis menggunakan *CPU fallback*, namun proses pembuatan *subtitle* dan *rendering* video akan berjalan 5x - 10x lebih lama.

---

## 🗺️ Roadmap

- [x] Dashboard & Analytics
- [x] Video Library Management
- [x] Upload Center
- [x] AI Clipper (scene & viral detection)
- [x] Timeline Editor
- [x] Subtitle Studio (AI + 5 bahasa)
- [x] AI Reframing
- [x] Render Queue
- [x] Team Workspace
- [x] AI Copilot
- [x] Billing & Subscription
- [x] Settings & Admin Panel
- [x] Realtime Subtitles (WebSocket)
- [ ] Thumbnail Studio (AI generation)
- [ ] Social Media Auto-Export
- [ ] Mobile App (React Native)
- [ ] Analytics Service (advanced)
- [ ] Notification Service (push + email)

---

## 📊 Billing Plans

| Plan | Harga | Video/Bulan | Storage | AI Credits | Team |
|------|-------|------------|---------|------------|------|
| **Starter** | Gratis | 5 video | 5 GB | 100 | 1 user |
| **Pro** | $29/bln | 50 video | 100 GB | 1.000 | 5 user |
| **Business** | $99/bln | Unlimited | 1 TB | 10.000 | 25 user |
| **Enterprise** | Custom | Unlimited | Unlimited | Unlimited | Unlimited |

---

## 🔐 Keamanan

- 🔒 **RBAC** — Role-based access control granular
- 🛡️ **2FA** — Two-factor authentication
- 📝 **Audit Logs** — Jejak audit lengkap
- 🚦 **Rate Limiting** — Perlindungan API
- 🔐 **Encryption** — Data at rest & in transit
- 🍪 **Secure Sessions** — HttpOnly, Secure cookies

---

## 🧪 Testing

```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

---

## 📖 Dokumentasi

| Dokumen | Deskripsi |
|---------|-----------|
| [Arsitektur](./docs/architecture.md) | Diagram & penjelasan arsitektur sistem |
| [API Reference](./docs/api.md) | Dokumentasi lengkap REST API |
| [Database Schema](./docs/database.md) | Skema database & ERD |
| [Deployment Guide](./docs/deployment.md) | Panduan deploy ke production |
| [Security Guide](./docs/security.md) | Panduan keamanan & hardening |
| [AI Copilot](./docs/ai-copilot.md) | Dokumentasi AI Copilot |
| [Rendering Engine](./docs/rendering-engine.md) | Dokumentasi rendering service |
| [Roadmap](./docs/roadmap.md) | Rencana pengembangan |

---

## 🤝 Kontribusi

Kontribusi sangat disambut! Silakan ikuti langkah berikut:

1. **Fork** repository ini
2. Buat branch baru: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: tambah fitur XYZ'`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat **Pull Request**

Pastikan kode Anda melewati semua lint & test sebelum membuat PR.

```bash
pnpm lint
pnpm test
```

---

## 👤 Author

<table>
  <tr>
    <td align="center">
      <b>Agus Dwi R</b><br/>
      <i>Creator & Lead Developer</i><br/>
      <a href="https://github.com/Audira141415">@Audira141415</a>
    </td>
  </tr>
</table>

---

## 📜 Lisensi

```
MIT License

Copyright (c) 2024 Agus Dwi R (AUDIRA)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

Lihat file [LICENSE](./LICENSE) untuk detail lengkap.

---

<div align="center">

**Dibuat dengan ❤️ oleh [Agus Dwi R (AUDIRA)](https://github.com/Audira141415)**

*AUDIRA CLIP AI — Transforming Video Content with Artificial Intelligence*

⭐ Jangan lupa beri **star** jika project ini bermanfaat!

</div>
