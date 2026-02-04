# CMS Lost & Found

Aplikasi web full-stack untuk melaporkan dan mengelola barang hilang serta barang ditemukan dalam lingkungan komunitas atau institusi. Backend (Node.js, Express, MySQL) dan frontend (React, Vite) berada dalam satu monorepo.

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
| Database  | MySQL 8 |
| Deploy    | Vercel (frontend + API serverless), MySQL cloud (mis. PlanetScale, Railway) |

---

## Persyaratan

- Node.js 18 atau lebih baru
- MySQL 8 (lokal: XAMPP, Laragon, atau Docker; production: PlanetScale, Railway, dll.)
- Git

---

## Instalasi (lokal)

**1. Clone dan pasang dependensi**

```bash
git clone https://github.com/Faiz-abdurrachman/CMS-UTS-SEMESTER-3.git
cd CMS-UTS-SEMESTER-3
npm run install:all
```

Jika gagal, pasang manual:

```bash
cd backend && npm install
cd ../frontend && npm install
```

**2. Database**

Buat database bernama `lostfound_db` lalu jalankan schema.

Lewat MySQL CLI:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS lostfound_db;"
mysql -u root -p lostfound_db < backend/database/schema.sql
```

Lewat phpMyAdmin (XAMPP/Laragon): buat database `lostfound_db`, lalu Import file `backend/database/schema.sql`.

**3. Environment (backend)**

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

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

Untuk JWT secret yang kuat (opsional di lokal):

```bash
openssl rand -base64 32
```

**4. Buat akun admin**

Dari root repo:

```bash
cd backend
npm run create-admin
```

Ikuti prompt (nama, email, password). Ini satu-satunya cara membuat admin; registrasi hanya untuk pengguna biasa.

**5. Jalankan aplikasi**

Dari root repo:

```bash
npm run dev
```

- Backend: http://localhost:5000  
- Frontend: http://localhost:3000  

Buka http://localhost:3000 di browser. Gunakan email/password admin untuk login sebagai Admin dan buka Admin Panel.

---

## Struktur proyek

```
CMS-UTS-SEMESTER-3/
├── api/
│   └── index.js              # Entry serverless Vercel (memakai server backend)
├── backend/
│   ├── config/
│   │   └── db.js             # Pool MySQL
│   ├── controllers/
│   ├── middleware/           # auth, admin, upload
│   ├── models/
│   ├── routes/
│   ├── database/
│   │   ├── schema.sql
│   │   └── create-admin.sql
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── server.js
│   ├── .env.example
│   └── .env.docker.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/         # AuthContext
│   │   ├── hooks/            # useAuth
│   │   ├── pages/
│   │   ├── api.js            # Instance Axios + interceptors
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── package.json              # install:all, dev, build:frontend
├── vercel.json               # Konfigurasi build dan routing Vercel
├── docker-compose.yml        # Opsional: MySQL + backend + frontend lokal
├── PRD.md                    # Product Requirements Document
└── README.md
```

---

## Deployment (Vercel + MySQL cloud)

Repo siap untuk Vercel: frontend sebagai build statis, backend sebagai serverless lewat `api/index.js`. Dibutuhkan instance MySQL di cloud (mis. PlanetScale atau Railway free tier).

**1. Database di cloud**

- **PlanetScale:** Buat database dan branch, lalu di Connect ambil host, user, password, nama database. Aktifkan SSL; set `DB_SSL=true` di production.
- **Railway:** Tambahkan MySQL ke proyek dan salin env vars yang diberikan.

Jalankan schema sekali ke database tersebut (mis. dari mesin Anda):

```bash
mysql -h YOUR_HOST -u YOUR_USER -p YOUR_DATABASE < backend/database/schema.sql
```

**2. Proyek Vercel**

- Import repo GitHub sebagai proyek Vercel baru.
- Root directory: biarkan default (root repo).
- Install command: `npm run install:all`
- Build/output: biarkan default (Vercel memakai `vercel.json`).

**3. Variabel environment (Vercel)**

Tambahkan di Project Settings > Environment Variables:

| Variabel     | Keterangan |
|--------------|------------|
| NODE_ENV     | `production` |
| DB_HOST      | Host MySQL dari PlanetScale/Railway |
| DB_USER      | User MySQL |
| DB_PASSWORD  | Password MySQL |
| DB_NAME      | Nama database (mis. `lostfound_db`) |
| DB_SSL       | `true` untuk PlanetScale; kosongkan atau `false` jika tidak dipakai |
| JWT_SECRET   | String acak panjang (mis. `openssl rand -base64 32`) |
| FRONTEND_URL | URL aplikasi Vercel (mis. `https://your-app.vercel.app`) |

Setelah deploy pertama, set `FRONTEND_URL` ke URL Vercel yang tepat (tanpa slash di akhir) lalu deploy ulang agar CORS berjalan benar.

**4. Buat admin di production**

Jalankan script create-admin sekali dengan DB dan JWT secret production (env vars diset lokal atau di environment sekali jalan):

```bash
cd backend
export DB_HOST=... DB_USER=... DB_PASSWORD=... DB_NAME=lostfound_db DB_SSL=true JWT_SECRET=...
node scripts/createAdmin.js
```

Lalu login di situs yang sudah di-deploy dengan email dan password admin tersebut.

**5. Upload file di Vercel**

Fungsi serverless tidak punya disk persisten. File yang di-upload ke backend bisa hilang saat cold start atau redeploy. Untuk production, disarankan menyimpan upload di storage eksternal (mis. Cloudinary, S3, Vercel Blob) dan hanya menyimpan URL di database.

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

## Docker (opsional, lokal)

Dari root repo:

```bash
docker compose up --build
```

Menjalankan MySQL (port 3306), backend (5000), dan frontend (3000). Gunakan `backend/.env.docker.example` sebagai acuan env; override `DB_HOST=mysql` di compose.

---

## Pemecahan masalah

**ECONNREFUSED 127.0.0.1:3306**  
Pastikan MySQL berjalan (XAMPP/Laragon/Docker). Periksa `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` di `.env`.

**Login selalu invalid**  
Jangan insert user manual dengan password plain. Gunakan Registrasi atau `npm run create-admin` di backend agar password di-hash.

**Gambar tidak tampil**  
Pastikan folder `backend/uploads` ada; backend melayani `/uploads` dari sana. Di production, gunakan storage eksternal.

**Error CORS setelah deploy**  
Set `FRONTEND_URL` di Vercel ke URL aplikasi yang tepat (tanpa slash di akhir) lalu deploy ulang.

---

Lisensi: ISC.  
Dokumentasi diperbarui: Februari 2026.
