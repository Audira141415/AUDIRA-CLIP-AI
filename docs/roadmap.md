# Roadmap & Prioritas Pengembangan AUDIRA-CLIP-AI

Dokumen ini merangkum urutan prioritas pengerjaan modul-modul yang baru saja diinisialisasi. Prioritas ini disusun berdasarkan penyelesaian alur fitur utama (MVP) aplikasi *video clipper*, menuju ke stabilitas *enterprise*, dan perluasan *platform*.

## 🥇 Prioritas 1: Core User Flow & Integrasi Utama (Mendesak)
Fokus pada penyelesaian fitur yang langsung berinteraksi dengan pengguna di aplikasi web utama dan logika AI intinya.

1. **`ai/prompts` & `ai/workflows`**
   - **Alasan:** Ini adalah otak dari produk. Logika untuk memotong video (clipping) dan mendeteksi momen viral harus dirancang prompt dan alur datanya terlebih dahulu.
2. **`packages/hooks` & `packages/sdk`**
   - **Alasan:** Frontend membutuhkan cara standar untuk melakukan pemanggilan API ke backend AI dan state global (seperti authentikasi dan status render).
3. **`services/user-service`**
   - **Alasan:** Pengelolaan batasan *tier* (Gratis vs Pro), profil, dan sinkronisasi workspace dibutuhkan sebelum fitur lainnya bisa digunakan dengan aman.
4. **`apps/web/src/app/thumbnail-studio` & `social-export`**
   - **Alasan:** Melengkapi seluruh 16 modul di aplikasi Web (agar SaaS ini 100% lengkap dari sisi UI).

---

## 🥈 Prioritas 2: Skalabilitas & Manajemen (Menengah)
Fokus pada alat untuk mengelola *user base* dan meningkatkan retensi pengguna lewat layanan *real-time*.

1. **`apps/admin` (Admin Panel)**
   - **Alasan:** Diperlukan aplikasi terpisah untuk melihat analitik keseluruhan, menyetujui paket berlangganan, atau melakukan intervensi jika ada *render* video yang gagal.
2. **`services/notification-service`**
   - **Alasan:** Video rendering memakan waktu. Layanan ini (Websockets/Email) sangat penting untuk memberi tahu pengguna saat video mereka selesai diproses oleh AI tanpa mereka harus memuat ulang halaman terus menerus.
3. **`services/analytics-service`**
   - **Alasan:** Mulai merekam dan melacak *event* (video apa yang di-export, performa pengguna) untuk laporan pengguna (Modul 12).
4. **`services/subtitle-service`**
   - **Alasan:** Ekstraksi spesifik layanan subtitle ke *microservice* agar proses Whisper tidak memberatkan `video-service` utama.

---

## 🥉 Prioritas 3: Ekosistem & Enterprise (Jangka Panjang)
Fokus pada perluasan platform dan stabilitas tingkat produksi.

1. **`apps/mobile` (React Native / Expo)**
   - **Alasan:** Setelah Web selesai 100%, kerangka mobile baru mulai dikerjakan menggunakan API yang sama.
2. **`infrastructure/terraform` & `infrastructure/monitoring`**
   - **Alasan:** Deployment otomatis ke cloud (AWS/GCP) dan *setup* dasbor performa menggunakan Grafana dan Prometheus untuk persiapan rilis ke publik.
3. **`.github/workflows` & `scripts/`**
   - **Alasan:** Automasi *build pipeline* (CI/CD) agar tim bisa merilis versi baru tanpa *downtime*.
4. **`tests/` (Unit, Integration, E2E)**
   - **Alasan:** Menambah jaminan kualitas perangkat lunak secara menyeluruh.
