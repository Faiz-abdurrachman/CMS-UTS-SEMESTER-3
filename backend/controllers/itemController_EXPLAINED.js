/*
📌 FILE: controllers/itemController.js

🧠 Fungsi file ini:
File ini mengurus semua operasi item (lost/found) untuk sisi user: buat laporan (createItem),
ambil daftar item publik (getAll), ambil satu item by id (getById), ambil laporan milik user
(getMyReports), update item (hanya pemilik), hapus item (hanya admin). req.user diisi oleh
middleware authenticate; req.file diisi oleh Multer kalau ada upload.

🔄 Alur singkat:
1. createItem: userId dari req.user, data dari req.body + req.file → Item.create → 201.
2. getAll: Item.findAllPublic() (hanya approved, aturan 24 jam) → json(items).
3. getById: Item.findById(req.params.id) → 404 atau json(item).
4. getMyReports: Item.findByUserId(req.user.id) → json(items).
5. updateItem: cek item ada + pemilik = req.user.id → Item.update → 200.
6. deleteItem: cek item ada + req.user.role === "admin" → Item.delete → 200.

📦 Analogi dunia nyata:
Seperti petugas pengaduan: terima formulir (create), kasih daftar pengaduan yang sudah disetujui (getAll),
kasih detail satu pengaduan (getById), kasih daftar pengaduan milik kamu (getMyReports); hanya pemilik
boleh ubah, hanya admin yang boleh hapus.
*/

// ============================================
// FILE: controllers/itemController.js
// DESKRIPSI: Controller untuk handle CRUD items (Lost & Found)
// ============================================

const Item = require("../models/Item");

// ============================================
// CREATE ITEM
// ============================================

// req.user.id dari middleware authenticate; req.file dari upload.single("image") kalau ada file
exports.createItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, location, date_occured, status } = req.body;
    // req.file = object dari Multer; filename = nama file yang sudah disimpan di folder uploads
    const image = req.file ? req.file.filename : null;

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
// GET ALL ITEMS (PUBLIC)
// ============================================

// Hanya item approved; yang resolved > 24 jam tidak tampil (logic di model findAllPublic)
exports.getAll = async (req, res) => {
  try {
    const items = await Item.findAllPublic();
    res.json(items);
  } catch (err) {
    console.error("Error in getAll items:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      sql: err.sql,
    });
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// ============================================
// GET ITEM BY ID
// ============================================

// req.params.id = nilai dari URL, misal GET /api/items/5 → req.params.id = "5"
exports.getById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

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

exports.getMyReports = async (req, res) => {
  try {
    const userId = req.user.id;
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

// Hanya pemilik (req.user.id === item.user_id) yang boleh update; image undefined = jangan ubah kolom image
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, date_occured, status } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (req.user.id !== item.user_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

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

// Hanya admin yang boleh hapus; user biasa tidak bisa hapus laporan sendiri lewat endpoint ini
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Hanya admin yang bisa menghapus laporan",
      });
    }

    await Item.delete(req.params.id);

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error in deleteItem:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/*
---------- RINGKASAN ALUR FILE INI ----------
createItem/getAll/getById/getMyReports/updateItem/deleteItem masing-masing: baca req → panggil model Item → res.status().json().
req.user dari middleware auth; req.params.id dari URL; req.file dari Multer.

---------- ISTILAH YANG MUNCUL ----------
- req.params: bagian path URL yang dinamis (/:id → req.params.id).
- req.file: object file dari Multer (filename, path, size, dll).
- 403 Forbidden: sudah auth tapi tidak punya hak (bukan pemilik / bukan admin).
- 404 Not found: resource tidak ada.

---------- KESALAHAN UMUM PEMULA ----------
- Memakai req.body.id untuk update/delete padahal id dari URL (req.params.id).
- Lupa cek kepemilikan (req.user.id === item.user_id) sebelum update → user lain bisa ubah.
- Mengira deleteItem bisa dipanggil user untuk hapus laporan sendiri (di kode ini hanya admin).
*/
