# Panduan Deploy – Lost & Found CMS

Agar aplikasi jalan **tanpa harus nyalain laptop** (bisa diakses dari mana aja), kamu perlu **deploy** ke internet. Panduan ini pakai **Vercel** (gratis) + **database MySQL di cloud**.

---

## Yang perlu disiapkan

1. **Akun Vercel** – [vercel.com](https://vercel.com) → Sign up (bisa pakai GitHub).
2. **Database MySQL di cloud** – dipakai buat nyimpen user, item, dll. Pilihan gratis/ murah:
   - [PlanetScale](https://planetscale.com) (MySQL, gratis tier)
   - [Railway](https://railway.app) (bisa MySQL, gratis tier)
   - [Aiven](https://aiven.io) (MySQL, trial)
3. **GitHub** – kode project ini harus ada di repo GitHub (biar Vercel bisa pull dan auto-deploy).

---

## Langkah 1: Push project ke GitHub

Kalau belum:

```bash
cd /home/faiz/kuliah/praktikumweb/CMS-UTS-SEMESTER-3
git add .
git commit -m "Prepare for deploy"
git remote add origin https://github.com/USERNAME/REPO.git   # ganti USERNAME/REPO
git push -u origin main
```

---

## Langkah 2: Bikin database MySQL di cloud

Contoh pakai **PlanetScale** (gratis):

1. Daftar di [planetscale.com](https://planetscale.com).
2. Buat database baru (misal nama: `lostfound-db`).
3. Di dashboard, buat **branch** (misal `main`).
4. Buka **Connect** → pilih **Connect with: General** → ambil:
   - **Host**
   - **Username**
   - **Password**
   - **Database name** (biasanya sama dengan nama DB).
5. Jalankan schema MySQL kamu sekali (isi tabel). Di PlanetScale bisa pakai **Console** → SQL, atau dari laptop:

   ```bash
   cd backend
   mysql -h HOST -u USER -p DATABASE_NAME < database/schema.sql
   ```

   (Ganti `HOST`, `USER`, `DATABASE_NAME`; password diminta.)

Kalau pakai **Railway**: buat project → Add MySQL → ambil env `DATABASE_URL` atau `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`.

---

## Langkah 3: Deploy ke Vercel

1. Login ke [vercel.com](https://vercel.com).
2. **Add New** → **Project** → **Import Git Repository** → pilih repo kamu.
3. **Configure Project**:
   - **Root Directory**: tetap `.` (root repo).
   - **Framework Preset**: Other (atau Vite kalau ada).
   - **Build Command**: kosongkan (Vercel pakai `vercel.json`).
   - **Output Directory**: kosongkan.
   - **Install Command**:  
     Isi: `npm run install:all`  
     (Supaya dependency backend + frontend ke-install.)
4. **Environment Variables** – tambahkan (ganti nilai dengan punya kamu):

   | Name           | Value (contoh)                    | Penting |
   |----------------|-----------------------------------|--------|
   | `NODE_ENV`     | `production`                      | Ya     |
   | `DB_HOST`      | `xxx.planetscale.com` atau host DB | Ya     |
   | `DB_USER`      | username DB                       | Ya     |
   | `DB_PASSWORD`  | password DB                       | Ya     |
   | `DB_NAME`      | `lostfound_db` (atau nama DB kamu) | Ya     |
   | `DB_SSL`       | `true` (wajib untuk PlanetScale)  | Ya     |
   | `JWT_SECRET`   | string random panjang (lihat bawah) | Ya     |
   | `FRONTEND_URL` | `https://PROJECT-KAMU.vercel.app` | Ya (CORS) |

   Generate **JWT_SECRET** (di laptop):

   ```bash
   openssl rand -base64 32
   ```

   Copy hasilnya → paste di env `JWT_SECRET` di Vercel.

5. Klik **Deploy**.

Tunggu sampai build selesai. Kalau sukses, kamu dapat URL seperti:  
`https://cms-lost-found-xxx.vercel.app`.

---

## Langkah 4: Set FRONTEND_URL setelah deploy

1. Setelah deploy pertama selesai, catat **URL asli** project (misal `https://cms-lost-found-abc123.vercel.app`).
2. Di Vercel: **Project → Settings → Environment Variables**.
3. Edit `FRONTEND_URL` → isi dengan URL itu (tanpa slash di akhir), lalu **Save**.
4. **Redeploy** sekali: **Deployments** → titik tiga di deploy terbaru → **Redeploy**.

Ini biar CORS backend mengizinkan request dari frontend yang sudah live.

---

## Langkah 5: Buat admin pertama (production)

Backend punya script `createAdmin`. Di production kamu harus jalanin ini sekali, dengan env production.

**Opsi A – Jalanin dari laptop (pakai env production):**

```bash
cd backend
# Set env dulu (ganti dengan nilai production)
export DB_HOST=xxx.planetscale.com
export DB_USER=...
export DB_PASSWORD=...
export DB_NAME=lostfound_db
export DB_SSL=true
export JWT_SECRET=...   # sama dengan di Vercel
node scripts/createAdmin.js
# Ikuti prompt: email + password admin
```

**Opsi B – Kalau backend punya route one-time “create first admin” (dengan secret), bisa dipanggil sekali lewat curl/Postman; di project ini belum ada, jadi pakai Opsi A.**

Setelah itu, login di app production pakai email + password admin itu (mode Admin).

---

## Penting: Upload file (gambar) di Vercel

Di Vercel, **serverless** tidak punya disk tetap. File yang di-upload ke folder `uploads` **tidak akan permanen** (bisa hilang tiap cold start / redeploy).

Agar upload gambar tetap jalan di production, nanti bisa:

- Simpan file ke **storage di cloud** (misal **Cloudinary**, **AWS S3**, **Vercel Blob**) dan simpan URL-nya di database, atau
- Untuk sementara: fitur upload tetap jalan, tapi file bisa hilang setelah redeploy/cold start. Kalau cuma demo, seringkali masih bisa dipakai dulu.

---

## Ringkasan alur deploy

1. Kode di GitHub.
2. Database MySQL di cloud (PlanetScale/Railway/dll) + schema sudah dijalankan.
3. Project Vercel import dari GitHub.
4. Install command: `npm run install:all`.
5. Env production: `DB_*`, `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV`, `DB_SSL` (kalau pakai PlanetScale).
6. Deploy → dapat URL.
7. Set `FRONTEND_URL` = URL Vercel → redeploy.
8. Buat admin dengan `createAdmin.js` (env production).
9. Buka URL Vercel → login (user/admin) → aplikasi jalan tanpa perlu nyalain laptop.

---

## Kalau mau pakai Docker (VPS / server sendiri)

Project ini juga ada `docker-compose.yml`. Cara jalanin di VPS (Ubuntu/server lain):

```bash
# Di server
git clone https://github.com/USERNAME/REPO.git
cd REPO
# Sesuaikan .env / env untuk backend (DB_*, JWT_SECRET, FRONTEND_URL = https://domain-kamu)
docker compose up -d --build
```

Lalu akses frontend di `http://IP-SERVER:3000` dan API di `http://IP-SERVER:5000`. Untuk production biasanya kamu pasang **reverse proxy** (Nginx/Caddy) + domain + HTTPS; itu bisa ditambah belakangan.

---

## Troubleshooting singkat

| Masalah | Cek |
|--------|-----|
| Build gagal | Cek **Build Logs** di Vercel. Pastikan `npm run install:all` dan build frontend jalan (tanpa error). |
| 500 / API error | Cek **Function Logs** (API) di Vercel. Sering karena DB: host/user/password/name/SSL salah. |
| CORS error | Pastikan `FRONTEND_URL` di env Vercel = URL asli frontend (tanpa trailing slash), lalu redeploy. |
| Login gagal | Pastikan schema + createAdmin sudah jalan; `JWT_SECRET` sama di backend (env) dan tidak kosong. |
| Gambar hilang | Di Vercel file upload tidak persistent; butuh storage cloud (Cloudinary/S3/Vercel Blob) untuk production tetap. |

Kalau kamu pilih provider DB lain (Railway, Aiven, dll), langkahnya mirip: bikin DB → ambil host, user, password, nama DB (dan kalau ada SSL) → isi env di Vercel → deploy.
