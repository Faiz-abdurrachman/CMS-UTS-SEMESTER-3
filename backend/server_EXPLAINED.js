/*
📌 FILE: server.js

🧠 Fungsi file ini:
File ini adalah "otak" backend. Dia yang menyalakan server HTTP (port 5000), memasang
semua aturan keamanan (helmet, rate limit), izin akses dari frontend (CORS), cara baca
data kiriman (JSON, form, file), dan menghubungkan URL ke file yang menangani (routes).
Semua request dari frontend ke backend lewat file ini dulu.

🔄 Alur singkat:
1. Load variabel lingkungan (.env) dan import route (auth, items, admin).
2. Buat aplikasi Express (app).
3. Pasang middleware berurutan: keamanan → rate limit → CORS → parser body → layanan file uploads.
4. Pasang route: GET /, lalu /api/auth, /api/items, /api/admin.
5. Pasang penanganan error di akhir.
6. Kalau file ini dijalankan langsung (bukan di-require), server listen di PORT; kalau di-require (Vercel), hanya export app.

📦 Analogi dunia nyata:
Seperti resepsionis gedung: dia yang terima tamu (request), cek keamanan (helmet, rate limit),
cek tamu dari mana (CORS), terima berkas (JSON/form), lalu mengarahkan tamu ke ruang yang benar (auth/items/admin). Kalau ada yang salah, dia yang beri tahu (error handler).
*/

// ============================================
// FILE: server.js
// DESKRIPSI: File utama server Express.js
// ============================================

// ---------- IMPORT MODUL ----------
// require = cara Node.js mengambil kode dari file/modul lain
// express = framework untuk bikin server HTTP (terima request, kirim response)
const express = require("express");
// cors = middleware agar browser mengizinkan request dari "asal lain" (misal frontend port 3000 ke backend 5000)
const cors = require("cors");
// path = utilitas untuk menggabungkan path folder (misal __dirname + "uploads")
const path = require("path");
// helmet = middleware yang mengamankan header HTTP (mencegah serangan tertentu)
const helmet = require("helmet");
// express-rate-limit = batasi jumlah request per IP (anti spam / brute force)
const rateLimit = require("express-rate-limit");
// dotenv.config() = baca file .env dan isi process.env (DB_HOST, JWT_SECRET, dll)
require("dotenv").config();

// Import routes = file yang isinya "kalau URL X dipanggil, jalankan fungsi Y"
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ---------- INISIALISASI APLIKASI ----------
// express() = buat satu "aplikasi" Express; semua middleware dan route nanti dipasang ke app
const app = express();

// ============================================
// MIDDLEWARE (dijalankan berurutan tiap request)
// ============================================

// Security Middleware: atur header HTTP agar lebih aman
app.use(helmet());

// Rate Limiting: dalam 15 menit, satu IP maksimal 100 request; lebih dari itu dapat pesan "Too many requests"
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit dalam milidetik
  max: 100,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// CORS: izinkan frontend (origin) mengakses backend; credentials = boleh kirim cookie/Authorization
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// express.json() = ubah body request yang format JSON jadi object JavaScript di req.body
// Tanpa ini, req.body akan undefined saat frontend kirim JSON
app.use(express.json());

// express.urlencoded() = ubah body form biasa (application/x-www-form-urlencoded) jadi req.body
app.use(express.urlencoded({ extended: true }));

// Route /uploads: layani file gambar dari folder uploads, dan set header agar gambar boleh dimuat dari domain lain (cross-origin)
// Tanpa header Cross-Origin-Resource-Policy: cross-origin, gambar dari port 5000 bisa diblokir saat ditampilkan di frontend port 3000
app.use(
  "/uploads",
  (req, res, next) => {
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads"))
);

// ============================================
// ROUTES (URL → siapa yang menangani)
// ============================================

// GET / = cek server hidup; response teks "Lost & Found API running"
app.get("/", (req, res) => res.send("Lost & Found API running"));

// Semua yang diawali /api/auth (misal POST /api/auth/login) → diserahkan ke authRoutes
app.use("/api/auth", authRoutes);

// Semua yang diawali /api/items → itemRoutes
app.use("/api/items", itemRoutes);

// Semua yang diawali /api/admin → adminRoutes
app.use("/api/admin", adminRoutes);

// ============================================
// ERROR HANDLING (dipanggil kalau ada error yang di-pass ke next(err))
// ============================================

// 4 parameter (err, req, res, next) = Express mengenali ini sebagai error handler
// err.status = kode HTTP dari error (misal 404); kalau tidak ada pakai 500
// Di development, kirim juga detail err di response; di production biasanya disembunyikan
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Terjadi kesalahan pada server",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// ============================================
// SERVER LISTENING
// ============================================

// PORT dari .env atau default 5000
const PORT = process.env.PORT || 5000;

// require.main === module = true hanya kalau file ini dijalankan langsung (node server.js)
// Kalau file ini di-require dari tempat lain (misal api/index.js untuk Vercel), jangan listen, cukup export app
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📡 Siap menerima request dari frontend`);
  });
}

// Export app agar bisa dipakai oleh api/index.js (Vercel) tanpa menjalankan listen
module.exports = app;

/*
---------- RINGKASAN ALUR FILE INI ----------
1. Load env dan route.
2. Buat app Express, pasang middleware (keamanan, CORS, parser, static uploads).
3. Pasang route: /, /api/auth, /api/items, /api/admin.
4. Pasang error handler.
5. Jika dijalankan langsung → listen(PORT); jika di-require → hanya export app.

---------- ISTILAH YANG MUNCUL ----------
- Middleware: fungsi (req, res, next) yang dijalankan sebelum/sesudah route; bisa mengubah req/res atau memanggil next().
- CORS: aturan browser yang membatasi request dari domain/port lain; server harus kirim header tertentu agar diizinkan.
- Route: pemetaan URL + method HTTP ke fungsi yang menangani (handler).
- req.body: isi body request (setelah di-parse middleware json/urlencoded).
- express.static: melayani file dari folder tertentu sebagai file statis (tanpa melalui handler).
- require.main === module: cara cek apakah file ini yang dijalankan langsung, bukan di-require.

---------- KESALAHAN UMUM PEMULA ----------
- Menaruh route sebelum middleware parser (express.json) → req.body tetap undefined.
- Lupa set CORS → frontend dapat error "blocked by CORS".
- Menaruh error handler di tengah-tengah route → error tidak tertangkap dengan benar (harus di akhir).
- Mengubah urutan route spesifik vs umum: route yang lebih spesifik (misal /my-reports) harus didahulukan dari route dengan parameter (/:id).
*/
