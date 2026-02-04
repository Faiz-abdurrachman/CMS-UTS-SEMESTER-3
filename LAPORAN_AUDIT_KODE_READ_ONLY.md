# LAPORAN AUDIT KODE — READ-ONLY

**Project:** CMS Lost & Found (Semester 3)  
**Mode:** Strict Read-Only — Tidak ada perubahan kode, hanya analisis dan penandaan.  
**Bahasa:** Indonesia, untuk pemula total.

---

## BAGIAN 1: STRUKTUR PROYEK

### 1.1 Pohon Folder & File (dari root sampai terdalam)

Hanya file sumber yang relevan (tanpa `node_modules` dan `.git`):

```
CMS-UTS-SEMESTER-3/
├── .env.production.example    # Template env untuk production
├── .gitignore                  # Daftar file yang tidak di-commit
├── package.json                # Script & dependensi root
├── package-lock.json
├── vercel.json                 # Konfigurasi deploy Vercel
├── README.md                   # Panduan install & penggunaan
├── PANDUAN_STRUKTUR_PROJECT.md
├── PANDUAN_BEDAH_KODE.md
├── AUDIT_DAN_REFACTORING_PLAN.md
│
├── api/
│   └── index.js                # Entry point backend untuk Vercel
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js               # Entry point server Express (local)
│   ├── .env.example             # Template env backend
│   ├── config/
│   │   └── db.js                # Koneksi database MySQL
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   └── itemController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Item.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── itemRoutes.js
│   ├── database/
│   │   ├── schema.sql
│   │   └── create-admin.sql
│   └── scripts/
│       └── createAdmin.js
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .gitignore
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        ├── index.css
        ├── components/
        │   ├── CardItem.jsx
        │   ├── Footer.jsx
        │   ├── Navbar.jsx
        │   └── SidebarAdmin.jsx
        ├── contexts/
        │   └── AuthContext.jsx
        ├── hooks/
        │   └── useAuth.js
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── ReportLost.jsx
            ├── ReportFound.jsx
            ├── MyReports.jsx
            └── AdminDashboard.jsx
```

---

### 1.2 Penjelasan Setiap Folder

| Folder | Fungsinya | Dipakai oleh | Kenapa harus ada | Jika dihapus |
|--------|-----------|---------------|-------------------|---------------|
| **Root (`CMS-UTS-SEMESTER-3/`)** | Rumah utama project; berisi konfigurasi global, README, dan referensi deploy. | Developer, Git, Vercel (baca `vercel.json`). | Semua path dan perintah (`npm run dev`, dll.) mengacu ke sini. | Project tidak punya “akar”; perintah dari root gagal. |
| **`api/`** | Tempat satu-satunya file yang dipanggil Vercel sebagai *serverless function* untuk backend. | Vercel (saat deploy). | Di Vercel, request ke `/api/*` diarahkan ke sini; file ini memuat `backend/server.js`. | Deploy backend di Vercel tidak jalan; hanya frontend statis. |
| **`backend/`** | Seluruh kode server: Express, koneksi DB, route, controller, model, middleware. | `api/index.js` (production), atau `npm run dev` / `node server.js` (local). | Semua logika API, auth, dan database ada di sini. | Tidak ada API; frontend tidak bisa login, ambil data, atau upload. |
| **`backend/config/`** | Konfigurasi (saat ini hanya koneksi database). | Semua model dan controller yang butuh akses DB. | Satu tempat untuk pengaturan DB; mudah ganti env tanpa ubah banyak file. | Koneksi DB tidak terpusat; error “cannot connect” di mana-mana. |
| **`backend/controllers/`** | Logika bisnis: apa yang dilakukan saat request datang (login, buat item, validasi, dll.). | Route memanggil fungsi controller. | Memisahkan “apa yang dilakukan” dari “URL mana yang dipanggil”. | Route tidak punya handler; request ke API error 404 atau crash. |
| **`backend/middleware/`** | Pemeriksaan sebelum request sampai controller: cek token, cek admin, handle upload file. | Route (dipakai di `routes/*.js`). | Auth dan upload tidak duplikat di tiap route. | Tanpa auth middleware, endpoint bisa diakses tanpa login; tanpa upload, file tidak tersimpan. |
| **`backend/models/`** | Cara berbicara dengan database: query SELECT/INSERT/UPDATE/DELETE untuk `users` dan `items`. | Controller memanggil model. | Satu lapis untuk akses data; controller tidak nulis SQL langsung. | Controller harus nulis SQL sendiri; kode berantakan dan rawan salah. |
| **`backend/routes/`** | Pemetaan URL ke controller (dan middleware). | `server.js` memuat route ini. | Menentukan “URL mana → controller mana”. | Server tidak tahu endpoint apa yang tersedia; semua 404. |
| **`backend/database/`** | Script SQL: buat tabel, contoh data, cara buat admin. | Dijalankan manual (phpMyAdmin/CLI) atau dibaca developer. | Database harus punya struktur yang sama dengan yang dipakai kode. | Tabel tidak ada atau beda; query error “column not found” / “table doesn’t exist”. |
| **`backend/scripts/`** | Script sekali jalan (misalnya buat akun admin). | Dijalankan manual: `npm run create-admin`. | Admin tidak bisa daftar lewat web; harus lewat script. | Tidak ada cara standar buat akun admin pertama. |
| **`frontend/`** | Seluruh aplikasi yang berjalan di browser: React, halaman, komponen, panggilan API. | User membuka situs; Vite menjalankan dev/build. | Ini yang user lihat dan gunakan. | Tidak ada tampilan; hanya backend “telanjang”. |
| **`frontend/src/`** | Kode sumber React: entry, routing, halaman, komponen, context, hook. | Vite (build & dev), browser. | Semua UI dan logika client ada di sini. | Aplikasi frontend kosong/tidak jalan. |
| **`frontend/src/components/`** | Komponen UI yang dipakai ulang (Navbar, Card, Footer, Sidebar admin). | Halaman dan layout di `pages/` dan `App.jsx`. | Menghindari copy-paste; satu ubah, semua pakai. | Banyak duplikasi kode; sulit maintenance. |
| **`frontend/src/contexts/`** | State global (siapa user yang login, token). | Komponen yang butuh info login (Navbar, ProtectedRoute, halaman). | Login state satu sumber; tidak perlu oper props ke mana-mana. | Harus oper user/token lewat banyak komponen; ribet dan rawan salah. |
| **`frontend/src/hooks/`** | Custom hook (misalnya `useAuth`) untuk pakai context/auth. | Komponen yang butuh `user`, `login`, `logout`. | Satu cara seragam akses auth. | Setiap komponen harus `useContext(AuthContext)` sendiri; tidak seragam. |
| **`frontend/src/pages/`** | Satu file = satu halaman/route (Home, Login, Dashboard, Admin, dll.). | `App.jsx` (React Router) menampilkan sesuai URL. | Satu halaman satu file; jelas dan teratur. | Routing tidak punya komponen; halaman kosong atau error. |

---

### 1.3 Penjelasan Setiap File (ringkas)

**Root**

| File | Peran | Kapan dieksekusi/dipanggil | File lain yang bergantung |
|------|------|----------------------------|---------------------------|
| `.env.production.example` | Contoh variabel env untuk production; tidak di-commit. | Dibaca manusia saat setup production. | Tidak ada (hanya referensi). |
| `.gitignore` | Daftar file/folder yang tidak ikut di Git. | Setiap `git add` / `git status`. | Semua yang pakai Git. |
| `package.json` (root) | Script `install:all`, `dev`, `dev:backend`, `dev:frontend`, `build:frontend`; dependensi seperti `concurrently`. | `npm run dev`, `npm run install:all`, dll. | Backend & frontend (lewat script). |
| `vercel.json` | Konfigurasi build & routing Vercel: frontend static + API ke `api/index.js`. | Saat deploy ke Vercel. | Vercel platform. |
| `README.md` | Panduan install, database, env, cara jalan. | Dibaca developer. | — |

**api/**

| File | Peran | Kapan dieksekusi/dipanggil | File lain yang bergantung |
|------|------|----------------------------|---------------------------|
| `api/index.js` | Entry point backend di Vercel; hanya `require("../backend/server")` dan export `app`. | Setiap request ke `/api/*` di Vercel. | `backend/server.js`. |

**backend/**

| File | Peran | Kapan dieksekusi/dipanggil | File lain yang bergantung |
|------|------|----------------------------|---------------------------|
| `server.js` | Inisialisasi Express, middleware (CORS, helmet, rate limit, json, static uploads), mount route, error handler, listen port. | Langsung (`node server.js`) atau lewat `api/index.js`. | Semua route, config tidak langsung (env). |
| `config/db.js` | Buat connection pool MySQL dari env; export pool. | Saat model atau controller pertama kali akses DB. | `User.js`, `Item.js`, `authMiddleware.js`, `adminController.getStatistics`. |
| `models/User.js` | Fungsi: findByEmail, findById, emailExists, create, findAll, delete. | Dipanggil controller auth & admin. | `authController`, `adminController`, `createAdmin.js`. |
| `models/Item.js` | Fungsi: findAll, findAllPublic, findById, findByUserId, create, update, updateValidationStatus, markAsResolved, delete, isOwner. | Dipanggil controller item & admin. | `itemController`, `adminController`. |
| `controllers/authController.js` | register, login (validasi, hash, JWT). | Route POST `/api/auth/register`, `/api/auth/login`. | `authRoutes.js`. |
| `controllers/itemController.js` | createItem, getAll, getById, getMyReports, updateItem, deleteItem. | Route di `/api/items/*`. | `itemRoutes.js`. |
| `controllers/adminController.js` | getAllUsers, deleteUser, getAllItems, updateValidationStatus, markAsResolved, updateItem, createItem, deleteItem, getStatistics. | Route di `/api/admin/*`. | `adminRoutes.js`. |
| `middleware/authMiddleware.js` | Cek header Authorization, verify JWT, isi `req.user`. | Route yang pakai `authenticate`. | `itemRoutes`, `adminRoutes`. |
| `middleware/adminMiddleware.js` | Cek `req.user.role === 'admin'`. | Route admin setelah `authenticate`. | `adminRoutes`. |
| `middleware/upload.js` | Konfigurasi Multer: simpan file ke `UPLOAD_DIR`, limit 5MB, nama unik. | Route yang pakai `upload.single('image')`. | `itemRoutes`, `adminRoutes`. |
| `routes/authRoutes.js` | POST `/register`, POST `/login`. | Mount di server sebagai `/api/auth`. | `server.js`. |
| `routes/itemRoutes.js` | GET/POST/PUT/DELETE `/api/items/*` dengan kombinasi authenticate & upload. | Mount di server sebagai `/api/items`. | `server.js`. |
| `routes/adminRoutes.js` | Semua route `/api/admin/*` (users, items, statistics, validate, resolve) dengan authenticate + isAdmin. | Mount di server sebagai `/api/admin`. | `server.js`. |
| `database/schema.sql` | CREATE DATABASE, DROP/CREATE tabel `users` & `items`, index. | Dijalankan manual sekali (phpMyAdmin/CLI). | Tidak ada (hanya referensi struktur). |
| `database/create-admin.sql` | Contoh INSERT admin (password harus sudah di-hash). | Opsional; bisa pakai script Node. | — |
| `scripts/createAdmin.js` | Tanya nama/email/password di CLI, hash, insert ke `users` dengan role admin. | `npm run create-admin` di folder backend. | `config/db.js`. |
| `backend/.env.example` | Template PORT, DB_*, JWT_SECRET, UPLOAD_DIR. | Dicopy jadi `.env` oleh developer. | — |

**frontend/**

| File | Peran | Kapan dieksekusi/dipanggil | File lain yang bergantung |
|------|------|----------------------------|---------------------------|
| `index.html` | Satu `<div id="root">` dan script `main.jsx`. | Dibuka browser; Vite menyajikan ini. | `main.jsx`. |
| `vite.config.js` | Konfigurasi Vite: plugin React, port 3000, proxy `/api` ke localhost:5000. | Saat `npm run dev` / `npm run build`. | Vite. |
| `tailwind.config.js` | Theme warna (primary, accent), font, daisyUI. | Saat build CSS Tailwind. | Tailwind. |
| `postcss.config.js` | Tailwind + autoprefixer. | Pipeline CSS (Vite). | — |
| `src/main.jsx` | Render `<App />` ke `#root`, bungkus StrictMode, pasang Toaster. | Entry React saat load halaman. | `App.jsx`, `index.css`. |
| `src/App.jsx` | Router, AuthProvider, ProtectedRoute, definisi Route untuk tiap halaman, Navbar/Footer (kecuali di `/admin`). | Setiap navigasi. | Semua pages, Navbar, Footer, AuthContext, useAuth. |
| `src/api.js` | Instance Axios: baseURL (env atau default), interceptor request (token), interceptor response (401 → logout). | Setiap panggilan API dari frontend. | AuthContext, semua page yang fetch/update data. |
| `src/index.css` | Import font, @tailwind, style dasar body/heading, scrollbar. | Di-import dari `main.jsx`. | — |
| `src/contexts/AuthContext.jsx` | State user/token/loading; fungsi login, register, logout; simpan ke localStorage. | Dibungkus di App; dipakai lewat useAuth. | useAuth, Login, Register, Navbar, ProtectedRoute. |
| `src/hooks/useAuth.js` | Mengambil context Auth dan memastikan dipakai di dalam AuthProvider. | Di komponen yang butuh auth. | Navbar, Login, Register, App (ProtectedRoute). |
| `src/pages/Home.jsx` | Landing: fetch items, filter lost/found/resolved, search, tampilkan CardItem. | Route `/`. | api, CardItem. |
| `src/pages/Login.jsx` | Form login; mode User/Admin; panggil AuthContext.login; redirect jika sudah login. | Route `/login`. | useAuth, api (lewat context). |
| `src/pages/Register.jsx` | Form daftar; panggil AuthContext.register (lalu auto login); redirect. | Route `/register`. | useAuth. |
| `src/pages/Dashboard.jsx` | Dashboard user: sidebar, fetch items, filter, search, link Report Lost/Found, My Reports. | Route `/dashboard` (protected). | api, CardItem. |
| `src/pages/ReportLost.jsx` | Form lapor barang hilang; FormData + status "lost"; POST `/items/lost`. | Route `/report-lost` (protected). | api. |
| `src/pages/ReportFound.jsx` | Form lapor barang ditemukan; FormData + status "found"; POST `/items/found`. | Route `/report-found` (protected). | api. |
| `src/pages/MyReports.jsx` | Fetch `/items/my-reports`, tampilkan lost/found milik user. | Route `/my-reports` (protected). | api, CardItem. |
| `src/pages/AdminDashboard.jsx` | Tab items & users; fetch admin/items, admin/users, admin/statistics; approve/reject, resolve, edit, delete; modal. | Route `/admin` (protected admin). | api, SidebarAdmin, CardItem. |
| `src/components/Navbar.jsx` | Logo, link Home/Login/Register atau Dashboard/My Reports/Admin; tampil user & logout. | Di App untuk semua route kecuali `/admin`. | useAuth. |
| `src/components/Footer.jsx` | Footer teks & copyright. | Di App (kecuali `/admin`). | — |
| `src/components/CardItem.jsx` | Tampil satu item: gambar (URL upload), badge status/validation, nama, deskripsi, lokasi, tanggal, reporter; opsional tombol delete. | Home, Dashboard, MyReports, AdminDashboard. | — (hanya terima props). |
| `src/components/SidebarAdmin.jsx` | Sidebar admin: Manage Reports / Manage Users; info user dari localStorage. | Hanya di AdminDashboard. | — |

---

## BAGIAN 2: ANALISIS KODE PER FILE

### 2.1 Backend

#### **backend/server.js**
- **Bahasa & teknologi:** Node.js, Express 5, dotenv, helmet, express-rate-limit, cors.
- **Alur (atas ke bawah):**  
  - Load env → import route.  
  - `express()` buat app.  
  - Pasang helmet (keamanan header).  
  - Rate limit: 100 request per 15 menit per IP.  
  - CORS: origin dari `FRONTEND_URL` atau localhost:3000, credentials true.  
  - `express.json()` dan `urlencoded` agar body request bisa dibaca.  
  - Static `/uploads` dari folder `UPLOAD_DIR` atau `uploads`.  
  - Route: GET `/`, `/api/auth`, `/api/items`, `/api/admin`.  
  - Error middleware: tangkap error, log, kirim JSON (detail error hanya di development).  
  - Listen port dari env (default 5000) hanya jika file di-run langsung (`require.main === module`); kalau di-require (misalnya dari `api/index.js`) tidak listen, hanya export `app`.
- **Syntax sederhana:**  
  - `require("modul")` = pakai kode dari modul lain.  
  - `app.use(fn)` = setiap request lewat fungsi itu dulu.  
  - `app.use("/path", router)` = request yang awalnya `/path/...` diserahkan ke `router`.  
  - `process.env.VARIABLE` = baca variabel lingkungan (dari `.env` atau sistem).
- **Hubungan:** Dipanggil langsung (local) atau dari `api/index.js` (Vercel). Route memakai controller; controller memakai model; model memakai `config/db.js`.

---

#### **backend/config/db.js**
- **Bahasa:** Node.js, `mysql2/promise`, dotenv.
- **Alur:** Load dotenv → `createPool` dengan host, user, password, database dari env; opsi SSL jika `DB_SSL=true`; waitForConnections, connectionLimit 10, timeout 10 detik → export pool.
- **Fungsi:** Satu pool koneksi dipakai bersama; query pakai `pool.query()`.
- **Hubungan:** Di-require oleh `User.js`, `Item.js`, `authMiddleware.js`, dan `adminController.getStatistics`.

---

#### **backend/models/User.js**
- **Bahasa:** Node.js, SQL lewat `pool.query`.
- **Fungsi utama:**  
  - `findByEmail(email)` → SELECT satu user by email.  
  - `findById(id)` → SELECT id, name, email, role, created_at.  
  - `emailExists(email)` → cek ada tidak.  
  - `create(name, email, hashedPassword, role)` → INSERT, return insertId.  
  - `findAll()` → semua user (tanpa password) untuk admin.  
  - `delete(id)` → DELETE user.
- **Parameter query:** Pakai placeholder `?` dan array nilai → mengurangi risiko SQL injection.
- **Hubungan:** Dipanggil authController (register, login), adminController (users), createAdmin.js.

---

#### **backend/models/Item.js**
- **Bahasa:** Node.js, SQL lewat pool.
- **Fungsi utama:**  
  - `findAll()` → items + reporter (JOIN users), untuk admin.  
  - `findAllPublic()` → hanya `validation_status = 'approved'`, dan (resolved_at IS NULL atau < 24 jam); fallback jika kolom `resolved_at` belum ada.  
  - `findById`, `findByUserId` → satu item atau list by user.  
  - `create(...)` → INSERT dengan validation_status 'pending'.  
  - `update(...)` → dynamic UPDATE dari field yang dikirim.  
  - `updateValidationStatus`, `markAsResolved` (dengan fallback ALTER TABLE jika kolom belum ada), `delete`, `isOwner`.
- **Keterangan:** Ada try/catch yang mengubah query jika error karena `resolved_at`/`resolved_note` belum ada; dan di `markAsResolved` ada ALTER TABLE otomatis.
- **Hubungan:** Dipanggil itemController dan adminController.

---

#### **backend/controllers/authController.js**
- **Bahasa:** Node.js, bcrypt, jsonwebtoken.
- **Register:** Ambil name, email, password (tolak jika ada role selain "user") → validasi wajib → cek emailExists → hash password (bcrypt 10) → User.create dengan role "user" → response 201.
- **Login:** Ambil email, password → User.findByEmail → bcrypt.compare → jika cocok, jwt.sign (payload id & role, expiresIn 7d) → kirim token + user (tanpa password).
- **Hubungan:** authRoutes memanggil export register/login; memakai model User.

---

#### **backend/controllers/itemController.js**
- **Bahasa:** Node.js, model Item.
- **createItem:** req.user.id dari middleware, body + req.file → Item.create.  
- **getAll:** Item.findAllPublic() → kirim ke client.  
- **getById:** Item.findById(params.id); 404 jika tidak ada.  
- **getMyReports:** Item.findByUserId(req.user.id).  
- **updateItem:** Cek item ada, cek req.user.id === item.user_id (pemilik), lalu Item.update.  
- **deleteItem:** Hanya jika req.user.role === 'admin'; user biasa tidak bisa hapus (403).
- **Hubungan:** itemRoutes memanggil; pakai Item.

---

#### **backend/controllers/adminController.js**
- **Bahasa:** Node.js, User, Item, pool (di getStatistics).
- **Fungsi:** getAllUsers, deleteUser (tidak boleh hapus diri sendiri), getAllItems, updateValidationStatus, markAsResolved, updateItem, createItem (bisa pakai user_id dari body atau req.user.id), deleteItem, getStatistics (query COUNT manual).
- **Hubungan:** adminRoutes memanggil; pakai User, Item, dan pool.

---

#### **backend/middleware/authMiddleware.js**
- **Alur:** Ambil header Authorization → split "Bearer " → ambil token → jwt.verify dengan JWT_SECRET → query user by payload.id → jika ada, set req.user → next(); jika tidak ada token/valid, response 401.
- **Penting:** Semua route yang pakai `authenticate` butuh token valid; req.user dipakai controller.

---

#### **backend/middleware/adminMiddleware.js**
- **Alur:** Cek req.user ada; cek req.user.role === 'admin' → next(); else 403.
- **Harus dipasang setelah authenticate.**

---

#### **backend/middleware/upload.js**
- **Alur:** Baca UPLOAD_DIR dari env; buat folder jika belum ada; multer diskStorage ke folder itu, filename = timestamp + random + ext; limit 5MB; export multer instance.
- **Tidak ada filter tipe file** (hanya limit ukuran); penyimpanan lokal.

---

#### **backend/routes/*.js**
- **authRoutes:** POST register, POST login → controller.  
- **itemRoutes:** GET / (getAll), GET /my-reports (authenticate), GET /:id, PUT /:id (authenticate + upload), POST /lost dan /found (authenticate + upload), DELETE /:id (authenticate).  
- **adminRoutes:** Semua dengan authenticate + isAdmin; beberapa dengan upload.single('image').

---

#### **api/index.js**
- Hanya: `const app = require("../backend/server"); module.exports = app;`
- Di Vercel, request ke path yang di-route ke API akan memanggil file ini; Express `app` menangani request.

---

#### **backend/database/schema.sql**
- CREATE DATABASE, USE, DROP TABLE items/users, CREATE TABLE users (id, name, email, password, role, created_at, updated_at), CREATE TABLE items (id, user_id, name, description, location, date_occured, image, status, validation_status, resolved_at, resolved_note, created_at, updated_at, FK user_id), lalu CREATE INDEX.
- **Tidak dieksekusi otomatis** oleh aplikasi; harus dijalankan manual.

---

#### **backend/scripts/createAdmin.js**
- readline untuk tanya name, email, password → validasi → cek email sudah ada → bcrypt.hash → INSERT ke users dengan role 'admin' → selesai.
- Butuh .env dan database sudah ada (schema sudah dijalankan).

---

### 2.2 Frontend

#### **frontend/src/main.jsx**
- React 18: createRoot, render App + StrictMode + Toaster. Entry point React.

#### **frontend/src/App.jsx**
- Router (BrowserRouter), Routes, Route; AuthProvider membungkus semua.
- ProtectedRoute: pakai useAuth; jika loading tampil "Loading..."; jika !user → Navigate ke /login; jika requireAdmin dan user.role !== 'admin' → Navigate ke /dashboard; else render children.
- Route: /, /login, /register (public); /dashboard, /report-lost, /report-found, /my-reports (protected); /admin (protected + admin).
- Navbar dan Footer tidak ditampilkan di pathname === '/admin'.

#### **frontend/src/api.js**
- Axios create dengan baseURL: VITE_API_URL atau (PROD ? "/api" : "http://localhost:5000/api").
- Request: ambil token dari localStorage, set header Authorization Bearer.
- Response: jika 401, hapus token & user, redirect window.location.href = "/login".

#### **frontend/src/contexts/AuthContext.jsx**
- useState: user, token (initial dari localStorage), loading.
- useEffect awal: baca localStorage user & token, set state, setLoading false.
- login(email, password): api.post /auth/login → simpan token & user ke localStorage dan state → return { success, message }.
- register(name, email, password): api.post /auth/register → lalu login(email, password) → return success/message.
- logout: hapus localStorage, set null, redirect /login.
- Provider value: user, token, loading, login, register, logout, isAuthenticated.

#### **frontend/src/hooks/useAuth.js**
- useContext(AuthContext); jika !context throw error "useAuth must be used within AuthProvider"; return context.

#### **frontend/src/pages/Home.jsx**
- useEffect fetch api.get("/items") → setItems; filter lost/found/resolved di frontend; search filter by name/description/location; tampil CardItem per kategori.

#### **frontend/src/pages/Login.jsx**
- useAuth (login, user); useEffect jika user ada redirect /admin atau /dashboard; form email/password; mode User vs Admin (hanya UI); submit → login() → toast & redirect lewat useEffect.

#### **frontend/src/pages/Register.jsx**
- useAuth register; form name, email, password; submit → register() → toast, navigate("/dashboard").

#### **frontend/src/pages/Dashboard.jsx**
- User state dari localStorage; fetch api.get("/items"); filter lost/found/resolved; sidebar + search; link Report Lost/Found, My Reports; tampil CardItem (showDelete=false).

#### **frontend/src/pages/ReportLost.jsx & ReportFound.jsx**
- Form name, description, location, date_occured, file; validasi ukuran file 5MB; FormData append status "lost" atau "found"; api.post /items/lost atau /items/found dengan Content-Type multipart/form-data; success → toast, navigate dashboard.

#### **frontend/src/pages/MyReports.jsx**
- Fetch api.get("/items/my-reports"); filter lost/found; tampil CardItem (showDelete=false).

#### **frontend/src/pages/AdminDashboard.jsx**
- useEffect: cek localStorage user, jika bukan admin redirect; fetch admin/items, admin/users, admin/statistics. Tab items/users; filter status; approve/reject, mark resolved, edit (modal + FormData), delete item/user. URL gambar edit: PROD ? "/api" : "http://localhost:5000" + "/uploads/" + item.image.

#### **frontend/src/components/CardItem.jsx**
- Props: item, onDelete, showDelete. Tampil gambar: base URL (PROD ? "/api" : "http://localhost:5000") + "/uploads/" + item.image. Badge status (Resolved/Lost/Found) dan validation_status; nama, deskripsi (truncate), lokasi, tanggal, reporter.

#### **frontend/src/components/Navbar.jsx**
- useAuth (user, logout); link beda untuk guest vs user vs admin; handleLogout panggil logout() dan navigate("/login").

#### **frontend/src/components/SidebarAdmin.jsx**
- State isOpen (mobile), user dari localStorage; tombol Manage Reports / Manage Users set activeTab; tampil info user.

---

## BAGIAN 3: ALUR APLIKASI (FLOW)

### 3.1 User Buka Frontend
1. User buka URL (misalnya http://localhost:3000).
2. Browser minta halaman ke Vite (dev) atau ke file static (production).
3. index.html diload, lalu main.jsx; React render App.
4. App punya AuthProvider dan Router; AuthContext baca localStorage (token, user); jika ada, state user terisi.
5. Sesuai URL: tampil Home, Login, Register, atau (jika login) Dashboard/Report/My Reports/Admin.

### 3.2 Request ke Backend
1. Misalnya user isi form Login dan klik Sign In.
2. Login.jsx memanggil login(email, password) dari AuthContext.
3. AuthContext memanggil api.post("/auth/login", { email, password }).
4. api.js: baseURL + "/auth/login" → di dev dengan proxy Vite = http://localhost:5000/api/auth/login; request interceptor belum perlu token (login tidak pakai token).
5. Request HTTP POST dengan body JSON sampai ke backend.

### 3.3 Proses di Server
1. server.js menerima request; CORS, json(), urlencoded sudah diproses.
2. Route /api/auth → authRoutes; path /login → authController.login.
3. authController: baca email & password → User.findByEmail → bcrypt.compare → jwt.sign → kirim response JSON { token, user }.

### 3.4 Akses Database
1. User.findByEmail memanggil pool.query("SELECT * FROM users WHERE email = ?", [email]).
2. db.js sudah createPool dengan env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME); pool.query mengirim query ke MySQL.
3. MySQL mengembalikan baris; model mengembalikan baris pertama ke controller.

### 3.5 Response Kembali ke Frontend
1. Backend res.json({ token, user }); status 200.
2. Axios di frontend terima response; AuthContext simpan token & user ke localStorage dan setState.
3. useEffect di Login.jsx melihat user sudah ada → navigate("/dashboard") atau "/admin".
4. Halaman baru fetch data (misalnya GET /items); request interceptor menambah header Authorization Bearer token; backend authMiddleware verify token, set req.user; controller mengembalikan data; frontend menampilkan.

---

## BAGIAN 4: KAITAN DENGAN SETUP & ENV

### 4.1 Peran .env
- **Backend:** File `.env` (dibuat dari `.env.example`) dibaca oleh `dotenv` di server.js dan db.js (dan middleware/script yang require config). Isi: PORT, NODE_ENV, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, UPLOAD_DIR, FRONTEND_URL (opsional).
- **Tanpa .env:** Server bisa jalan dengan default (PORT 5000, DB localhost/root/kosong/lostfound_db), tapi JWT_SECRET default di example berbahaya di production; dan kalau DB beda (password, host) akan error koneksi.

### 4.2 Variabel yang Wajib
- **DB_HOST, DB_USER, DB_PASSWORD, DB_NAME:** Tanpa ini, koneksi DB gagal (atau pakai default yang mungkin salah).
- **JWT_SECRET:** Dipakai jwt.sign dan jwt.verify. Jika kosong atau lemah, token bisa ditebak atau dipalsu; login “aman” jadi tidak aman.
- **PORT:** Hanya untuk run lokal; di Vercel tidak dipakai (serverless).
- **UPLOAD_DIR:** Di production Vercel biasanya `/tmp`; file tidak persistent. Tanpa set, default "uploads" bisa tidak cocok dengan environment.
- **FRONTEND_URL:** Untuk CORS; jika salah, frontend di domain lain diblok browser.
- **Frontend:** `VITE_API_URL` (opsional): di production bisa dipakai agar request API ke domain yang benar (misalnya backend di subdomain/domain lain). Kalau tidak ada, dipakai "/api" (PROD) atau localhost:5000 (dev).

### 4.3 Hubungan Setup dengan Kode
- **Local:** Backend jalan `node server.js` atau `nodemon server.js`; frontend Vite proxy `/api` ke localhost:5000; .env di backend; database MySQL lokal (XAMPP/dll); uploads di folder lokal.
- **Vercel:** Build frontend = static; request ke `/api/*` diarahkan ke `api/index.js` yang memuat backend/server. Backend jalan di serverless; env diset di dashboard Vercel. Database harus bisa diakses dari internet (PlanetScale, Aiven, dll.). Upload ke filesystem serverless tidak persistent (biasanya /tmp); file hilang setelah request selesai.
- **Salah setup:** Contoh: lupa jalankan schema.sql → tabel tidak ada → error "Table 'users' doesn't exist". Atau .env tidak ada → JWT_SECRET undefined → jwt.sign/verify bisa error. Atau FRONTEND_URL salah → CORS error di browser.

---

## BAGIAN 5: AUDIT (TANPA SOLUSI)

Berikut hanya penandaan risiko; tidak ada saran perbaikan kode.

### 5.1 Potensi Bug / Perilaku Tidak Diinginkan
- **Item.js findAllPublic & markAsResolved:** Fallback jika kolom `resolved_at`/`resolved_note` belum ada: query diubah atau ALTER TABLE dijalankan di dalam aplikasi. Di environment yang tidak punya hak ALTER TABLE bisa error; di multi-instance bisa race condition saat ALTER.
- **adminController.markAsResolved:** Pesan error yang dicek berisi "resolved_at belum ada" mungkin tidak persis sama dengan pesan yang di-throw dari model (model throw "Gagal menandai item..."), sehingga response 500 dengan pesan khusus SQL mungkin tidak pernah muncul.
- **AuthContext register:** Setelah register sukses, auto login dipanggil; jika login gagal (misalnya timeout), return { success: true, message: "Registration successful. Please login." } tetap dikirim; user bisa bingung karena sudah “sukses” tapi belum login.
- **Login.jsx redirect:** Redirect ke /admin atau /dashboard bergantung pada state `user` yang di-update setelah login(); kadang state belum ter-update saat redirect, sehingga bisa sesaat salah halaman (biasanya useEffect kedua kali memperbaiki).
- **Dashboard.jsx & MyReports.jsx & SidebarAdmin:** User diambil dari localStorage, bukan dari AuthContext; jika user diubah di tab lain (logout) atau token diubah, komponen ini tidak otomatis update sampai refresh/navigasi.
- **AdminDashboard.jsx:** Proteksi admin dengan useEffect baca localStorage dan navigate; jika seseorang ubah localStorage (role: admin) tanpa token valid, backend tetap menolak, tapi UI bisa sebentar tampil admin sampai request API gagal.
- **itemController.deleteItem:** Hanya admin yang bisa hapus; pemilik item tidak bisa hapus laporan sendiri dari UI/API biasa (by design), tapi pesan "Hanya admin yang bisa menghapus laporan" bisa membingungkan user yang mengira bisa hapus laporan sendiri.

### 5.2 Potensi Error Runtime
- **JWT_SECRET kosong/undefined:** jwt.sign dan jwt.verify bisa error atau perilaku tidak aman; server bisa return 500 saat login atau saat akses route terproteksi.
- **Database belum jalan / schema belum dijalankan:** Pool.query akan error (ECONNREFUSED atau "Table doesn't exist"); semua endpoint yang sentuh DB bisa 500.
- **Upload di Vercel:** Penyimpanan ke `/tmp`; setelah response selesai file bisa hilang. URL gambar yang disimpan di DB bisa 404 di request berikutnya.
- **api/index.js path:** Memakai `require("../backend/server")`; jika struktur folder berubah (misalnya backend pindah), path ini break.
- **CardItem & AdminDashboard URL gambar:** Hardcode "http://localhost:5000" di development; jika backend jalan di port lain atau di host lain, gambar tidak muncul.
- **Rate limit:** 100 request/15 menit per IP; di belakang proxy/NAT banyak user bisa berbagi IP dan kena limit bersama.
- **Multer:** Tidak ada validasi tipe file (hanya size); file bukan gambar bisa di-upload dan disimpan; jika nanti ditampilkan sebagai image bisa error atau risiko keamanan.

### 5.3 Potensi Security
- **JWT_SECRET:** Di .env.example ada nilai default; jika .env tidak diganti di production, secret bisa ditebak; token bisa dipalsu.
- **CORS:** Hanya origin FRONTEND_URL atau localhost:3000; jika FRONTEND_URL salah atau terlalu longgar (misalnya "*"), bisa bikin situs lain bisa panggil API dengan credential.
- **Register role:** Backend menolak role selain "user" di body; itu bagus; pastikan tidak ada endpoint lain yang bisa set role user.
- **Password:** Di-hash dengan bcrypt (10 rounds); aman asal JWT dan HTTPS dipakai di production.
- **SQL:** Query pakai parameter (?); model tidak konkatenasi string ke SQL; risiko SQL injection rendah.
- **Token di localStorage:** Rentan XSS; jika ada script jahat di halaman, bisa baca token. Tidak dibahas mitigasi (hanya penandaan).
- **Upload:** Tanpa validasi MIME/extension; nama file unik (timestamp+random) mengurangi overwrite tapi tidak mencegah upload file berbahaya; penyimpanan lokal bisa dipakai untuk isi disk atau path traversal jika ada bug di tempat lain.
- **Error message:** Di development, err object dikirim ke client; bisa bocor info stack trace atau path.
- **Admin panel:** Hanya dicek role di backend (isAdmin); frontend hanya redirect; jika ada bug di routing atau seseorang akses langsung URL admin tanpa token valid, backend tetap menolak.

---

## BAGIAN 6: KESIMPULAN

### 6.1 Kekuatan Arsitektur
- Pemisahan jelas: backend (Express, route → controller → model), frontend (React, halaman → komponen, context auth).
- Satu backend dipakai lokal dan (lewat api/index.js) di Vercel; tidak duplikasi logika.
- Auth dengan JWT dan middleware; role admin dipisah; registrasi tidak bisa pilih role admin.
- Password tidak disimpan plain; query pakai parameter.
- Ada rate limit dan helmet; ada validasi input dasar di controller (register/login, validation_status).
- Frontend punya protected route dan pembedaan user vs admin; UI konsisten (Tailwind, satu theme).

### 6.2 Kelemahan Desain
- Database schema dan migrasi (resolved_at, resolved_note) tidak seragam: ada fallback dan ALTER di kode; lebih aman jika migrasi dijalankan eksplisit.
- Upload file di production serverless tidak persistent; butuh penyimpanan eksternal (S3, Cloudinary) agar gambar tetap ada.
- Beberapa state user di frontend mengandalkan localStorage tanpa sinkron dengan AuthContext; bisa stale.
- Validasi file upload hanya ukuran; tipe file tidak dicek.
- Pesan error dan penanganan error (termasuk JWT_SECRET kosong) bisa diperjelas dan diseragamkan.

### 6.3 Kesiapan (DEV / PROD)
- **Development:** Cukup siap: dengan .env, MySQL jalan, schema dijalankan, npm run dev, flow login/register/item/admin jalan. Perhatian: JWT_SECRET jangan kosong; path upload dan URL gambar sesuai env.
- **Production:** Belum sepenuhnya siap tanpa penyesuaian: (1) Database harus bisa diakses dari internet dan aman. (2) Upload harus pindah ke storage persisten. (3) JWT_SECRET harus kuat dan unik. (4) CORS dan FRONTEND_URL harus sesuai domain production. (5) HTTPS wajib. (6) Error jangan expose detail ke client.

Laporan ini hanya menganalisis dan menandai; tidak ada perubahan kode atau saran perbaikan teknis. Untuk langkah perbaikan atau implementasi, tunggu perintah Anda.
