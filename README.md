# Lost & Found CMS

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

**A modern, full-stack web application for reporting and managing lost and found items**

[Live Demo](https://cmsutssemester3.vercel.app) • [Documentation](#documentation) • [Report Bug](https://github.com/Faiz-abdurrachman/CMS-UTS-SEMESTER-3/issues) • [Request Feature](https://github.com/Faiz-abdurrachman/CMS-UTS-SEMESTER-3/issues)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Admin Setup](#admin-setup)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Lost & Found CMS** is a comprehensive web application designed to help users report and manage lost or found items. The system features a modern, responsive UI with role-based access control, allowing both regular users and administrators to efficiently manage lost and found items.

### Key Highlights

- **Modern UI/UX** - Clean, professional design with smooth animations
- **Role-Based Access** - Separate interfaces for users and administrators
- **Real-time Validation** - Admin approval system for item reports
- **Image Upload** - Support for item photos with automatic optimization
- **Responsive Design** - Fully optimized for desktop and mobile devices
- **Secure Authentication** - JWT-based authentication with password hashing
- **Search & Filter** - Advanced filtering and search capabilities

---

## Features

### User Features

- **User Authentication**
  - Secure registration and login
  - JWT token-based session management
  - Password encryption with bcrypt

- **Item Reporting**
  - Report lost items with detailed information
  - Report found items to help owners
  - Upload item photos (max 5MB)
  - Add location and date information

- **Dashboard**
  - View all lost and found items
  - Search items by name, description, or location
  - Filter by status (Lost, Found, Resolved)
  - View personal reports

- **Profile Management**
  - View personal information
  - Manage own reports
  - Track report status

### Admin Features

- **Admin Dashboard**
  - Comprehensive statistics overview
  - Manage all users and items
  - Real-time system monitoring

- **Item Validation**
  - Approve or reject item reports
  - Review pending items
  - Mark items as resolved

- **User Management**
  - View all registered users
  - Delete user accounts
  - Monitor user activity

- **Item Management**
  - Full CRUD operations on all items
  - Edit item details
  - Delete items
  - Mark items as resolved with notes

---

## Tech Stack

### Frontend

| Technology          | Version | Purpose                                        |
| ------------------- | ------- | ---------------------------------------------- |
| **React.js**        | ^18.2.0 | UI library for building interactive interfaces |
| **React Router**    | ^6.20.0 | Client-side routing                            |
| **Vite**            | ^5.0.8  | Fast build tool and dev server                 |
| **TailwindCSS**     | ^3.3.6  | Utility-first CSS framework                    |
| **DaisyUI**         | ^4.4.19 | Component library for TailwindCSS              |
| **Axios**           | ^1.6.2  | HTTP client for API requests                   |
| **React Hot Toast** | ^2.4.1  | Toast notifications                            |

### Backend

| Technology     | Version  | Purpose                         |
| -------------- | -------- | ------------------------------- |
| **Node.js**    | >=18.0.0 | JavaScript runtime              |
| **Express.js** | ^5.1.0   | Web application framework       |
| **MySQL**      | Latest   | Relational database             |
| **mysql2**     | ^3.15.3  | MySQL client for Node.js        |
| **JWT**        | ^9.0.2   | JSON Web Token authentication   |
| **bcrypt**     | ^6.0.0   | Password hashing                |
| **Multer**     | ^2.0.2   | File upload middleware          |
| **CORS**       | ^2.8.5   | Cross-Origin Resource Sharing   |
| **dotenv**     | ^17.2.3  | Environment variable management |

### Development Tools

- **Nodemon** - Auto-restart server during development
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **MySQL** (via XAMPP, Laragon, or standalone) - [XAMPP](https://www.apachefriends.org/) | [Laragon](https://laragon.org/)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** (comes with Node.js)

### Recommended Tools

- **VS Code** - Code editor
- **Postman** or **Insomnia** - API testing
- **MySQL Workbench** or **phpMyAdmin** - Database management

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Faiz-abdurrachman/CMS-UTS-SEMESTER-3.git
cd CMS-UTS-SEMESTER-3
```

### Step 2: Install Dependencies

#### Option A: Install All at Once (Recommended)

```bash
npm run install:all
```

This will install dependencies for both backend and frontend.

#### Option B: Install Separately

**Backend:**

```bash
cd backend
npm install
cd ..
```

**Frontend:**

```bash
cd frontend
npm install
cd ..
```

### Step 3: Database Setup

See [Database Setup](#database-setup) section for detailed instructions.

### Step 4: Environment Configuration

#### Backend Configuration

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Copy the example environment file:

   ```bash
   # Windows
   copy .env.example .env

   # Mac/Linux
   cp .env.example .env
   ```

3. Edit `.env` file with your configuration:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=lostfound_db
   JWT_SECRET=your_secret_key_here_change_in_production
   NODE_ENV=development
   UPLOAD_DIR=uploads
   FRONTEND_URL=http://localhost:3000
   ```

   **Important Notes:**
   - `DB_PASSWORD` should be empty for default XAMPP/Laragon setup
   - Change `JWT_SECRET` to a strong random string in production
   - `FRONTEND_URL` should match your frontend development URL

### Step 5: Start Development Servers

#### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

#### Start Frontend Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 6: Verify Installation

1. **Backend**: Open `http://localhost:5000` - Should see "Lost & Found API running"
2. **Frontend**: Open `http://localhost:3000` - Should see the home page
3. **Database**: Verify connection by checking server logs

---

## Configuration

### Environment Variables

#### Backend `.env` File

| Variable       | Description               | Default                 | Required |
| -------------- | ------------------------- | ----------------------- | -------- |
| `PORT`         | Backend server port       | `5000`                  | Yes      |
| `DB_HOST`      | MySQL host address        | `localhost`             | Yes      |
| `DB_USER`      | MySQL username            | `root`                  | Yes      |
| `DB_PASSWORD`  | MySQL password            | `` (empty)              | No       |
| `DB_NAME`      | Database name             | `lostfound_db`          | Yes      |
| `JWT_SECRET`   | Secret key for JWT tokens | -                       | Yes      |
| `NODE_ENV`     | Environment mode          | `development`           | Yes      |
| `UPLOAD_DIR`   | Upload directory path     | `uploads`               | Yes      |
| `FRONTEND_URL` | Frontend URL for CORS     | `http://localhost:3000` | Yes      |

### Frontend Configuration

Frontend API configuration is in `frontend/src/api.js`. The base URL is automatically set based on the environment:

- **Development**: `http://localhost:5000`
- **Production**: `/api` (relative path for Vercel deployment)

---

## Usage

### For Regular Users

1. **Register an Account**
   - Navigate to the registration page
   - Fill in your name, email, and password
   - Click "Sign Up"

2. **Login**
   - Use your credentials to log in
   - You'll be redirected to your dashboard

3. **Report Lost Item**
   - Click "I just lost my stuff" button
   - Fill in item details (name, description, location, date)
   - Upload a photo (optional)
   - Submit the report
   - Wait for admin approval

4. **Report Found Item**
   - Click "I found someone stuff" button
   - Fill in found item details
   - Upload a photo if available
   - Submit the report

5. **View Reports**
   - Browse all items on the home page
   - Use search to find specific items
   - View your own reports in "My Reports"

### For Administrators

1. **Admin Login**
   - Select "Login as Admin" mode
   - Use admin credentials
   - Access admin dashboard

2. **Manage Reports**
   - View all pending, approved, and rejected reports
   - Approve or reject pending reports
   - Edit item details
   - Mark items as resolved

3. **Manage Users**
   - View all registered users
   - Delete user accounts (if needed)
   - Monitor user activity

4. **Statistics**
   - View total users, reports, and pending items
   - Monitor system activity

---

## API Documentation

### Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**

```json
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

### Item Endpoints

#### Get All Items

```http
GET /api/items
```

**Response:**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Black Wallet",
    "description": "Leather wallet with credit cards",
    "location": "Campus Parking",
    "date_occured": "2024-01-15",
    "image": "1762755146714-717254827.jpg",
    "status": "lost",
    "validation_status": "approved",
    "resolved_at": null,
    "resolved_note": null,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "reporter": "John Doe"
  }
]
```

#### Get Item by ID

```http
GET /api/items/:id
```

#### Get My Reports

```http
GET /api/items/my-reports
Authorization: Bearer <token>
```

#### Create Lost Item

```http
POST /api/items/lost
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**

- `name` (string, required)
- `description` (string, required)
- `location` (string, optional)
- `date_occured` (date, optional)
- `image` (file, optional, max 5MB)

#### Create Found Item

```http
POST /api/items/found
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:** Same as lost item

#### Update Item

```http
PUT /api/items/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:** Same as create, all fields optional

#### Delete Item

```http
DELETE /api/items/:id
Authorization: Bearer <token>
```

### Admin Endpoints

All admin endpoints require authentication and admin role.

#### Get All Users

```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### Delete User

```http
DELETE /api/admin/users/:id
Authorization: Bearer <admin_token>
```

#### Get All Items (Admin)

```http
GET /api/admin/items
Authorization: Bearer <admin_token>
```

#### Get Statistics

```http
GET /api/admin/statistics
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "totalUsers": 10,
  "totalItems": 25,
  "totalPending": 5,
  "totalApproved": 18,
  "totalRejected": 2
}
```

#### Update Validation Status

```http
PUT /api/admin/items/:id/validate
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "validation_status": "approved"
}
```

**Status Options:** `pending`, `approved`, `rejected`

#### Mark Item as Resolved

```http
PUT /api/admin/items/:id/resolve
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "resolved_note": "Item returned to owner"
}
```

#### Update Item (Admin)

```http
PUT /api/admin/items/:id
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

#### Delete Item (Admin)

```http
DELETE /api/admin/items/:id
Authorization: Bearer <admin_token>
```

---

## Project Structure

```
CMS-UTS-SEMESTER-3/
│
├── api/                          # Vercel serverless functions
│   └── index.js                  # API entry point for Vercel
│
├── backend/                      # Backend application
│   ├── config/
│   │   └── db.js                 # Database connection configuration
│   │
│   ├── controllers/
│   │   ├── adminController.js    # Admin operations (CRUD, validation)
│   │   ├── authController.js     # Authentication (register, login)
│   │   └── itemController.js     # Item operations (CRUD)
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.js    # Admin role verification
│   │   ├── authMiddleware.js     # JWT authentication
│   │   └── upload.js             # File upload (Multer)
│   │
│   ├── models/
│   │   ├── Item.js               # Item model/schema
│   │   └── User.js               # User model/schema
│   │
│   ├── routes/
│   │   ├── adminRoutes.js        # Admin API routes
│   │   ├── authRoutes.js         # Authentication routes
│   │   └── itemRoutes.js         # Item API routes
│   │
│   ├── scripts/
│   │   └── createAdmin.js        # Script to create admin user
│   │
│   ├── uploads/                  # Uploaded images (gitignored)
│   │
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
│
├── database/                     # Database scripts
│   ├── schema.sql                # Main database schema
│   ├── add-validation-status.sql # Add validation_status column
│   ├── add-resolved-fields.sql   # Add resolved_at and resolved_note
│   └── create-admin.sql          # Admin user creation script
│
├── docs/                         # Documentation
│   ├── 01-STRUKTUR-PROJECT.md
│   ├── 02-BACKEND-DETAIL.md
│   ├── 03-FRONTEND-DETAIL.md
│   ├── 04-SETUP-DAN-INSTALASI.md
│   ├── 05-SETUP-LOST-FOUND.md
│   ├── 06-SETUP-FRONTEND.md
│   ├── 07-CARA-BUAT-ADMIN.md
│   ├── 08-FIX-VALIDATION-STATUS.md
│   ├── 09-FITUR-RESOLVED-ITEMS.md
│   ├── 10-FIX-PERMASALAHAN.md
│   ├── 11-DEPLOY-VERCEL.md
│   └── 12-SETUP-DATABASE-CLOUD.md
│
├── frontend/                     # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── CardItem.jsx      # Item card component
│   │   │   ├── Footer.jsx        # Footer component
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   └── SidebarAdmin.jsx  # Admin sidebar navigation
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx # Admin dashboard page
│   │   │   ├── Dashboard.jsx     # User dashboard page
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── MyReports.jsx     # User's reports page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── ReportFound.jsx   # Report found item page
│   │   │   └── ReportLost.jsx    # Report lost item page
│   │   │
│   │   ├── api.js                # Axios configuration
│   │   ├── App.jsx               # Main app component with routing
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # React entry point
│   │
│   ├── index.html                # HTML template
│   ├── package.json              # Frontend dependencies
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.js        # TailwindCSS configuration
│   └── vite.config.js            # Vite configuration
│
├── .gitignore                    # Git ignore rules
├── package.json                  # Root package.json with scripts
├── README.md                     # This file
└── vercel.json                   # Vercel deployment configuration
```

---

## Admin Setup

### Creating an Admin User

#### Method 1: Using Script (Recommended)

```bash
cd backend
npm run create-admin
```

Follow the prompts to enter:

- Admin name
- Admin email
- Admin password

#### Method 2: Manual Database Insert

1. Open phpMyAdmin or MySQL client
2. Select `lostfound_db` database
3. Run the following SQL (replace values):

```sql
INSERT INTO users (name, email, password, role)
VALUES (
  'Admin Name',
  'admin@example.com',
  '$2b$10$YourHashedPasswordHere',
  'admin'
);
```

**Note:** Password must be hashed with bcrypt. Use an online bcrypt generator or the create-admin script.

#### Method 3: Using SQL Script

```bash
# Navigate to database folder
cd database

# Import the create-admin.sql script
# Edit the file first to set your admin credentials
mysql -u root -p lostfound_db < create-admin.sql
```

### Admin Login

1. Navigate to login page
2. Select "Login as Admin" mode
3. Enter admin credentials
4. Access admin dashboard

---

## Database Setup

### Option 1: Using XAMPP

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start Apache and MySQL services
   - Ensure both show green status

2. **Create Database**
   - Open `http://localhost/phpmyadmin`
   - Click "SQL" tab
   - Copy and paste contents of `database/schema.sql`
   - Click "Go" to execute

3. **Verify**
   - Check that `lostfound_db` database exists
   - Verify `users` and `items` tables are created

### Option 2: Using Laragon

1. **Start Laragon**
   - Click "Start All"

2. **Create Database**
   - Open HeidiSQL (included with Laragon)
   - Create new database `lostfound_db`
   - Execute `database/schema.sql`

3. **Verify**
   - Tables should appear in the database

### Option 3: Cloud Database (Aiven)

1. Create account on Aiven.io
2. Create MySQL service
3. Get connection credentials
4. Update `.env` with cloud credentials
5. Use `mysql` command line or workbench to import schema

---

## Deployment

### Vercel Deployment (Full Stack)

This project is configured for deployment on Vercel as a full-stack application (React frontend + Express backend as Serverless Functions).

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to Vercel Dashboard
   - "Add New" -> "Project"
   - Import repository

3. **Configure Environment Variables**
   - Add all variables from `.env`
   - Update `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` to your cloud database credentials

4. **Deploy**
   - Click Deploy
   - Vercel will build frontend and set up serverless functions

### Alternative Deployment

- **Frontend**: Netlify, Vercel, Firebase Hosting
- **Backend**: Heroku, Railway, Render, DigitalOcean

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

- Check if MySQL service is running
- Verify credentials in `.env`
- Ensure database `lostfound_db` exists
- Check if port 3306 is available

#### 2. Images Not Loading

- Check `uploads` folder exists in backend
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check permissions on `uploads` folder

#### 3. CORS Errors

- Ensure `FRONTEND_URL` in backend `.env` is correct
- Check if you're calling the correct API URL

#### 4. Login Fails

- Verify table structure matches `models/User.js`
- Check if password hashing is working correctly
- Clear browser local storage

---

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the ISC License. See `LICENSE` for more information.
