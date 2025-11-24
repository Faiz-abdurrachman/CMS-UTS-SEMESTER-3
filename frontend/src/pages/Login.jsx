// ============================================
// FILE: src/pages/Login.jsx
// DESKRIPSI: Halaman login user
// ============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  // ============================================
  // CEK JIKA SUDAH LOGIN
  // ============================================

  // Jika user sudah login, redirect langsung ke dashboard sesuai role
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user) {
      // Jika sudah login, redirect ke dashboard sesuai role
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  // State untuk form data
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // State untuk memilih mode login (user atau admin)
  const [loginMode, setLoginMode] = useState("user"); // 'user' atau 'admin'

  // State untuk error dan loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================
  // HANDLE SUBMIT
  // ============================================

  const submit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!form.email || !form.password) {
      setError("Email dan password harus diisi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Kirim POST request ke backend
      const response = await api.post("/auth/login", form);

      // Jika sukses, simpan token dan user ke localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const userRole = response.data.user.role;

        // Validasi: jika pilih admin tapi role bukan admin
        if (loginMode === "admin" && userRole !== "admin") {
          setError("Email ini bukan akun admin! Silakan login sebagai User.");
          toast.error("Email ini bukan akun admin!");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return;
        }

        // Validasi: jika pilih user tapi role adalah admin
        if (loginMode === "user" && userRole === "admin") {
          setError(
            "Ini adalah akun admin! Silakan pilih 'Login sebagai Admin'."
          );
          toast.error("Ini adalah akun admin! Pilih mode Admin.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return;
        }

        // Tampilkan pesan sukses berdasarkan role
        if (userRole === "admin") {
          toast.success("Login berhasil! Selamat datang Admin 👑");
          // Redirect admin langsung ke Admin Dashboard
          navigate("/admin", { replace: true });
        } else {
          toast.success("Login berhasil! Selamat datang User 👤");
          // Redirect user langsung ke User Dashboard
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (err) {
      // Tangkap error dari backend
      const errorMessage =
        err.response?.data?.message || "Email atau password salah!";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${
        loginMode === "admin"
          ? "bg-gradient-to-br from-purple-600 to-indigo-700"
          : "bg-gradient-to-br from-blue-500 to-blue-600"
      }`}
    >
      <div className="max-w-md w-full card bg-base-100 shadow-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {loginMode === "admin" ? "👑 Login Admin" : "👤 Login User"}
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            {loginMode === "admin"
              ? "Masuk sebagai Administrator untuk mengelola sistem"
              : "Masuk sebagai User untuk menggunakan layanan Lost & Found"}
          </p>

          {/* Toggle Switch untuk memilih mode */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span
              className={`text-sm font-medium ${
                loginMode === "user" ? "text-blue-600" : "text-gray-400"
              }`}
            >
              User
            </span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={loginMode === "admin"}
              onChange={(e) =>
                setLoginMode(e.target.checked ? "admin" : "user")
              }
            />
            <span
              className={`text-sm font-medium ${
                loginMode === "admin" ? "text-purple-600" : "text-gray-400"
              }`}
            >
              Admin
            </span>
          </div>

          {/* Badge indicator */}
          <div className="flex justify-center">
            {loginMode === "admin" ? (
              <span className="badge badge-warning badge-lg gap-2">
                👑 Admin Mode
              </span>
            ) : (
              <span className="badge badge-primary badge-lg gap-2">
                👤 User Mode
              </span>
            )}
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-3 rounded-lg font-semibold transition-all duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : loginMode === "admin"
                ? "bg-purple-600 hover:bg-purple-700 hover:shadow-lg"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {loading
              ? "Masuk..."
              : loginMode === "admin"
              ? "👑 Masuk sebagai Admin"
              : "👤 Masuk sebagai User"}
          </button>

          {/* Link ke Register (hanya untuk User) */}
          {loginMode === "user" && (
            <p className="text-center text-gray-600 text-sm">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Daftar
              </a>
            </p>
          )}

          {/* Info untuk Admin */}
          {loginMode === "admin" && (
            <p className="text-center text-gray-500 text-xs italic">
              Akun admin dibuat oleh administrator sistem
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
