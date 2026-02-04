# System Flow & User Flow — Lengkap dan Rinci

Dokumen ini berisi **alur sistem** (dari request sampai database dan balik) serta **alur user** (setiap langkah yang dilakukan user di tiap peran). Semua mengacu ke kode di repo.

---

# BAGIAN A: SISTEM FLOW

## A.1 Arsitektur Sistem (High-Level)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER (User)                                  │
│  http://localhost:3000  →  React (Vite)  →  Halaman (Home, Login, dll.)    │
└─────────────────────────────────────────────────────────────────────────────┘
                    │
                    │  HTTP (fetch/axios)
                    │  • GET/POST/PUT/DELETE
                    │  • Header: Authorization: Bearer <token> (jika login)
                    │  • Body: JSON atau FormData (upload file)
                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)  :5000                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Middleware  │→ │   Routes    │→ │ Controllers │→ │ Models (query DB)   │ │
│  │ helmet,cors,│  │ /api/auth  │  │ auth, item, │  │ User, Item           │ │
│  │ rateLimit,  │  │ /api/items  │  │ admin       │  │ pool.query(...)      │ │
│  │ json,       │  │ /api/admin  │  │             │  │                      │ │
│  │ authenticate│  │             │  │             │  │                      │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                                              │
│  Static: GET /uploads/*  →  file dari folder uploads/                        │
└─────────────────────────────────────────────────────────────────────────────┘
                    │
                    │  MySQL (mysql2 pool)
                    │  • SELECT, INSERT, UPDATE, DELETE
                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE (MySQL)  :3306                             │
│  Tabel: users (id, name, email, password, role, created_at, updated_at)     │
│  Tabel: items (id, user_id, name, description, location, date_occured,      │
│                image, status, validation_status, resolved_at, resolved_note│
│                created_at, updated_at)                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## A.2 Urutan Middleware di Backend (Setiap Request)

Setiap request HTTP ke backend melewati middleware berikut **berurutan** (sesuai `server.js`):

| No | Middleware | File / sumber | Fungsi |
|----|------------|----------------|--------|
| 1 | helmet() | server.js | Set header keamanan (XSS, clickjacking, dll.). |
| 2 | rateLimit | server.js | Batas 100 request per 15 menit per IP; lebih dari itu → 429 + message. |
| 3 | cors() | server.js | Izinkan origin dari FRONTEND_URL (default localhost:3000); credentials: true. |
| 4 | express.json() | server.js | Parse body JSON → req.body. |
| 5 | express.urlencoded({ extended: true }) | server.js | Parse body form-urlencoded → req.body. |
| 6 | Route match | server.js | Request cocok ke salah satu: GET /, /api/auth/*, /api/items/*, /api/admin/*, /uploads/*. |

Untuk **route tertentu** ada middleware tambahan **sebelum** controller:

- **`/api/items/my-reports`**, **`/api/items/lost`**, **`/api/items/found`**, **`/api/items/:id`** (PUT, DELETE):  
  `authenticate` → cek header Authorization, verify JWT, isi `req.user`. Kalau gagal → 401, controller tidak dipanggil.
- **`/api/items/lost`**, **`/api/items/found`**, **`/api/items/:id`** (PUT):  
  `upload.single("image")` (Multer) → simpan file ke disk, isi `req.file` (filename, path, dll.).
- **Semua `/api/admin/*`**:  
  `authenticate` lalu `isAdmin` (cek `req.user.role === 'admin'`). Kalau bukan admin → 403.

Setelah semua middleware lolos, request sampai ke **controller** (authController, itemController, adminController). Controller memanggil **model** (User, Item); model memakai **pool** (config/db.js) untuk query ke MySQL.

---

## A.3 Alur Satu Request dari Frontend ke Database (Umum)

1. **User aksi di browser** (klik, submit form, buka URL).
2. **Komponen React** memanggil `api.get(...)` atau `api.post(...)` (dari `frontend/src/api.js`).
3. **Axios request interceptor** jalan: ambil `localStorage.getItem("token")`, set `headers.Authorization = "Bearer " + token` (jika token ada).
4. **HTTP request** keluar ke backend: method, URL (baseURL + path), headers, body.
5. **Backend** terima request → middleware global (helmet, rateLimit, cors, json, urlencoded) → route match.
6. **Kalau route terproteksi:** middleware `authenticate` (dan kalau admin, `isAdmin`) jalan. Gagal → response 401/403, selesai.
7. **Controller** jalan: baca `req.body`, `req.params`, `req.user`, `req.file` → panggil **model** (User.xxx, Item.xxx).
8. **Model** jalankan `pool.query(SQL, params)` → **MySQL** eksekusi query → hasil dikembalikan ke model → ke controller.
9. **Controller** kirim `res.status(xxx).json(...)` ke frontend.
10. **Frontend:** kalau status 401, **response interceptor** hapus token & user, redirect ke `/login`. Kalau sukses, promise resolve, komponen set state (misalnya setItems, setUser) dan UI update.

---

## A.4 Daftar Lengkap Endpoint API

Semua endpoint yang dipakai aplikasi, beserta method, auth, body, dan response (dari kode).

### A.4.1 Auth (`/api/auth`)

| Method | Path | Auth | Request body | Response sukses | Response error |
|--------|------|------|--------------|-----------------|----------------|
| POST | /api/auth/register | Tidak | `{ name, email, password }` | 201 `{ message, userId }` | 400 Missing fields / Email exists; 403 role selain user; 500 |
| POST | /api/auth/login | Tidak | `{ email, password }` | 200 `{ token, user: { id, name, email, role } }` | 400 Invalid credentials; 500 |

### A.4.2 Items (`/api/items`)

| Method | Path | Auth | Request body / note | Response sukses | Response error |
|--------|------|------|----------------------|-----------------|----------------|
| GET | /api/items | Tidak | - | 200 array items (hanya approved, filter resolved 24 jam) | 500 |
| GET | /api/items/my-reports | Bearer | - | 200 array items (by user_id dari token) | 401; 500 |
| GET | /api/items/:id | Tidak | - | 200 satu item | 404 Not found; 500 |
| POST | /api/items/lost | Bearer + upload | FormData: name, description, location, date_occured, image (file), status=lost | 201 `{ message, id }` | 401; 500 |
| POST | /api/items/found | Bearer + upload | FormData: name, description, location, date_occured, image (file), status=found | 201 `{ message, id }` | 401; 500 |
| PUT | /api/items/:id | Bearer + upload (opsional) | FormData: name, description, location, date_occured, status, image (file) | 200 `{ message }` | 403 (bukan pemilik); 404; 400 No fields to update; 500 |
| DELETE | /api/items/:id | Bearer | - | 200 `{ message }` | 403 (bukan admin); 404; 500 |

### A.4.3 Admin (`/api/admin`)

| Method | Path | Auth | Request body / note | Response sukses | Response error |
|--------|------|------|----------------------|-----------------|----------------|
| GET | /api/admin/users | Bearer + admin | - | 200 array users (id, name, email, role, created_at) | 401; 403; 500 |
| GET | /api/admin/items | Bearer + admin | - | 200 array items (semua status, + reporter) | 401; 403; 500 |
| GET | /api/admin/statistics | Bearer + admin | - | 200 `{ totalUsers, totalItems, totalLost, totalFound, totalPending, totalApproved }` | 401; 403; 500 |
| DELETE | /api/admin/users/:id | Bearer + admin | - | 200 `{ message }` | 400 Cannot delete yourself; 404; 401; 403; 500 |
| POST | /api/admin/items | Bearer + admin + upload | FormData: name, description, location, date_occured, status, image, validation_status, user_id (opsional) | 201 `{ message, id }` | 401; 403; 500 |
| PUT | /api/admin/items/:id | Bearer + admin + upload | FormData: name, description, location, date_occured, status, validation_status, image (opsional) | 200 `{ message }` | 404; 400; 401; 403; 500 |
| PUT | /api/admin/items/:id/validate | Bearer + admin | `{ validation_status: "pending" \| "approved" \| "rejected" }` | 200 `{ message }` | 400 Invalid status; 404; 401; 403; 500 |
| PUT | /api/admin/items/:id/resolve | Bearer + admin | `{ resolved_note }` (opsional) | 200 `{ message }` | 404; 401; 403; 500 |
| DELETE | /api/admin/items/:id | Bearer + admin | - | 200 `{ message }` | 404; 401; 403; 500 |

### A.4.4 Static (bukan API JSON)

| Method | Path | Auth | Response |
|--------|------|------|----------|
| GET | /uploads/:filename | Tidak | File gambar (dengan header Cross-Origin-Resource-Policy: cross-origin). |

---

## A.5 System Flow Per Fitur (Step-by-Step)

### A.5.1 Aplikasi Pertama Kali Dibuka (Load Awal)

| Step | Lapisan | Yang terjadi (dari kode) |
|------|---------|---------------------------|
| 1 | Browser | User buka http://localhost:3000. Browser minta document ke Vite dev server. |
| 2 | Frontend | index.html load → script main.jsx load. ReactDOM.createRoot(#root).render(<App />). |
| 3 | Frontend | App.jsx render: AuthProvider → Router → AppContent. AuthProvider mount → AuthContext run. |
| 4 | Frontend | AuthContext useEffect([]): localStorage.getItem("user"), getItem("token"). Jika ada: setUser(JSON.parse(storedUser)), setToken(storedToken). setLoading(false). |
| 5 | Frontend | Router cocokkan URL (misalnya /) ke Route path="/" → element <Home />. AppContent render: !isAdminPage → Navbar; main → Routes; !isAdminPage → Footer. |
| 6 | Frontend | Navbar useAuth(): user ada atau tidak → tampil link berbeda (Sign In/Sign Up vs Dashboard, My Reports, Logout). |
| 7 | Frontend | Home.jsx mount → useEffect([]) → fetchItems() → api.get("/items"). Tidak pakai token (endpoint public). |
| 8 | Backend | Request GET /api/items. Middleware global jalan. Route: app.use("/api/items", itemRoutes) → itemRoutes GET / → itemController.getAll (tanpa authenticate). |
| 9 | Backend | itemController.getAll() → Item.findAllPublic() → pool.query(SELECT ... WHERE validation_status='approved' AND (resolved_at IS NULL OR resolved_at > NOW()-24h) ...). |
| 10 | Database | MySQL return rows. Model return ke controller. Controller res.json(items). |
| 11 | Frontend | Axios terima response 200. fetchItems setItems(response.data). Home filter lostItems, foundItems, resolvedItems di client. Render CardItem untuk tiap kategori. |

Tidak ada login; tidak ada token. Hanya GET /api/items yang dipanggil.

---

### A.5.2 Register (Guest → User)

| Step | Lapisan | Yang terjadi (dari kode) |
|------|---------|---------------------------|
| 1 | User | Buka /register, isi name, email, password, klik Submit. |
| 2 | Frontend | Register.jsx submit(e): e.preventDefault(); validasi form; setLoading(true); register(form.name, form.email, form.password) dari useAuth(). |
| 3 | Frontend | AuthContext.register(): api.post("/auth/register", { name, email, password }). Tidak ada header Authorization (belum login). |
| 4 | Backend | POST /api/auth/register. Middleware global. Route authRoutes POST /register → authController.register. |
| 5 | Backend | authController.register: ambil name, email, password (tolak role selain "user"); validasi ada field; User.emailExists(email) → pool.query(SELECT id FROM users WHERE email=?). |
| 6 | Database | Return rows. Jika length>0 → res.status(400).json({ message: "Email exists" }). |
| 7 | Backend | Jika email belum ada: bcrypt.hash(password, 10) → hashedPassword. User.create(name, email, hashedPassword, "user") → pool.query(INSERT INTO users ...). Return insertId. |
| 8 | Backend | res.status(201).json({ message: "Registered", userId }). |
| 9 | Frontend | AuthContext.register dapat 201. Lanjut login(email, password): api.post("/auth/login", { email, password }). |
| 10 | Backend | POST /api/auth/login → authController.login: User.findByEmail(email) → SELECT * FROM users WHERE email=?; bcrypt.compare(password, user.password); jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" }); res.json({ token, user: { id, name, email, role } }). |
| 11 | Frontend | AuthContext.login dapat { token, user }. localStorage.setItem("token", token); setItem("user", JSON.stringify(user)); setUser(user); setToken(token). Return { success: true }. |
| 12 | Frontend | Register.jsx dapat result.success. toast.success; navigate("/dashboard"). React Router ganti URL → Dashboard mount (ProtectedRoute sudah lolos karena user ada). |

---

### A.5.3 Login (Guest → User atau Admin)

| Step | Lapisan | Yang terjadi (dari kode) |
|------|---------|---------------------------|
| 1 | User | Buka /login, pilih mode User/Admin (UI), isi email & password, klik Sign In. |
| 2 | Frontend | Login.jsx submit: login(form.email, form.password) dari useAuth(). |
| 3 | Frontend | AuthContext.login(): api.post("/auth/login", { email, password }). |
| 4 | Backend | POST /api/auth/login → authController.login (sama seperti di Register langkah 10). Return { token, user }. |
| 5 | Frontend | Simpan token & user ke localStorage dan state. Return { success: true }. Login.jsx toast.success. useEffect([user, navigate]) jalan: user ada → jika user.role==='admin' navigate("/admin", replace), else navigate("/dashboard", replace). |

---

### A.5.4 Lihat My Reports (User Sudah Login)

| Step | Lapisan | Yang terjadi (dari kode) |
|------|---------|---------------------------|
| 1 | User | Klik "My Reports" di Navbar (atau akses /my-reports). |
| 2 | Frontend | Router path /my-reports → ProtectedRoute. useAuth(): user ada → render MyReports. |
| 3 | Frontend | MyReports.jsx useEffect: fetchMyReports() → api.get("/items/my-reports"). Request interceptor set Authorization: Bearer <token>. |
| 4 | Backend | GET /api/items/my-reports. itemRoutes: authenticate → itemController.getMyReports. authenticate: ambil token dari header, jwt.verify, pool.query(SELECT ... FROM users WHERE id=?), req.user = rows[0], next(). |
| 5 | Backend | itemController.getMyReports: userId = req.user.id. Item.findByUserId(userId) → pool.query(SELECT i.*, u.name as reporter FROM items i JOIN users u ON i.user_id=u.id WHERE i.user_id=? ORDER BY created_at DESC). |
| 6 | Backend | res.json(items). |
| 7 | Frontend | setItems(response.data). Filter lostItems, foundItems. Render CardItem untuk tiap item. Gambar: src = baseURL + "/uploads/" + item.image (baseURL dari env atau localhost:5000). |

---

### A.5.5 Submit Report Lost (User)

| Step | Lapisan | Yang terjadi (dari kode) |
|------|---------|---------------------------|
| 1 | User | Dari Dashboard atau Navbar ke /report-lost. Isi form (name, description, location, date_occured, optional file). Klik Submit Report. |
| 2 | Frontend | ReportLost.jsx submit: FormData append name, description, location, date_occured, status="lost", image (file jika ada). api.post("/items/lost", data) — tanpa set Content-Type (axios set boundary otomatis). Token dari interceptor. |
| 3 | Backend | POST /api/items/lost. itemRoutes: authenticate → upload.single("image") → itemController.createItem. authenticate isi req.user. Multer simpan file ke UPLOAD_DIR, req.file = { filename, ... }. |
| 4 | Backend | itemController.createItem: userId = req.user.id; name, description, location, date_occured, status dari req.body; image = req.file ? req.file.filename : null. Item.create(userId, name, description, location, date_occured, image, status||"lost") → INSERT INTO items (..., validation_status='pending'). Return insertId. |
| 5 | Backend | res.status(201).json({ message: "Item created", id }). |
| 6 | Frontend | toast.success; navigate("/dashboard"). |

---

### A.5.6 Admin Buka Dashboard & Approve/Reject

| Step | Lapisan | Yang terjadi (dari kode) |
|------|---------|---------------------------|
| 1 | User | Login sebagai admin → redirect /admin. AdminDashboard mount. |
| 2 | Frontend | AdminDashboard useEffect: fetchData() → Promise.all([ api.get("/admin/items"), api.get("/admin/users"), api.get("/admin/statistics") ]). Semua dengan header Bearer token. |
| 3 | Backend | GET /api/admin/items: authenticate → isAdmin → adminController.getAllItems → Item.findAll() (semua status). GET /api/admin/users → User.findAll(). GET /api/admin/statistics → pool.query COUNT users, COUNT items, COUNT by status. |
| 4 | Frontend | setItems, setUsers, setStatistics. Render tab Items (filter all/pending/approved/rejected), tab Users. |
| 5 | User | Klik Approve pada satu item. |
| 6 | Frontend | handleValidationStatus(itemId, "approved") → api.put(`/admin/items/${itemId}/validate`, { validation_status: "approved" }). |
| 7 | Backend | PUT /api/admin/items/:id/validate. authenticate → isAdmin → adminController.updateValidationStatus. Validasi validation_status in ["pending","approved","rejected"]; Item.findById(id); Item.updateValidationStatus(id, validation_status) → UPDATE items SET validation_status=? WHERE id=?. res.json({ message }). |
| 8 | Frontend | toast.success; fetchData() lagi → list ter-update. |

Flow untuk Reject, Mark as Resolved, Edit, Delete item, Delete user mengikuti pola yang sama: aksi di UI → api.put/delete dengan path dan body sesuai tabel endpoint → backend route → middleware → controller → model → DB → response → frontend update state / refetch.

---

# BAGIAN B: USER FLOW (Rinci Per Peran)

## B.1 Guest (Belum Login)

Setiap langkah: aksi user → tampilan → request (jika ada) → response → perubahan tampilan/state.

| # | Aksi user | URL / layar | Yang tampil | Request API (jika ada) | Response | Perubahan setelah |
|---|-----------|-------------|-------------|------------------------|----------|--------------------|
| 1 | Buka aplikasi | / | Home | GET /api/items | 200 [items] | List Lost Items, Found Items, Resolved (jika ada). Search box. Tombol "Find your stuff here", "Sign In". |
| 2 | Ketik di search | / | Home | - | - | List difilter di client (filterItems) by name/description/location. |
| 3 | Klik "Find your stuff here" | /register | Register | - | - | Form: Full Name, Email, Password. Note: admin dibuat manual. Tombol Sign Up, link Sign In. |
| 4 | Isi form daftar & Submit | /register | Register | POST /api/auth/register | 201 atau 400/403 | Jika 201: lanjut auto login (POST /api/auth/login) → token & user disimpan → redirect /dashboard (jadi User flow). Jika error: pesan error, tetap di form. |
| 5 | Klik "Sign In" | /login | Login | - | - | Form email, password. Toggle User/Admin. Tombol Sign In, link Sign Up (mode User). |
| 6 | Isi email & password (mode User) & Sign In | /login | Login | POST /api/auth/login | 200 { token, user } atau 400 | Jika 200: token & user disimpan, redirect /dashboard. Jika 400: pesan Invalid credentials. |
| 7 | Isi email & password (mode Admin) & Sign In | /login | Login | POST /api/auth/login | 200 { token, user } | Jika role admin: redirect /admin. Jika role user: redirect /dashboard. |

Guest tidak bisa akses /dashboard, /report-lost, /report-found, /my-reports, /admin. Jika nekat buka URL itu, ProtectedRoute akan redirect ke /login.

---

## B.2 User (Sudah Login, Role user)

Asumsi: user sudah login (token dan user di localStorage dan AuthContext).

| # | Aksi user | URL / layar | Yang tampil | Request API (jika ada) | Response | Perubahan setelah |
|---|-----------|-------------|-------------|------------------------|----------|--------------------|
| 1 | Setelah login (bukan admin) | /dashboard | Dashboard | GET /api/items | 200 [items] | Sidebar: Home, My Report, All Items. Header: nama user, tombol Lost/Found. Section Lost Items, Found Items, Resolved (CardItem). |
| 2 | Klik "Home" di Navbar | / | Home | GET /api/items | 200 [items] | Sama seperti Guest di Home, tapi Navbar tampil Dashboard, My Reports, nama user, Logout. |
| 3 | Klik "Dashboard" di Navbar | /dashboard | Dashboard | GET /api/items | 200 [items] | List barang + sidebar. |
| 4 | Klik "My Reports" | /my-reports | My Reports | GET /api/items/my-reports | 200 [items] | List laporan milik user (lost & found). Tombol Report Lost Item, Report Found Item. CardItem per item (dengan placeholder jika tanpa foto). |
| 5 | Klik "I just lost my stuff" atau "Report Lost Item" | /report-lost | Report Lost | - | - | Form: Item Name, Description, Last Known Location, Date Lost, Item Photo (optional). Submit Report, Cancel. |
| 6 | Isi form Report Lost & Submit | /report-lost | - | POST /api/items/lost (FormData + Bearer) | 201 { message, id } | toast success; navigate /dashboard. Item baru di DB dengan validation_status=pending (tidak muncul di Home sampai di-approve admin). |
| 7 | Klik "I found someone stuff" atau "Report Found Item" | /report-found | Report Found | - | - | Form mirip Report Lost; label Found Location. status=found. |
| 8 | Isi form Report Found & Submit | /report-found | - | POST /api/items/found (FormData + Bearer) | 201 | toast success; navigate /dashboard. |
| 9 | Klik "All Items" di sidebar (Dashboard) | / | Home | GET /api/items | 200 | Sama seperti Home (list public). |
| 10 | Klik Logout | - | - | - | - | AuthContext.logout: hapus token & user; window.location.href="/login". Layar jadi /login. |

Jika token expired atau invalid: request terproteksi return 401 → response interceptor hapus token & user, redirect /login.

---

## B.3 Admin (Sudah Login, Role admin)

| # | Aksi user | URL / layar | Yang tampil | Request API (jika ada) | Response | Perubahan setelah |
|---|-----------|-------------|-------------|------------------------|----------|--------------------|
| 1 | Login sebagai admin | /admin | Admin Dashboard | GET /api/admin/items, GET /api/admin/users, GET /api/admin/statistics | 200 masing-masing | Statistik: Total Users, Total Reports, Pending, Approved. Tab: Manage Reports, Manage Users. Sidebar: Manage Reports, Manage Users. |
| 2 | Di tab Manage Reports | /admin | Admin Dashboard | - | - | Filter: All, Pending, Approved, Rejected. List card item + badge validation_status + tombol Approve/Reject (jika pending), Mark as Resolved (jika approved), Edit, Delete. |
| 3 | Klik Approve pada item | /admin | - | PUT /api/admin/items/:id/validate { validation_status: "approved" } | 200 | toast success; fetchData() → list refresh. Item itu sekarang validation_status=approved (bisa muncul di Home). |
| 4 | Klik Reject pada item | /admin | - | PUT /api/admin/items/:id/validate { validation_status: "rejected" } | 200 | toast success; fetchData(). Item tidak akan muncul di Home. |
| 5 | Klik Mark as Resolved | /admin | Modal | - | - | Modal: input resolved_note (optional). Tombol Cancel, Mark as Resolved. |
| 6 | Isi note & Mark as Resolved | /admin | - | PUT /api/admin/items/:id/resolve { resolved_note } | 200 | Modal tutup; fetchData(). Item dapat resolved_at, resolved_note. Di public, item tetap muncul sampai 24 jam setelah resolved. |
| 7 | Klik Edit pada item | /admin | Modal Edit | - | - | Modal form: name, description, location, date_occured, status, validation_status, image (optional). Prefill dari item. |
| 8 | Ubah field & Save | /admin | - | PUT /api/admin/items/:id (FormData) | 200 | Modal tutup; fetchData(). |
| 9 | Klik Delete pada item | /admin | - | confirm() → DELETE /api/admin/items/:id | 200 | toast success; fetchData(). Item hilang dari DB. |
| 10 | Klik tab Manage Users | /admin | Admin Dashboard | (data users sudah di-load awal) | - | Tabel: ID, Name, Email, Role, Registered Date, Action (Delete). Tombol Delete per user (disabled untuk admin sendiri). |
| 11 | Klik Delete user | /admin | - | confirm() → DELETE /api/admin/users/:id | 200 atau 400 | Jika bukan diri sendiri: user dihapus, cascade delete items-nya. Jika diri sendiri: 400 Cannot delete yourself. |
| 12 | Klik "Add Lost Report" / "Add Found Report" | /report-lost atau /report-found | Report Lost/Found | - | - | Form sama seperti User; token yang dipakai token admin. Item masuk dengan user_id admin (atau user_id dari body jika admin kirim). |
| 13 | Klik Logout (Navbar atau sidebar) | - | - | - | - | logout(); redirect /login. |

Admin yang buka URL /dashboard tetap bisa (ProtectedRoute allow), tapi Navbar menawarkan Admin Panel; admin yang buka /admin tanpa token akan redirect /login oleh ProtectedRoute.

---

## B.4 Diagram Alur User (Mermaid) — Ringkas

```mermaid
flowchart TD
    A[Buka Browser localhost:3000] --> B{Ada token & user di localStorage?}
    B -->|Tidak| C[Tampil Home - Guest]
    B -->|Ya| D{user.role === 'admin'?}
    D -->|Ya| E[Tampil Navbar + bisa ke /admin]
    D -->|Tidak| F[Tampil Navbar + Dashboard/My Reports]

    C --> G[Sign Up / Sign In]
    G --> H[Register → auto login → /dashboard]
    G --> I[Login → /dashboard atau /admin]

    F --> J[Dashboard: list barang, link Report Lost/Found]
    F --> K[My Reports: list laporan sendiri]
    J --> L[/report-lost atau /report-found]
    L --> M[Submit FormData] --> N[POST /api/items/lost atau /found]
    N --> O[Backend: authenticate → upload → createItem → DB]
    O --> P[Redirect /dashboard, toast]

    E --> Q[/admin: items + users + statistics]
    Q --> R[Approve/Reject/Resolve/Edit/Delete item]
    Q --> S[Delete user]
    R --> T[PUT/DELETE /api/admin/items/...]
    S --> U[DELETE /api/admin/users/:id]
    T --> V[fetchData lagi, list update]
    U --> V
```

---

## B.5 Data Yang Disimpan di Mana

| Data | Lokasi | Kapan di-set | Kapan di-hapus/diganti |
|------|--------|--------------|-------------------------|
| token (JWT string) | localStorage, state AuthContext | Setelah login/register sukses | Logout; atau response 401 (interceptor) |
| user (object: id, name, email, role) | localStorage, state AuthContext | Setelah login/register sukses | Logout; atau response 401 |
| items (array) untuk Home/Dashboard | State di Home.jsx / Dashboard.jsx | Setelah GET /api/items sukses | Setiap kali mount + fetch lagi |
| items untuk My Reports | State di MyReports.jsx | Setelah GET /api/items/my-reports sukses | Setiap kali mount + fetchMyReports |
| items, users, statistics untuk Admin | State di AdminDashboard.jsx | Setelah fetchData() (tiga GET admin) | Setelah aksi (approve/delete dll.) panggil fetchData() lagi |
| File gambar | Backend: folder uploads/ (atau volume Docker); DB: kolom items.image (filename) | POST /api/items/lost atau /found (dan admin create/update) | Tidak dihapus otomatis saat item di-delete (file tetap di disk) |

---

Dokumen ini mencakup **system flow** (arsitektur, middleware, endpoint, alur per fitur) dan **user flow** (setiap aksi per peran Guest, User, Admin) selengkap mungkin berdasarkan kode di repo. Untuk detail implementasi tiap fungsi, lihat file yang dirujuk di tabel (server.js, routes, controllers, models, AuthContext, api.js, dan halaman React).
