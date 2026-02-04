/*
📌 FILE: hooks/useAuth.js

🧠 Fungsi file ini:
Custom hook yang mengembalikan nilai context AuthContext (user, token, loading, login,
register, logout, isAuthenticated). Memakai useContext(AuthContext). Kalau context
undefined (komponen tidak di dalam AuthProvider), throw Error agar developer tahu.
Dipakai di Navbar, Login, Register, ProtectedRoute, dll agar tidak perlu import
AuthContext dan useContext di setiap file.

🔄 Alur singkat:
1. const context = useContext(AuthContext).
2. if (!context) throw Error.
3. return context.

📦 Analogi dunia nyata:
Seperti nomor telepon "layanan siapa yang login": satu nomor (useAuth) yang dipanggil
di mana pun; kalau dipanggil di luar gedung (di luar AuthProvider) akan dapat pesan error.
*/

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// useAuth = custom hook; harus dipakai di dalam komponen yang ada di bawah AuthProvider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/*
---------- RINGKASAN: useContext(AuthContext) → cek ada/tidak → return value context.
---------- ISTILAH: Custom hook (fungsi yang pakai hook lain); useContext (baca value dari Provider terdekat).
---------- KESALAHAN PEMULA: Memakai useAuth di komponen yang tidak dibungkus AuthProvider → context undefined, throw Error.
*/
