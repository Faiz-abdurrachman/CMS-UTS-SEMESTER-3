/*
📌 FILE: ReportFound.jsx (versi dijelaskan baris per baris)
🧠 Fungsi: Form lapor barang ditemukan; POST /items/found dengan FormData; sukses → toast + navigate /dashboard.
🔄 Alur: State form/file/imagePreview/error/loading; handleImageChange (max 5MB, preview); submit → FormData + status "found" + image → api.post → toast + navigate.
📦 Analogi: Form "saya menemukan barang": nama, deskripsi, lokasi, tanggal, foto; kirim; sukses ke dashboard.
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function ReportFound() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", location: "", date_occured: "" });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must not exceed 5MB");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      setError("Item name and description are required!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => { if (form[key]) data.append(key, form[key]); });
      data.append("status", "found");
      if (file) data.append("image", file);
      await api.post("/items/found", data);
      toast.success("Report submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred. Please try again!";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-3">Report Found Item</h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Report an item you found (not yours). Your report will be validated by admin.
            </p>
          </div>
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Black Wallet" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 text-gray-900 placeholder-gray-400" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the item" rows="5" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 text-gray-900 placeholder-gray-400 resize-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Found Location <span className="text-red-500">*</span></label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g., Campus Parking" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 text-gray-900 placeholder-gray-400" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date Found</label>
              <input type="date" value={form.date_occured} onChange={(e) => setForm({ ...form, date_occured: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Photo (Optional)</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-primary" />
              {imagePreview && <div className="mt-3"><img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg border-2 border-gray-200" /></div>}
            </div>
            {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button type="submit" disabled={loading} className={`flex-1 py-3 px-6 rounded-lg font-semibold ${loading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-accent text-primary hover:bg-accent-dark"}`}>
                {loading ? "Submitting..." : "Submit Report"}
              </button>
              <button type="button" onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/*
🔄 Alur: State → handleImageChange (5MB, preview) → submit FormData + status "found" → api.post /items/found → toast + navigate.
🧠 Ringkasan: Form lapor barang ditemukan; FormData; status "found"; sukses ke dashboard.
📘 Glosarium: FormData, FileReader.readAsDataURL, accept="image/*".
⚠️ Kesalahan: Harus FormData untuk upload file; backend multipart.
*/
