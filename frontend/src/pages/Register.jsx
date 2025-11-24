// ============================================
// FILE: src/pages/Register.jsx
// DESKRIPSI: Halaman registrasi user baru
// ============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  // State untuk form data
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // State untuk error dan loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================
  // HANDLE SUBMIT
  // ============================================

  const submit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!form.name || !form.email || !form.password) {
      setError("Semua field harus diisi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Kirim POST request ke backend
      // api.post() otomatis menggunakan baseURL + '/auth/register'
      await api.post("/auth/register", form);

      // Jika sukses, redirect ke login
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      // Tangkap error dari backend
      const errorMessage =
        err.response?.data?.message || "Terjadi kesalahan. Coba lagi!";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full card bg-base-100 shadow-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            👤 Daftar Akun User
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            Daftar sebagai User untuk menggunakan layanan Lost & Found
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-4">
            <p className="text-xs text-blue-700 text-left">
              <strong>Catatan:</strong> Registrasi ini hanya untuk User biasa.
              Akun Admin dibuat secara manual oleh administrator sistem untuk
              keamanan.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Name Input */}
          <div>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama Lengkap"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

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
            className={`w-full bg-blue-600 text-white p-3 rounded-lg font-semibold transition-all duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>

          {/* Link ke Login */}
          <p className="text-center text-gray-600 text-sm">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Masuk
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
