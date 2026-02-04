# 📄 Deep Dive Backend — Setiap File

Dokumen ini menjelaskan **setiap file di folder backend** dari sudut pandang pemula: fungsi file, import, kode penting per blok, alur eksekusi, dan istilah yang dipakai.  
Backend = aplikasi server (Node.js + Express) yang melayani API dan menyimpan data ke MySQL.

---

## server.js

### 1. Fungsi File Ini

- **Ngapain:** File utama backend. Membuat aplikasi Express, memasang middleware (keamanan, CORS, parsing body, static uploads), mendaftarkan semua route API (auth, items, admin), menangani error, dan menjalankan server di port tertentu (atau hanya export app untuk Vercel).
- **Dipanggil oleh:** Langsung dijalankan dengan `node server.js` atau `nodemon server.js`; juga di-require oleh `api/index.js` untuk deploy Vercel.
- **Penting:** Sangat penting. Tanpa file ini tidak ada server API.

### 2. Import / Dependency

| Import | Dari mana | Kenapa |
|--------|-----------|--------|
| `express` | package `express` | Framework untuk membuat server HTTP dan route. |
| `cors` | package `cors` | Middleware agar frontend (origin lain/port lain) boleh akses API. |
| `path` | modul bawaan Node.js | Untuk menggabungkan path folder (misal __dirname + 'uploads'). |
| `helmet` | package `helmet` | Mengamankan header HTTP. |
| `express-rate-limit` | package `express-rate-limit` | Membatasi jumlah request per IP (anti spam/brute). |
| `require("dotenv").config()` | package `dotenv` | Membaca file `.env` dan mengisi `process.env.*`. |
| `authRoutes`, `itemRoutes`, `adminRoutes` | folder `./routes/` | Router yang menangani URL /api/auth, /api/items, /api/admin. |

### 3. Penjelasan Kode (per blok)

- **`const app = express();`**  
  Membuat instance aplikasi Express. Semua middleware dan route dipasang ke `app`.

- **`app.use(helmet());`**  
  Memasang Helmet: mengatur header HTTP (X-Content-Type-Options, dll) untuk keamanan.

- **`rateLimit({ windowMs: 15*60*1000, max: 100, ... })`**  
  Limit: per IP maksimal 100 request dalam 15 menit. Kalau lewat, response “Too many requests…”.

- **`app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));`**  
  CORS: izinkan request dari URL frontend; `credentials: true` = cookie/header Authorization boleh dikirim.

- **`app.use(express.json());`**  
  Parsing body request yang berisi JSON menjadi `req.body` (object).

- **`app.use(express.urlencoded({ extended: true }));`**  
  Parsing body form biasa (application/x-www-form-urlencoded) ke `req.body`.

- **Blok `/uploads`:**  
  Pertama middleware yang set header `Cross-Origin-Resource-Policy: cross-origin` agar gambar bisa dimuat dari frontend (port/domain lain). Lalu `express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads"))` melayani file di folder uploads sebagai file statis.

- **`app.get("/", ...)`**  
  Route GET ke `/`: jawab “Lost & Found API running” (untuk cek server hidup).

- **`app.use("/api/auth", authRoutes);`**  
  Semua request yang path-nya dimulai `/api/auth` (misal POST /api/auth/login) diarahkan ke `authRoutes`.

- **`app.use("/api/items", itemRoutes);`** dan **`app.use("/api/admin", adminRoutes);`**  
  Sama: request ke /api/items dan /api/admin di-handle oleh router masing-masing.

- **Error handling middleware `(err, req, res, next)`**  
  Dipanggil ketika ada error yang di-pass ke `next(err)`. Mengirim response JSON dengan status (err.status atau 500) dan message; di development bisa kirim detail error.

- **`const PORT = process.env.PORT || 5000;`**  
  Port dari env atau default 5000.

- **`if (require.main === module)`**  
  Cek apakah file ini dijalankan langsung (bukan di-require). Kalau langsung → `app.listen(PORT, ...)`; kalau di-require (misal oleh Vercel) → tidak listen, hanya export `app`.

### 4. Alur Eksekusi

1. Load env (dotenv), require routes.
2. Buat `app`, pasang semua middleware (helmet, rate limit, CORS, json, urlencoded, static uploads).
3. Pasang route: `/`, `/api/auth`, `/api/items`, `/api/admin`.
4. Pasang error handler.
5. Jika dijalankan langsung: listen di PORT, log “Server berjalan…”. Jika di-require: tidak listen; pemanggil (Vercel) yang memakai `app`.

### 5. Istilah

- **Middleware:** Fungsi yang menerima `(req, res, next)`. Bisa mengubah req/res atau memanggil `next()` ke handler berikutnya.
- **Static file:** File dilayani langsung dari path (tanpa melalui controller). `express.static` = serve file dari folder tertentu.
- **CORS:** Kebijakan browser yang membatasi request dari domain/port lain; header dari server mengizinkan atau menolak.

---

## config/db.js

### 1. Fungsi File Ini

- Menyediakan **connection pool** MySQL (pakai `mysql2/promise`) untuk dipakai di seluruh backend. Satu modul, satu pool; semua model/controller yang butuh DB require file ini.
- Dipanggil oleh: `User.js`, `Item.js`, `authMiddleware.js`, `adminController.js`, `createAdmin.js`.
- Penting: Tanpa koneksi DB, login/register/items tidak bisa jalan.

### 2. Import / Dependency

| Import | Dari mana | Kenapa |
|--------|-----------|--------|
| `mysql` dari `mysql2/promise` | package `mysql2` | API Promise untuk MySQL (bisa await). |
| `require("dotenv").config()` | package `dotenv` | Supaya process.env terisi sebelum createPool. |

### 3. Penjelasan Kode

- **`mysql.createPool({ ... })`**  
  Membuat pool koneksi. Opsi: host, user, password, database dari `process.env` (dengan default), waitForConnections, connectionLimit (10), ssl jika DB_SSL=true, timeout.  
  Pool = kumpulan koneksi; request pakai koneksi dari pool lalu dikembalikan, tidak buka-tutup koneksi tiap request.

- **`module.exports = pool;`**  
  Mengekspor pool. File lain yang require ini dapat object pool; query pakai `pool.query(...)`.

### 4. Alur Eksekusi

Saat file pertama kali di-require: dotenv load .env, createPool dipanggil sekali, pool diekspor. Eksekusi query terjadi nanti saat model/controller memanggil `pool.query()`.

### 5. Istilah

- **Pool:** Kumpulan koneksi database yang dipakai bergantian; efisien untuk banyak request.
- **Promise:** Hasil operasi async; dipakai dengan .then() atau await. mysql2/promise mengembalikan Promise dari query.

---

## database/schema.sql

### 1. Fungsi File Ini

- Script SQL untuk membuat database `lostfound_db` dan tabel `users` serta `items` (termasuk kolom resolved_at, resolved_note). Juga membuat index untuk performa.
- Dipanggil oleh: Dijalankan manual (phpMyAdmin, mysql CLI) atau oleh Docker saat container MySQL pertama kali init (via docker-entrypoint-initdb.d).
- Penting: Tanpa schema, backend tidak punya tabel; semua query akan error.

### 2. Import / Dependency

Tidak ada import; file SQL murni.

### 3. Penjelasan Kode (per blok)

- **CREATE DATABASE IF NOT EXISTS lostfound_db;**  
  Buat database kalau belum ada.

- **USE lostfound_db;**  
  Semua perintah berikut berlaku untuk database ini.

- **DROP TABLE IF EXISTS items; DROP TABLE IF EXISTS users;**  
  Hapus tabel lama (hati-hati: ini menghapus data). Urutan penting karena items punya foreign key ke users.

- **CREATE TABLE users (...)**  
  Tabel users: id (auto increment primary key), name, email (unique), password (untuk hash), role (default 'user'), created_at, updated_at. ENGINE InnoDB, charset utf8mb4.

- **CREATE TABLE items (...)**  
  Tabel items: id, user_id (FK ke users, ON DELETE CASCADE), name, description, location, date_occured, image, status (lost/found), validation_status (pending/approved/rejected), resolved_at, resolved_note, created_at, updated_at.

- **CREATE INDEX ...**  
  Index pada email (users), status, validation_status, created_at, user_id, resolved_at (items) untuk mempercepat filter dan sort.

### 4. Alur Eksekusi

Dijalankan sekali (manual atau init DB). MySQL menjalankan perintah secara berurutan: buat DB, use, drop tabel (jika ada), buat tabel, buat index.

### 5. Istilah

- **Foreign key:** Kolom yang merujuk ke primary key tabel lain. user_id di items merujuk ke users(id). ON DELETE CASCADE = kalau user dihapus, item miliknya ikut terhapus.
- **AUTO_INCREMENT:** Nilai id otomatis naik tiap insert.
- **TIMESTAMP DEFAULT CURRENT_TIMESTAMP:** Kolom otomatis terisi waktu saat insert/update.

---

## database/create-admin.sql

### 1. Fungsi File Ini

- Contoh script SQL untuk insert satu user admin secara manual. Password harus sudah dalam bentuk hash (bcrypt). Juga ada contoh UPDATE role dan SELECT untuk cek admin.
- Dipanggil oleh: Dijalankan manual (setelah ganti nama/email/hash). Bukan dijalankan otomatis oleh aplikasi.
- Penting: Opsional; biasanya admin dibuat lewat script `createAdmin.js` yang sudah hash password.

### 2–4. (Singkat)

Isi file: komentar cara pakai, contoh INSERT dengan placeholder hash, contoh UPDATE role, contoh SELECT. Tidak ada dependency; murni referensi SQL.

### 5. Istilah

- **Hash (password):** String hasil bcrypt dari password; tidak bisa dibalik. Login dengan membandingkan password input dan hash (bcrypt.compare).

---

## .env.example dan .env.docker.example

### 1. Fungsi

- **.env.example:** Template untuk environment **lokal (non-Docker)**. Di-copy jadi `.env` di folder backend. DB_HOST=localhost, dll.
- **.env.docker.example:** Template untuk **Docker**. Di-copy jadi `.env.docker`. DB_HOST=mysql (nama service), DB_PASSWORD=rootpassword, dll.

Keduanya tidak di-commit isi asli; hanya template. File asli (.env, .env.docker) ada di .gitignore.

### 2–5. (Singkat)

Berisi variabel: PORT, NODE_ENV, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, UPLOAD_DIR, FRONTEND_URL. Dibaca oleh dotenv di server.js dan config/db.js.

---

## controllers/authController.js

### 1. Fungsi File Ini

- Menangani **register** dan **login**: validasi input, cek email ada/tidak, hash password, simpan user, atau cek kredensial dan mengeluarkan JWT + data user.
- Dipanggil oleh: authRoutes (POST /register, POST /login).
- Penting: Inti autentikasi user.

### 2. Import / Dependency

| Import | Dari mana | Kenapa |
|--------|-----------|--------|
| User | ../models/User | Cek email, create user, findByEmail. |
| bcrypt | package bcrypt | Hash password (register), bandingkan password (login). |
| jwt | package jsonwebtoken | Generate token setelah login sukses. |

### 3. Penjelasan Kode (per blok)

- **exports.register = async (req, res) => { ... }**  
  Fungsi async: boleh pakai await. req.body berisi name, email, password (dari body JSON).

- **Proteksi role:** Jika req.body.role ada dan bukan "user", return 403. Registrasi hanya untuk user; admin tidak bisa didaftarkan lewat form.

- **Validasi:** Jika name/email/password kosong, return 400 "Missing fields".

- **Email exists:** User.emailExists(email). Kalau true, return 400 "Email exists".

- **Hash:** hashedPassword = await bcrypt.hash(password, 10). Angka 10 = salt rounds (tingkat kesulitan).

- **Simpan:** User.create(name, email, hashedPassword, "user"). Return insertId. Response 201 + message + userId.

- **exports.login = async (req, res) => { ... }**  
  Ambil email, password dari req.body. User.findByEmail(email). Kalau tidak ada user, return 400 "Invalid credentials". bcrypt.compare(password, user.password). Kalau tidak cocok, return 400. Kalau cocok: jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" }). Response JSON: token + user (id, name, email, role tanpa password).

- **catch:** console.error, response 500 "Server error".

### 4. Alur Eksekusi

- **Register:** Validasi → cek email → hash → create user → response 201.
- **Login:** Cari user → bandingkan password → sign JWT → response 200 + token & user.

### 5. Istilah

- **201:** HTTP status “Created”. **400:** Bad Request. **403:** Forbidden. **500:** Server Error.
- **JWT sign:** Membuat token yang berisi payload (id, role) dan ditandatangani dengan JWT_SECRET; client bisa kirim token ini untuk request berikutnya.

---

## controllers/itemController.js

### 1. Fungsi File Ini

- CRUD item (lost/found): createItem (dari req.user.id + body + req.file), getAll (public, pakai Item.findAllPublic), getById, getMyReports (by user_id), updateItem (hanya pemilik), deleteItem (hanya admin).
- Dipanggil oleh: itemRoutes (berbagai GET/POST/PUT/DELETE).
- Penting: Semua logika item untuk user (bukan admin) ada di sini.

### 2. Import / Dependency

Hanya `Item` model. Tidak ada bcrypt/jwt; auth sudah di-handle middleware.

### 3. Penjelasan Kode (ringkas)

- **createItem:** userId dari req.user.id (setelah authenticate). Data dari req.body (name, description, location, date_occured, status). Gambar dari req.file.filename (kalau ada). Item.create(...). Response 201 + id.
- **getAll:** Item.findAllPublic() → hanya approved dan aturan resolved 24 jam. Response array items.
- **getById:** Item.findById(req.params.id). Kalau tidak ada, 404. Response item.
- **getMyReports:** Item.findByUserId(req.user.id). Response array.
- **updateItem:** Cek item ada, cek req.user.id === item.user_id. Item.update(...). Bisa kirim image baru via req.file.
- **deleteItem:** Cek item ada. Hanya jika req.user.role === "admin" boleh hapus. Item.delete(id). Response 200.

### 4. Alur Eksekusi

Tergantung route: create → auth + upload jalan dulu, lalu controller; get → controller baca dari model; update/delete → cek kepemilikan/role lalu model.

### 5. Istilah

- **req.params:** Bagian path (misal :id). req.params.id = nilai id dari URL.
- **req.file:** Objek file dari Multer (upload.single('image')). filename = nama file yang disimpan.

---

## controllers/adminController.js

### 1. Fungsi File Ini

- Operasi admin: getAllUsers, deleteUser (tidak boleh hapus diri sendiri), getAllItems, updateValidationStatus (pending/approved/rejected), markAsResolved (resolved_note), updateItem, createItem, deleteItem, getStatistics (count users, items, lost, found, pending, approved).
- Dipanggil oleh: adminRoutes. Semua route admin sudah lewat authenticate + isAdmin.
- Penting: Semua fitur admin panel backend ada di sini.

### 2. Import / Dependency

User model, Item model; getStatistics juga require pool untuk query COUNT.

### 3. Penjelasan Kode (ringkas)

- **getAllUsers:** User.findAll(). Response array users (tanpa password).
- **deleteUser:** Cek id !== req.user.id. User.findById, kalau tidak ada 404. User.delete(id). Response 200.
- **getAllItems:** Item.findAll() (semua status). Response array items.
- **updateValidationStatus:** Validasi validation_status in ["pending","approved","rejected"]. Item.updateValidationStatus(id, validation_status). Response 200.
- **markAsResolved:** Item.markAsResolved(id, resolved_note). Response 200. Ada penanganan error jika kolom resolved_at belum ada (pesan jelas).
- **updateItem / createItem / deleteItem:** Sama seperti item controller tapi tanpa cek pemilik; admin bisa edit/hapus semua.
- **getStatistics:** Beberapa pool.query COUNT untuk users, items, status lost/found, validation pending/approved. Response object { totalUsers, totalItems, totalLost, totalFound, totalPending, totalApproved }.

### 4. Alur Eksekusi

Setiap fungsi: terima req (params/body), panggil model, kirim res.json(...). Error di-catch, response 500.

### 5. Istilah

- **Validation status:** Status persetujuan laporan (pending/approved/rejected). Hanya approved yang tampil di public.
- **Resolved:** Kasus selesai; admin isi resolved_note, backend set resolved_at.

---

## middleware/authMiddleware.js

### 1. Fungsi File Ini

- Middleware **authenticate**: mengambil token dari header Authorization (Bearer &lt;token&gt;), verify dengan JWT_SECRET, load user dari DB by payload.id, menulis req.user. Kalau tidak ada token / invalid / user tidak ada, response 401.
- Dipanggil oleh: itemRoutes (my-reports, lost, found, put, delete) dan adminRoutes (semua).
- Penting: Semua endpoint yang butuh “user login” memakai middleware ini.

### 2. Import / Dependency

jwt, pool (config/db), dotenv.

### 3. Penjelasan Kode

- **const header = req.headers.authorization;**  
  Format: "Bearer <token>". Kalau tidak ada, return 401 "No token provided".

- **const token = header.split(" ")[1];**  
  Ambil bagian setelah "Bearer ". Kalau tidak ada, 401.

- **const payload = jwt.verify(token, process.env.JWT_SECRET);**  
  Verify tanda tangan dan kadaluarsa. Kalau gagal, throw → catch return 401 "Invalid or expired token".

- **Pool query SELECT id, name, email, role FROM users WHERE id = ?**  
  Payload.id dari token. Kalau tidak ada baris, 401 "User not found".

- **req.user = rows[0]; next();**  
  Simpan data user ke request; route handler berikutnya bisa pakai req.user.

### 4. Alur Eksekusi

Request masuk → ambil header → ambil token → verify → query user → req.user = user → next(). Salah satu langkah gagal → response 401, next() tidak dipanggil.

### 5. Istilah

- **401 Unauthorized:** Belum login atau token invalid/expired.
- **Bearer:** Skema Authorization header; format "Bearer <token>".

---

## middleware/adminMiddleware.js

### 1. Fungsi File Ini

- Middleware **isAdmin**: Cek req.user (harus sudah di-set oleh authenticate). Kalau req.user.role !== "admin", response 403 "Admin access required". Kalau admin, next().
- Dipanggil oleh: adminRoutes, selalu setelah authenticate.
- Penting: Membatasi route admin hanya untuk user dengan role admin.

### 2. Import / Dependency

Tidak ada; hanya memakai req.user dari middleware sebelumnya.

### 3. Penjelasan Kode

- if (!req.user) return 401 "Authentication required".
- if (req.user.role !== "admin") return 403 "Admin access required".
- next().

### 4. Alur Eksekusi

Singkat: cek user ada dan role admin; kalau tidak, 401/403; kalau ya, next().

### 5. Istilah

- **403 Forbidden:** Sudah login tapi tidak punya hak akses (bukan admin).

---

## middleware/upload.js

### 1. Fungsi File Ini

- Konfigurasi **Multer**: folder simpan (UPLOAD_DIR dari env atau "uploads"), buat folder kalau belum ada. Nama file: timestamp + random + extension. Limit 5MB. Export instance multer untuk dipakai upload.single('image').
- Dipanggil oleh: itemRoutes (POST lost/found, PUT :id) dan adminRoutes (POST/PUT items).
- Penting: Tanpa ini, file upload tidak tersimpan dan req.file tidak terisi.

### 2. Import / Dependency

multer, path, fs, dotenv.

### 3. Penjelasan Kode

- **UPLOAD_DIR:** process.env.UPLOAD_DIR || "uploads". fs.existsSync + mkdirSync recursive jika belum ada.
- **storage = multer.diskStorage({ destination, filename }):** destination = folder UPLOAD_DIR; filename = Date.now() + "-" + random + path.extname(file.originalname).
- **multer({ storage, limits: { fileSize: 5*1024*1024 } }):** Max 5MB.
- **module.exports = upload;** Dipakai: upload.single("image") → field form harus bernama "image".

### 4. Alur Eksekusi

Saat request dengan multipart: Multer parse body, simpan file ke disk, isi req.file (path, filename, size, dll). Route handler dapat req.file.

### 5. Istilah

- **Multer:** Middleware Express untuk multipart/form-data (form + file).
- **diskStorage:** Menyimpan file ke disk (bukan memory). destination = folder; filename = nama file.

---

## models/User.js

### 1. Fungsi File Ini

- Model User: findByEmail, findById, emailExists, create, findAll, delete. Semua berinteraksi dengan tabel users via pool.
- Dipanggil oleh: authController, adminController.
- Penting: Satu-satunya tempat query ke tabel users (konsisten dan mudah dirawat).

### 2. Import / Dependency

Hanya pool dari ../config/db.

### 3. Penjelasan Kode (ringkas)

- **findByEmail(email):** SELECT * FROM users WHERE email = ?. Return rows[0] atau null.
- **findById(id):** SELECT id, name, email, role, created_at (tanpa password). Return rows[0] atau null.
- **emailExists(email):** SELECT id. Return rows.length > 0.
- **create(name, email, hashedPassword, role):** INSERT. Return result.insertId.
- **findAll():** SELECT id, name, email, role, created_at ORDER BY created_at DESC. Return rows.
- **delete(id):** DELETE FROM users WHERE id = ?.

### 4. Alur Eksekusi

Tidak jalan sendiri; dipanggil oleh controller. Setiap fungsi: pool.query(...) dengan parameter (placeholder ?), return hasil.

### 5. Istilah

- **Placeholder (?):** Mencegah SQL injection; nilai dari array parameter ke query.
- **insertId:** ID yang di-generate untuk baris yang baru di-INSERT.

---

## models/Item.js

### 1. Fungsi File Ini

- Model Item: findAll, findAllPublic (approved + aturan resolved 24 jam, dengan fallback jika resolved_at belum ada), findById, findByUserId, create, update, updateValidationStatus, markAsResolved (dengan fallback ALTER TABLE jika kolom belum ada), delete, isOwner.
- Dipanggil oleh: itemController, adminController.
- Penting: Semua akses ke tabel items melalui model ini.

### 2. Import / Dependency

Hanya pool.

### 3. Penjelasan Kode (ringkas)

- **findAll:** JOIN users, SELECT i.*, u.name as reporter, ORDER BY created_at DESC.
- **findAllPublic:** WHERE validation_status = 'approved' AND (resolved_at IS NULL OR resolved_at > NOW() - 24 hour). Ada try/catch: kalau error karena kolom resolved_at belum ada, query tanpa kondisi resolved_at.
- **findById, findByUserId:** Query dengan WHERE id = ? / user_id = ?. Return satu atau banyak.
- **create:** INSERT dengan user_id, name, description, location, date_occured, image, status, validation_status = 'pending'. Return insertId.
- **update:** Dynamic: hanya kolom yang dikirim yang di-UPDATE (array updates + values). Return true/false.
- **updateValidationStatus:** UPDATE items SET validation_status = ? WHERE id = ?.
- **markAsResolved:** UPDATE resolved_at = NOW(), resolved_note. Kalau error ER_BAD_FIELD_ERROR / "resolved_at", coba ALTER TABLE tambah kolom resolved_at dan resolved_note lalu update lagi.
- **delete:** DELETE FROM items WHERE id = ?.
- **isOwner:** SELECT user_id, bandingkan dengan userId.

### 4. Alur Eksekusi

Sama seperti User: hanya dipanggil controller; eksekusi saat controller memanggil fungsi model.

### 5. Istilah

- **JOIN:** Menggabungkan baris dari dua tabel (items + users) berdasarkan kondisi (user_id = id).
- **Dynamic update:** Hanya kolom yang nilainya dikirim yang di-set di query UPDATE.

---

## routes/authRoutes.js

### 1. Fungsi File Ini

- Mendefinisikan route: POST /register → authController.register, POST /login → authController.login. Base path dari server: /api/auth, jadi full path POST /api/auth/register dan POST /api/auth/login.
- Dipanggil oleh: server.js (app.use("/api/auth", authRoutes)).
- Penting: Satu-satunya route auth untuk user.

### 2. Import / Dependency

express (Router), authController (../controllers/authController).

### 3. Penjelasan Kode

- **const router = express.Router();** Membuat router kecil.
- **router.post("/register", ctrl.register);** Saat POST /register (relatif ke /api/auth), panggil ctrl.register.
- **router.post("/login", ctrl.login);** Idem untuk login.
- **module.exports = router;** Diekspor ke server.js.

### 4. Alur Eksekusi

Request POST /api/auth/register → Express masuk ke authRoutes → path match "/register" → panggil ctrl.register(req, res). Idem untuk login.

### 5. Istilah

- **Router:** Kelompok route dengan prefix yang sama. Memisahkan route per fitur (auth, items, admin).

---

## routes/itemRoutes.js

### 1. Fungsi File Ini

- GET / → getAll (public). GET /my-reports → authenticate, getMyReports. GET /:id → getById. PUT /:id → authenticate, upload.single("image"), updateItem. POST /lost dan POST /found → authenticate, upload.single("image"), createItem. DELETE /:id → authenticate, deleteItem.
- Dipanggil oleh: server.js app.use("/api/items", itemRoutes).
- Penting: Semua endpoint item untuk user (bukan admin) ada di sini.

### 2. Import / Dependency

express, itemController, authMiddleware (authenticate), upload.

### 3. Penjelasan Kode

- Route tanpa auth: GET /, GET /:id.
- Route dengan auth: GET /my-reports, POST /lost, POST /found, PUT /:id, DELETE /:id. Middleware order: authenticate (dan upload untuk yang ada file) lalu controller.
- Perhatian: Route yang lebih spesifik (/my-reports, /lost, /found) didefinisikan sebelum /:id agar tidak tertimpa parameter id.

### 4. Alur Eksekusi

Request masuk → cocokkan path dan method → jalankan middleware berurutan (auth, upload jika ada) → controller.

### 5. Istilah

- **:id:** Parameter path. GET /api/items/5 → req.params.id = "5".

---

## routes/adminRoutes.js

### 1. Fungsi File Ini

- Semua route di bawah /api/admin: users (GET, DELETE), items (GET, POST, PUT, DELETE), validate (PUT), resolve (PUT), statistics (GET). Semua memakai authenticate lalu isAdmin; yang ada upload memakai upload.single("image").
- Dipanggil oleh: server.js app.use("/api/admin", adminRoutes).
- Penting: Satu-satunya pintu API untuk fitur admin.

### 2. Import / Dependency

express, adminController, authenticate, isAdmin, upload.

### 3. Penjelasan Kode

- Setiap route: router.get/put/post/delete("...", authenticate, isAdmin, [upload.single("image") jika perlu], adminController.namaFungsi).
- Path contoh: /users, /users/:id, /items, /items/:id, /items/:id/validate, /items/:id/resolve, /statistics.

### 4. Alur Eksekusi

Request → authenticate (isi req.user) → isAdmin (cek role) → upload jika ada → controller.

### 5. Istilah

- **Chaining middleware:** Beberapa fungsi berurutan; masing-masing bisa menghentikan dengan res.status(...).send atau memanggil next().

---

## scripts/createAdmin.js

### 1. Fungsi File Ini

- Script CLI untuk membuat satu user admin: baca name, email, password dari stdin (readline), cek email belum ada, hash password (bcrypt), INSERT ke users dengan role 'admin'. Bukan bagian dari server; dijalankan sekali dengan `node scripts/createAdmin.js` atau `npm run create-admin`.
- Dipanggil oleh: Developer (manual). Bisa dari package.json script "create-admin".
- Penting: Cara aman membuat admin pertama tanpa insert SQL manual (password ter-hash).

### 2. Import / Dependency

bcrypt, pool, dotenv, readline (bawaan Node).

### 3. Penjelasan Kode

- **readline.createInterface({ input: process.stdin, output: process.stdout }):** Membaca input dari terminal.
- **question(query):** Promise yang resolve dengan jawaban user. Dipakai await question("Masukkan nama admin: ") dll.
- Validasi: name, email, password tidak boleh kosong. Cek email belum ada di DB.
- **bcrypt.hash(password, 10):** Hash password. INSERT ke users (name, email, hashedPassword, "admin"). Log sukses, rl.close(), process.exit(0). Error: log, process.exit(1).
- **createAdmin();** Script langsung menjalankan fungsi ini saat file di-run.

### 4. Alur Eksekusi

Jalankan script → tanya nama, email, password → validasi → hash → insert → selesai.

### 5. Istilah

- **CLI:** Command-line interface; program dijalankan di terminal, input dari keyboard.
- **process.exit(0):** Keluar dengan kode 0 (sukses). process.exit(1) = error.

---

## backend/Dockerfile

### 1. Fungsi File Ini

- Build image Docker untuk backend: Node 18 Alpine, WORKDIR /app, copy package*.json, npm install, copy source, expose 5000, CMD npm run dev (nodemon). Volume di docker-compose memount kode dan node_modules sehingga development bisa hot-reload.
- Dipanggil oleh: docker-compose (build context ./backend).
- Penting: Untuk menjalankan backend di dalam container (pasangan dengan MySQL dan frontend di compose).

### 2–5. (Singkat)

FROM node:18-alpine → WORKDIR /app → COPY package*.json → RUN npm install → COPY . . → EXPOSE 5000 → CMD ["npm", "run", "dev"]. Istilah: image = snapshot; container = instance yang jalan; volume = mount folder host ke container.

---

**Selesai.** Untuk deep dive **frontend** (setiap file, import, kode, alur, istilah), lihat **DEEP_DIVE_FRONTEND.md**.
