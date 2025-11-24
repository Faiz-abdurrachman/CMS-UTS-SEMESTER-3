// ============================================
// FILE: middleware/adminMiddleware.js
// DESKRIPSI: Middleware untuk memastikan user adalah admin
// ============================================

// ============================================
// FUNGSI IS ADMIN
// ============================================

// Middleware untuk memastikan user yang login adalah admin
// Harus dipanggil SETELAH authenticate middleware
const isAdmin = (req, res, next) => {
  // req.user sudah di-set oleh authenticate middleware
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Cek apakah role user adalah 'admin'
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  // Jika admin, lanjutkan ke route handler
  next();
};

// ============================================
// EXPORT
// ============================================

module.exports = { isAdmin };
