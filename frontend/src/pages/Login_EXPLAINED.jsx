/*
📌 FILE: src/pages/Login.jsx
🧠 Fungsi: Halaman login: form email & password, toggle User/Admin (hanya tampilan; backend satu endpoint). Jika sudah user (useEffect) redirect ke /admin atau /dashboard. submit panggil login() dari AuthContext; sukses toast, error tampil.
🔄 Alur: useEffect([user]) → jika user ada redirect by role. submit: validasi → login(form) → toast + redirect atau setError. State: form, loginMode, error, loading.
📦 Analogi: Seperti loket masuk: pilih "User" atau "Admin", isi email/password, dapat stempel (token) lalu diarahkan ke ruang yang benar.
*/

// ============================================
// FILE: src/pages/Login.jsx
// DESKRIPSI: Halaman login user - Modern Split-Screen Design
// ============================================

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // ============================================
  // CEK JIKA SUDAH LOGIN
  // ============================================

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  // State untuk form data
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // State untuk memilih mode login (user atau admin)
  const [loginMode, setLoginMode] = useState("user");

  // State untuk error dan loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================
  // HANDLE SUBMIT
  // ============================================

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Email and password are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Panggil fungsi login dari AuthContext
      const result = await login(form.email, form.password);

      if (result.success) {
        // Cek role manual karena state user mungkin belum update seketika di sini
        // Kita bisa ambil payload dari token jika perlu, tapi untuk simpelnya
        // kita percaya redirect di useEffect atau kita cek response jika login mengembalikan data user (updated AuthContext to return user)
        
        // Note: AuthContext.login mengembalikan { success: true } 
        // Logic redirect sebenarnya sudah dihandle useEffect([user]), 
        // tapi untuk UX lebih cepat bisa kita handle disini juga atau biarkan useEffect bekerja.
        
        // Agar aman, kita biarkan useEffect yang handle redirect setelah user state terupdate.
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
      {/* Left Section - Decorative Text */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-light items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-5xl sm:text-6xl font-display font-bold text-white mb-6 leading-tight">
            {loginMode === "admin" ? (
              <>
                Let's
                <br />
                manage!
              </>
            ) : (
              <>
                Let's find
                <br />
                your stuff
                <br />
                back!
              </>
            )}
          </h1>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mode Toggle */}
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
            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
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

            {/* Link ke Register (hanya untuk User) */}
            {loginMode === "user" && (
              <p className="text-center text-sm text-gray-600">
                Didn't have an account yet?{" "}
                <Link
                  to="/register"
                  className="text-accent-dark font-semibold hover:text-primary transition-colors"
                >
                  Let's Sign Up first
                </Link>
              </p>
            )}

            {/* Info untuk Admin */}
            {loginMode === "admin" && (
              <p className="text-center text-xs text-gray-500">
                Not an admin?{" "}
                <button
                  type="button"
                  onClick={() => setLoginMode("user")}
                  className="text-accent-dark font-semibold hover:text-primary transition-colors"
                >
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
---------- RINGKASAN: useAuth login, user. useEffect redirect jika user. submit → login() → toast/error. State form (email, password), loginMode, error, loading. Controlled input.
---------- ISTILAH: replace (navigate replace: true); controlled input; e.preventDefault() agar form tidak reload.
---------- KESALAHAN PEMULA: Tidak cek user di useEffect → setelah login tidak redirect. Lupa e.preventDefault() → submit bikin reload halaman.
*/
