// ============================================
// FILE: src/components/CardItem.jsx
// DESKRIPSI: Komponen card untuk menampilkan item dengan DaisyUI
// ============================================

// Props: item - data item, onDelete - callback untuk delete, showDelete - apakah tampilkan tombol delete
export default function CardItem({ item, onDelete, showDelete = false }) {
  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-200">
      {/* Gambar */}
      {item.image && (
        <figure className="h-48 sm:h-56 overflow-hidden">
          <img
            src={`${import.meta.env.PROD ? "/api" : "http://localhost:5000"}/uploads/${item.image}`}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </figure>
      )}

      {/* Card Body */}
      <div className="card-body">
        {/* Status Badge */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2 flex-wrap">
            {/* Badge untuk status item */}
            {item.resolved_at ? (
              <span className="badge badge-success">✅ Sudah Ditemukan</span>
            ) : (
              <span
                className={`badge ${
                  item.status === "lost" ? "badge-warning" : "badge-success"
                }`}
              >
                {item.status === "lost" ? "🔍 Hilang" : "⏳ Menunggu Pemilik"}
              </span>
            )}
            {/* Badge untuk validation status */}
            {item.validation_status && (
              <span
                className={`badge badge-outline ${
                  item.validation_status === "pending"
                    ? "badge-warning"
                    : item.validation_status === "approved"
                    ? "badge-success"
                    : "badge-error"
                }`}
              >
                {item.validation_status === "pending" && "Pending"}
                {item.validation_status === "approved" && "Approved"}
                {item.validation_status === "rejected" && "Rejected"}
              </span>
            )}
          </div>
          {showDelete && onDelete && (
            <button
              className="btn btn-error btn-sm btn-circle"
              onClick={() => onDelete(item.id)}
              title="Hapus item"
            >
              🗑️
            </button>
          )}
        </div>

        {/* Nama Barang */}
        <h2 className="card-title text-slate-800">{item.name}</h2>

        {/* Deskripsi */}
        <p className="text-gray-700 text-sm">
          {truncateDescription(item.description)}
        </p>

        {/* Info Tambahan */}
        <div className="space-y-1 text-xs text-gray-600 mt-4 border-t pt-4">
          {item.location && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{item.location}</span>
            </div>
          )}
          {item.date_occured && (
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>{formatDate(item.date_occured)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span>{item.reporter}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>🕐</span>
            <span>{formatDate(item.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
