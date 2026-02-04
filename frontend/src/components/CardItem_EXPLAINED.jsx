/*
📌 FILE: src/components/CardItem.jsx
🧠 Fungsi: Satu kartu untuk menampilkan satu item (lost/found): gambar (atau placeholder), badge status (Resolved/Lost/Found) dan validation_status, nama, deskripsi (truncate), lokasi, tanggal, reporter. Opsional tombol hapus (showDelete + onDelete). URL gambar: PROD /api, dev localhost:5000.
🔄 Alur: Props item, onDelete, showDelete → helper formatDate, truncateDescription, getStatusBadge → imageBaseUrl → render card; onError gambar sembunyikan img dan tampilkan placeholder.
📦 Analogi: Seperti kartu pengumuman: foto, stempel status, judul, ringkasan, lokasi, tanggal, nama pelapor; kadang ada tombol hapus.
*/

// ============================================
// FILE: src/components/CardItem.jsx
// DESKRIPSI: Komponen card untuk menampilkan item - Modern Clean Design
// ============================================

export default function CardItem({ item, onDelete, showDelete = false }) {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateDescription = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getStatusBadge = () => {
    if (item.resolved_at) {
      return {
        text: "Resolved",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      };
    }
    if (item.status === "lost") {
      return {
        text: "Lost",
        className: "bg-orange-100 text-orange-700 border-orange-200",
      };
    }
    return {
      text: "Found",
      className: "bg-green-100 text-green-700 border-green-200",
    };
  };

  const statusBadge = getStatusBadge();

  // Production pakai /api (same origin); dev pakai localhost:5000 agar gambar dari backend load
  const imageBaseUrl = import.meta.env.PROD ? "/api" : "http://localhost:5000";

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 group">
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
        {item.image ? (
          <img
            src={`${imageBaseUrl}/uploads/${item.image}`}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={`flex items-center justify-center h-full text-gray-400 ${
            item.image ? "hidden" : ""
          }`}
          aria-hidden
        >
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="sr-only">No photo</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.className}`}
            >
              {statusBadge.text}
            </span>
            {item.validation_status && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  item.validation_status === "pending"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : item.validation_status === "approved"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }`}
              >
                {item.validation_status === "pending"
                  ? "Pending"
                  : item.validation_status === "approved"
                  ? "Approved"
                  : "Rejected"}
              </span>
            )}
          </div>
          {showDelete && onDelete && (
            <button
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
              onClick={() => onDelete(item.id)}
              title="Delete item"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        <h2 className="text-lg font-display font-bold text-primary mb-2 line-clamp-2">
          {item.name}
        </h2>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {truncateDescription(item.description)}
        </p>

        <div className="space-y-2 pt-4 border-t border-gray-100">
          {item.location && (
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="line-clamp-1">{item.location}</span>
            </div>
          )}
          {item.date_occured && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(item.date_occured)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="line-clamp-1">{item.reporter || "Unknown"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
---------- RINGKASAN: Props item + opsional onDelete, showDelete. Helper formatDate, truncate, getStatusBadge. imageBaseUrl beda dev/prod. onError img fallback placeholder.
---------- ISTILAH: Props (item, onDelete, showDelete); optional chaining (item?.reporter); import.meta.env.PROD; onError (fallback saat gambar gagal load).
---------- KESALAHAN PEMULA: Salah imageBaseUrl di production (misal tetap localhost:5000) → gambar 404. Lupa handle onError → broken image icon saat URL salah.
*/
