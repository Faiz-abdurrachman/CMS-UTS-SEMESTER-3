/*
📌 FILE: middleware/authMiddleware.js

🧠 Fungsi file ini:
File ini adalah "satpam" untuk route yang butuh login. Dia cek: apakah request membawa token
JWT di header Authorization? Kalau ya, dia verifikasi token (valid & belum kadaluarsa),
lalu mengambil data user dari database dan menaruhnya di req.user. Route handler berikutnya
bisa pakai req.user.id, req.user.role, dll. Kalau tidak ada token atau token invalid → response 401.

🔄 Alur singkat:
1. Ambil header Authorization (format "Bearer <token>").
2. Kalau tidak ada atau kosong → 401 "No token provided".
3. jwt.verify(token, JWT_SECRET) → dapat payload (id, role) atau throw.
4. Query user by payload.id dari DB; kalau tidak ada → 401 "User not found".
5. req.user = rows[0]; next() → lanjut ke handler berikutnya.
6. Catch (token invalid/expired) → 401 "Invalid or expired token".

📦 Analogi dunia nyata:
Seperti penjaga gedung: tamu harus tunjuk kartu (token). Penjaga cek kartu valid, lalu
lihat daftar penghuni (DB) untuk dapat nama dan hak akses, lalu mencatat "ini siapa" (req.user)
dan mengizinkan masuk (next()). Kalau kartu palsu atau kedaluarsa, tamu ditolak (401).
*/

// ============================================
// FILE: middleware/authMiddleware.js
// DESKRIPSI: Middleware untuk autentikasi JWT token (untuk user biasa)
// ============================================

const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();

// ============================================
// FUNGSI AUTHENTICATE
// ============================================

// authenticate = fungsi middleware (req, res, next); async karena ada await pool.query
const authenticate = async (req, res, next) => {
  try {
    // 1️⃣ Ambil header; frontend kirim: Authorization: "Bearer <token>"
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2️⃣ split(" ") = bagi string jadi array ["Bearer", "eyJhbG..."]; [1] = ambil elemen kedua (token)
    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 3️⃣ verify = decode + cek tanda tangan & expiry; kalau gagal throw → masuk catch
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Ambil user dari DB (hanya kolom yang perlu; jangan password)
    // pool.query mengembalikan [rows, fields]; [rows] = destructure array pertama
    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [payload.id]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "User not found" });
    }

    // 5️⃣ Simpan ke req agar route handler berikutnya bisa pakai req.user
    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ============================================
// EXPORT
// ============================================

// Export object { authenticate } agar bisa: const { authenticate } = require("...")
module.exports = { authenticate };

/*
---------- RINGKASAN ALUR FILE INI ----------
Request masuk → cek Authorization header → ambil token → verify → load user dari DB → req.user = user → next(). Salah satu gagal → 401.

---------- ISTILAH YANG MUNCUL ----------
- Middleware: fungsi (req, res, next) yang dijalankan sebelum route handler; next() = lanjut ke handler berikutnya.
- 401 Unauthorized: belum login atau token tidak valid.
- req.headers: object berisi header HTTP (authorization, content-type, dll).
- payload: isi token JWT (di sini { id, role }) setelah di-decode dan diverifikasi.

---------- KESALAHAN UMUM PEMULA ----------
- Memanggil isAdmin sebelum authenticate → req.user belum ada, isAdmin error.
- Lupa set JWT_SECRET di .env → jwt.verify throw, semua request terproteksi dapat 401.
- Mengirim token tanpa prefix "Bearer " → header.split(" ")[1] bisa salah; standar pakai "Bearer <token>".
*/
