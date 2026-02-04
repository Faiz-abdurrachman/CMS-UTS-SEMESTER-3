/*
📌 FILE: middleware/adminMiddleware.js

🧠 Fungsi file ini:
File ini memastikan user yang sudah login adalah admin. Harus dipanggil SETELAH middleware
authenticate, karena dia memakai req.user (yang diisi oleh authenticate). Kalau req.user
tidak ada → 401; kalau req.user.role !== "admin" → 403. Kalau admin → next() ke handler.

🔄 Alur singkat:
1. Cek req.user ada (kalau tidak, berarti authenticate tidak dijalankan atau gagal) → 401.
2. Cek req.user.role === "admin" → kalau tidak → 403 "Admin access required".
3. next() → lanjut ke controller admin.

📦 Analogi dunia nyata:
Seperti pintu ruang VIP: tamu sudah punya kartu (authenticate), tapi pintu ini cek "apakah
kartu ini kartu VIP (admin)?". Bukan VIP → ditolak (403). VIP → boleh masuk (next()).
*/

// ============================================
// FILE: middleware/adminMiddleware.js
// DESKRIPSI: Middleware untuk memastikan user adalah admin
// ============================================

// ============================================
// FUNGSI IS ADMIN
// ============================================

// Bukan async karena tidak ada await; hanya cek req.user.role
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

// ============================================
// EXPORT
// ============================================

module.exports = { isAdmin };

/*
---------- RINGKASAN ALUR FILE INI ----------
Cek req.user → cek role === "admin" → next() atau 401/403.

---------- ISTILAH YANG MUNCUL ----------
- 403 Forbidden: sudah terautentikasi tapi tidak punya hak (bukan admin).
- next(): memanggil middleware/handler berikutnya dalam rantai.

---------- KESALAHAN UMUM PEMULA ----------
- Memakai isAdmin tanpa authenticate dulu di route → req.user undefined, selalu 401.
- Mengecek role dengan req.body.role (bisa dipalsu) → harus pakai req.user.role dari token/DB.
*/
