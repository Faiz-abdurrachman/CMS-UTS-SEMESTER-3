/*
📌 FILE: AuthContext.jsx (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   Menyediakan "state global" untuk autentikasi: user, token, loading, serta fungsi login,
   register, logout. Komponen anak bisa mengakses ini lewat useAuth() tanpa prop drilling.
🔄 Alur singkat:
   1. createContext untuk AuthContext.
   2. AuthProvider: state user, token, loading; useEffect cek localStorage (user & token) lalu set state; login/register panggil API dan simpan ke localStorage + state; logout hapus localStorage + redirect.
   3. value = objek yang diberikan ke Provider; isAuthenticated = !!user.
   4. Return AuthContext.Provider dengan value dan children.
📦 Analogi dunia nyata:
   Seperti "meja informasi" satu gedung: siapa pun (komponen) bisa datang dan tanya "siapa yang login?
   apa token-nya?" atau minta "tolong login/register/logout". Satu tempat, dipakai banyak ruangan.
*/

// import = mengambil dari modul React
// createContext = fungsi untuk membuat "context" (kotak yang bisa diisi nilai dan dibaca anak komponen)
// useState = hook untuk state (nilai yang berubah dan memicu re-render)
// useEffect = hook untuk efek samping (jalan setelah render, misal baca localStorage)
import { createContext, useState, useEffect } from "react";

// import instance api (axios yang sudah dikonfigurasi baseURL + token) untuk panggil backend
import api from "../api";

// export = agar file lain bisa pakai
// createContext() = membuat objek context; bisa diberi nilai default (null kalau tidak ada argumen)
// AuthContext = nama variabel; nanti dipakai di Provider dan useAuth (consumer)
export const AuthContext = createContext();

// export AuthProvider = komponen yang "menyediakan" nilai auth ke semua anak di bawahnya
// ({ children }) = props: destructuring, kita ambil prop bernama children (isi yang dibungkus <AuthProvider>...</AuthProvider>)
export const AuthProvider = ({ children }) => {
  // useState(null) = state dengan nilai awal null; setUser = fungsi untuk mengubah nilai user
  // user = data user yang login (atau null kalau belum login)
  const [user, setUser] = useState(null);

  // token = string JWT; nilai awal dari localStorage.getItem("token") (bisa null)
  // setToken = fungsi untuk mengubah token (misal setelah login)
  const [token, setToken] = useState(localStorage.getItem("token"));

  // loading = true awal; nanti di useEffect kita set false setelah cek localStorage
  // dipakai agar komponen tidak tampilkan "belum login" dulu sebelum kita tahu ada token atau tidak
  const [loading, setLoading] = useState(true);

  // useEffect = jalankan fungsi setelah render (dan saat dependency berubah)
  // (() => { ... }, []) = dependency array kosong = hanya jalankan sekali setelah mount
  useEffect(() => {
    // const storedUser = ... = variabel lokal
    // localStorage.getItem("user") = string JSON yang dulu kita simpan (atau null)
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    // jika keduanya ada (truthy), kita set state user dan token
    // JSON.parse(storedUser) = ubah string JSON kembali jadi objek JavaScript
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    // selesai cek; set loading false agar UI bisa tampil (misal redirect login atau tampilkan konten)
    setLoading(false);
  }, []);

  // const login = ... = mendefinisikan fungsi login (async = bisa pakai await)
  // (email, password) = parameter yang dikirim dari form login
  const login = async (email, password) => {
    // try { ... } = coba jalankan kode; kalau ada error, loncat ke catch
    try {
      // await = tunggu promise selesai; api.post = HTTP POST ke baseURL + "/auth/login"
      // { email, password } = body request (object; shorthand untuk { email: email, password: password })
      const response = await api.post("/auth/login", { email, password });

      // response.data = body response dari server; kita ambil token dan user
      // const { token, user } = ... = destructuring dari response.data
      const { token, user } = response.data;

      // simpan ke localStorage agar tetap ada setelah refresh
      // localStorage.setItem("token", token) = simpan dengan kunci "token", nilai string token
      localStorage.setItem("token", token);
      // JSON.stringify(user) = ubah objek user jadi string JSON (localStorage hanya simpan string)
      localStorage.setItem("user", JSON.stringify(user));

      // set state agar komponen yang pakai useAuth langsung dapat user & token baru
      setToken(token);
      setUser(user);

      // return objek { success: true } = memberitahu pemanggil bahwa login berhasil
      return { success: true };
    } catch (error) {
      // kalau request gagal (network error atau response 4xx/5xx), masuk sini
      // error.response?.data?.message = pesan error dari body response (jika ada)
      // || "Login failed" = fallback jika tidak ada message
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // register = fungsi untuk mendaftar user baru
  // (name, email, password) = parameter dari form register
  const register = async (name, email, password) => {
    try {
      // POST ke /auth/register dengan data name, email, password
      await api.post("/auth/register", { name, email, password });

      // setelah daftar berhasil, otomatis login (supaya user tidak perlu isi form login lagi)
      const loginResult = await login(email, password);

      // jika login berhasil, return success
      if (loginResult.success) {
        return { success: true };
      }

      // kalau login gagal (jarang), tetap return success untuk registrasi
      return { success: true, message: "Registration successful. Please login." };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // logout = fungsi tanpa parameter; dipanggil saat user klik logout
  const logout = () => {
    // hapus token dan user dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // set state jadi null agar UI langsung update (misal Navbar hilangkan nama user)
    setUser(null);
    setToken(null);

    // redirect ke halaman login (full page load agar state benar-benar bersih)
    window.location.href = "/login";
  };

  // value = objek yang akan kita berikan ke AuthContext.Provider
  // semua komponen anak yang pakai useAuth() akan dapat objek ini
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    // !!user = konversi ke boolean: true jika user ada, false jika null/undefined
    isAuthenticated: !!user,
  };

  // return = yang di-render oleh AuthProvider
  // AuthContext.Provider = komponen dari React (kita dapat dari createContext)
  // value={value} = prop yang membuat nilai value tersedia untuk semua consumer (useContext(AuthContext) atau useAuth)
  // {children} = konten yang ada di antara <AuthProvider> ... </AuthProvider> (di App.jsx: Router dan isinya)
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/*
🔄 Alur eksekusi file (step by step)
1. AuthContext dibuat dengan createContext().
2. AuthProvider didefinisikan: state user, token, loading; useEffect sekali jalan cek localStorage → set user/token kalau ada, lalu setLoading(false).
3. login: panggil api.post("/auth/login"), simpan token & user ke localStorage dan state, return { success: true } atau { success: false, message }.
4. register: panggil api.post("/auth/register"), lalu login; return success/failure.
5. logout: hapus localStorage, setUser/setToken null, window.location.href = "/login".
6. value dihitung (user, token, loading, login, register, logout, isAuthenticated).
7. Return Provider dengan value dan children. Setiap komponen di bawah Provider bisa pakai useAuth() untuk dapat value.

🧠 Ringkasan versi manusia awam
   "AuthContext itu satu 'kotak' yang isinya: siapa user yang login, token-nya, dan fungsi login/register/logout.
   AuthProvider membungkus aplikasi dan mengisi kotak itu. Komponen mana pun bisa baca isi kotak dengan
   useAuth(), tanpa perlu kirim prop dari atas ke bawah."

📘 Glosarium
   - createContext: membuat objek context React (Provider + Consumer).
   - Provider: komponen yang memberi nilai ke context; anak-anak bisa baca lewat useContext.
   - useState: hook untuk state; [nilai, setter].
   - useEffect: hook untuk efek (jalan setelah render); [] = sekali saat mount.
   - localStorage: penyimpanan browser (string); setItem, getItem, removeItem.
   - JSON.parse / JSON.stringify: ubah string ↔ objek.
   - isAuthenticated: boolean "apakah user sudah login" (!!user).

⚠️ Kesalahan umum pemula + contoh
   - Memakai useAuth() di komponen yang tidak ada AuthProvider di atasnya → error "useContext can't find provider".
   - Lupa setLoading(false) di useEffect → loading selamanya true, UI bisa stuck "Loading...".
   - Menyimpan objek langsung ke localStorage tanpa JSON.stringify → jadi "[object Object]".
*/
