// ============================================
// FILE: src/pages/ReportFound.jsx
// DESKRIPSI: Halaman untuk melaporkan barang ditemukan
// ============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function ReportFound() {
  const navigate = useNavigate();

  // State untuk form data
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    date_occured: "",
  });

  // State untuk file gambar
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State untuk error dan loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================
  // HANDLE IMAGE CHANGE
  // ============================================

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validasi ukuran (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        return;
      }

      setFile(selectedFile);

      // Preview gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // ============================================
  // HANDLE SUBMIT
  // ============================================

  const submit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!form.name || !form.description) {
      setError("Nama dan deskripsi harus diisi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Buat FormData untuk multipart/form-data
      const data = new FormData();

      // Append form fields
      Object.keys(form).forEach((key) => {
        if (form[key]) {
          data.append(key, form[key]);
        }
      });

      // Append status
      data.append("status", "found");

      // Append file jika ada
      if (file) {
        data.append("image", file);
      }

      // Kirim POST request dengan FormData
      await api.post("/items/found", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Jika sukses, redirect ke dashboard
      toast.success("Laporan berhasil dikirim!");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Terjadi kesalahan. Coba lagi!";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-6 sm:py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card bg-base-100 shadow-xl p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <span className="text-green-500">✅</span> Laporkan Penemuan Barang
          </h1>
          <p className="text-gray-600 mb-6 text-sm">
            Laporkan barang yang Anda temukan di tempat random (bukan milik
            Anda). Bantu pemilik asli menemukan barang mereka. Laporan akan
            divalidasi oleh admin sebelum muncul di dashboard public.
          </p>

          <form onSubmit={submit} className="space-y-4">
            {/* Nama Barang */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Barang *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Contoh: Dompet Hitam, Kunci Motor"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi *
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Jelaskan detail barang, ciri-ciri, dll"
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi Ditemukan *
              </label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Contoh: Parkiran Kampus, Ruang 101, Jalan Raya, dll"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Lokasi di mana Anda menemukan barang ini
              </p>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Ditemukan
              </label>
              <input
                type="date"
                value={form.date_occured}
                onChange={(e) =>
                  setForm({ ...form, date_occured: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Upload Gambar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto Barang (Opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-green-600 text-white p-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "hover:bg-green-700 hover:shadow-lg"
                }`}
              >
                {loading ? "Menyimpan..." : "Kirim Laporan"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 sm:px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm sm:text-base"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
