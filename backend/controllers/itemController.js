// ============================================
// FILE: controllers/itemController.js
// DESKRIPSI: Controller untuk handle CRUD items (Lost & Found)
// ============================================

const Item = require("../models/Item");

// ============================================
// CREATE ITEM
// ============================================

// Fungsi untuk membuat item baru (lost atau found)
// req.user.id berasal dari middleware authenticate
// req.file berasal dari middleware upload (jika ada file)
exports.createItem = async (req, res) => {
  try {
    // Ambil user ID dari token (setelah melewati middleware authenticate)
    const userId = req.user.id;

    // Ambil data dari request body
    const { name, description, location, date_occured, status } = req.body;

    // Ambil nama file jika ada upload
    // req.file.filename adalah nama file yang sudah disimpan oleh multer
    const image = req.file ? req.file.filename : null;

    // Insert item baru ke database menggunakan model
    const itemId = await Item.create(
      userId,
      name,
      description,
      location,
      date_occured || null,
      image,
      status || "lost"
    );

    res.status(201).json({
      message: "Item created",
      id: itemId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// GET ALL ITEMS
// ============================================

// Fungsi untuk mengambil semua items
// JOIN dengan tabel users untuk ambil nama reporter
exports.getAll = async (req, res) => {
  try {
    // Ambil semua items menggunakan model
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// GET ITEM BY ID
// ============================================

// Fungsi untuk mengambil item berdasarkan ID
exports.getById = async (req, res) => {
  try {
    // Ambil item berdasarkan ID menggunakan model
    const item = await Item.findById(req.params.id);

    // Jika item tidak ditemukan
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// GET MY REPORTS (Items by User ID)
// ============================================

// Fungsi untuk mengambil items milik user yang sedang login
exports.getMyReports = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ambil items berdasarkan user_id menggunakan model
    const items = await Item.findByUserId(userId);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// UPDATE ITEM
// ============================================

// Fungsi untuk update item (hanya pemilik yang bisa update)
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, date_occured, status } = req.body;
    const image = req.file ? req.file.filename : undefined;

    // Cek apakah item ada
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Cek apakah user adalah pemilik item
    if (req.user.id !== item.user_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Update item menggunakan model
    // Jika image undefined, tidak update image (biarkan yang lama)
    const updated = await Item.update(
      id,
      name,
      description,
      location,
      date_occured,
      image,
      status
    );

    if (!updated) {
      return res.status(400).json({ message: "No fields to update" });
    }

    res.json({ message: "Item updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// DELETE ITEM
// ============================================

// Fungsi untuk menghapus item
// Hanya admin atau pemilik item yang bisa hapus
exports.deleteItem = async (req, res) => {
  try {
    // Cek apakah item ada
    const item = await Item.findById(req.params.id);

    // Jika item tidak ditemukan
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    // Cek apakah user adalah admin atau pemilik item
    // req.user.role berasal dari middleware authenticate
    // req.user.id adalah ID user yang sedang login
    if (req.user.role !== "admin" && req.user.id !== item.user_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Hapus item dari database menggunakan model
    await Item.delete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
