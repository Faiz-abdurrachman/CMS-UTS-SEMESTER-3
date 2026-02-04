/*
📌 FILE: src/App.jsx

🧠 Fungsi file ini:
File ini adalah komponen utama yang mengatur (1) siapa boleh akses halaman mana (ProtectedRoute),
(2) daftar semua URL dan komponen halaman (Routes), (3) layout global (Navbar, Footer; disembunyikan
di halaman /admin). AuthProvider membungkus seluruh app agar useAuth() tersedia di mana pun.
Router membungkus Routes agar Navigate dan useLocation jalan. Route yang butuh login dibungkus
ProtectedRoute; route admin pakai requireAdmin={true}.

🔄 Alur singkat:
1. App return AuthProvider > Router > AppContent.
2. AppContent: useLocation → pathname; kalau bukan /admin tampilkan Navbar dan Footer.
3. Routes: path "/" "/login" "/register" → Home, Login, Register (public). path "/dashboard" dll → ProtectedRoute > halaman.
4. ProtectedRoute: useAuth(); loading → "Loading..."; !user → Navigate to /login; requireAdmin && role !== admin → Navigate to /dashboard; else return children.

📦 Analogi dunia nyata:
Seperti peta gedung: AuthProvider = daftar "siapa yang login"; Router = peta ruangan (URL);
ProtectedRoute = pintu yang cek kartu (login/admin); Navbar/Footer = lorong atas dan bawah (tidak tampil di ruang admin).
*/

// ============================================
// FILE: src/App.jsx
// DESKRIPSI: Komponen utama aplikasi dengan React Router
// ============================================

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import MyReports from "./pages/MyReports";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================

// children = komponen halaman yang dilindungi; requireAdmin = true hanya untuk route /admin
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Belum login → redirect ke /login; replace = ganti history agar tombol back tidak kembali ke halaman protected
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route butuh admin tapi user bukan admin → redirect ke dashboard user
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isAdminPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-lost"
            element={
              <ProtectedRoute>
                <ReportLost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-found"
            element={
              <ProtectedRoute>
                <ReportFound />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reports"
            element={
              <ProtectedRoute>
                <MyReports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

/*
---------- RINGKASAN ALUR FILE INI ----------
App: AuthProvider > Router > AppContent. AppContent: Navbar (kecuali /admin) + Routes + Footer (kecuali /admin). Setiap route protected: ProtectedRoute cek user & role → tampil children atau Navigate.

---------- ISTILAH YANG MUNCUL ----------
- BrowserRouter (Router): menyimpan state URL dan menyediakan useLocation, Navigate, Link ke anak-anaknya.
- Routes / Route: cocokkan path URL dengan element (komponen) yang di-render.
- Navigate: komponen yang mengalihkan ke URL lain; replace = ganti entry history.
- useLocation(): hook yang mengembalikan objek location (pathname, search, dll).
- AuthProvider: context provider yang menyediakan user, login, logout ke useAuth().

---------- KESALAHAN UMUM PEMULA ----------
- Menaruh Route dengan path yang sama tanpa membedakan → hanya satu yang match; pastikan path unik atau nested.
- Memakai useAuth() di komponen yang tidak di dalam AuthProvider → error "useAuth must be used within AuthProvider". App harus bungkus dengan AuthProvider dulu.
- Lupa replace di Navigate → user bisa klik back dan kembali ke halaman protected tanpa login (karena history masih ada).
*/
