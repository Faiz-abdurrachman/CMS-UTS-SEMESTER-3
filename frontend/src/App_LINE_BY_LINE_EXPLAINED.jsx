/*
📌 FILE: App.jsx (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   Komponen utama aplikasi: mengatur routing (URL → halaman), layout (Navbar, main, Footer),
   dan proteksi rute (halaman yang butuh login/admin). Juga membungkus seluruh app dengan
   AuthProvider dan Router.
🔄 Alur singkat:
   1. Import Router, Routes, Route, Navigate, useLocation, komponen UI, halaman, AuthProvider, useAuth.
   2. Definisikan ProtectedRoute: jika loading tampilkan "Loading..."; jika belum login redirect ke /login;
      jika requireAdmin tapi user bukan admin redirect ke /dashboard; selain itu tampilkan children.
   3. AppContent: pakai useLocation; jika path /admin sembunyikan Navbar dan Footer; di main render Routes.
   4. Routes: public (/, /login, /register), protected user (dashboard, report-lost, report-found, my-reports),
      protected admin (/admin).
   5. App: return AuthProvider → Router → AppContent. Export App.
📦 Analogi dunia nyata:
   Seperti resepsionis gedung: dia punya daftar ruangan (routes). Ada ruangan umum, ada yang butuh
   kartu anggota (ProtectedRoute), ada yang khusus admin. Dia juga mengatur siapa yang boleh masuk.
*/

// import beberapa export dari paket "react-router-dom"
// kurung kurawal { } = named imports (nama harus sama dengan yang di-export)
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// import komponen Navbar dari file Navbar.jsx di folder components
import Navbar from "./components/Navbar";

// import komponen Footer
import Footer from "./components/Footer";

// import halaman-halaman dari folder pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import MyReports from "./pages/MyReports";
import AdminDashboard from "./pages/AdminDashboard";

// AuthProvider = komponen yang menyediakan state auth (user, login, logout) ke seluruh app
import { AuthProvider } from "./contexts/AuthContext";

// useAuth = hook untuk mengakses nilai dari AuthContext (user, loading, login, dll)
import { useAuth } from "./hooks/useAuth";

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================

// `const` = deklarasi variabel yang nilainya tidak akan diganti (referensi komponen)
// `ProtectedRoute` = nama komponen
// `=` = assignment (memberi nilai)
// `({ children, requireAdmin = false })` = parameter fungsi: objek props yang di-destructure
//   - children = konten yang dibungkus (biasanya satu komponen halaman)
//   - requireAdmin = boolean; default false = tidak wajib admin
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // useAuth() = hook; mengembalikan objek berisi user, loading, dll dari AuthContext
  // { user, loading } = destructuring: kita ambil properti user dan loading dari objek itu
  const { user, loading } = useAuth();

  // if (loading) = jika sedang loading (misal cek token/user dari localStorage)
  // return = keluar dari fungsi dan mengembalikan nilai berikut
  // <div>Loading...</div> = elemen JSX: div berisi teks "Loading..."
  if (loading) {
    return <div>Loading...</div>;
  }

  // jika tidak ada user (null/undefined) = belum login
  // Navigate to="/login" = komponen yang akan mengalihkan browser ke URL /login
  // replace = mengganti history sehingga tombol back tidak kembali ke halaman protected
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // requireAdmin && ... = jika route ini khusus admin DAN role user bukan "admin"
  // user.role = properti role dari objek user (biasanya "user" atau "admin")
  // redirect ke /dashboard (halaman user biasa)
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // jika semua cek lulus: tampilkan children (komponen halaman yang dilindungi)
  // children = apa yang ada di antara <ProtectedRoute> ... </ProtectedRoute>
  return children;
};

// function AppContent() = deklarasi fungsi bernama AppContent (komponen React)
// () = tidak ada parameter
function AppContent() {
  // useLocation() = hook dari react-router yang mengembalikan objek location (pathname, search, dll)
  const location = useLocation();

  // location.pathname = bagian path dari URL (misal "/admin", "/dashboard")
  // === "/admin" = benar-benar sama dengan string "/admin"
  // isAdminPage = true hanya ketika kita di halaman admin
  const isAdminPage = location.pathname === "/admin";

  // return = nilai yang "dikembalikan" oleh komponen (yang akan di-render)
  // ( ... ) = mengembalikan satu ekspresi JSX (kurung agar bisa multi-baris)
  return (
    // <div> = elemen pembungkus
    // className = atribut untuk memberi kelas CSS; Tailwind: min-h-screen (min tinggi layar), bg-white, flex, flex-col
    <div className="min-h-screen bg-white flex flex-col">
      {/* jika BUKAN halaman admin, tampilkan Navbar; kalau admin, Navbar tidak ditampilkan */}
      {!isAdminPage && <Navbar />}

      {/* <main> = elemen semantik untuk konten utama halaman; className="flex-1" = agar main memenuhi sisa ruang vertikal (flex grow) */}
      <main className="flex-1">
        {/* <Routes> = komponen react-router: tempat mendefinisikan daftar Route (path → komponen) */}
        <Routes>
          {/* Public Routes = bisa diakses tanpa login */}
          {/* <Route> = satu aturan: path URL dan elemen (komponen) yang di-render; path="/" = ketika URL tepat "/"; element={<Home />} = komponen yang di-render */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (User) = harus login; jika belum akan redirect ke /login */}
          {/* path="/dashboard" = URL /dashboard; element = ProtectedRoute membungkus Dashboard; children = <Dashboard /> */}
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

          {/* Protected Routes (Admin Only) = harus login DAN role admin; requireAdmin={true} = prop agar ProtectedRoute cek role admin */}
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

      {/* sama seperti Navbar: Footer tidak ditampilkan di halaman /admin */}
      {!isAdminPage && <Footer />}
    </div>
  );
}

// function App() = komponen tingkat paling atas yang di-import di main.jsx
function App() {
  // return satu elemen JSX: AuthProvider membungkus Router, Router membungkus AppContent; urutan: auth dulu, lalu routing, lalu isi
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// export default App = mengekspor App sebagai "default export" file ini
// file lain bisa: import App from "./App";
export default App;

/*
🔄 Alur eksekusi file (step by step)
1. Semua import dijalankan: Router, Routes, Route, Navigate, useLocation, Navbar, Footer, halaman, AuthProvider, useAuth.
2. ProtectedRoute didefinisikan: saat dipanggil, ia pakai useAuth; jika loading → "Loading..."; jika !user → Navigate ke /login;
   jika requireAdmin dan user.role !== "admin" → Navigate ke /dashboard; else return children.
3. AppContent didefinisikan: pakai useLocation; isAdminPage = (pathname === "/admin"); return div dengan conditional Navbar,
   main (berisi Routes), conditional Footer. Di dalam Routes: tiap Route memetakan path ke element (public atau ProtectedRoute).
4. App didefinisikan: return AuthProvider → Router → AppContent.
5. Saat URL berubah, Router memilih Route yang cocok; jika Route pakai ProtectedRoute, ProtectedRoute memutuskan tampilkan children atau redirect.

🧠 Ringkasan versi manusia awam
   "App.jsx itu yang mengatur: (1) daftar halaman dan URL-nya, (2) halaman mana yang butuh login/admin,
   (3) layout global (navbar di atas, footer di bawah, kecuali di halaman admin). Semua dibungkus
   dengan penyedia auth (AuthProvider) dan router (Router)."

📘 Glosarium
   - Router / BrowserRouter: menyediakan konteks routing (pathname, navigate, dll).
   - Routes / Route: mendefinisikan path → komponen.
   - Navigate: komponen yang menyebabkan redirect ke URL lain.
   - useLocation: hook untuk mendapatkan objek location (pathname, dll).
   - ProtectedRoute: komponen buatan kita untuk melindungi rute (cek login/admin).
   - AuthProvider: penyedia state auth (user, login, logout) lewat Context.
   - useAuth: hook untuk mengonsumsi nilai dari AuthContext.
   - children: konten yang ada di antara tag pembuka dan penutup komponen.
   - element (di Route): komponen React yang di-render untuk path tersebut.

⚠️ Kesalahan umum pemula + contoh
   - Menaruh Route di luar Routes → tidak jalan; Route harus anak langsung (atau di dalam) Routes.
   - Lupa membungkus dengan Router → useLocation/Navigate/Routes butuh Router di atas.
   - ProtectedRoute tanpa AuthProvider di atas → useAuth() error (no provider).
   - Menulis komentar di JSX pakai // → invalid; pakai {/* ... */}.
*/
