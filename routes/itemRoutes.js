// ============================================
// FILE: routes/itemRoutes.js
// DESKRIPSI: Routes untuk endpoint items (Lost & Found)
// ============================================

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/itemController");
const { authenticate } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// ============================================
// ROUTE DEFINITIONS
// ============================================

// GET /api/items
// Endpoint untuk mengambil semua items (public, tidak perlu login)
router.get("/", ctrl.getAll);

// GET /api/items/my-reports
// Endpoint untuk mengambil items milik user yang sedang login
router.get("/my-reports", authenticate, ctrl.getMyReports);

// GET /api/items/:id
// Endpoint untuk mengambil item berdasarkan ID (public)
router.get("/:id", ctrl.getById);

// PUT /api/items/:id
// Endpoint untuk update item (hanya pemilik)
router.put("/:id", authenticate, upload.single("image"), ctrl.updateItem);

// POST /api/items/lost
// Endpoint untuk membuat item lost (perlu login + upload gambar)
// authenticate: middleware untuk verifikasi token
// upload.single('image'): middleware untuk handle single file upload
// Field name di form harus 'image'
router.post("/lost", authenticate, upload.single("image"), ctrl.createItem);

// POST /api/items/found
// Endpoint untuk membuat item found (perlu login + upload gambar)
router.post("/found", authenticate, upload.single("image"), ctrl.createItem);

// DELETE /api/items/:id
// Endpoint untuk menghapus item (perlu login)
// Hanya admin atau pemilik item yang bisa hapus
router.delete("/:id", authenticate, ctrl.deleteItem);

// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;
