// ============================================
// FILE: routes/adminRoutes.js
// DESKRIPSI: Routes untuk endpoint admin
// ============================================

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// ============================================
// ROUTE DEFINITIONS
// ============================================

// Semua route di sini memerlukan authentication DAN admin role
// authenticate: verifikasi token
// isAdmin: cek apakah user adalah admin

// GET /api/admin/users - Ambil semua users
router.get("/users", authenticate, isAdmin, adminController.getAllUsers);

// DELETE /api/admin/users/:id - Hapus user
router.delete("/users/:id", authenticate, isAdmin, adminController.deleteUser);

// GET /api/admin/items - Ambil semua items
router.get("/items", authenticate, isAdmin, adminController.getAllItems);

// PUT /api/admin/items/:id/validate - Update validation status
router.put(
  "/items/:id/validate",
  authenticate,
  isAdmin,
  adminController.updateValidationStatus
);

// DELETE /api/admin/items/:id - Hapus item (admin bisa hapus semua)
router.delete("/items/:id", authenticate, isAdmin, adminController.deleteItem);

// GET /api/admin/statistics - Ambil statistics untuk dashboard
router.get("/statistics", authenticate, isAdmin, adminController.getStatistics);

// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;
