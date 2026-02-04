# 📄 Deep Dive Frontend — Setiap File

Dokumen ini menjelaskan **setiap file di folder frontend** (React + Vite + Tailwind) dari sudut pandang pemula: fungsi file, import, kode penting per blok, alur eksekusi, dan istilah.  
Frontend = aplikasi yang berjalan di browser; memanggil backend lewat HTTP (Axios) dan menampilkan halaman (React).

---

## index.html

### 1. Fungsi File Ini

- Satu-satunya file HTML yang diload browser. Berisi struktur dasar: `<div id="root">` (tempat React akan render) dan script yang memuat `src/main.jsx`. Juga meta viewport, title, dan font Inter.
- Dipanggil oleh: Browser saat buka situs (dev: Vite serve; prod: file ini dilayani dari dist).
- Penting: Entry HTML; tanpa ini React tidak punya tempat mount.

### 2. Import / Dependency

- Link ke Google Fonts (Inter). Tag `<script type="module" src="/src/main.jsx">` memuat entry point React. Vite mengubah `/src/main.jsx` ke path yang benar saat build.

### 3. Penjelasan Kode

- **`<div id="root"></div>`:** ReactDOM.createRoot(document.getElementById("root")) di main.jsx akan merender seluruh aplikasi ke dalam div ini.
- **`<script type="module" src="/src/main.jsx">`:** type="module" = ES module; src = entry point. Vite menangani path ini saat dev dan build.

### 4. Alur Eksekusi

Browser load HTML → load script main.jsx → main.jsx render App ke #root → React mengambil alih tampilan (SPA).

### 5. Istilah

- **SPA:** Single Page Application. Satu HTML; navigasi dan konten diganti oleh JavaScript (React Router) tanpa reload penuh.
- **Mount:** Proses React “memasang” komponen ke elemen DOM (di sini #root).

---

## package.json (frontend)

### 1. Fungsi File Ini

- Mendefinisikan nama proyek, dependency (react, react-dom, react-router-dom, axios, react-hot-toast), devDependency (Vite, Tailwind, PostCSS, DaisyUI, plugin React), dan script: dev (vite), build (vite build), preview (vite preview).
- Dipanggil oleh: npm/yarn saat install dan saat npm run dev / build.
- Penting: Tanpa dependency ini, tidak ada React/Vite; script dev/build dipakai sehari-hari.

### 2–5. (Singkat)

- **dependencies:** react, react-dom (library inti), react-router-dom (routing), axios (HTTP client), react-hot-toast (notifikasi).
- **devDependencies:** vite, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer, daisyui. Script "dev" = vite (development server), "build" = vite build (output ke dist).

---

## vite.config.js

### 1. Fungsi File Ini

- Konfigurasi Vite: plugin React, server port 3000, host 0.0.0.0 (bisa akses dari LAN), open true (buka browser otomatis), proxy /api ke http://localhost:5000 agar request dari frontend ke /api di-forward ke backend.
- Dipanggil oleh: Vite saat `npm run dev` atau `npm run build`.
- Penting: Proxy memungkinkan frontend (port 3000) memanggil backend (5000) tanpa CORS masalah di dev; production pakai baseURL yang sama atau relatif /api.

### 2. Import / Dependency

defineConfig dari "vite", react dari "@vitejs/plugin-react".

### 3. Penjelasan Kode

- **plugins: [react()]:** Agar Vite paham dan compile JSX.
- **server.port: 3000:** Dev server di http://localhost:3000.
- **server.host: "0.0.0.0":** Listen ke semua interface (bisa akses dari HP di WiFi yang sama).
- **server.proxy["/api"]:** target "http://localhost:5000", changeOrigin true. Setiap request dari browser ke http://localhost:3000/api/... akan di-forward ke http://localhost:5000/api/...

### 4. Alur Eksekusi

Vite baca config saat start. Saat request ke /api, Vite mem-forward ke backend. Build pakai config yang sama untuk resolve path dan plugin.

### 5. Istilah

- **Proxy:** Server (Vite) meneruskan request ke server lain (backend). Browser hanya bicara ke satu origin (port 3000).
- **changeOrigin:** Mengubah header Host saat proxy agar backend menerima request dengan benar.

---

## postcss.config.js

### 1. Fungsi File Ini

- Konfigurasi PostCSS: memakai plugin tailwindcss dan autoprefixer. Diperlukan agar Tailwind bisa diproses dan CSS vendor prefix otomatis ditambah.
- Dipanggil oleh: Vite saat memproses file CSS (yang pakai @tailwind).
- Penting: Tanpa ini, @tailwind di index.css tidak ter-expand.

### 2–5. (Singkat)

Export default { plugins: { tailwindcss: {}, autoprefixer: {} } }. PostCSS = pemroses CSS; Tailwind mengubah directive @tailwind menjadi utility class; autoprefixer menambah prefix -webkit-, -moz- untuk kompatibilitas browser.

---

## tailwind.config.js

### 1. Fungsi File Ini

- Konfigurasi Tailwind: content (file yang di-scan untuk class: index.html, src/**/*.jsx/tsx), theme extend (warna primary, accent, font), plugin DaisyUI dengan tema light (warna disesuaikan).
- Dipanggil oleh: Tailwind (via PostCSS) saat build/compile CSS.
- Penting: Menentukan warna dan font yang dipakai di seluruh UI (primary, accent, font-display).

### 2. Import / Dependency

Tidak ada import; export default object. Plugin require("daisyui").

### 3. Penjelasan Kode

- **content:** Hanya class yang muncul di file ini yang akan ada di CSS akhir (tree-shaking).
- **theme.extend.colors:** primary (hijau gelap), accent (hijau muda), secondary (abu). Dipakai sebagai class bg-primary, text-accent, dll.
- **theme.extend.fontFamily:** sans = Inter, display = Playfair Display (untuk heading).
- **plugins: [require("daisyui")], daisyui.themes:** Tema "light" dengan warna yang selaras.

### 4. Alur Eksekusi

Saat Vite/Tailwind proses CSS, config ini dibaca; class yang dipakai di content akan di-generate; theme dipakai untuk nilai utility (bg-primary, dll).

### 5. Istilah

- **Utility-first:** Styling dengan class kecil (margin, padding, warna) bukan satu class besar per komponen. Tailwind = utility-first.
- **Tree-shaking:** Hanya class yang benar-benar dipakai yang masuk ke CSS final.

---

## frontend/Dockerfile

### 1. Fungsi File Ini

- Build image Docker untuk frontend: Node 18 Alpine, install dependency, copy source, expose 3000, CMD npm run dev dengan --host 0.0.0.0 agar bisa diakses dari luar container.
- Dipanggil oleh: docker-compose (build context ./frontend).
- Penting: Untuk menjalankan frontend di container (development mode di compose).

### 2–5. (Singkat)

FROM node:18-alpine, WORKDIR /app, COPY package*.json, RUN npm install, COPY . ., EXPOSE 3000, CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"].

---

## src/main.jsx

### 1. Fungsi File Ini

- Entry point JavaScript/React: membuat root React dengan createRoot(document.getElementById("root")), merender komponen App (dibungkus StrictMode) dan Toaster (notifikasi), ke dalam #root.
- Dipanggil oleh: index.html (script src).
- Penting: Titik masuk React; tanpa ini tidak ada yang di-render.

### 2. Import / Dependency

| Import | Dari mana | Kenapa |
|--------|-----------|--------|
| React | "react" | Untuk JSX dan StrictMode. |
| ReactDOM | "react-dom/client" | createRoot (API React 18). |
| App | "./App" | Komponen utama (router + layout). |
| ./index.css | File CSS | Global + Tailwind. |
| Toaster | "react-hot-toast" | Notifikasi toast global. |

### 3. Penjelasan Kode

- **ReactDOM.createRoot(document.getElementById("root")):** Mengambil elemen #root dari DOM, membuat “root” React 18.
- **.render(...):** Merender isi ke root. StrictMode = mode development yang membantu deteksi side effect. App = komponen utama. Toaster position="top-right" = tempat muncul notifikasi.

### 4. Alur Eksekusi

Load → createRoot → render App + Toaster → App me-render router dan halaman sesuai URL.

### 5. Istilah

- **StrictMode:** Komponen React yang tidak render apa pun visual; hanya memicu pemeriksaan tambahan di development (double-invocation, dll).
- **Root:** Wadah tingkat atas tempat React me-render pohon komponen.

---

## src/App.jsx

### 1. Fungsi File Ini

- Komponen utama: membungkus aplikasi dengan AuthProvider (state login global), Router (React Router), lalu mendefinisikan semua Route (/, /login, /register, /dashboard, /report-lost, /report-found, /my-reports, /admin). Juga komponen ProtectedRoute yang redirect ke login jika belum login, atau ke dashboard jika akses admin tapi bukan admin. Navbar dan Footer tidak ditampilkan di halaman /admin.
- Dipanggil oleh: main.jsx.
- Penting: Pusat routing dan perlindungan halaman; siapa boleh akses halaman mana ditentukan di sini.

### 2. Import / Dependency

BrowserRouter, Routes, Route, Navigate, useLocation dari react-router-dom; Navbar, Footer; semua halaman (Home, Login, Register, Dashboard, ReportLost, ReportFound, MyReports, AdminDashboard); AuthProvider, useAuth.

### 3. Penjelasan Kode (per blok)

- **ProtectedRoute ({ children, requireAdmin = false }):**  
  Menggunakan useAuth(). Jika loading, tampil "Loading...". Jika !user, return &lt;Navigate to="/login" replace /&gt;. Jika requireAdmin dan user.role !== "admin", return &lt;Navigate to="/dashboard" replace /&gt;. Selain itu return children (halaman yang dilindungi).

- **AppContent:** useLocation(). pathname === "/admin" → isAdminPage. Return layout: jika !isAdminPage tampilkan Navbar; main berisi Routes; jika !isAdminPage tampilkan Footer. Route path="/" element={&lt;Home /&gt;} (public). Route /login, /register public. Route /dashboard, /report-lost, /report-found, /my-reports dibungkus ProtectedRoute (tanpa requireAdmin). Route /admin dibungkus ProtectedRoute requireAdmin={true} element AdminDashboard.

- **App:** Return &lt;AuthProvider&gt;&lt;Router&gt;&lt;AppContent /&gt;&lt;/Router&gt;&lt;/AuthProvider&gt;. Urutan: Provider auth dulu agar useAuth tersedia di dalam Router; Router agar useLocation/Navigate jalan; AppContent berisi route dan layout.

### 4. Alur Eksekusi

User buka URL → Router cocokkan path → jika route protected, ProtectedRoute cek user/role → tampil halaman atau redirect. Setiap navigasi (Link/redirect) → Router update, komponen halaman yang match di-render.

### 5. Istilah

- **Context (AuthProvider):** Menyediakan state (user, token, login, logout) ke semua komponen di bawahnya tanpa prop drilling.
- **Replace (Navigate):** Mengganti history sehingga tombol back tidak kembali ke halaman yang diredirect (misal login).
- **Protected route:** Route yang hanya boleh diakses jika sudah login (dan jika requireAdmin, hanya admin).

---

## src/api.js

### 1. Fungsi File Ini

- Membuat instance Axios dengan baseURL: production pakai import.meta.env.VITE_API_URL atau "/api"; development pakai "http://localhost:5000/api". Request interceptor: menambah header Authorization Bearer &lt;token&gt; dari localStorage. Response interceptor: jika 401, hapus token dan user dari localStorage dan redirect ke /login.
- Dipanggil oleh: Semua halaman dan AuthContext yang memanggil backend (login, register, get/put/delete items, admin).
- Penting: Satu titik konfigurasi HTTP; token otomatis ter-attach; logout otomatis saat token invalid (401).

### 2. Import / Dependency

Hanya axios.

### 3. Penjelasan Kode

- **axios.create({ baseURL: ... }):** baseURL = prefix untuk setiap request. PROD ? "/api" : "http://localhost:5000/api" (dev bisa pakai proxy atau langsung 5000).
- **api.interceptors.request.use((config) => { ... }):** Sebelum request dikirim: ambil localStorage.getItem("token"); jika ada, config.headers.Authorization = `Bearer ${token}`. Return config. Error handler: return Promise.reject(error).
- **api.interceptors.response.use(...):** Response sukses: return response. Response error: jika error.response?.status === 401, hapus token dan user dari localStorage, window.location.href = "/login". Lalu return Promise.reject(error).

### 4. Alur Eksekusi

Setiap api.get/post/put/delete: request interceptor tambah Authorization → kirim request → jika 401, response interceptor hapus token dan redirect → jika sukses atau error lain, return response/error ke pemanggil.

### 5. Istilah

- **Interceptor:** Fungsi yang dipanggil sebelum request dikirim atau setelah response diterima. Dipakai untuk mengubah config (tambah header) atau menangani error global (401 = logout).
- **import.meta.env:** Variabel environment yang di-set Vite. VITE_* exposed ke client; PROD = true saat build production.

---

## src/index.css

### 1. Fungsi File Ini

- File CSS global: import font (Inter, Playfair Display), directive @tailwind base/components/utilities, dan layer base (body font, warna, heading font dan warna), serta utility scrollbar-hide.
- Dipanggil oleh: main.jsx (import "./index.css").
- Penting: Memuat Tailwind dan gaya dasar (font, warna heading) untuk seluruh aplikasi.

### 2–5. (Singkat)

@tailwind base/components/utilities = sumber utility Tailwind. @layer base = aturan untuk body dan h1–h6 (font, color). @layer utilities = class .scrollbar-hide untuk menyembunyikan scrollbar. Istilah: layer = kelompok aturan Tailwind; base = default elemen HTML.

---

## src/contexts/AuthContext.jsx

### 1. Fungsi File Ini

- Context untuk state auth global: user, token, loading, login(), register(), logout(), isAuthenticated. Saat mount, baca user dan token dari localStorage; login/register memanggil API lalu menyimpan token dan user ke localStorage dan state; logout hapus localStorage dan redirect ke /login.
- Dipanggil oleh: App.jsx (AuthProvider membungkus app); useAuth() dipakai di Navbar, Login, Register, ProtectedRoute, dll.
- Penting: Satu sumber kebenaran untuk “siapa yang login”; semua halaman dan Navbar pakai useAuth().

### 2. Import / Dependency

createContext, useState, useEffect dari "react"; api dari "../api".

### 3. Penjelasan Kode

- **createContext():** Membuat objek context. AuthContext.Provider nanti akan menyediakan value ke anak-anaknya.
- **AuthProvider ({ children }):** useState untuk user (null), token (dari localStorage), loading (true). useEffect([]): baca localStorage "user" dan "token"; jika ada, setUser(JSON.parse(storedUser)), setToken(storedToken). setLoading(false). Dependency [] = jalan sekali saat mount.
- **login(email, password):** api.post("/auth/login", { email, password }). Dari response: localStorage.setItem("token", token), setItem("user", JSON.stringify(user)); setToken, setUser. Return { success: true }. Catch: return { success: false, message: error.response?.data?.message || "Login failed" }.
- **register(name, email, password):** api.post("/auth/register", ...). Lalu login(email, password). Jika login sukses return { success: true }; else return { success: true, message: "Registration successful. Please login." }. Catch return { success: false, message: ... }.
- **logout():** localStorage remove token dan user; setUser(null), setToken(null); window.location.href = "/login".
- **value = { user, token, loading, login, register, logout, isAuthenticated: !!user }.** Provider value={value}. Semua yang pakai useContext(AuthContext) dapat value ini.

### 4. Alur Eksekusi

App load → AuthProvider mount → useEffect baca localStorage → set user/token/loading → child render. Saat login/register dipanggil → API → update state + localStorage → komponen yang pakai useAuth re-render (misal Navbar tampil nama user). Logout → clear state dan localStorage → redirect.

### 5. Istilah

- **Context:** Mekanisme React untuk “meneruskan” data ke banyak komponen tanpa prop per level. Provider = yang memberi nilai; useContext = yang memakai.
- **Persist:** Menyimpan state ke localStorage agar setelah refresh halaman user tetap “login” selama token masih ada.

---

## src/hooks/useAuth.js

### 1. Fungsi File Ini

- Custom hook yang mengembalikan context AuthContext. Jika context undefined (komponen tidak di dalam AuthProvider), throw Error. Dipakai agar setiap komponen tidak perlu import AuthContext dan useContext secara terpisah.
- Dipanggil oleh: Navbar, Login, Register, App (ProtectedRoute), dll.
- Penting: Satu cara standar mengakses auth di seluruh app.

### 2. Import / Dependency

useContext dari "react", AuthContext dari "../contexts/AuthContext".

### 3. Penjelasan Kode

- **const context = useContext(AuthContext);** Mengambil value dari Provider terdekat.
- **if (!context) throw new Error("useAuth must be used within an AuthProvider");** Memastikan hook hanya dipakai di dalam AuthProvider.
- **return context;** Return object { user, token, loading, login, register, logout, isAuthenticated }.

### 4. Alur Eksekusi

Setiap komponen yang memanggil useAuth() akan dapat value terbaru dari AuthContext; saat login/logout, state berubah dan komponen itu re-render.

### 5. Istilah

- **Custom hook:** Fungsi yang memakai hook React (useState, useEffect, useContext). Namanya biasa diawali "use". Memungkinkan logika dipakai ulang.

---

## src/components/Navbar.jsx

### 1. Fungsi File Ini

- Menampilkan navbar: logo "Found It!" (link ke /), link Home, dan tergantung user: jika login dan admin → link Admin Panel + nama + Logout; jika login user → Dashboard, My Reports, nama, Logout; jika belum login → Sign In, Sign Up. Juga versi mobile (dropdown menu).
- Dipanggil oleh: App.jsx (di AppContent, kecuali di halaman /admin).
- Penting: Navigasi utama dan indikator login/admin.

### 2. Import / Dependency

Link, useNavigate dari react-router-dom; useAuth (user, logout).

### 3. Penjelasan Kode (ringkas)

- **useNavigate(), useAuth():** Navigate untuk redirect; logout dari context.
- **handleLogout:** Panggil logout() lalu navigate("/login"). (logout di context sudah redirect; navigate di sini redundant tapi aman.)
- **Logo:** Link to="/" dengan teks "Found It!".
- **Desktop:** Link Home. Conditional: user ? (role === "admin" ? Admin Panel + user name + Logout : Dashboard + My Reports + name + Logout) : Sign In + Sign Up.
- **Mobile:** Dropdown (DaisyUI) dengan item yang sama; tombol hamburger, daftar link/button di dalam dropdown.

### 4. Alur Eksekusi

Render sekali; saat user/login berubah (dari AuthContext), komponen re-render dan menampilkan link/nama yang sesuai.

### 5. Istilah

- **Conditional rendering:** Menampilkan JSX berbeda berdasarkan kondisi (user ada/tidak, role admin/user). Pakai ternary (a ? b : c) atau &&.

---

## src/components/Footer.jsx

### 1. Fungsi File Ini

- Footer sederhana: logo "Found It!", tagline, dan copyright tahun dinamis (new Date().getFullYear()). Tidak ada state atau logic.
- Dipanggil oleh: App.jsx (kecuali di /admin).
- Penting: Konsistensi branding di bawah halaman.

### 2–5. (Singkat)

Hanya JSX: div footer, container, teks. Tidak ada import khusus selain default export. Istilah: component presentational = hanya tampilan, tidak ada state/logic kompleks.

---

## src/components/CardItem.jsx

### 1. Fungsi File Ini

- Komponen kartu untuk menampilkan satu item (lost/found): gambar (atau placeholder SVG jika tidak ada/error), badge status (Resolved / Lost / Found), badge validation_status (Pending/Approved/Rejected), nama, deskripsi (truncate), lokasi, tanggal, reporter. Opsional: tombol hapus (jika showDelete dan onDelete diberikan). URL gambar: production /api, dev http://localhost:5000, path /uploads/{item.image}.
- Dipanggil oleh: Home, Dashboard, MyReports, AdminDashboard (daftar item).
- Penting: Tampilan seragam untuk setiap item di mana pun dipakai.

### 2. Import / Dependency

Tidak ada import library; hanya export default function dengan props { item, onDelete, showDelete = false }.

### 3. Penjelasan Kode (ringkas)

- **formatDate(dateString):** Return toLocaleDateString atau "-" jika kosong.
- **truncateDescription(text, maxLength):** Potong teks, tambah "..." jika panjang.
- **getStatusBadge():** Berdasarkan item.resolved_at dan item.status return { text, className } untuk Resolved / Lost / Found.
- **imageBaseUrl:** import.meta.env.PROD ? "/api" : "http://localhost:5000" agar gambar load dari backend (dev/prod).
- **Gambar:** img src=`${imageBaseUrl}/uploads/${item.image}`; onError sembunyikan img dan tampilkan placeholder. Jika tidak ada item.image, tampil placeholder saja.
- **Badge:** statusBadge + validation_status (jika ada). Tombol delete jika showDelete && onDelete, onClick={() => onDelete(item.id)}.
- **Body:** Nama (heading), deskripsi truncate, lokasi, date_occured, reporter.

### 4. Alur Eksekusi

Diberi props item (dan opsional onDelete, showDelete) → render sekali; jika item berubah (reference baru), re-render dengan data baru.

### 5. Istilah

- **Prop:** Data yang dikirim dari parent ke child. item, onDelete, showDelete = props.
- **onError (img):** Event ketika gambar gagal load; dipakai untuk fallback placeholder.

---

## src/components/SidebarAdmin.jsx

### 1. Fungsi File Ini

- Sidebar untuk halaman admin: judul "Found It! Admin Panel", tombol "Manage Reports" dan "Manage Users" (mengontrol activeTab lewat setActiveTab), info user dari localStorage (nama, email). Versi mobile: tombol toggle dan overlay; sidebar bisa slide.
- Dipanggil oleh: AdminDashboard (dengan props activeTab, setActiveTab).
- Penting: Navigasi dalam admin panel (items vs users).

### 2. Import / Dependency

useState, useEffect dari "react". Tidak ada router; hanya button onClick setActiveTab("items") atau setActiveTab("users").

### 3. Penjelasan Kode (ringkas)

- **useState isOpen (mobile menu), user.** useEffect baca localStorage "user" → setUser(JSON.parse(userData)).
- **Mobile:** Button toggle isOpen; overlay klik tutup sidebar. Aside class conditional: isOpen ? translate-x-0 : -translate-x-full (di mobile), di lg selalu tampil (lg:translate-x-0).
- **Nav:** Dua button; className tergantung activeTab === "items" / "users". onClick setActiveTab dan setIsOpen(false) (tutup menu mobile).
- **User info:** Avatar inisial, nama, email dari user.

### 4. Alur Eksekusi

Mount → baca user dari localStorage. Klik tab → setActiveTab → parent (AdminDashboard) ganti konten yang ditampilkan (items atau users).

### 5. Istilah

- **Controlled component (tab):** Nilai aktif (activeTab) dipegang parent; child hanya memanggil setActiveTab. Parent yang menentukan apa yang tampil.

---

## src/pages/Home.jsx

### 1. Fungsi File Ini

- Halaman utama (landing): hero section, search bar, tiga section daftar item (Lost, Found, Resolved) dari API GET /items. Filter client-side: lostItems (status lost dan !resolved_at), foundItems (status found dan !resolved_at), resolvedItems (resolved_at ada). Search filter by name/description/location. Tampil pakai CardItem; loading spinner; empty state jika tidak ada data.
- Dipanggil oleh: Route path="/" di App.jsx.
- Penting: Halaman pertama yang dilihat user; daftar barang yang sudah approved dan (sesuai backend) yang resolved &lt; 24 jam.

### 2. Import / Dependency

useState, useEffect dari "react"; Link dari "react-router-dom"; api dari "../api"; CardItem dari "../components/CardItem".

### 3. Penjelasan Kode (ringkas)

- **State:** items [], loading true, searchQuery "".
- **useEffect([]):** fetchItems() sekali saat mount. fetchItems: api.get("/items") → setItems(response.data), setLoading(false). Catch log error.
- **Filter:** lostItems = items.filter(status==="lost" && !resolved_at). foundItems = status==="found" && !resolved_at. resolvedItems = resolved_at != null.
- **filterItems(itemList):** Jika searchQuery kosong return itemList; else filter item yang name/description/location (lowercase) include query.
- **JSX:** Hero (judul, link Register/Login). Search input (value searchQuery, onChange setSearchQuery). Tiga section: Lost, Found, Resolved. Masing-masing: judul, count, list CardItem dari filterItems(...) atau resolvedItems. Loading spinner; empty state teks.

### 4. Alur Eksekusi

Mount → fetchItems → set items → filter → render. User ketik search → setSearchQuery → re-render → filterItems memfilter → tampil hasil.

### 5. Istilah

- **useEffect dependency []:** Hanya jalankan sekali setelah mount. Cocok untuk fetch data awal.
- **Client-side filter:** Data sudah di frontend; filter dengan .filter() berdasarkan state (searchQuery). Berbeda dengan filter di backend (query params).

---

## src/pages/Login.jsx

### 1. Fungsi File Ini

- Halaman login: form email & password, toggle mode User/Admin (hanya mengubah tampilan teks; backend tetap satu endpoint, role dari token). Jika sudah user (useEffect), redirect ke /admin (admin) atau /dashboard (user). Submit panggil login() dari AuthContext; sukses toast, error tampil dan toast. Link ke Register (mode user) dan tombol "Sign in as User" (mode admin).
- Dipanggil oleh: Route /login.
- Penting: Pintu masuk user dan admin (sama endpoint, beda role dari response).

### 2. Import / Dependency

useState, useEffect dari "react"; useNavigate, Link dari "react-router-dom"; useAuth (login, user); toast dari "react-hot-toast".

### 3. Penjelasan Kode (ringkas)

- **useEffect([user, navigate]):** Jika user ada, navigate replace ke /admin (role admin) atau /dashboard (user).
- **State:** form { email, password }, loginMode "user"/"admin", error "", loading false.
- **submit(e):** e.preventDefault(). Validasi email & password. setLoading(true), setError(""). login(form.email, form.password). Result success → toast.success. Else setError(result.message), toast.error. Catch setError + toast. finally setLoading(false).
- **JSX:** Split layout (kiri dekoratif, kanan form). Toggle User/Admin (loginMode). Input email/password (value form, onChange update form). Error box. Button submit (disabled saat loading). Link Register; info admin.

### 4. Alur Eksekusi

User isi form → submit → login() panggil API → backend return token+user → AuthContext set user → useEffect detect user → redirect. Jika salah → error + toast.

### 5. Istilah

- **Controlled input:** value={form.email} onChange={e => setForm({...form, email: e.target.value})}. Nilai input dikontrol state React.
- **Replace redirect:** navigate(..., { replace: true }) = history entry diganti, back tidak kembali ke login.

---

## src/pages/Register.jsx

### 1. Fungsi File Ini

- Form registrasi: name, email, password. Submit panggil register() dari AuthContext (yang di dalamnya POST register lalu auto login). Sukses → toast, navigate("/dashboard"). Error → setError, toast. Catatan: registrasi hanya untuk user; admin dibuat manual.
- Dipanggil oleh: Route /register.
- Penting: Satu-satunya cara user biasa mendaftar.

### 2. Import / Dependency

useState dari "react"; useNavigate, Link dari "react-router-dom"; useAuth (register); toast.

### 3. Penjelasan Kode (ringkas)

- State form (name, email, password), error, loading. submit: validasi → register(form.name, form.email, form.password). result.success → toast, navigate("/dashboard"). Else/catch → setError, toast. finally setLoading(false). JSX: layout mirip Login, form dengan label, input, info "admin created manually", link ke Login.

### 4. Alur Eksekusi

Submit → register() → API register → API login (di context) → context set user → navigate dashboard.

### 5. Istilah

- **Auto login after register:** UX: setelah daftar langsung masuk tanpa isi form login lagi. Di sini dilakukan di AuthContext.register dengan memanggil login setelah register sukses.

---

## src/pages/Dashboard.jsx

### 1. Fungsi File Ini

- Dashboard user setelah login: sidebar (logo, search, link Dashboard, My Report, All Items), header dengan sapaan dan tombol "I just lost my stuff" / "I found someone stuff" (ke report-lost/report-found). Konten: section Lost Items, Found Items, Resolved Items (sama seperti Home: filter dari api.get("/items"), tampil CardItem). Search hanya memfilter tampilan (client-side).
- Dipanggil oleh: Route /dashboard (ProtectedRoute).
- Penting: Home-nya user login; akses cepat ke lapor barang dan lihat daftar.

### 2. Import / Dependency

useState, useEffect dari "react"; Link, useLocation dari "react-router-dom"; api, CardItem, toast.

### 3. Penjelasan Kode (ringkas)

- State: items, loading, user (dari localStorage), searchQuery, sidebarOpen. useEffect baca user; useEffect fetchItems (api.get("/items")). Filter lostItems, foundItems, resolvedItems; filterItems(itemList) by searchQuery. isActive(path) = location.pathname === path untuk highlight nav. Layout: aside sidebar (search, nav links), overlay mobile, main content (header + link report + section Lost/Found/Resolved dengan CardItem).

### 4. Alur Eksekusi

Mount → fetch items, baca user → render. Klik link report → navigasi ke ReportLost/ReportFound. Ketik search → filter client-side.

### 5. Istilah

- **useLocation:** Hook React Router yang mengembalikan objek location (pathname, search, dll). Dipakai untuk highlight link aktif.

---

## src/pages/ReportLost.jsx

### 1. Fungsi File Ini

- Form lapor barang hilang: name, description, location, date_occured, file gambar (opsional). Validasi name & description wajib. Submit: buat FormData, append semua field + status "lost" + file (key "image"), api.post("/items/lost", data). Sukses toast, navigate dashboard. Jangan set Content-Type manual (biarkan Axios set multipart dengan boundary).
- Dipanggil oleh: Route /report-lost (Protected).
- Penting: Satu dari dua form laporan (lost); backend butuh field "image" untuk file.

### 2. Import / Dependency

useState dari "react"; useNavigate dari "react-router-dom"; api; toast.

### 3. Penjelasan Kode (ringkas)

- State: form (name, description, location, date_occured), file, imagePreview, error, loading. handleImageChange: cek size 5MB, setFile, FileReader readAsDataURL untuk preview. submit: FormData, Object.keys(form).forEach append; append status "lost"; if file append "image" file. api.post("/items/lost", data) — tidak set header Content-Type. Sukses → toast, navigate("/dashboard"). Catch setError, toast. JSX: form dengan input, textarea, date, file input, preview, error, button submit/cancel.

### 4. Alur Eksekusi

User isi form, pilih file → submit → FormData dikirim → backend authenticate + Multer + createItem → response 201 → frontend redirect.

### 5. Istilah

- **FormData:** Objek untuk mengirim form multipart (teks + file). append(key, value). Axios mendeteksi FormData dan set Content-Type: multipart/form-data; boundary otomatis.
- **FileReader.readAsDataURL:** Membaca file sebagai data URL (base64) untuk preview gambar di img src.

---

## src/pages/ReportFound.jsx

### 1. Fungsi File Ini

- Sama seperti ReportLost, tetapi status "found" dan api.post("/items/found", data). Label sedikit beda (Found Location, Date Found). Logic dan struktur sama.
- Dipanggil oleh: Route /report-found.
- Penting: Form lapor barang ditemukan.

### 2–5. (Singkat)

Mirip ReportLost: FormData, append status "found", api.post("/items/found", data). Tidak set Content-Type manual.

---

## src/pages/MyReports.jsx

### 1. Fungsi File Ini

- Halaman "My Reports": fetch api.get("/items/my-reports") (butuh token). Tampil dua section: Lost Items dan Found Items (filter by item.status). Masing-masing list CardItem (showDelete false). Link ke report-lost dan report-found. Empty state + link report.
- Dipanggil oleh: Route /my-reports (Protected).
- Penting: User lihat hanya laporannya sendiri (pending/approved/rejected); backend filter by user_id dari token.

### 2. Import / Dependency

useState, useEffect dari "react"; Link; api, CardItem, toast.

### 3. Penjelasan Kode (ringkas)

- State: items, loading, user. useEffect: baca user dari localStorage; fetchMyReports() (api.get("/items/my-reports") → setItems). lostItems = items.filter(s=>s.status==="lost"), foundItems = status==="found". JSX: header, tombol Report Lost/Found, section Lost (CardItem list), section Found (CardItem list). Loading spinner; empty state dengan link.

### 4. Alur Eksekusi

Mount → fetch my-reports (dengan token) → set items → filter → render. Backend hanya return item milik user.

### 5. Istilah

- **Endpoint terproteksi:** GET /items/my-reports memakai middleware authenticate; token wajib. Tanpa token → 401.

---

## src/pages/AdminDashboard.jsx

### 1. Fungsi File Ini

- Dashboard admin: sidebar (SidebarAdmin), tab "items" / "users". Fetch admin/items, admin/users, admin/statistics. Tampil statistik (totalUsers, totalItems, totalPending, dll), tabel laporan dengan filter (all/pending/approved/rejected), tombol Approve/Reject, Edit, Delete, Mark Resolved. Modal resolve (input catatan), modal edit item (form + optional gambar). Tabel users dengan tombol delete. Semua request pakai token admin; redirect jika bukan admin.
- Dipanggil oleh: Route /admin (ProtectedRoute requireAdmin).
- Penting: Pusat semua fitur admin (validasi, resolve, edit, hapus item/user).

### 2. Import / Dependency

useState, useEffect dari "react"; useNavigate, Link; api; SidebarAdmin, CardItem; toast.

### 3. Penjelasan Kode (ringkas)

- **Proteksi:** useEffect baca user dari localStorage; jika role !== "admin" toast error, navigate("/dashboard"). Jika tidak ada user, navigate("/login").
- **State:** items, users, statistics, loading, activeTab ("items"/"users"), filterStatus, user; modal resolve (showResolveModal, selectedItemId, resolveNote); modal edit (showEditModal, editingItem, editForm, editImageFile, editImagePreview).
- **fetchData:** Promise.all([ api.get("/admin/items"), api.get("/admin/users"), api.get("/admin/statistics") ]) → setItems, setUsers, setStatistics.
- **handleValidationStatus(itemId, status):** api.put(`/admin/items/${itemId}/validate`, { validation_status }). Toast, fetchData.
- **handleMarkAsResolved:** api.put(`/admin/items/${selectedItemId}/resolve`, { resolved_note }). Tutup modal, fetchData.
- **handleOpenEditModal(item):** setEditingItem, setEditForm dari item, setEditImagePreview (URL gambar lama atau null). handleUpdateItem: FormData append field + optional image; api.put(`/admin/items/${editingItem.id}`, formData). **Catatan:** Jangan set header "Content-Type": "multipart/form-data" manual agar boundary otomatis (sama seperti ReportLost/ReportFound). Di kode saat ini ada headers: { "Content-Type": "multipart/form-data" } — ini berpotensi menyebabkan error parsing di backend; idealnya dihapus untuk FormData.
- **handleDeleteItem, handleDeleteUser:** Konfirmasi window.confirm, api.delete, toast, fetchData.
- **Tampilan:** SidebarAdmin(activeTab, setActiveTab). Jika activeTab "items": stat cards, filter dropdown, tabel/grid item dengan tombol Approve/Reject/Edit/Delete/Resolve; CardItem dengan showDelete true, onDelete handleDeleteItem. Jika activeTab "users": tabel users, tombol delete. Modal resolve dan modal edit di-render conditional (showResolveModal, showEditModal).

### 4. Alur Eksekusi

Mount → cek admin → fetchData → tampil stat + daftar. Klik Approve/Reject/Resolve/Edit/Delete → panggil API → toast → fetchData lagi. Modal buka/tutup dengan state.

### 5. Istilah

- **Promise.all:** Menunggu beberapa request sekaligus; hasil array berurutan. Efisien untuk load items + users + statistics dalam satu “gelombang”.
- **Modal:** Kotak di atas halaman (overlay); tampil/sembunyi dengan state (showResolveModal, showEditModal). Tutup = set state false.

---

**Catatan AdminDashboard dan upload:**  
Jika saat edit item dengan gambar masih ada baris yang set header `Content-Type: "multipart/form-data"` secara manual, sebaiknya dihapus (sama seperti di ReportLost/ReportFound) agar Axios yang set header dengan boundary. Lihat bagian “Kesalahan Umum” di DEEP_DIVE_PROJECT.md.

---

**Selesai.** Ringkasan project, struktur, alur data, bug, dan glosarium ada di **DEEP_DIVE_PROJECT.md**. Detail backend per file di **DEEP_DIVE_BACKEND.md**.
