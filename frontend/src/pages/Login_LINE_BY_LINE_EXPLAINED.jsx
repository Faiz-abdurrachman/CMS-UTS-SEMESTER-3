/*
📌 FILE: Login.jsx (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   Halaman login: form email + password, toggle User/Admin mode (hanya mengubah teks dekoratif),
   submit memanggil login dari AuthContext; jika sukses toast dan redirect (via useEffect ketika user ter-update).
🔄 Alur singkat:
   1. useNavigate, useAuth(login, user); useEffect: jika user ada redirect ke /admin atau /dashboard.
   2. State: form (email, password), loginMode (user/admin), error, loading.
   3. submit: validasi, login(), toast, setError jika gagal; finally setLoading false.
   4. Return: split layout (kiri dekoratif, kanan form); form onSubmit=submit; link Register.
📦 Analogi dunia nyata:
   Seperti "loket masuk": isi email dan password, pilih "User" atau "Admin" (hanya mengubah tulisan),
   lalu tombol Sign In. Kalau berhasil, kamu diarahkan ke dashboard atau admin.
*/

// import useState (state) dan useEffect (efek setelah render) dari React
import { useState, useEffect } from "react";
// import useNavigate (redirect) dan Link (navigasi tanpa reload) dari react-router-dom
import { useNavigate, Link } from "react-router-dom";
// import useAuth untuk akses login dan user dari AuthContext
import { useAuth } from "../hooks/useAuth";
// import toast untuk notifikasi pop-up
import toast from "react-hot-toast";

// export default = ekspor utama; function Login() = komponen tanpa props
export default function Login() {
  // const navigate = fungsi untuk pindah halaman (programmatic)
  const navigate = useNavigate();
  // const { login, user } = destructuring dari useAuth(); login = fungsi login, user = objek user atau null
  const { login, user } = useAuth();

  // useEffect = jalankan saat user atau navigate berubah
  useEffect(() => {
    // if (user) = jika sudah login (user tidak null)
    if (user) {
      // jika role admin, redirect ke /admin; replace: true = ganti history (back tidak ke login)
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  // state form: email dan password; setForm untuk update
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  // loginMode = "user" atau "admin"; hanya mengubah teks dekoratif dan link (tidak mengubah API)
  const [loginMode, setLoginMode] = useState("user");
  // error = pesan error untuk ditampilkan; string kosong = tidak ada error
  const [error, setError] = useState("");
  // loading = true saat request login sedang jalan (tombol disabled)
  const [loading, setLoading] = useState(false);

  // submit = fungsi async yang dipanggil saat form di-submit (onSubmit)
  const submit = async (e) => {
    // e.preventDefault() = cegah form submit default (reload halaman)
    e.preventDefault();
    // validasi: email dan password wajib diisi
    if (!form.email || !form.password) {
      setError("Email and password are required!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // panggil login dari AuthContext; result = { success: true } atau { success: false, message }
      const result = await login(form.email, form.password);
      if (result.success) {
        toast.success("Login successful!");
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Bagian kiri: dekoratif; hidden di mobile, lg:flex = tampil di desktop; setengah lebar; gradient hijau */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-light items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-5xl sm:text-6xl font-display font-bold text-white mb-6 leading-tight">
            {loginMode === "admin" ? (
              <>Let's<br />manage!</>
            ) : (
              <>Let's find<br />your stuff<br />back!</>
            )}
          </h1>
        </div>
      </div>
      {/* Bagian kanan: form login; w-full di mobile, lg:w-1/2 di desktop */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-3">
              Sign in as {loginMode === "admin" ? "Admin" : "User"}
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setLoginMode("user")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  loginMode === "user"
                    ? "bg-accent text-primary"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("admin")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  loginMode === "admin"
                    ? "bg-accent text-primary"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Admin
              </button>
            </div>
          </div>
          <form onSubmit={submit} className="space-y-6">
            <div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Username"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900 placeholder-gray-400"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-accent text-primary hover:bg-accent-dark shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
            {loginMode === "user" && (
              <p className="text-center text-sm text-gray-600">
                Didn't have an account yet?{" "}
                <Link to="/register" className="text-accent-dark font-semibold hover:text-primary transition-colors">
                  Let's Sign Up first
                </Link>
              </p>
            )}
            {loginMode === "admin" && (
              <p className="text-center text-xs text-gray-500">
                Not an admin?{" "}
                <button type="button" onClick={() => setLoginMode("user")} className="text-accent-dark font-semibold hover:text-primary transition-colors">
                  Sign in as User here
                </button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

/*
🔄 Alur eksekusi: Import → Login() → useNavigate, useAuth; useEffect([user,navigate]) redirect jika user ada; state form/loginMode/error/loading; submit validasi → login() → toast/error; return split layout + form.
🧠 Ringkasan: Halaman login: form email/password, toggle User/Admin (teks saja), submit panggil AuthContext.login; kalau sukses redirect ke dashboard/admin lewat useEffect.
📘 Glosarium: useNavigate, useAuth, replace:true, loginMode, toast, e.preventDefault.
⚠️ Kesalahan: Lupa e.preventDefault() → form submit reload halaman; memakai loginMode untuk enforce backend role → tidak, role dari server; backend yang putuskan admin/user.
*/
