const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Ambil token dari header

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak, token tidak tersedia" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi token
    req.user = decoded; // Simpan data user dari token ke req
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token tidak valid" });
  }
};

module.exports = authMiddleware;
