# 🎯 Lost & Found System

Aplikasi web fullstack untuk melaporkan dan menemukan barang hilang/ditemukan menggunakan React.js, Express.js, dan MySQL.

## 📋 Daftar Isi

- [Quick Start](#-quick-start-untuk-developer-baru)
- [Fitur](#-fitur)
- [Tech Stack](#-tech-stack)
- [Struktur Project](#-struktur-project)
- [Setup Database](#-setup-database)
- [Setup Backend](#-setup-backend)
- [Setup Frontend](#-setup-frontend)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)

## 🚀 Quick Start (Untuk Developer Baru)

Jika kamu baru clone project ini dari GitHub, ikuti langkah-langkah berikut:

### Prerequisites

- ✅ **Node.js** (versi 16+)
- ✅ **XAMPP** (untuk MySQL database lokal)
- ✅ **Git** (untuk clone project)

### Langkah-langkah Setup

1. **Clone Repository**

   ```bash
   git clone <repository-url>
   cd CMS_3
   ```

2. **Setup Database (XAMPP)**

   - Start XAMPP → Start **MySQL**
   - Buka `http://localhost/phpmyadmin`
   - Import file `database/schema.sql` (copy-paste isinya ke tab SQL)
   - Database `lostfound_db` akan dibuat otomatis

3. **Setup Backend**

   ```bash
   cd backend
   npm install
   copy .env.example .env    # Windows
   # atau
   cp .env.example .env      # Mac/Linux
   ```

   - Edit file `.env` jika perlu (default sudah sesuai untuk XAMPP)
   - Jalankan: `npm run dev`

4. **Setup Frontend**

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

5. **Akses Aplikasi**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

**Catatan Penting:**

- ⚠️ Setiap developer harus setup database XAMPP sendiri di komputer mereka
- ⚠️ File `.env` tidak akan ada di GitHub (sudah di `.gitignore`), jadi harus dibuat manual
- ⚠️ Database lokal tidak akan ter-share antar developer (masing-masing punya database sendiri)

---

## ✨ Fitur

- ✅ **Register & Login** - Autentikasi user dengan JWT
- ✅ **Laporkan Barang Hilang** - Form untuk melaporkan barang yang hilang
- ✅ **Laporkan Barang Ditemukan** - Form untuk melaporkan barang yang ditemukan
- ✅ **Upload Gambar** - Upload foto barang (max 5MB)
- ✅ **Dashboard** - Lihat semua laporan (lost & found)
- ✅ **Delete Item** - Hapus laporan (hanya admin atau pemilik)
- ✅ **Responsive Design** - UI modern dengan TailwindCSS

## 🛠 Tech Stack

### Frontend

- **React.js** - UI library
- **React Router** - Routing
- **Vite** - Build tool
- **TailwindCSS** - CSS framework
- **Axios** - HTTP client

### Backend

- **Express.js** - Web framework
- **MySQL** - Database (via XAMPP)
- **JWT** - Authentication
- **Multer** - File upload
- **bcrypt** - Password hashing

## 📁 Struktur Project

```
CMS_3/
├── backend/
│   ├── config/
│   │   └── db.js              # Koneksi database
│   ├── controllers/
│   │   ├── authController.js  # Register & Login
│   │   └── itemController.js  # CRUD items
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   └── upload.js         # File upload (Multer)
│   ├── routes/
│   │   ├── authRoutes.js     # Routes auth
│   │   └── itemRoutes.js     # Routes items
│   ├── uploads/              # Folder untuk file upload
│   ├── server.js             # Entry point server
│   ├── package.json
│   └── .env                  # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── api.js            # Axios config dengan interceptor
│   │   ├── pages/
│   │   │   ├── Home.jsx      # Landing page
│   │   │   ├── Login.jsx     # Halaman login
│   │   │   ├── Register.jsx  # Halaman register
│   │   │   ├── Dashboard.jsx  # Dashboard user
│   │   │   ├── ReportLost.jsx   # Form lapor hilang
│   │   │   └── ReportFound.jsx  # Form lapor ditemukan
│   │   ├── components/
│   │   │   ├── Navbar.jsx    # Navigation bar
│   │   │   └── ItemCard.jsx  # Card untuk item
│   │   ├── App.jsx           # Router utama
│   │   └── main.jsx          # Entry point
│   └── package.json
│
└── database/
    └── schema.sql            # Script SQL untuk membuat database
```

## 🗄 Setup Database

### 1. Start XAMPP

1. Buka **XAMPP Control Panel**
2. Start **Apache** dan **MySQL**
3. Pastikan status berwarna **hijau**

### 2. Buat Database

1. Buka browser → `http://localhost/phpmyadmin`
2. Klik tab **SQL**
3. Copy-paste semua isi dari file `database/schema.sql`
4. Klik **Go** untuk execute

**Atau manual:**

```sql
CREATE DATABASE lostfound_db;
USE lostfound_db;

-- Tabel users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel items
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    date_occured DATE,
    image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'lost',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Verifikasi

- Cek di phpMyAdmin: database `lostfound_db` dan tabel `users` + `items` sudah ada ✅

## ⚙️ Setup Backend

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Buat File .env

**Cara 1: Copy dari template (Recommended)**

```bash
cd backend
copy .env.example .env
```

**Cara 2: Buat manual**

Buat file `.env` di folder `backend/` dan copy isi dari `.env.example`, atau isi manual:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=lostfound_db
JWT_SECRET=secret_key_lostfound_2024
NODE_ENV=development
UPLOAD_DIR=uploads
```

**Catatan Penting:**

- ⚠️ **File `.env` tidak akan di-commit ke GitHub** (sudah di `.gitignore`)
- Setiap developer harus buat `.env` sendiri di komputer mereka
- `DB_PASSWORD` kosong jika XAMPP tidak pakai password (default XAMPP)
- Jika MySQL kamu pakai password, isi di `DB_PASSWORD`
- `JWT_SECRET` ganti dengan string random yang aman di production
- Database `lostfound_db` harus sudah dibuat dulu (lihat Setup Database di atas)

### 3. Start Backend Server

```bash
npm run dev
```

Server berjalan di `http://localhost:5000`

**Test:** Buka `http://localhost:5000` → harus muncul "Lost & Found API running"

## 🎨 Setup Frontend

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Frontend Server

```bash
npm run dev
```

Frontend berjalan di `http://localhost:3000`

**Test:** Buka `http://localhost:3000` → harus muncul halaman Home

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description        | Auth Required |
| ------ | -------------------- | ------------------ | ------------- |
| POST   | `/api/auth/register` | Register user baru | ❌            |
| POST   | `/api/auth/login`    | Login user         | ❌            |

### Items

| Method | Endpoint           | Description       | Auth Required |
| ------ | ------------------ | ----------------- | ------------- |
| GET    | `/api/items`       | Get all items     | ❌            |
| GET    | `/api/items/:id`   | Get item by ID    | ❌            |
| POST   | `/api/items/lost`  | Create lost item  | ✅            |
| POST   | `/api/items/found` | Create found item | ✅            |
| DELETE | `/api/items/:id`   | Delete item       | ✅            |

### Sample Requests

#### Register

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Create Item (Lost)

```bash
POST http://localhost:5000/api/items/lost
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

name: Dompet Hitam
description: Dompet kulit hitam, ada kartu ATM
location: Parkiran Kampus
date_occured: 2024-01-15
status: lost
image: [file]
```

## 📸 Screenshots

### Home Page

![Home Page](docs/screenshots/home.png)

### Login Page

![Login Page](docs/screenshots/login.png)

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Report Lost

![Report Lost](docs/screenshots/report-lost.png)

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Solusi:**

1. Pastikan XAMPP MySQL sudah running
2. Cek `DB_HOST`, `DB_USER`, `DB_PASSWORD` di `.env`
3. Pastikan database `lostfound_db` sudah dibuat

### Error: "Port 5000 already in use"

**Solusi:**

- Ganti port di `.env`: `PORT=5001`
- Atau kill process yang pakai port 5000

### Error: "Port 3000 already in use"

**Solusi:**

- Ganti port di `vite.config.js`: `port: 3001`

### Error: "ECONNREFUSED"

**Solusi:**

- Pastikan backend server sudah running
- Cek XAMPP MySQL running
- Cek credentials di `.env`

### Error: "tailwind not recognized"

**Solusi:**

```bash
cd frontend
npm install
npx tailwindcss init -p
```

### Error: "Multer file upload ENOENT"

**Solusi:**

- Folder `uploads/` akan dibuat otomatis saat pertama kali upload
- Pastikan server punya permission write

### Error: "CORS error"

**Solusi:**

- Pastikan backend sudah running
- Cek CORS config di `backend/server.js`
- Pastikan origin di CORS sesuai dengan URL frontend

## 📝 Catatan Penting

1. **Backend harus running** saat menggunakan frontend
2. **Token JWT** disimpan di localStorage
3. **File upload** disimpan di `backend/uploads/`
4. **Gambar** bisa diakses via: `http://localhost:5000/uploads/filename.jpg`
5. **Token expires** setelah 7 hari (bisa diubah di `authController.js`)

## 🚀 Next Steps

- [ ] Tambah fitur edit item
- [ ] Tambah fitur search/filter
- [ ] Tambah fitur pagination
- [ ] Tambah fitur contact reporter
- [ ] Deploy ke production

## 📄 License

Project ini dibuat untuk tujuan pembelajaran.

---

**Happy Coding! 🎉**
