# 📋 CMS Lost & Found - Audit & Refactoring Plan

> Dibuat: 2 Februari 2026  
> Status: Menunggu Approval untuk Eksekusi

---

## 📊 RINGKASAN AUDIT

### 🚨 Masalah yang Ditemukan

| No  | Masalah                       | Prioritas | Status           |
| --- | ----------------------------- | --------- | ---------------- |
| 1   | Folder `backend/` duplikat    | 🔴 KRITIS | Belum diperbaiki |
| 2   | Path salah di `api/index.js`  | 🔴 KRITIS | Belum diperbaiki |
| 3   | Database schema tidak lengkap | 🟡 SEDANG | Belum diperbaiki |
| 4   | Vercel config tidak tepat     | 🟡 SEDANG | Belum diperbaiki |
| 5   | JWT Secret lemah di .env      | 🟢 RENDAH | Belum diperbaiki |

---

## 🏗️ STRUKTUR SAAT INI (BERMASALAH)

```
CMS-UTS-SEMESTER-3/
├── server.js              ← ✅ File asli
├── controllers/           ← ✅ Folder asli
├── models/                ← ✅ Folder asli
├── routes/                ← ✅ Folder asli
├── config/                ← ✅ Folder asli
├── middleware/            ← ✅ Folder asli
├── database/              ← ✅ Folder asli
├── scripts/               ← ✅ Folder asli
├── api/                   ← ✅ Untuk Vercel
├── frontend/              ← ✅ React app
│
├── backend/               ← ❌ DUPLIKAT - HAPUS INI!
│   ├── backend/           ← ❌ DUPLIKAT LAGI
│   ├── server.js          ← ❌ Salinan
│   └── ...
```

---

## 🎯 STRUKTUR YANG DIINGINKAN (PROFESIONAL)

```
CMS-UTS-SEMESTER-3/
├── .env.example           ✓ Config template
├── package.json           ✓ Root dependencies
├── server.js              ✓ Entry point
├── vercel.json            ✓ Deployment config
│
├── api/                   ✓ Vercel serverless
│   └── index.js
│
├── config/                ✓ DB & app config
│   └── db.js
│
├── controllers/           ✓ Business logic
│   ├── adminController.js
│   ├── authController.js
│   └── itemController.js
│
├── database/              ✓ SQL schemas
│   └── schema.sql
│
├── middleware/            ✓ Express middleware
│   ├── adminMiddleware.js
│   ├── authMiddleware.js
│   └── upload.js
│
├── models/                ✓ Data models
│   ├── Item.js
│   └── User.js
│
├── routes/                ✓ API routes
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   └── itemRoutes.js
│
├── scripts/               ✓ Utility scripts
│   └── createAdmin.js
│
└── frontend/              ✓ React application
    ├── src/
    │   ├── components/
    │   ├── contexts/      ← BARU (AuthContext)
    │   ├── hooks/         ← BARU (useAuth)
    │   ├── pages/
    │   ├── api.js
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🛠️ RENCANA ROMBAK (4 FASE)

### FASE 1: Cleanup Struktur (5 menit)

```bash
# Hapus folder duplikat
rm -rf backend/
```

### FASE 2: Standardisasi Backend (30-45 menit)

- [ ] Update `package.json` scripts
- [ ] Tambah security middleware (helmet, rate-limit)
- [ ] Fix path di `api/index.js`
- [ ] Update database schema

### FASE 3: Refactor Frontend (30-45 menit)

- [ ] Buat `AuthContext` untuk state management
- [ ] Buat `useAuth` hook
- [ ] Refactor components

### FASE 4: Production Config (15 menit)

- [ ] Fix `vercel.json`
- [ ] Buat `.env.production.example`

---

## 💻 TECH STACK FINAL

| Layer       | Technology            | Version     |
| ----------- | --------------------- | ----------- |
| Backend     | Node.js + Express     | v18+ / v5.1 |
| Frontend    | React + Vite          | v18 / v5    |
| Styling     | TailwindCSS + DaisyUI | v3.3 / v4.4 |
| Database    | MySQL                 | v8+         |
| Auth        | JWT + bcrypt          | latest      |
| File Upload | Multer                | v2          |

---

## ✅ HAL YANG SUDAH BAGUS

1. **Arsitektur MVC** - Controllers, Models, Routes terpisah dengan baik
2. **Security** - Password hashing dengan bcrypt, JWT auth
3. **SQL Injection Protection** - Menggunakan parameterized queries
4. **UI Modern** - TailwindCSS + DaisyUI dengan custom theme
5. **Protected Routes** - Admin-only routes dilindungi
6. **File Upload** - Multer dengan size limit

---

## ❓ PERTANYAAN SEBELUM EKSEKUSI

1. **Deployment**: Tetap Vercel atau pindah ke Railway/Render?
2. **Database**: XAMPP lokal atau cloud (PlanetScale)?
3. **Fitur tambahan**: Ada yang mau ditambahkan?

---

## 📞 NEXT STEPS

Untuk melanjutkan rombak, jalankan:

```
Bilang "lanjut" atau "gas" untuk mulai eksekusi
```

Atau jika ada pertanyaan/perubahan, diskusikan dulu sebelum eksekusi.

---

_Dokumen ini dibuat oleh AI Assistant untuk referensi pengembangan._
