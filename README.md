# 🎯 Lost & Found CMS

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

**A modern, full-stack web application for reporting and managing lost and found items**

[Live Demo](https://cmsutssemester3.vercel.app) • [Documentation](#-documentation) • [Report Bug](https://github.com/Faiz-abdurrachman/CMS-UTS-SEMESTER-3/issues) • [Request Feature](https://github.com/Faiz-abdurrachman/CMS-UTS-SEMESTER-3/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Admin Setup](#-admin-setup)
- [Database Setup](#-database-setup)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Lost & Found CMS** is a comprehensive web application designed to help users report and manage lost or found items. The system features a modern, responsive UI with role-based access control, allowing both regular users and administrators to efficiently manage lost and found items.

### Key Highlights

- ✅ **Modern UI/UX** - Clean, professional design with smooth animations
- ✅ **Role-Based Access** - Separate interfaces for users and administrators
- ✅ **Real-time Validation** - Admin approval system for item reports
- ✅ **Image Upload** - Support for item photos with automatic optimization
- ✅ **Responsive Design** - Fully optimized for desktop and mobile devices
- ✅ **Secure Authentication** - JWT-based authentication with password hashing
- ✅ **Search & Filter** - Advanced filtering and search capabilities

---

## ✨ Features

### User Features

- 🔐 **User Authentication**

  - Secure registration and login
  - JWT token-based session management
  - Password encryption with bcrypt

- 📝 **Item Reporting**

  - Report lost items with detailed information
  - Report found items to help owners
  - Upload item photos (max 5MB)
  - Add location and date information

- 📊 **Dashboard**

  - View all lost and found items
  - Search items by name, description, or location
  - Filter by status (Lost, Found, Resolved)
  - View personal reports

- 👤 **Profile Management**
  - View personal information
  - Manage own reports
  - Track report status

### Admin Features

- 🛡️ **Admin Dashboard**

  - Comprehensive statistics overview
  - Manage all users and items
  - Real-time system monitoring

- ✅ **Item Validation**

  - Approve or reject item reports
  - Review pending items
  - Mark items as resolved

- 👥 **User Management**

  - View all registered users
  - Delete user accounts
  - Monitor user activity

- 📦 **Item Management**
  - Full CRUD operations on all items
  - Edit item details
  - Delete items
  - Mark items as resolved with notes

---

## 🛠 Tech Stack

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

## 📦 Prerequisites

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

## 🚀 Installation

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

See [Database Setup](#-database-setup) section for detailed instructions.

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

## ⚙️ Configuration

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

## 📖 Usage

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

## 📡 API Documentation

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

## 📁 Project Structure

```
CMS-UTS-SEMESTER-3/
│
├── 📁 api/                          # Vercel serverless functions
│   └── index.js                     # API entry point for Vercel
│
├── 📁 backend/                      # Backend application
│   ├── 📁 config/
│   │   └── db.js                    # Database connection configuration
│   │
│   ├── 📁 controllers/
│   │   ├── adminController.js       # Admin operations (CRUD, validation)
│   │   ├── authController.js        # Authentication (register, login)
│   │   └── itemController.js        # Item operations (CRUD)
│   │
│   ├── 📁 middleware/
│   │   ├── adminMiddleware.js       # Admin role verification
│   │   ├── authMiddleware.js        # JWT authentication
│   │   └── upload.js                # File upload (Multer)
│   │
│   ├── 📁 models/
│   │   ├── Item.js                  # Item model/schema
│   │   └── User.js                  # User model/schema
│   │
│   ├── 📁 routes/
│   │   ├── adminRoutes.js           # Admin API routes
│   │   ├── authRoutes.js            # Authentication routes
│   │   └── itemRoutes.js            # Item API routes
│   │
│   ├── 📁 scripts/
│   │   └── createAdmin.js           # Script to create admin user
│   │
│   ├── 📁 uploads/                  # Uploaded images (gitignored)
│   │
│   ├── .env.example                  # Environment variables template
│   ├── package.json                 # Backend dependencies
│   └── server.js                    # Express server entry point
│
├── 📁 database/                      # Database scripts
│   ├── schema.sql                   # Main database schema
│   ├── add-validation-status.sql    # Add validation_status column
│   ├── add-resolved-fields.sql      # Add resolved_at and resolved_note
│   └── create-admin.sql             # Admin user creation script
│
├── 📁 docs/                         # Documentation
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
├── 📁 frontend/                     # Frontend React application
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── CardItem.jsx         # Item card component
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   └── SidebarAdmin.jsx     # Admin sidebar navigation
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── AdminDashboard.jsx   # Admin dashboard page
│   │   │   ├── Dashboard.jsx        # User dashboard page
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── MyReports.jsx        # User's reports page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── ReportFound.jsx      # Report found item page
│   │   │   └── ReportLost.jsx       # Report lost item page
│   │   │
│   │   ├── api.js                   # Axios configuration
│   │   ├── App.jsx                  # Main app component with routing
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # React entry point
│   │
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── postcss.config.js            # PostCSS configuration
│   ├── tailwind.config.js           # TailwindCSS configuration
│   └── vite.config.js               # Vite configuration
│
├── .gitignore                       # Git ignore rules
├── package.json                     # Root package.json with scripts
├── README.md                        # This file
└── vercel.json                      # Vercel deployment configuration
```

---

## 👨‍💼 Admin Setup

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

## 🗄️ Database Setup

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

   - Open Laragon application
   - Start Apache and MySQL services

2. **Create Database**

   - Open `http://localhost/phpmyadmin` or use Laragon's database manager
   - Import `database/schema.sql` file
   - Or execute SQL manually

3. **Configure .env**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=lostfound_db
   ```

### Option 3: Using Cloud Database

For production or cloud deployment:

1. **Create Database**

   - Use services like PlanetScale, AWS RDS, or Google Cloud SQL
   - Note the connection details

2. **Configure .env**

   ```env
   DB_HOST=your-cloud-host.com
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=lostfound_db
   DB_SSL=true  # If required
   ```

3. **Import Schema**
   - Use MySQL client or phpMyAdmin
   - Import `database/schema.sql`

### Database Schema

The database consists of two main tables:

#### Users Table

| Column       | Type         | Description                  |
| ------------ | ------------ | ---------------------------- |
| `id`         | INT          | Primary key, auto increment  |
| `name`       | VARCHAR(100) | User's full name             |
| `email`      | VARCHAR(100) | Unique email address         |
| `password`   | VARCHAR(255) | Bcrypt hashed password       |
| `role`       | VARCHAR(20)  | User role: 'user' or 'admin' |
| `created_at` | TIMESTAMP    | Account creation timestamp   |
| `updated_at` | TIMESTAMP    | Last update timestamp        |

#### Items Table

| Column              | Type         | Description                       |
| ------------------- | ------------ | --------------------------------- |
| `id`                | INT          | Primary key, auto increment       |
| `user_id`           | INT          | Foreign key to users table        |
| `name`              | VARCHAR(200) | Item name                         |
| `description`       | TEXT         | Item description                  |
| `location`          | VARCHAR(200) | Location where lost/found         |
| `date_occured`      | DATE         | Date when item was lost/found     |
| `image`             | VARCHAR(255) | Image filename                    |
| `status`            | VARCHAR(20)  | 'lost' or 'found'                 |
| `validation_status` | VARCHAR(20)  | 'pending', 'approved', 'rejected' |
| `resolved_at`       | TIMESTAMP    | When item was marked as resolved  |
| `resolved_note`     | TEXT         | Admin note when resolving         |
| `created_at`        | TIMESTAMP    | Report creation timestamp         |
| `updated_at`        | TIMESTAMP    | Last update timestamp             |

---

## 🚀 Deployment

### Deploying to Vercel

This project is configured for Vercel deployment with serverless functions.

#### Prerequisites

- Vercel account
- GitHub repository connected to Vercel

#### Steps

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Import to Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**

   - In Vercel project settings, add all variables from `backend/.env.example`
   - Set production values for:
     - `DB_HOST` (cloud database)
     - `DB_USER`
     - `DB_PASSWORD`
     - `JWT_SECRET` (strong random string)
     - `FRONTEND_URL` (your Vercel domain)

4. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Or click "Deploy" manually

#### Database for Production

Use a cloud database service:

- **PlanetScale** - Serverless MySQL
- **AWS RDS** - Managed MySQL
- **Google Cloud SQL** - Managed MySQL
- **Railway** - Database hosting

### Manual Deployment

#### Backend Deployment

1. **Build**

   ```bash
   cd backend
   npm install --production
   ```

2. **Set Environment Variables**

   - Configure production `.env` file

3. **Start Server**
   ```bash
   npm start
   ```

#### Frontend Deployment

1. **Build**

   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy**
   - Upload `dist/` folder to your hosting service
   - Configure server to serve `index.html` for all routes

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Database Connection Errors

**Error:** `Cannot connect to database`

**Solutions:**

1. Verify MySQL service is running (XAMPP/Laragon)
2. Check `.env` file credentials
3. Ensure database `lostfound_db` exists
4. Test connection with MySQL client

#### Port Already in Use

**Error:** `Port 5000 already in use` or `Port 3000 already in use`

**Solutions:**

- **Backend**: Change `PORT` in `.env` file
- **Frontend**: Change port in `vite.config.js`
- Or kill the process using the port:

  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

  # Mac/Linux
  lsof -ti:5000 | xargs kill
  ```

#### CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions:**

1. Check `FRONTEND_URL` in backend `.env`
2. Verify backend CORS configuration in `server.js`
3. Ensure backend server is running

#### File Upload Errors

**Error:** `Multer file upload ENOENT` or `Cannot find module 'multer'`

**Solutions:**

1. Ensure `uploads/` directory exists in backend folder
2. Check file permissions (write access)
3. Verify Multer is installed: `npm install multer`

#### JWT Token Errors

**Error:** `Invalid token` or `Token expired`

**Solutions:**

1. Clear browser localStorage
2. Log out and log in again
3. Check `JWT_SECRET` in `.env` matches between restarts

#### Build Errors

**Error:** `TailwindCSS not recognized` or build fails

**Solutions:**

```bash
cd frontend
npm install
npx tailwindcss init -p
npm run build
```

#### Module Not Found

**Error:** `Cannot find module` or `Module not found`

**Solutions:**

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Verify all dependencies in `package.json`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add some amazing feature"
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style

- Follow existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Test your changes before submitting

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

**Note:** This project was created for educational purposes.

---

## 👤 Author

**Faiz Abdurrachman**

- GitHub: [@Faiz-abdurrachman](https://github.com/Faiz-abdurrachman)
- Project: [Lost & Found CMS](https://github.com/Faiz-abdurrachman/CMS-UTS-SEMESTER-3)

---

## 🙏 Acknowledgments

- React.js community for excellent documentation
- TailwindCSS team for the amazing utility framework
- Express.js for the robust backend framework
- All contributors and users of this project

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review existing [Issues](https://github.com/Faiz-abdurrachman/CMS-UTS-SEMESTER-3/issues)
3. Create a new issue with detailed information

---

<div align="center">

**Made with ❤️ for helping people find their lost items**

⭐ Star this repo if you find it helpful!

</div>
