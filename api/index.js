// ============================================
// FILE: api/index.js
// DESKRIPSI: Entry point untuk Vercel Serverless Functions
// ============================================
// Vercel routes /api/* to this file. The Express app in backend/server.js
// already defines routes under /api (e.g. /api/auth, /api/items, /api/admin),
// so the request path is unchanged: client calls /api/auth/login, Express
// receives /api/auth/login and matches app.use("/api/auth", ...). No path rewrite needed.

const app = require("../backend/server");
module.exports = app;
