# Panduan File *_EXPLAINED

Setiap file asli di project punya versi **nama_FILE_EXPLAINED.ext** yang berisi:
1. **Blok komentar di atas**: Fungsi file, alur singkat, analogi dunia nyata.
2. **Kode asli** dengan komentar per blok / per baris penting (tanpa mengubah logika atau format).
3. **Di akhir file**: Ringkasan alur, daftar istilah, kesalahan umum pemula.

## Daftar file *_EXPLAINED yang sudah dibuat

### Root & API
- `api/index_EXPLAINED.js`

### Backend
- `backend/server_EXPLAINED.js`
- `backend/config/db_EXPLAINED.js`
- `backend/database/schema_EXPLAINED.sql`
- `backend/database/create-admin_EXPLAINED.sql`
- `backend/.env.example_EXPLAINED`
- `backend/.env.docker.example_EXPLAINED`
- `backend/Dockerfile_EXPLAINED`
- `backend/controllers/authController_EXPLAINED.js`
- `backend/controllers/itemController_EXPLAINED.js`
- `backend/controllers/adminController_EXPLAINED.js`
- `backend/middleware/authMiddleware_EXPLAINED.js`
- `backend/middleware/adminMiddleware_EXPLAINED.js`
- `backend/middleware/upload_EXPLAINED.js`
- `backend/models/User_EXPLAINED.js`
- `backend/models/Item_EXPLAINED.js`
- `backend/routes/authRoutes_EXPLAINED.js`
- `backend/routes/itemRoutes_EXPLAINED.js`
- `backend/routes/adminRoutes_EXPLAINED.js`
- `backend/scripts/createAdmin_EXPLAINED.js`

### Frontend
- `frontend/index_EXPLAINED.html`
- `frontend/vite.config_EXPLAINED.js`
- `frontend/src/main_EXPLAINED.jsx`
- `frontend/src/App_EXPLAINED.jsx`
- `frontend/src/api_EXPLAINED.js`
- `frontend/src/index_EXPLAINED.css`
- `frontend/src/contexts/AuthContext_EXPLAINED.jsx`
- `frontend/src/hooks/useAuth_EXPLAINED.js`
- `frontend/src/components/Navbar_EXPLAINED.jsx`
- `frontend/src/components/Footer_EXPLAINED.jsx`

### Frontend (lanjutan)
- `frontend/src/components/CardItem_EXPLAINED.jsx`
- `frontend/src/components/SidebarAdmin_EXPLAINED.jsx`
- `frontend/tailwind.config_EXPLAINED.js`
- `frontend/postcss.config_EXPLAINED.js`
- `frontend/src/pages/Home_EXPLAINED.jsx`
- `frontend/src/pages/Login_EXPLAINED.jsx`
- `frontend/src/pages/Register_EXPLAINED.jsx`
- `frontend/src/pages/Dashboard_EXPLAINED.jsx`
- `frontend/src/pages/ReportLost_EXPLAINED.jsx`
- `frontend/src/pages/ReportFound_EXPLAINED.jsx`
- `frontend/src/pages/MyReports_EXPLAINED.jsx`
- `frontend/src/pages/AdminDashboard_EXPLAINED.jsx`

## Cara pakai
- **Jangan jalankan** file *_EXPLAINED (mereka bukan entry point). File asli (tanpa _EXPLAINED) yang dijalankan.
- **Baca** file *_EXPLAINED untuk belajar: baca dulu blok atas, lalu ikuti kode dengan komentar, lalu baca footer.
- **Jangan mengubah** logika atau format kode di dalam file _EXPLAINED; hanya komentar yang ditambah.
