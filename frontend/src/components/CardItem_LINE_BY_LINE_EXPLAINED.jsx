/*
📌 FILE: CardItem.jsx (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   Komponen kartu untuk menampilkan satu item (lost/found): gambar (atau placeholder), badge status,
   nama, deskripsi (dipotong), lokasi, tanggal, reporter. Bisa tampil tombol hapus jika showDelete dan onDelete ada.
🔄 Alur singkat:
   1. Terima props: item, onDelete, showDelete (default false).
   2. Helper: formatDate, truncateDescription, getStatusBadge.
   3. imageBaseUrl dari env (prod vs dev).
   4. Render: div kartu → area gambar → body (badge, nama, deskripsi, info lokasi/tanggal/reporter); conditional delete button.
📦 Analogi dunia nyata:
   Seperti kartu barang di papan pengumuman: foto barang, status (Lost/Found/Resolved), nama, cuplikan deskripsi,
   lokasi, tanggal, dan siapa yang melaporkan. Kalau kamu punya wewenang, ada tombol hapus.
*/

// export default = mengekspor satu nilai utama (komponen CardItem)
// function CardItem({ ... }) = komponen yang menerima satu argumen: objek props yang di-destructure
// item = data satu item (name, description, image, status, location, date_occured, reporter, validation_status, resolved_at, id)
// onDelete = fungsi callback yang dipanggil saat tombol delete diklik; parameter biasanya item.id
// showDelete = boolean; default false = tombol hapus tidak ditampilkan kecuali di-set true
export default function CardItem({ item, onDelete, showDelete = false }) {
  // const formatDate = ... = fungsi helper di dalam komponen (akan dibuat ulang tiap render)
  // (dateString) = parameter: string tanggal dari API (bisa null/undefined)
  const formatDate = (dateString) => {
    // if (!dateString) = jika dateString falsy (null, undefined, ""), kembalikan "-"
    if (!dateString) return "-";
    // new Date(dateString) = membuat objek Date dari string; .toLocaleDateString(...) = format ke string lokal
    // "en-US" = locale; year/month/day = opsi format (numeric, short month, numeric day)
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // truncateDescription = potong teks; jika lebih dari maxLength, potong dan tambah "..."
  // (text, maxLength = 120) = parameter kedua punya default 120
  const truncateDescription = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    // .substring(0, maxLength) = ambil karakter dari index 0 sampai maxLength-1; + "..." = tambah elipsis
    return text.substring(0, maxLength) + "...";
  };

  // getStatusBadge = mengembalikan objek { text, className } untuk tampilan badge status
  const getStatusBadge = () => {
    // jika item punya resolved_at = sudah diselesaikan → badge "Resolved" biru
    if (item.resolved_at) {
      return {
        text: "Resolved",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      };
    }
    // jika status === "lost" → badge "Lost" oranye
    if (item.status === "lost") {
      return {
        text: "Lost",
        className: "bg-orange-100 text-orange-700 border-orange-200",
      };
    }
    // selain itu dianggap "Found" → hijau
    return {
      text: "Found",
      className: "bg-green-100 text-green-700 border-green-200",
    };
  };

  // panggil getStatusBadge sekali, simpan hasilnya di variabel
  const statusBadge = getStatusBadge();

  // imageBaseUrl = dasar URL untuk gambar upload; di production pakai "/api", di dev pakai localhost:5000
  const imageBaseUrl = import.meta.env.PROD ? "/api" : "http://localhost:5000";

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 group">
      {/* Area gambar: tinggi tetap; tampil gambar jika item.image ada, else placeholder icon */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
        {/* item.image ? (...) : null = conditional render: hanya render img jika item.image truthy */}
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

      {/* Card Body: padding; berisi badge, nama, deskripsi, info */}
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
🔄 Alur eksekusi file (step by step)
1. CardItem dipanggil dengan props item, onDelete, showDelete.
2. formatDate, truncateDescription, getStatusBadge didefinisikan; statusBadge = getStatusBadge(); imageBaseUrl di-set.
3. Return JSX: div kartu → area gambar (img jika item.image, else placeholder div); body dengan badge status + optional validation_status badge; jika showDelete && onDelete, tombol delete; nama, deskripsi (truncate), lalu lokasi/tanggal/reporter.
4. onError pada img: jika gambar gagal dimuat, sembunyikan img dan tampilkan placeholder (nextElementSibling).

🧠 Ringkasan versi manusia awam
   "CardItem itu satu kartu untuk satu barang: foto (atau icon kalau tidak ada), status Lost/Found/Resolved,
   nama, deskripsi singkat, lokasi, tanggal, dan nama pelapor. Kalau dipanggil dengan showDelete dan onDelete,
   ada tombol hapus yang memanggil onDelete(item.id)."

📘 Glosarium
   - props / destructuring: item, onDelete, showDelete dari parent.
   - toLocaleDateString: format Date ke string sesuai locale.
   - substring: potong string.
   - conditional render: item.image ? <img /> : null (tampil salah satu).
   - onError (img): event saat gambar gagal dimuat.
   - line-clamp (Tailwind): batasi jumlah baris teks dengan elipsis.
   - optional chaining: ?. (nextElementSibling?.classList).

⚠️ Kesalahan umum pemula + contoh
   - Lupa handle item.image null → img src jadi "/api/uploads/undefined" atau error; selalu cek atau pakai placeholder.
   - onDelete dipanggil tanpa item.id → pastikan parent kirim callback yang benar (id untuk hapus di API).
   - Menulis // di dalam JSX → harus {/* */} untuk komentar di JSX.
*/
