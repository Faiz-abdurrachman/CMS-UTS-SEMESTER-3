# 📌 Overview Project

## Project ini tentang apa?

**CMS Lost & Found** adalah aplikasi web **full-stack** (ada bagian tampilan/user dan bagian server/database) untuk **melaporkan dan mencari barang hilang**. Bayangkan seperti papan pengumuman digital: orang bisa mengisi “barang saya hilang” atau “saya nemu barang orang”, lalu admin memeriksa laporan. Yang sudah disetujui tampil di halaman utama; yang selesai (barang ketemu) bisa ditandai “resolved”.

## Masalah apa yang diselesaikan?

- **Pemilik barang hilang**: Bisa lapor barang hilang dengan foto dan detail (lokasi, tanggal), lalu mengecek status (pending/approved/rejected).
- **Yang nemu barang orang**: Bisa lapor “saya nemu barang” agar pemilik asli bisa tahu.
- **Admin**: Bisa menyetujui/menolak laporan, mengelola user dan item, serta menandai kasus selesai (resolved).

## Alur besar aplikasi dari user buka sampai selesai

1. **User buka situs** (misal `http://localhost:3000`) → frontend React load, tampil **Home** (landing + daftar barang lost/found yang sudah approved).
2. **User daftar / login** → isi form Register atau Login → backend cek database, kirim **JWT token** → token disimpan di browser (localStorage), state “user login” aktif.
3. **User lapor barang** (Lost atau Found) → isi form + optional foto → kirim ke backend → backend simpan ke database dengan status **pending** → admin nanti approve/reject.
4. **User lihat “My Reports”** → request ke backend dengan token → backend kembalikan hanya laporan milik user itu.
5. **Admin login** → pilih mode Admin di halaman login → masuk **Admin Dashboard** → lihat statistik, daftar laporan (pending/approved/rejected), daftar user → bisa approve/reject, resolve, edit, hapus.
6. **Setelah admin approve** → laporan muncul di **Home** dan **Dashboard** (untuk semua user). Setelah **resolve** → bisa tampil di section “Resolved” lalu hilang setelah 24 jam (sesuai logic backend).

## Teknologi apa saja yang dipakai dan KENAPA

| Teknologi | Fungsi | Kenapa dipakai |
|-----------|--------|----------------|
| **React (Vite)** | Membangun tampilan web (frontend) | React populer, komponen bisa dipakai ulang; Vite bikin dev cepat dan build ringan. |
| **TailwindCSS + DaisyUI** | Styling (warna, layout, tombol) | Tailwind = class CSS di HTML, cepat; DaisyUI = komponen siap pakai (dropdown, dll). |
| **Node.js + Express** | Server backend (API) | JavaScript di server, satu bahasa dengan frontend; Express ringan dan banyak dipakai. |
| **MySQL** | Database (user, item, status) | Data terstruktur (tabel, relasi); cocok untuk user, item, status validation. |
| **JWT** | Autentikasi (token login) | Token bisa dibawa tiap request tanpa simpan session di server (stateless). |
| **bcrypt** | Enkripsi password | Password tidak disimpan mentah; hanya hash yang disimpan. |
| **Multer** | Upload file (foto) | Express butuh middleware khusus untuk form multipart (file + teks). |
| **Helmet + Rate Limit** | Keamanan | Helmet amankan header HTTP; rate limit batasi request per IP (anti spam/brute). |
| **Axios** | HTTP client di frontend | Mudah set header (token), intercept response (misal redirect kalau 401). |

---

# 📁 Struktur Folder Project

```
CMS-UTS-SEMESTER-3/
├── api/                    # Entry point untuk Vercel (serverless)
├── backend/                # Aplikasi server (Express + DB)
├── frontend/               # Aplikasi client (React)
├── docker-compose.yml      # Orkestrasi Docker (MySQL + backend + frontend)
├── vercel.json             # Konfigurasi deploy Vercel
├── .env.production.example # Referensi env production (bukan untuk di-copy ke backend)
├── .gitignore
├── package.json            # Script root: install:all, dev, build:frontend
└── README.md
```

## Penjelasan folder & file penting

- **api/**  
  Berisi `index.js` yang dipakai **Vercel** sebagai serverless function. File ini hanya me-require `backend/server` (app Express) dan export. Jadi satu codebase backend dipakai untuk jalan lokal (node server.js) dan untuk deploy di Vercel.

- **backend/**  
  Seluruh logika server: koneksi DB, route API, controller, model, middleware (auth, admin, upload).  
  - `config/` → koneksi database (pool MySQL).  
  - `controllers/` → logika bisnis (register, login, CRUD item, admin).  
  - `middleware/` → auth (JWT), cek admin, upload file.  
  - `models/` → query ke database (User, Item).  
  - `routes/` → mapping URL ke controller.  
  - `database/` → schema SQL dan script buat admin.  
  - `scripts/` → script CLI (create admin).  

  **Kenapa dipisah?** Agar tanggung jawab jelas: route hanya routing, controller hanya logika, model hanya akses data. Kalau satu file berisi semua, akan susah dibaca dan dirawat.

- **frontend/**  
  Aplikasi React: halaman (pages), komponen (components), context (Auth), hooks (useAuth), konfigurasi Vite/Tailwind.  
  - `src/pages/` → satu file per halaman (Home, Login, Dashboard, Admin, dll).  
  - `src/components/` → komponen dipakai ulang (Navbar, CardItem, Footer, SidebarAdmin).  
  - `src/contexts/` → AuthContext (state user/token global).  
  - `src/hooks/` → useAuth (akses context auth).  
  - `src/api.js` → instance Axios + interceptors (token, redirect 401).  

  **Hubungan dengan backend:** Frontend memanggil backend lewat HTTP (Axios). Dev: Vite proxy `/api` ke `localhost:5000`. Production (Vercel): request ke `/api` di-handle `api/index.js` yang memakai backend Express.

- **Root `package.json`**  
  Script: `install:all` (install backend + frontend), `dev` (jalankan backend dan frontend bersamaan dengan concurrently), `build:frontend` untuk build React.  
  **Kenapa ada root dan ada package.json di backend/frontend?** Backend dan frontend adalah dua “proyek” terpisah (dependency beda). Root cuma pemersatu untuk menjalankan keduanya sekaligus.

---

# 📄 Deep Dive File di Root (singkat)

Detail tiap file backend ada di **DEEP_DIVE_BACKEND.md**, frontend di **DEEP_DIVE_FRONTEND.md**. Di sini hanya ringkasan file **root** dan **api**.

## package.json (root)

- **Fungsi:** Script untuk install semua dependency dan menjalankan backend + frontend sekaligus.
- **Script penting:**  
  - `install:all`: cd backend → npm install, cd frontend → npm install.  
  - `dev`: jalankan `dev:backend` dan `dev:frontend` bersamaan (concurrently).  
  - `build:frontend`: build production frontend (output di `frontend/dist`).

## .gitignore

- Mengabaikan: `node_modules/`, `.env`, `.env.docker`, `dist/`, `uploads/`, file log, IDE, dsb.  
- Supaya rahasia (env) dan hasil build tidak ikut ke Git.

## docker-compose.yml

- **Services:**  
  - **mysql:** Container MySQL 8, database `lostfound_db`, schema dijalankan dari `backend/database/schema.sql`.  
  - **backend:** Build dari `backend/Dockerfile`, pakai env dari `backend/.env.docker`, konek ke service `mysql`.  
  - **frontend:** Build dari `frontend/Dockerfile`, port 3000.  
- **Volumes:** Data MySQL, node_modules, uploads agar persistent/cache.  
- **Kenapa:** Satu perintah (`docker compose up`) bisa jalanin DB + backend + frontend tanpa install MySQL di laptop.

## vercel.json

- **builds:** Frontend di-build (static), `api/index.js` dipakai sebagai serverless function.  
- **routes:** Request ke `/api/(.*)` ke `api/index.js`; selain itu ke static frontend atau `index.html` (SPA).  
- **Fungsi:** Saat deploy ke Vercel, frontend dan API pakai konfigurasi ini.

## api/index.js

- Hanya: `const app = require("../backend/server");` lalu `module.exports = app;`.  
- **Fungsi:** Vercel memanggil file ini untuk setiap request ke `/api/*`. Aplikasi Express yang sama dengan yang dijalankan di `backend/server.js` dipakai di sini, jadi tidak ada duplikasi logika.

## .env.production.example

- **Bukan** file untuk di-copy ke `backend/.env`. Ini **referensi** variabel yang harus di-set di **dashboard hosting** (Vercel/Railway dll) untuk production: `DB_*`, `JWT_SECRET`, `FRONTEND_URL`, `UPLOAD_DIR`, dll.  
- Di production, env biasanya di-set di panel hosting, bukan dari file di repo.

---

# 🔄 Alur Data & Flow Aplikasi

## Data dari mana?

- **User & password:** Input form Register/Login → backend → hash password (bcrypt) → simpan di tabel `users`.  
- **Item (lost/found):** Form Report Lost/Found + optional gambar → backend (Multer simpan file, controller baca `req.body` + `req.file`) → simpan di tabel `items` (user_id dari token JWT).  
- **Daftar item public:** Backend baca dari DB (hanya `validation_status = 'approved'` dan aturan resolved 24 jam).  
- **My Reports:** Backend filter `items` by `user_id` dari token.  
- **Admin:** Data user, item, statistik dari query ke `users` dan `items`.

## Mengalir ke mana?

- **Login:** Frontend POST `/api/auth/login` → authController cek user, bcrypt compare password → kirim JWT + data user → frontend simpan token & user di localStorage + AuthContext.  
- **Setiap request terproteksi:** Frontend (Axios interceptor) menambah header `Authorization: Bearer <token>` → backend middleware auth decode JWT, isi `req.user` → controller pakai `req.user.id` / `req.user.role`.  
- **Upload gambar:** FormData dari frontend → backend route pakai `upload.single('image')` → file disimpan di folder `uploads/`, nama file disimpan di kolom `image` tabel `items`.  
- **Tampil gambar:** URL `.../uploads/<filename>` dilayani oleh `express.static` di backend; frontend pakai URL yang sama (dev: localhost:5000, prod: /api lewat proxy/Vercel).

## Diproses di file apa?

- **Auth:** `authRoutes` → `authController` (register, login) + model `User`, middleware tidak dipakai untuk register/login.  
- **Item publik:** `itemRoutes` GET `/` → `itemController.getAll` → model `Item.findAllPublic()`.  
- **Item milik user:** GET `/my-reports` → middleware `authenticate` → `itemController.getMyReports` → `Item.findByUserId(req.user.id)`.  
- **Buat laporan:** POST `/lost` atau `/found` → `authenticate` + `upload.single('image')` → `itemController.createItem`.  
- **Admin:** Semua route di `adminRoutes` → `authenticate` → `isAdmin` → `adminController` (statistics, users, items, validate, resolve, delete).

## Output akhirnya apa?

- **User:** Halaman web (HTML/JS/CSS) yang render data dari API (daftar item, form, My Reports).  
- **Admin:** Dashboard dengan statistik, tabel, tombol approve/reject/resolve/edit/delete; perubahan tersimpan di database.  
- **API:** Response JSON (message, data array/object) atau file statis (gambar di `/uploads`).

---

# ❓ Kesalahan Umum & Potensi Bug

## Bagian rawan error

1. **Upload gambar**  
   - Jangan set header `Content-Type: multipart/form-data` manual di frontend. Biarkan Axios yang set (dengan boundary). Kalau di-set manual tanpa boundary, backend (Multer) tidak bisa parse file.  
   - **Gambar tidak tampil (CORS/CORP):** Backend pakai Helmet; default CORP bisa `same-origin` sehingga gambar dari port 5000 diblok browser saat frontend di port 3000. Di project ini sudah diatasi dengan middleware yang set `Cross-Origin-Resource-Policy: cross-origin` untuk route `/uploads`.

2. **Database**  
   - Kalau kolom `resolved_at` / `resolved_note` belum ada di tabel (schema lama), query `findAllPublic` atau `markAsResolved` bisa error. Schema di `backend/database/schema.sql` sudah memuat kolom ini; pastikan migration/schema dijalankan.

3. **Token**  
   - Token kadaluarsa (7 hari) → response 401 → interceptor Axios hapus token dan redirect ke login. Kalau JWT_SECRET beda antara environment, verify akan gagal.

4. **Env**  
   - Tanpa `.env` di backend (atau salah path), `process.env.DB_*` / `JWT_SECRET` undefined → koneksi DB gagal atau JWT error.  
   - Docker: backend harus pakai `DB_HOST=mysql` (nama service), bukan `localhost`.

## Kesalahan yang sering dilakukan pemula

- Lupa jalankan MySQL sebelum backend → `ECONNREFUSED 127.0.0.1:3306`.  
- Insert user manual lewat SQL dengan password plain text → login gagal karena backend membandingkan dengan bcrypt hash. Harus pakai Register atau script `create-admin`.  
- Memakai `role` dari body request saat register → backend sengaja menolak (hanya role `user`); admin harus dibuat manual/script.  
- Menghapus atau mengabaikan folder `backend/uploads` → gambar 404; pastikan folder ada dan permission benar.

## Cara menghindari

- Selalu cek MySQL nyala dan `.env` sesuai environment (local vs Docker).  
- Jangan set header Content-Type untuk FormData; jangan expose JWT_SECRET.  
- Setelah ubah schema SQL, jalankan ulang schema atau migration.  
- Untuk production, set env di dashboard hosting dan (kalau perlu) pakai storage eksternal untuk upload (bukan filesystem lokal).

---

# 🧠 Ringkasan Super Awam

Aplikasi ini seperti **papan pengumuman barang hilang/temuan** yang punya dua pintu:

1. **Pintu user:** Daftar, login, lalu bisa mengisi “barang saya hilang” atau “saya nemu barang” (plus foto). Laporan itu masuk antrian; user bisa lihat daftar laporannya sendiri. Yang sudah “disetujui” admin akan muncul di halaman utama.
2. **Pintu admin:** Login khusus admin, lalu ada dashboard untuk lihat semua laporan dan user. Admin bisa setujui/tolak laporan, edit, hapus, dan tandai “sudah selesai” (resolved).

Semua data (akun, laporan, status) disimpan di database MySQL. Frontend (tampilan) dan backend (API + database) terpisah; komunikasi lewat HTTP (request/response). Tidak pakai istilah rumit: “login” = cek email+password lalu kasih token; “token” = kartu identitas digital yang dikirim setiap request agar server tahu siapa yang akses.

---

# 📘 Glosarium Istilah

| Istilah | Arti | Contoh / Analogi |
|--------|------|-------------------|
| **API** | Interface untuk program berbicara dengan server (request/response). | Frontend “menelepon” backend: “Kasih daftar barang” → backend jawab JSON. |
| **Async / await** | Cara menulis kode yang menunggu operasi selesai (misal network, DB) tanpa membekukan halaman. | Seperti pesan “tunggu dulu, nanti kabari kalau sudah selesai”. |
| **bcrypt** | Algoritma untuk mengubah password menjadi string acak (hash); tidak bisa dibalik ke password asli. | Password “123” disimpan jadi “$2b$10$…”. Login: bandingkan input dengan hash. |
| **CORS** | Aturan browser: script di domain A boleh/tidak boleh akses resource di domain B. | Backend set header agar frontend (port 3000) boleh akses API (port 5000). |
| **Controller** | Bagian kode yang mengolah request dan menentukan response (logika bisnis). | authController: terima email+password, cek DB, kirim token atau error. |
| **Credentials** | Data login (cookie/token) yang dikirim bersama request. | Axios kirim `Authorization: Bearer <token>`. |
| **CRUD** | Create, Read, Update, Delete (operasi dasar data). | Item: buat laporan, baca daftar, update, hapus. |
| **Endpoint** | URL + method HTTP yang melayani satu jenis aksi. | POST `/api/auth/login` = endpoint untuk login. |
| **Environment variable (.env)** | Variabel konfigurasi di luar kode (password DB, secret JWT). | `DB_PASSWORD=...` dibaca di backend, tidak di-commit ke Git. |
| **Express** | Framework Node.js untuk membuat server HTTP (route, middleware). | app.get('/api/items', ...) = “Kalau ada GET ke /api/items, jalankan fungsi ini.” |
| **FormData** | Format kirim data form yang berisi file dan teks (multipart). | Report Lost dengan foto: name, description, + file image. |
| **Full-stack** | Mencakup frontend (tampilan) dan backend (server + DB). | Project ini: React + Express + MySQL. |
| **Hash (password)** | Hasil enkripsi satu arah dari password. | bcrypt.hash("admin123") → string panjang; tidak bisa dikembalikan ke "admin123". |
| **Helmet** | Middleware Express untuk mengamankan header HTTP. | Mencegah beberapa jenis serangan dengan mengatur header. |
| **JWT (JSON Web Token)** | Token berisi payload (misal user id, role) yang ditandatangani dengan secret; dipakai untuk auth. | Setelah login, client simpan token; tiap request kirim token agar server tahu “siapa”. |
| **Middleware** | Fungsi yang dijalankan sebelum/sesudah route handler (auth, parse body, upload). | authenticate: cek token → isi req.user → next(). |
| **Model** | Bagian yang berinteraksi dengan database (query, insert, update). | User.findByEmail(email), Item.create(...). |
| **Multer** | Middleware Express untuk menangani upload file (multipart/form-data). | upload.single('image') → file disimpan, req.file berisi info file. |
| **Pool (koneksi)** | Kumpulan koneksi database yang dipakai bergantian (efisien). | mysql2 createPool: banyak request pakai koneksi yang sama tanpa buka-tutup terus. |
| **Rate limit** | Batas jumlah request per IP dalam jangka waktu. | Maksimal 100 request per 15 menit per IP (anti spam). |
| **Route** | Pemetaan URL + method ke fungsi (controller). | GET /api/items → itemController.getAll. |
| **Schema (DB)** | Struktur tabel (nama kolom, tipe, constraint). | schema.sql: tabel users, items, index. |
| **SPA (Single Page Application)** | Aplikasi web yang satu HTML; navigasi di-handle JavaScript (React Router). | Klik link tidak reload penuh; hanya ganti komponen. |
| **State** | Data yang disimpan di komponen/context dan mengontrol tampilan. | useState([items]) → daftar item; berubah → UI re-render. |
| **Static file** | File dilayani langsung (gambar, CSS) tanpa melalui logika route. | express.static('uploads') → file di uploads/ bisa diakses via URL. |
| **Token** | String yang dipakai sebagai “bukti” sudah login. | JWT disimpan di localStorage, dikirim di header Authorization. |
| **Validation status** | Status persetujuan laporan: pending, approved, rejected. | Hanya approved yang tampil di dashboard public. |
| **Vite** | Build tool untuk frontend (dev server cepat, build production). | npm run dev di frontend = Vite; npm run build = bundle untuk production. |

---

**Lanjutan:**  
- Detail **setiap file backend** (fungsi, import, kode per blok, alur, istilah): **DEEP_DIVE_BACKEND.md**  
- Detail **setiap file frontend** (fungsi, import, kode per blok, alur, istilah): **DEEP_DIVE_FRONTEND.md**
