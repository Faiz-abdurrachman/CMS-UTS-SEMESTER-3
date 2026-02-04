# User Flow — Dari Kode ke Perilaku Aplikasi

Dokumen ini menjelaskan **alur user** di aplikasi Lost & Found berdasarkan **penelusuran kode** (frontend route → API call → backend route → controller → database). Berguna untuk onboarding, testing, atau presentasi.

---

## 1. Tiga “Peran” di Aplikasi

| Peran | Siapa | Bisa akses apa |
|------|--------|-----------------|
| **Guest** | Belum login | Home (`/`), Login (`/login`), Register (`/register`). Bisa lihat daftar barang (lost/found/resolved) di Home karena `GET /api/items` public. |
| **User** | Sudah login, role `user` | Semua yang guest bisa + Dashboard, Report Lost/Found, My Reports. Tidak bisa akses `/admin`. |
| **Admin** | Sudah login, role `admin` | Semua yang user bisa + Admin Panel (`/admin`): kelola laporan, approve/reject, resolve, kelola user. |

**Cara backend tahu peran:** Setelah login, backend mengembalikan JWT yang di dalamnya ada `id` dan `role`. Setiap request terproteksi mengirim header `Authorization: Bearer <token>`. Middleware `authenticate` decode token dan isi `req.user`; untuk route admin ada middleware `isAdmin` yang cek `req.user.role === 'admin'`.

---

## 2. Peta Route (URL → Halaman → Proteksi)

Semua route didefinisikan di **`frontend/src/App.jsx`**:

| URL | Komponen | Proteksi | Keterangan |
|-----|----------|----------|------------|
| `/` | `Home` | Public | Landing + list barang (lost/found/resolved), search. |
| `/login` | `Login` | Public | Form email + password; mode User / Admin (UI saja, backend tetap satu endpoint). |
| `/register` | `Register` | Public | Form nama, email, password. Hanya buat user biasa. |
| `/dashboard` | `Dashboard` | Protected (user) | Dashboard user: list barang + sidebar (Home, My Reports, All Items) + link Report Lost/Found. |
| `/report-lost` | `ReportLost` | Protected (user) | Form lapor barang hilang + upload foto (optional). |
| `/report-found` | `ReportFound` | Protected (user) | Form lapor barang ditemukan + upload foto (optional). |
| `/my-reports` | `MyReports` | Protected (user) | Daftar laporan milik user (lost + found). |
| `/admin` | `AdminDashboard` | Protected + Admin | Tab Manage Reports & Manage Users; approve/reject, resolve, edit, delete, statistik. |

**Proteksi di frontend:** Komponen `ProtectedRoute` (di `App.jsx`) pakai `useAuth()`. Kalau `loading` → tampil "Loading...". Kalau `!user` → `<Navigate to="/login" />`. Kalau `requireAdmin && user.role !== 'admin'` → `<Navigate to="/dashboard" />`. Kalau lolos → render `children` (halaman yang diminta).

---

## 3. Alur Autentikasi (Register, Login, Token, Logout)

### 3.1 Awal buka aplikasi

1. User buka **http://localhost:3000** (atau domain production).
2. **`main.jsx`** render `<App />`. **`App.jsx`** bungkus dengan `<AuthProvider>` dan `<Router>`.
3. **`AuthContext`** di-mount: `useEffect` baca `localStorage` (`token`, `user`). Kalau ada, `setUser(JSON.parse(storedUser))` dan `setToken(storedToken)`. Lalu `setLoading(false)`.
4. **`AppContent`** render route sesuai URL. **Navbar** pakai `useAuth()`: kalau `user` ada tampil Dashboard / My Reports (atau Admin Panel kalau admin) + Logout; kalau tidak tampil Sign In / Sign Up.

### 3.2 Register (guest → user)

1. User buka **`/register`**, isi nama, email, password, submit.
2. **`Register.jsx`** panggil `register(form.name, form.email, form.password)` dari **AuthContext**.
3. **AuthContext.register**:
   - `api.post("/auth/register", { name, email, password })` → **Backend** `POST /api/auth/register` → **authRoutes** → **authController.register**.
   - Backend: validasi (termasuk tolak `role` selain user), cek email belum dipakai, hash password (bcrypt), `User.create(..., "user")` → DB.
   - Response 201 → frontend lanjut **auto login**: `login(email, password)`.
4. **AuthContext.login**:
   - `api.post("/auth/login", { email, password })` → **Backend** `POST /api/auth/login` → **authController.login**.
   - Backend: `User.findByEmail`, bcrypt.compare, `jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "7d" })`, kirim `{ token, user }`.
   - Frontend: `localStorage.setItem("token", token)`, `localStorage.setItem("user", JSON.stringify(user))`, `setUser(user)`, `setToken(token)`.
5. **Register.jsx** dapat `result.success`, toast, lalu `navigate("/dashboard")`. **Login.jsx** tidak dipanggil; redirect ke dashboard terjadi dari Register.

### 3.3 Login (guest → user atau admin)

1. User buka **`/login`**, pilih mode User atau Admin (hanya UI), isi email + password, submit.
2. **`Login.jsx`** panggil `login(form.email, form.password)` dari **AuthContext**.
3. **AuthContext.login** → sama seperti di atas: `POST /api/auth/login` → backend kembalikan `{ token, user }` (termasuk `user.role`) → simpan ke localStorage dan state.
4. **Login.jsx** punya `useEffect` yang depend ke `user`: kalau `user` ada, `navigate("/admin", { replace: true })` kalau `user.role === "admin"`, else `navigate("/dashboard", { replace: true })`.

Jadi setelah login, user biasa masuk **Dashboard**, admin masuk **Admin**.

### 3.4 Setiap request terproteksi (token di header)

- **`frontend/src/api.js`**: Axios instance pakai `baseURL` (dev: `http://localhost:5000/api`). **Request interceptor** baca `localStorage.getItem("token")` dan set `config.headers.Authorization = "Bearer " + token` untuk setiap request.
- Backend **authMiddleware**: baca `req.headers.authorization`, ambil token, `jwt.verify(token, JWT_SECRET)`, load user dari DB by `payload.id`, set `req.user`. Kalau token tidak ada/invalid/expired → 401.
- **Response interceptor** di `api.js`: kalau response 401, hapus token & user dari localStorage dan `window.location.href = "/login"`.

### 3.5 Logout

1. User klik **Logout** di **Navbar** (atau di sidebar admin).
2. **Navbar** panggil `logout()` dari **AuthContext** lalu `navigate("/login")`.
3. **AuthContext.logout**: `localStorage.removeItem("token")`, `localStorage.removeItem("user")`, `setUser(null)`, `setToken(null)`, `window.location.href = "/login"` (redirect ganda dengan navigate, tidak masalah).

---

## 4. Alur Per Halaman (User & Guest)

### 4.1 Home (`/`)

- **Component:** `Home.jsx`.
- **API:** `GET /api/items` (public, tidak pakai token). Backend **itemRoutes** `GET /` → **itemController.getAll** → **Item.findAllPublic()** (hanya `validation_status = 'approved'`, plus filter resolved & 24 jam).
- **Frontend:** `fetchItems()` di `useEffect`, filter di client jadi `lostItems`, `foundItems`, `resolvedItems`, plus search by name/description/location. Tampil **CardItem** per kategori.
- **Guest:** Bisa buka dan lihat list. Link "Find your stuff here" → `/register`, "Sign In" → `/login`.

### 4.2 Dashboard (`/dashboard`) — user saja

- **Component:** `Dashboard.jsx`. **ProtectedRoute** wajib login; kalau bukan admin dan akses `/admin` akan di-redirect ke sini.
- **API:** `GET /api/items` (sama seperti Home; token ikut karena interceptor). Data yang dipakai: list barang approved untuk tampil di dashboard (lost/found/resolved).
- **Frontend:** Sidebar (Home, My Report, All Items), user dari `localStorage`, search, link "I just lost my stuff" → `/report-lost`, "I found someone stuff" → `/report-found`. Tampil **CardItem** (showDelete=false).

### 4.3 Report Lost (`/report-lost`) — user saja

- **Component:** `ReportLost.jsx`. Form: name, description, location, date_occured, file (optional).
- **Submit:** `FormData` dengan field name, description, location, date_occured, status = `"lost"`, dan `image` (file) kalau ada. **Tidak** set header `Content-Type` manual (biar axios set boundary untuk multipart).
- **API:** `POST /api/items/lost` dengan **authenticate** + **upload.single("image")** → **itemController.createItem**. Backend ambil `req.user.id`, simpan file lewat Multer, **Item.create(userId, name, description, location, date_occured, image, "lost")** → DB (`validation_status = 'pending'`).
- **Frontend:** Toast sukses, `navigate("/dashboard")`.

### 4.4 Report Found (`/report-found`) — user saja

- Sama seperti Report Lost, tapi `status = "found"` dan endpoint **`POST /api/items/found`**. Backend tetap **itemController.createItem** (status dari body).

### 4.5 My Reports (`/my-reports`) — user saja

- **Component:** `MyReports.jsx`.
- **API:** `GET /api/items/my-reports` dengan **authenticate** → **itemController.getMyReports** → **Item.findByUserId(req.user.id)**.
- **Frontend:** Tampil list lost vs found milik user, pakai **CardItem** (showDelete=false). Link ke Report Lost / Report Found.

---

## 5. Alur Admin (`/admin`)

- **Component:** `AdminDashboard.jsx`. **ProtectedRoute** dengan `requireAdmin={true}`: kalau bukan admin → redirect ke `/dashboard`. Ada lagi pengecekan di `useEffect`: baca `localStorage` user, kalau bukan admin atau belum login → toast + navigate.
- **API yang dipanggil sekali saat load:**
  - `GET /api/admin/items` → **adminController.getAllItems** → **Item.findAll()** (semua status).
  - `GET /api/admin/users` → **adminController.getAllUsers** → **User.findAll()**.
  - `GET /api/admin/statistics` → **adminController.getStatistics** (query COUNT ke DB).
- **Aksi admin (dari kode):**
  - **Approve / Reject:** `PUT /api/admin/items/:id/validate` body `{ validation_status: "approved" | "rejected" }` → **adminController.updateValidationStatus** → **Item.updateValidationStatus**.
  - **Mark as Resolved:** `PUT /api/admin/items/:id/resolve` body `{ resolved_note }` → **adminController.markAsResolved** → **Item.markAsResolved**.
  - **Edit item:** `PUT /api/admin/items/:id` dengan FormData (termasuk image optional) → **adminController.updateItem** → **Item.update** + **Item.updateValidationStatus** kalau ada.
  - **Delete item:** `DELETE /api/admin/items/:id` → **adminController.deleteItem** → **Item.delete**.
  - **Delete user:** `DELETE /api/admin/users/:id` → **adminController.deleteUser** → **User.delete** (admin tidak bisa hapus diri sendiri).
- **Tab:** Manage Reports (filter all/pending/approved/rejected) dan Manage Users (tabel + delete). Link "Add Lost Report" / "Add Found Report" ke `/report-lost` dan `/report-found` (tetap pakai form user, dengan token admin).

---

## 6. Ringkasan: Request API per aksi user

| Aksi user | Frontend (file + method) | API endpoint | Backend route → controller | Auth |
|-----------|---------------------------|-------------|----------------------------|------|
| Lihat list barang (Home/Dashboard) | Home/Dashboard, `api.get("/items")` | GET /api/items | itemRoutes `/` → itemController.getAll | - |
| Daftar akun | AuthContext, `api.post("/auth/register")` | POST /api/auth/register | authRoutes /register → authController.register | - |
| Login | AuthContext, `api.post("/auth/login")` | POST /api/auth/login | authRoutes /login → authController.login | - |
| Lihat laporan saya | MyReports, `api.get("/items/my-reports")` | GET /api/items/my-reports | itemRoutes, authenticate → itemController.getMyReports | Bearer |
| Lapor barang hilang | ReportLost, `api.post("/items/lost", FormData)` | POST /api/items/lost | itemRoutes, authenticate + upload → itemController.createItem | Bearer |
| Lapor barang ditemukan | ReportFound, `api.post("/items/found", FormData)` | POST /api/items/found | itemRoutes, authenticate + upload → itemController.createItem | Bearer |
| Admin: list items/users/stats | AdminDashboard, `api.get("/admin/items")` dll. | GET /api/admin/* | adminRoutes, authenticate + isAdmin → adminController | Bearer |
| Admin: approve/reject | AdminDashboard, `api.put("/admin/items/:id/validate")` | PUT /api/admin/items/:id/validate | adminRoutes → adminController.updateValidationStatus | Bearer |
| Admin: resolve | AdminDashboard, `api.put("/admin/items/:id/resolve")` | PUT /api/admin/items/:id/resolve | adminRoutes → adminController.markAsResolved | Bearer |
| Admin: edit/delete item, delete user | AdminDashboard, `api.put` / `api.delete` | PUT/DELETE /api/admin/... | adminRoutes → adminController | Bearer |

---

## 7. Urutan khas pakai aplikasi (narrative)

**Guest:** Buka Home → lihat barang lost/found/resolved → Sign Up → isi form register → otomatis login → masuk Dashboard → bisa Report Lost/Found, buka My Reports.

**User yang sudah punya akun:** Login di `/login` (mode User) → redirect ke Dashboard → bisa ke My Reports, Report Lost, Report Found, atau kembali ke Home (All Items).

**Admin:** Login di `/login` (mode Admin) → redirect ke `/admin` → lihat statistik, tab Manage Reports (approve/reject/resolve/edit/delete), tab Manage Users (delete user). Bisa juga lewat Navbar klik Admin Panel.

**Logout:** Klik Logout di Navbar (atau sidebar admin) → token & user dihapus → redirect ke `/login`.

Dokumen ini sepenuhnya didasarkan pada kode di repo (App.jsx, AuthContext, api.js, backend routes & controllers). Untuk detail implementasi tiap fungsi, lihat file yang disebutkan di tabel dan di bagian alur.
