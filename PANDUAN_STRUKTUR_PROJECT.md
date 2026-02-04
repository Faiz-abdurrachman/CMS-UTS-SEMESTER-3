# PANDUAN LENGKAP STRUKTUR PROJECT & LOGIKA KODE

## (Lost & Found App - Semester 3)

Halo! Dokumen ini dibuat khusus untuk menjelasin **seluruh** isi project kamu dari akar sampe daun-daunnya. Kita bakal bedah satu per satu, kenapa file itu ada, apa gunanya, dan apa yang terjadi kalau file itu ilang. Penjelasannya bakal "goblok-proof" alias pake bahasa manusia, bukan bahasa alien.

---

## 🏗️ KONSEP DASAR: Fullstack (MERN-ish)

Project ini adalah aplikasi "Fullstack". Ibarat restoran:

1.  **Backend (Dapur):** Tempat masak data, simpen bahan (Database MySQL), dan ngatur pesanan.
2.  **Frontend (Meja Makan/Buku Menu):** Apa yang dilihat user, tempat user klik-klik.

Kalo ga ada Backend? User cuma bisa liat menu tapi ga bisa pesen.
Kalo ga ada Frontend? Makanannya ada tapi user ga tau cara pesennya gimana (koding lewat terminal doang).

---

## 📂 BAGIAN 1: START DARI LUAR (ROOT FOLDER)

Folder utama `CMS-UTS-SEMESTER-3` adalah rumah besarnya.

### 1. `.env` / `.env.production.example`

- **Apa ini?** Kunci rahasia rumah.
- **Isinya:** Password database, rahasia JWT (token login), URL backend.
- **Kenapa penting?** Biar password ga kesebar di internet (GitHub).
- **Kalo ilang:** Aplikasi lu ga bisa connect ke database, login error semua.

### 2. `.gitignore`

- **Apa ini?** Daftar "sampah" atau "rahasia" yang gak boleh di-upload ke GitHub.
- **Isinya:** `node_modules`, `.env`, folder `dist`.
- **Kenapa penting?** Biar GitHub lu bersih dan aman.
- **Kalo ilang:** GitHub lu bakal penuh sama file sampah ber-giga-giga byte.

### 3. `package.json` (Di Root, Backend, & Frontend)

- **Apa ini?** KTP & Resep Project.
- **Isinya:** Nama project, script buat jalanin (`npm run dev`), dan **Daftar Belanja (Dependencies)**.
- **Kenapa penting?** Node.js butuh file ini buat tau library apa aja yang harus di-install.
- **Kalo ilang:** Project MATI TOTAL. Gak bisa di-install (`npm install` error).

### 4. `README.md`

- **Apa ini?** Brosur panduan.
- **Isinya:** Cara install, cara jalanin.
- **Kalo ilang:** Orang lain (atau lu di masa depan) bakal bingung cara jalanin aplikasinya.

---

## 📂 BAGIAN 2: BACKEND (DAPUR) 🍳

Folder: `/backend`

Ini adalah otak dari sistem. Pake `Node.js` dan `Express.js`.

### 📄 `server.js` (Otak Utama)

**Logika:** Ini file pertama yang jalan pas lu ketik `npm run start`.

1.  Dia **manggil** Express (koki).
2.  Dia **colok** kabel ke Database.
3.  Dia **pasang** Security (Helmet, CORS biar frontend boleh masuk).
4.  Dia **buka pintu** (Listen port 5000).

**Ibarat:** Manager restoran yang buka pintu, nyalain lampu, dan siapin koki.

### 📂 `backend/config/`

- **`db.js`**: **Kabel Telepon ke Database MySQL.**
  - **Logika:** Pake library `mysql2`. Dia bikin "Pool" (kolam koneksi). Kenapa Pool? Biar gak usah nelpon ulang tiap kali ada user request. Sekali buka, bisa dipake rame-rame.
  - **Kalo rusak:** Server jalan, tapi pas mau login/ambil data -> ERROR CONNECTION REFUSED.

### 📂 `backend/models/` (Cetak Biru / Blueprint)

Ini adalah "Kamus Data". Backend harus tau bentuk data itu kayak gimana.

- **`User.js`**:
  - Mendefinisikan cara ngobrol sama tabel `users` di database.
  - Ada fungsi `findByEmail` (cari user), `create` (bikin user baru).
  - **Logika:** Menulis query SQL manual (`SELECT * FROM users...`) biar programmer gak usah ngetik SQL terus-terusan di Controller.
- **`Item.js`**: Sama kayak User, tapi buat barang hilang/temu.

### 📂 `backend/routes/` (Penunjuk Jalan)

User request ke URL mana, siapa yang nanganin?

- **`authRoutes.js`**: Kalo user ke `/api/auth/login`, arahin ke `authController.login`.
- **`itemRoutes.js`**: Kalo user ke `/api/items`, arahin ke `adminController` atau `itemController`.
- **Logika:** Kayak Resepsionis. "Mau login? Ke loket 1. Mau lapor barang? Ke loket 2."

### 📂 `backend/controllers/` (Pekerja / Koki)

Di sini logika beneran terjadi.

- **`authController.js`**:
  - **Register:** Terima nama/email -> Cek email ada gak? -> Hash password (acak-acak biar aman) -> Simpan ke DB.
  - **Login:** Terima email/pass -> Cari user -> Bandingkan password (pake bcrypt) -> Kalo cocok, kasih **JWT Token** (Tiket masuk).
- **`itemController.js`**: Logika buat nambah barang, hapus barang.

### 📂 `backend/middleware/` (Satpam)

Sebelum masuk ke Controller, harus lewat sini dulu.

- **`authMiddleware.js`**:
  - Cek: "Eh, lu bawa tiket (Token JWT) gak?"
  - Kalo gak bawa -> TENDANG (401 Unauthorized).
  - Kalo bawa -> Silakan masuk.
- **`upload.js`**:
  - Khusus buat handle upload gambar (pake library `multer`). Cek: "Ini gambar apa virus?".

---

## 📂 BAGIAN 3: FRONTEND (MEJA MAKAN) 🍽️

Folder: `/frontend`

Pake `React.js` + `Vite` (biar cepet).

### 📄 `index.html`

- **Apa ini?** Tengkorak web.
- **Isinya:** Cuma satu `div id="root"`. React bakal nyuntik semua isinya ke situ.

### 📂 `frontend/src/` (Source Code)

Di sini tempat lu ngoding tampilan.

#### 1. `main.jsx` (Pintu Masuk)

- **Logika:** "Halo Browser, tolong ambil `div id='root'` terus isi pake komponen `<App />`".
- File ini yang nge-start React.

#### 2. `App.jsx` (Lorong Utama / Routing)

- **Logika:** Di sini diatur navigasinya.
  - "Kalo URL `/login`, tampilin halaman Login."
  - "Kalo URL `/dashboard`, CEK DULU (Protected Route). Udah login belom? Kalo belom tendang ke Login."
- **Penting:** Ada `AuthProvider` yang mbungkus semuanya. Itu biar status login user ("Si A lagi login") bisa dibaca di mana aja.

#### 3. `api.js` (Handphone ke Backend)

- **Apa ini?** Setup `Axios`.
- **Kerennya:** Ada "Interceptor".
  - Setiap kali lu request ke backend, dia otomatis nyelipin Token JWT di saku (Header). Jadi lu gak usah manual masukin token tiap kali request.
  - Kalo backend bilang "Token basi", dia otomatis logout user.

#### 4. `frontend/src/pages/`

Halaman-halaman web lu.

- **`Login.jsx` & `Register.jsx`**: Form input. Pas klik submit, panggil `api.post('/auth/login')`.
- **`Dashboard.jsx`**: Halaman utama setelah login. Fetch data barang dari backend.

#### 5. `frontend/src/components/` (Potongan Lego)

Komponen kecil yang dipake ulang.

- **`Navbar.jsx`**: Menu atas. Bisa beda tampilan kalo user login vs belom login.
- **`CardItem.jsx`**: Kotak tampilan barang hilang. Daripada bikin kotak ulang-ulang, mending bikin satu cetakan (Card) terus isi datanya beda-beda.

#### 6. `frontend/src/contexts/` (Listrik Rumah)

- **`AuthContext.jsx`**:
  - Ini nyimpen **Global State**: "Siapa yang lagi login sekarang?".
  - Tanpa ini, lu harus oper data user dari App -> Dashboard -> Navbar secara manual (ribet, namanya _prop drilling_).
  - Dengan Context, `Navbar` bisa langsung nanya "Woy Context, siapa yang login?" tanpa lewat perantara.

---

## 🧠 CONTOH ALUR: USER LOGIN

Biar paham gimana semua file ini kerja bareng:

1.  **Frontend (`Login.jsx`):** User isi email & pass, klik "Login".
2.  **Frontend (`api.js`):** Kirim request `POST /api/auth/login` ke Backend.
3.  **Backend (`server.js`):** Terima request, oper ke `authRoutes`.
4.  **Backend (`authRoutes`):** Oper ke `authController.login`.
5.  **Backend (`authController`):**
    - Minta `User` model cari emailnya di Database (`db.js`).
    - Database SQL jawab: "Ini datanya".
    - Cek password pake `bcrypt`. Cocok.
    - Bikin **Token** (boarding pass).
    - Kirim Token balik ke Frontend.
6.  **Frontend (`Login.jsx`):** Terima token.
7.  **Frontend (`AuthContext`):** Simpan token di LocalStorage (biar di-refresh ga ilang) & update status "User is Login".
8.  **Frontend (`App.jsx`):** Liat status udah login, otomatis pindahin layar ke `/dashboard`.

---

## ⚠️ APA YANG TERJADI KALAU...

1.  **Schema Database Beda sama Kodingan?**
    - Backend bakal error "Column not found". Kodingan minta kolom `phone`, di database gak ada. Server meledak (crash).
2.  **Lupa `npm install`?**
    - Folder `node_modules` gak ada. Komputer lu gak tau apa itu "express" atau "react". Program gak jalan sama sekali.
3.  **File `.env` ga ada?**
    - Program bingung "Database gue di mana? Passwordnya apa?". Gagal connect.

---

Semoga penjelasan ini bikin lu paham struktur kerajaan kodingan lu! Kalo ada yang masih bingung, tanya aja bagian spesifiknya.
