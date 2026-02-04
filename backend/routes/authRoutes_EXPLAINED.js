/*
📌 FILE: routes/authRoutes.js

🧠 Fungsi file ini:
File ini mendefinisikan dua route untuk autentikasi: POST /register dan POST /login.
Karena dipasang di server dengan app.use("/api/auth", authRoutes), full path-nya
POST /api/auth/register dan POST /api/auth/login. Tidak ada middleware auth di sini
(karena register/login justru untuk yang belum punya token). Setiap route langsung
memanggil fungsi di authController.

🔄 Alur singkat:
1. Buat router dengan express.Router().
2. router.post("/register", ctrl.register) = saat POST ke /register, jalankan ctrl.register.
3. router.post("/login", ctrl.login) = saat POST ke /login, jalankan ctrl.login.
4. Export router; server.js memakai dengan app.use("/api/auth", authRoutes).

📦 Analogi dunia nyata:
Seperti dua pintu: satu pintu "Daftar" (register), satu pintu "Masuk" (login). Siapa pun
boleh lewat tanpa tunjuk kartu; petugas di dalam (controller) yang mengurus formulir.
*/

// ============================================
// FILE: routes/authRoutes.js
// DESKRIPSI: Routes untuk endpoint autentikasi
// ============================================

const express = require("express");
// Router = mini-app untuk kelompok route dengan prefix yang sama
const router = express.Router();
const ctrl = require("../controllers/authController");

// ============================================
// ROUTE DEFINITIONS
// ============================================

// POST /api/auth/register → body: name, email, password → authController.register
router.post("/register", ctrl.register);

// POST /api/auth/login → body: email, password → authController.login
router.post("/login", ctrl.login);

// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;

/*
---------- RINGKASAN ALUR FILE INI ----------
Request POST /api/auth/register atau /api/auth/login → Express cocokkan path → panggil ctrl.register atau ctrl.login (req, res).

---------- ISTILAH YANG MUNCUL ----------
- Router: objek yang punya .get, .post, .put, .delete; dipasang ke app dengan app.use(prefix, router).
- ctrl.register: referensi ke fungsi; saat route match, Express memanggil ctrl.register(req, res).

---------- KESALAHAN UMUM PEMULA ----------
- Menaruh middleware authenticate di route login/register → user belum punya token, selalu 401.
- Salah path: router.get("/register") padahal form kirim POST → route tidak pernah match.
*/
