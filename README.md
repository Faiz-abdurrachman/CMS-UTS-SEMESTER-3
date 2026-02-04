# CMS Lost & Found

Aplikasi web full-stack untuk melaporkan dan mengelola barang hilang serta barang ditemukan dalam lingkungan komunitas atau institusi. Backend (Node.js, Express, MySQL) dan frontend (React, Vite) berada dalam satu monorepo.

---

## Daftar isi

- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Persyaratan](#persyaratan)
- [Cara instalasi – pilih yang cocok](#cara-instalasi--pilih-yang-cocok)
- [Jalan A: Pakai Docker (disarankan)](#jalan-a-pakai-docker-disarankan)
- [Jalan B: Instalasi manual (tanpa Docker)](#jalan-b-instalasi-manual-tanpa-docker)
- [Struktur proyek](#struktur-proyek)
- [Deployment (Vercel + MySQL cloud)](#deployment-vercel--mysql-cloud)
- [Ringkasan API](#ringkasan-api)
- [Pemecahan masalah](#pemecahan-masalah)

---

## Fitur

**Pengguna**
- Registrasi dan login dengan JWT.
- Melaporkan barang hilang (nama, deskripsi, lokasi, tanggal, foto opsional).
- Melaporkan barang ditemukan (field sama).
- Dashboard berisi daftar hilang, ditemukan, dan selesai; pencarian dan filter.
- My Reports: melihat dan melacak laporan sendiri (pending / approved / resolved).

**Admin**
- Dashboard statistik (jumlah user, laporan, pending, approved).
- Validasi laporan: setujui atau tolak; tandai selesai dengan catatan opsional.
- Edit atau hapus laporan; hapus pengguna (akun admin dilindungi).
- Tab Manage Reports dan Manage Users.

---

## Tech Stack

| Lapisan   | Teknologi |
|-----------|-----------|
| Frontend  | React 18, Vite, React Router, TailwindCSS, DaisyUI, Axios, react-hot-toast |
| Backend   | Node.js, Express 5, mysql2 (pool), bcrypt, jsonwebtoken, multer, helmet, express-rate-limit, cors |
| Database  | MySQL 8 (atau MariaDB kompatibel) |
| Deploy    | Vercel (frontend + API serverless), MySQL cloud (PlanetScale, Railway, dll.) |

---

## Persyaratan

| Yang dibutuhkan | Keterangan |
|------------------|------------|
| **Node.js** | Versi 18 atau lebih baru. Cek: `node -v` |
| **npm** | Biasanya ikut Node.js. Cek: `npm -v` |
| **Git** | Untuk clone repo |
| **Database** | MySQL 8 atau MariaDB. Bisa lewat Docker, XAMPP, Laragon (Windows), atau pasang langsung (Linux/macOS). |

**Per OS:**
- **Windows:** Node.js + MySQL. MySQL bisa dari [XAMPP](https://www.apachefriends.org/), [Laragon](https://laragon.org/), atau Docker Desktop.
- **Linux:** Node.js + MariaDB/MySQL (paket `mariadb` atau `mysql-server`). CLI `mysql` opsional; proyek ini punya script Node untuk jalankan schema tanpa CLI.
- **macOS:** Node.js + MySQL/MariaDB (mis. lewat [Homebrew](https://brew.sh/): `brew install mysql`).

---

## Cara instalasi – pilih yang cocok

| Situasi | Disarankan |
|--------|-------------|
| Mau paling cepat, tidak mau pasang MySQL di laptop | **Jalan A: Docker** |
| Windows, sudah pakai XAMPP/Laragon | **Jalan B** + phpMyAdmin atau MySQL CLI |
| Linux, tidak punya Docker / mau MySQL lokal | **Jalan B** + MariaDB + script `npm run run-schema` (tanpa perlu CLI `mysql`) |
| macOS, mau MySQL lokal | **Jalan B** + Homebrew MySQL + CLI atau `run-schema` |

---

## Jalan A: Pakai Docker (disarankan)

Cocok untuk **semua OS** (Windows, Linux, macOS). MySQL, backend, dan frontend jalan di container; tidak perlu pasang MySQL atau konfigurasi manual.

**1. Pasang Docker**

- Windows/macOS: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Linux (contoh Arch): `sudo pacman -S docker docker-compose` lalu `sudo systemctl start docker`
- Linux (Debian/Ubuntu): `sudo apt install docker.io docker-compose` lalu `sudo systemctl start docker`

**2. Clone dan siapkan env**

```bash
git clone https://github.com/Faiz-abdurrachman/CMS-UTS-SEMESTER-3.git
cd CMS-UTS-SEMESTER-3
npm run install:all
cp backend/.env.docker.example backend/.env.docker
```

**3. Jalankan semuanya**

```bash
docker compose up --build
```

- Schema database jalan otomatis saat container MySQL pertama kali start.
- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000  

**4. Buat akun admin (sekali jalan)**

Buka terminal **baru**, lalu:

```bash
cd CMS-UTS-SEMESTER-3/backend
docker compose exec backend node scripts/createAdmin.js
```

Ikuti prompt (nama, email, password). Lalu buka http://localhost:3000 dan login dengan akun admin tersebut.

**5. Hentikan**

Di terminal yang menjalankan `docker compose up`: `Ctrl+C`. Untuk stop sekaligus hapus container: `docker compose down`.

---

## Jalan B: Instalasi manual (tanpa Docker)

Gunakan cara ini jika kamu **tidak** pakai Docker dan mau jalankan backend/frontend + MySQL langsung di laptop.

### Langkah 1: Clone dan dependensi

```bash
git clone https://github.com/Faiz-abdurrachman/CMS-UTS-SEMESTER-3.git
cd CMS-UTS-SEMESTER-3
npm run install:all
```

Jika `install:all` gagal, pasang manual:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Langkah 2: Database

Buat database `lostfound_db` dan jalankan schema. Pilih **satu** cara di bawah yang cocok dengan kamu.

#### Opsi 2a – Docker hanya untuk MySQL (opsional)

Kalau mau pakai Docker **hanya** untuk MySQL, dan backend/frontend jalan di laptop:

```bash
docker compose up -d mysql
```

Tunggu sampai MySQL sehat (~30 detik), lalu buat `.env` di backend (langkah 3) dengan `DB_HOST=localhost`, `DB_USER=root`, `DB_PASSWORD=rootpassword`, `DB_NAME=lostfound_db`. Schema sudah dijalankan otomatis oleh container. Lalu lanjut ke langkah 4 (create-admin) dan 5 (npm run dev).

#### Opsi 2b – Tanpa CLI `mysql` (Linux / macOS / Windows dengan Node saja)

Cocok jika kamu **tidak** punya perintah `mysql` di terminal (mis. belum pasang MySQL client, atau pakai MariaDB tanpa CLI).

1. Pasang dan nyalakan MySQL/MariaDB:
   - **Arch Linux:** `sudo pacman -S mariadb` → `sudo mariadb-install-db -u root` → `sudo systemctl start mariadb`
   - **Debian/Ubuntu:** `sudo apt install mariadb-server` → `sudo systemctl start mariadb`
   - **macOS (Homebrew):** `brew install mysql` → `brew services start mysql`
   - **Windows (XAMPP/Laragon):** nyalakan MySQL dari panel kontrol.

2. Dari **root repo**:

```bash
cd backend
cp .env.example .env
# Edit .env: isi DB_PASSWORD jika MySQL root punya password
npm run run-schema
```

Script `run-schema` akan membuat database `lostfound_db` dan menjalankan `backend/database/schema.sql` lewat Node (tidak perlu perintah `mysql`).

#### Opsi 2c – Lewat MySQL CLI

Kalau di laptop sudah ada perintah `mysql`:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS lostfound_db;"
mysql -u root -p lostfound_db < backend/database/schema.sql
```

Di Windows (cmd/PowerShell) path bisa pakai backslash, contoh: `backend\database\schema.sql`.

#### Opsi 2d – Lewat phpMyAdmin (XAMPP/Laragon)

1. Buka phpMyAdmin (biasanya http://localhost/phpmyadmin).
2. Buat database baru: nama `lostfound_db`.
3. Pilih database tersebut → tab **Import** → pilih file `backend/database/schema.sql` → jalankan.

### Langkah 3: Environment (backend)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` sesuai MySQL kamu, contoh:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=lostfound_db

JWT_SECRET=gunakan_string_acak_panjang_di_sini
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:3000
```

- **DB_PASSWORD:** kosongkan jika user `root` tidak pakai password; isi jika ada.
- **JWT_SECRET:** untuk development bisa pakai string bebas; untuk production gunakan string acak, mis. hasil `openssl rand -base64 32`.

### Langkah 4: Buat akun admin

Dari **root repo**:

```bash
cd backend
npm run create-admin
```

Ikuti prompt (nama, email, password). Ini satu-satunya cara membuat admin; registrasi di aplikasi hanya untuk pengguna biasa.

### Langkah 5: Jalankan aplikasi

Dari **root repo**:

```bash
npm run dev
```

- Backend: http://localhost:5000  
- Frontend: http://localhost:3000  

Buka http://localhost:3000 di browser. Login dengan email/password admin untuk akses Admin Panel.

---

## Struktur proyek

```
CMS-UTS-SEMESTER-3/
├── api/
│   └── index.js              # Entry serverless Vercel
├── backend/
│   ├── config/
│   │   └── db.js             # Pool MySQL
│   ├── controllers/
│   ├── middleware/           # auth, admin, upload
│   ├── models/
│   ├── routes/
│   ├── database/
│   │   ├── schema.sql        # Skema database (tabel users, items)
│   │   └── create-admin.sql
│   ├── scripts/
│   │   ├── createAdmin.js    # Buat akun admin
│   │   └── runSchema.js      # Jalankan schema tanpa CLI mysql
│   ├── server.js
│   ├── .env.example
│   └── .env.docker.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/         # AuthContext
│   │   ├── hooks/            # useAuth
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── package.json              # install:all, dev, build:frontend
├── vercel.json
├── docker-compose.yml        # MySQL + backend + frontend
├── PRD.md
└── README.md
```

---

## Deployment (Vercel + MySQL cloud)

Repo siap untuk Vercel: frontend sebagai build statis, backend sebagai serverless lewat `api/index.js`. Dibutuhkan instance MySQL di cloud (PlanetScale, Railway, dll.).

**1. Database di cloud**

- **PlanetScale:** Buat database dan branch, di Connect ambil host, user, password, nama database. Aktifkan SSL; set `DB_SSL=true` di production.
- **Railway:** Tambahkan MySQL ke proyek, salin env vars yang diberikan.

Jalankan schema **sekali** ke database tersebut:

- Jika punya CLI `mysql`:  
  `mysql -h YOUR_HOST -u YOUR_USER -p YOUR_DATABASE < backend/database/schema.sql`
- Jika tidak punya CLI: set env `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (dan `DB_SSL=true` jika perlu), lalu dari folder `backend` jalankan:  
  `npm run run-schema`

**2. Proyek Vercel**

- Import repo GitHub sebagai proyek Vercel baru.
- Root directory: default (root repo).
- Install: `npm run install:all`
- Build/output: ikuti default (Vercel memakai `vercel.json`).

**3. Variabel environment (Vercel)**

Di Project Settings → Environment Variables tambahkan:

| Variabel     | Keterangan |
|--------------|------------|
| NODE_ENV     | `production` |
| DB_HOST      | Host MySQL (PlanetScale/Railway) |
| DB_USER      | User MySQL |
| DB_PASSWORD  | Password MySQL |
| DB_NAME      | Nama database (mis. `lostfound_db`) |
| DB_SSL       | `true` untuk PlanetScale; kosongkan atau `false` jika tidak |
| JWT_SECRET   | String acak panjang (mis. `openssl rand -base64 32`) |
| FRONTEND_URL | URL aplikasi Vercel (mis. `https://your-app.vercel.app`, tanpa slash akhir) |

Setelah deploy pertama, pastikan `FRONTEND_URL` sesuai URL Vercel lalu deploy ulang agar CORS benar.

**4. Buat admin di production**

Jalankan create-admin sekali dengan env production (lokal dengan env set, atau di tempat aman):

```bash
cd backend
export DB_HOST=... DB_USER=... DB_PASSWORD=... DB_NAME=lostfound_db DB_SSL=true JWT_SECRET=...
node scripts/createAdmin.js
```

Lalu login di situs production dengan email dan password admin tersebut.

**5. Upload file di production**

Fungsi serverless tidak punya disk persisten. File yang di-upload bisa hilang. Untuk production, disarankan pakai storage eksternal (Cloudinary, S3, Vercel Blob) dan simpan URL di database.

---

## Ringkasan API

Base URL (lokal): `http://localhost:5000/api`  
Base URL (Vercel): `https://your-app.vercel.app/api`

**Publik**
- `POST /auth/register` — body: `{ name, email, password }`
- `POST /auth/login` — body: `{ email, password }`
- `GET /items` — daftar item (query opsional: search, status)

**Terlindungi (header: `Authorization: Bearer <token>`)**  
- `GET /items/my-reports`  
- `POST /items/lost` — FormData (name, description, location, date_occured, status=lost, image opsional)  
- `POST /items/found` — FormData (sama, status=found)

**Admin**
- `GET /admin/statistics`  
- `GET /admin/items`, `GET /admin/users`  
- `PUT /admin/items/:id/validate` — body: `{ validation_status: "approved" | "rejected" }`  
- `PUT /admin/items/:id/resolve` — body: `{ resolved_note?: string }`  
- `PUT /admin/items/:id` — update item (FormData)  
- `DELETE /admin/items/:id`, `DELETE /admin/users/:id`

---

## Pemecahan masalah

| Gejala | Solusi |
|--------|--------|
| **`command not found: mysql`** | Tidak perlu CLI `mysql`. Pakai **Opsi 2b**: pasang MySQL/MariaDB server, lalu `cd backend` dan `npm run run-schema`. |
| **ECONNREFUSED 127.0.0.1:3306** | MySQL belum jalan. Nyalakan: XAMPP/Laragon (Windows), `sudo systemctl start mariadb` (Linux), `brew services start mysql` (macOS), atau `docker compose up -d mysql`. Cek juga `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` di `.env`. |
| **Port 3000 atau 5000 sudah dipakai** | Matikan proses yang pakai port tersebut, atau ubah port di `backend/.env` (PORT) dan di `frontend/vite.config.js` (server.port). |
| **Login selalu invalid** | Jangan insert user manual dengan password plain. Pakai **Registrasi** di aplikasi atau `npm run create-admin` di backend agar password di-hash (bcrypt). |
| **Gambar tidak tampil** | Pastikan folder `backend/uploads` ada; backend melayani `/uploads` dari sana. Di production, pakai storage eksternal. |
| **Error CORS setelah deploy** | Set `FRONTEND_URL` di Vercel ke URL aplikasi yang tepat (tanpa slash di akhir), lalu deploy ulang. |
| **Docker: schema tidak jalan / tabel kosong** | Pastikan file `backend/database/schema.sql` ada dan container MySQL dibuat ulang sekali: `docker compose down -v` lalu `docker compose up --build`. Volume `-v` akan menghapus data lama sehingga schema dijalankan lagi. |
| **npm run install:all gagal** | Jalankan manual: `cd backend && npm install` lalu `cd ../frontend && npm install`. Pastikan Node.js ≥ 18 (`node -v`). |

---

Lisensi: ISC.  
Dokumentasi diperbarui: Februari 2026.
