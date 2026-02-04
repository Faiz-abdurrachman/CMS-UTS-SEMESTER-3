# CMS Lost & Found

Full-stack web application for reporting and managing lost and found items in a community or institutional setting. Backend (Node.js, Express, MySQL) and frontend (React, Vite) are in a single monorepo.

---

## Features

**User**
- Register and login with JWT.
- Report lost items (name, description, location, date, optional photo).
- Report found items (same fields).
- Dashboard with lost, found, and resolved lists; search and filter.
- My Reports: view and track own submissions (pending / approved / resolved).

**Admin**
- Dashboard with statistics (users, reports, pending, approved).
- Validate reports: approve or reject; mark as resolved with optional note.
- Edit or delete any report; delete users (admin accounts protected).
- Manage Reports and Manage Users tabs.

---

## Tech Stack

| Layer     | Technology        |
|----------|-------------------|
| Frontend | React 18, Vite, React Router, TailwindCSS, DaisyUI, Axios, react-hot-toast |
| Backend  | Node.js, Express 5, mysql2 (pool), bcrypt, jsonwebtoken, multer, helmet, express-rate-limit, cors |
| Database | MySQL 8 |
| Deploy   | Vercel (frontend + serverless API), cloud MySQL (e.g. PlanetScale, Railway) |

---

## Prerequisites

- Node.js 18 or newer
- MySQL 8 (local: XAMPP, Laragon, or Docker; production: PlanetScale, Railway, etc.)
- Git

---

## Installation (local)

**1. Clone and install dependencies**

```bash
git clone https://github.com/Faiz-abdurrachman/CMS-UTS-SEMESTER-3.git
cd CMS-UTS-SEMESTER-3
npm run install:all
```

If that fails, install manually:

```bash
cd backend && npm install
cd ../frontend && npm install
```

**2. Database**

Create a database named `lostfound_db` and load the schema.

Using MySQL CLI:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS lostfound_db;"
mysql -u root -p lostfound_db < backend/database/schema.sql
```

Using phpMyAdmin (XAMPP/Laragon): create database `lostfound_db`, then Import `backend/database/schema.sql`.

**3. Environment (backend)**

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=lostfound_db

JWT_SECRET=use_a_long_random_string_here
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:3000
```

Generate a strong JWT secret (optional for local):

```bash
openssl rand -base64 32
```

**4. Create admin user**

From repo root:

```bash
cd backend
npm run create-admin
```

Follow prompts (name, email, password). This is the only way to create an admin; registration is for regular users only.

**5. Run the app**

From repo root:

```bash
npm run dev
```

- Backend: http://localhost:5000  
- Frontend: http://localhost:3000  

Open http://localhost:3000 in the browser. Use the admin email/password to log in as Admin and open the Admin Panel.

---

## Project structure

```
CMS-UTS-SEMESTER-3/
├── api/
│   └── index.js              # Vercel serverless entry (uses backend server)
├── backend/
│   ├── config/
│   │   └── db.js             # MySQL pool
│   ├── controllers/
│   ├── middleware/            # auth, admin, upload
│   ├── models/
│   ├── routes/
│   ├── database/
│   │   ├── schema.sql
│   │   └── create-admin.sql
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── server.js
│   ├── .env.example
│   └── .env.docker.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/          # AuthContext
│   │   ├── hooks/             # useAuth
│   │   ├── pages/
│   │   ├── api.js             # Axios instance + interceptors
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── package.json               # install:all, dev, build:frontend
├── vercel.json                # Build and route config for Vercel
├── docker-compose.yml         # Optional: local MySQL + backend + frontend
└── README.md
```

---

## Deployment (Vercel + cloud MySQL)

The repo is set up for Vercel: frontend as static build, backend as serverless via `api/index.js`. You need a cloud MySQL instance (e.g. PlanetScale or Railway free tier).

**1. Database in the cloud**

- **PlanetScale:** Create a database and branch, then in Connect get host, user, password, database name. Enable SSL; set `DB_SSL=true` in production.
- **Railway:** Add MySQL to the project and copy the provided env vars.

Run the schema once against this database (e.g. from your machine):

```bash
mysql -h YOUR_HOST -u YOUR_USER -p YOUR_DATABASE < backend/database/schema.sql
```

**2. Vercel project**

- Import the GitHub repo as a new Vercel project.
- Root directory: leave as default (repo root).
- Install command: `npm run install:all`
- Build/output: leave default (Vercel uses `vercel.json`).

**3. Environment variables (Vercel)**

Add in Project Settings > Environment Variables:

| Variable       | Description |
|----------------|-------------|
| NODE_ENV       | `production` |
| DB_HOST        | MySQL host from PlanetScale/Railway |
| DB_USER        | MySQL user |
| DB_PASSWORD    | MySQL password |
| DB_NAME        | Database name (e.g. `lostfound_db`) |
| DB_SSL         | `true` for PlanetScale; omit or `false` if not needed |
| JWT_SECRET     | Long random string (e.g. `openssl rand -base64 32`) |
| FRONTEND_URL   | Your Vercel app URL (e.g. `https://your-app.vercel.app`) |

After the first deploy, set `FRONTEND_URL` to the exact Vercel URL (no trailing slash) and redeploy so CORS works.

**4. Create admin in production**

Run the create-admin script once with production DB and JWT secret (env vars set locally or in a one-off environment):

```bash
cd backend
export DB_HOST=... DB_USER=... DB_PASSWORD=... DB_NAME=lostfound_db DB_SSL=true JWT_SECRET=...
node scripts/createAdmin.js
```

Then log in on the deployed site with that admin email and password.

**5. File uploads on Vercel**

Serverless functions do not have persistent disk. Files uploaded to the backend may be lost on cold starts or redeploys. For production, consider storing uploads in external storage (e.g. Cloudinary, S3, Vercel Blob) and saving only URLs in the database.

---

## API overview

Base URL (local): `http://localhost:5000/api`  
Base URL (Vercel): `https://your-app.vercel.app/api`

**Public**
- `POST /auth/register` — body: `{ name, email, password }`
- `POST /auth/login` — body: `{ email, password }`
- `GET /items` — list items (optional query: search, status)

**Protected (header: `Authorization: Bearer <token>`)**  
- `GET /items/my-reports`  
- `POST /items/lost` — FormData (name, description, location, date_occured, status=lost, optional image)  
- `POST /items/found` — FormData (same, status=found)

**Admin**
- `GET /admin/statistics`  
- `GET /admin/items`, `GET /admin/users`  
- `PUT /admin/items/:id/validate` — body: `{ validation_status: "approved" \| "rejected" }`  
- `PUT /admin/items/:id/resolve` — body: `{ resolved_note?: string }`  
- `PUT /admin/items/:id` — update item (FormData)  
- `DELETE /admin/items/:id`, `DELETE /admin/users/:id`

---

## Docker (optional, local)

From repo root:

```bash
docker compose up --build
```

Runs MySQL (port 3306), backend (5000), and frontend (3000). Use `backend/.env.docker.example` as reference for env; override `DB_HOST=mysql` in compose.

---

## Troubleshooting

**ECONNREFUSED 127.0.0.1:3306**  
Start MySQL (XAMPP/Laragon/Docker). Check `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `.env`.

**Login always invalid**  
Do not insert users manually with plain passwords. Use Register or `npm run create-admin` in backend so passwords are hashed.

**Images not loading**  
Ensure `backend/uploads` exists; backend serves `/uploads` from there. In production, use external storage.

**CORS errors after deploy**  
Set `FRONTEND_URL` in Vercel to the exact app URL (no trailing slash) and redeploy.

---

License: ISC.  
Documentation updated: February 2026.
