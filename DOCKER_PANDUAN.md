# Docker vs Laragon — Buat yang Baru Pakai Docker (Arch Linux)

## Bedanya Apa?

### Laragon (Windows)
- **Satu installer** → pasang Apache/Nginx + PHP + MySQL + dll. sekaligus.
- Kamu **pasang di Windows** seperti aplikasi biasa; semuanya jalan di laptop kamu.
- Klik "Start All" → MySQL nyala, PHP nyala. Kamu buka project, jalan.
- **Kekurangan:** Cuma di Windows. Di Linux (Arch) tidak ada Laragon.

### Docker
- Kamu **tidak pasang MySQL atau Node di sistem** (boleh sih, tapi tidak wajib).
- Kamu pasang cuma **Docker Engine** (aplikasi yang bisa jalankan "container").
- Satu file **docker-compose.yml** mendefinisikan: "butuh MySQL 8, butuh backend Node, butuh frontend React".
- Satu perintah **`docker compose up`** → Docker yang mengunduh image (kalau belum ada), lalu menjalankan MySQL di container, backend di container, frontend di container. Semua terisolasi dan konsisten di mana pun (Arch, Windows, Mac).

**Analoginya:**
- **Laragon** = satu paket "Laptop Windows + MySQL + PHP" yang kamu install sekali.
- **Docker** = kamu punya "mesin" (Docker) yang bisa nyalakan banyak "kotak" (container): satu kotak MySQL, satu kotak backend, satu kotak frontend. Isi kotak itu sama di mana pun kamu jalanin (Arch, Windows, server).

Jadi **integrasinya beda**: dengan Docker kamu tidak "pasang MySQL ke Arch" seperti di Laragon; kamu jalankan MySQL **di dalam container** lewat Docker. Hasil akhirnya mirip: ada MySQL yang bisa dipakai aplikasi, ada backend, ada frontend.

---

## Yang Perlu Kamu Siapkan di Arch Linux

1. **Pasang Docker**
   ```bash
   sudo pacman -S docker docker-compose
   sudo systemctl enable --now docker
   sudo usermod -aG docker $USER
   ```
   Lalu **logout/login** (atau reboot) biar grup `docker` ke-load. Setelah itu kamu bisa jalankan `docker` tanpa sudo.

2. **Clone / buka project** seperti biasa.

3. **File yang dipakai untuk Docker** (sudah disediakan di project ini):
   - `docker-compose.yml` — mendefinisikan MySQL + backend + frontend.
   - `backend/Dockerfile` — cara "bangun" image backend.
   - `frontend/Dockerfile` — cara "bangun" image frontend.
   - **Env Docker terpisah:** `backend/.env.docker.example` → copy jadi `backend/.env.docker` (isi sudah DB_HOST=mysql, tidak bergantung asumsi override).

---

## Cara masuk aplikasi (setelah Docker jalan)

Ikuti urutan ini supaya bisa buka dan pakai aplikasi:

| Langkah | Apa yang dilakukan |
|--------|---------------------|
| 1 | Di folder project: `cp backend/.env.docker.example backend/.env.docker` (cukup sekali) |
| 2 | Jalankan: `docker compose up --build` (tunggu sampai ada log "ready" / tidak error). Biarkan terminal ini tetap jalan. |
| 3 | Buka **terminal baru**, di folder project: `docker compose exec backend npm run create-admin` → isi nama, email, password admin (cukup sekali). |
| 4 | Buka browser, ke: **http://localhost:3000** |
| 5 | **User biasa:** klik "Sign Up" → daftar → login. Atau langsung "Sign In" kalau sudah punya akun. |
| 6 | **Admin:** di halaman login pilih mode "Admin", lalu Sign In pakai email & password admin yang tadi dibuat. |

Setelah itu kamu sudah "masuk" aplikasi: bisa lihat Home, Dashboard, My Reports, atau (kalau admin) Admin Panel.

---

## Cara Jalanin Project dengan Docker

### Pertama kali (setup)

1. **Copy env khusus Docker** (supaya eksplisit: backend di container pakai DB_HOST=mysql):
   ```bash
   cp backend/.env.docker.example backend/.env.docker
   ```
   File `.env.docker` dipakai **hanya** saat `docker compose up`; isinya sudah benar untuk konek ke MySQL di container. Jalan lokal (tanpa Docker) pakai `backend/.env` dari `backend/.env.example`.

2. Jalankan semua service (MySQL + backend + frontend):
   ```bash
   docker compose up --build
   ```
   - Pertama kali akan unduh image MySQL/Node dan build backend/frontend (agak lama).
   - Setelah jalan: MySQL di port 3306 (internal), backend di **http://localhost:5000**, frontend di **http://localhost:3000**.

3. **Database:** Schema MySQL akan dijalankan otomatis dari `backend/database/schema.sql` saat container MySQL pertama kali dibuat (lewat volume yang di-mount ke `/docker-entrypoint-initdb.d`).

4. **Buat akun admin** (setelah `docker compose up` jalan):
   - Buka terminal baru:
     ```bash
     docker compose exec backend npm run create-admin
     ```
   - Ikuti isian nama, email, password.

5. Buka browser: **http://localhost:3000** → aplikasi frontend; login/register pakai backend di **http://localhost:5000**.

### Sehari-hari

- **Nyalakan:**
  ```bash
  docker compose up
  ```
  (pakai `-d` kalau mau jalan di background: `docker compose up -d`)

- **Matikan:**
  ```bash
  docker compose down
  ```

- **Lihat log:**
  ```bash
  docker compose logs -f
  ```

---

## Ringkasan Perbandingan

| Aspek | Laragon (Windows) | Docker (Arch / Linux) |
|--------|--------------------|------------------------|
| Pasang apa? | Laragon (MySQL, PHP, dll. ke sistem) | Cuma Docker Engine |
| MySQL di mana? | Jalan di Windows | Jalan di container |
| Backend/Frontend | Biasanya jalan manual (node, npm) | Bisa jalan di container (seperti di sini) |
| Sama di mana-mana? | Tidak (Windows only) | Ya (Arch, Windows, Mac, server) |
| Perintah "nyalakan" | Klik Start di Laragon | `docker compose up` |

Integrasinya **tidak persis sama** dengan Laragon (Laragon bukan Docker), tapi **konsep mirip**: satu cara untuk nyalakan "lingkungan" (MySQL + app) dengan perintah yang jelas. Di Arch, Docker adalah cara yang umum dipakai supaya setup kamu sama dengan teman atau server.

Kalau mau, langkah berikutnya bisa: pastikan Docker dan `docker compose` sudah terpasang, lalu coba `docker compose up --build` dan buat admin seperti di atas.
