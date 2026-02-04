/*
📌 FILE: routes/adminRoutes.js

🧠 Fungsi file ini:
File ini mendefinisikan semua route untuk admin: users (GET semua, DELETE by id), items
(GET, POST, PUT, DELETE), validate (PUT), resolve (PUT), statistics (GET). Semua route
wajib lewat authenticate lalu isAdmin; yang ada upload memakai upload.single("image").
Prefix di server: app.use("/api/admin", adminRoutes), jadi full path misal GET /api/admin/users.

🔄 Alur singkat:
1. Setiap route: authenticate (isi req.user) → isAdmin (cek role) → [upload jika ada] → controller.
2. GET /users, DELETE /users/:id, GET /items, POST /items, PUT /items/:id, PUT /items/:id/validate,
   PUT /items/:id/resolve, DELETE /items/:id, GET /statistics.

📦 Analogi dunia nyata:
Seperti pintu ruang admin: setiap orang yang masuk harus tunjuk kartu (authenticate) lalu
cek kartu VIP (isAdmin); kalau bukan VIP ditolak. Di dalam ada banyak meja (endpoint): kelola user,
kelola item, approve, resolve, lihat statistik.
*/

// ============================================
// FILE: routes/adminRoutes.js
// DESKRIPSI: Routes untuk endpoint admin
// ============================================

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

// ============================================
// ROUTE DEFINITIONS
// ============================================

// Semua route: authenticate dulu (supaya req.user ada), lalu isAdmin (supaya hanya admin)
router.get("/users", authenticate, isAdmin, adminController.getAllUsers);
router.delete("/users/:id", authenticate, isAdmin, adminController.deleteUser);

router.get("/items", authenticate, isAdmin, adminController.getAllItems);
router.post(
  "/items",
  authenticate,
  isAdmin,
  upload.single("image"),
  adminController.createItem
);
router.put(
  "/items/:id",
  authenticate,
  isAdmin,
  upload.single("image"),
  adminController.updateItem
);
router.put(
  "/items/:id/validate",
  authenticate,
  isAdmin,
  adminController.updateValidationStatus
);
router.put(
  "/items/:id/resolve",
  authenticate,
  isAdmin,
  adminController.markAsResolved
);
router.delete("/items/:id", authenticate, isAdmin, adminController.deleteItem);

router.get("/statistics", authenticate, isAdmin, adminController.getStatistics);

// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;

/*
---------- RINGKASAN ALUR FILE INI ----------
Request ke /api/admin/* → authenticate → isAdmin → [upload] → controller. Satu saja gagal → response 401/403, controller tidak jalan.

---------- ISTILAH YANG MUNCUL ----------
- authenticate, isAdmin: middleware; urutan harus authenticate dulu agar req.user tersedia untuk isAdmin.

---------- KESALAHAN UMUM PEMULA ----------
- Memakai isAdmin tanpa authenticate → req.user undefined, isAdmin return 401.
- Salah method (misal GET untuk delete) → route tidak match; pakai DELETE untuk hapus.
*/
