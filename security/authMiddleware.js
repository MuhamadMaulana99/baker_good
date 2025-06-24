const jwt = require('jsonwebtoken');
const JWT_SECRET = 'selamatdatangdiduapuluh'; // Gunakan environment variable di production

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'Token tidak disediakan.' });
  }

  // Format token yang benar: "Bearer <token>"
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(400).json({ message: 'Format token salah. Gunakan format: Bearer <token>' });
  }

  const token = tokenParts[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token sudah kedaluwarsa.' });
      }
      return res.status(401).json({ message: 'Token tidak valid.' });
    }

    req.user = decoded; // Menyimpan data user dari token ke dalam request
    next(); // Melanjutkan ke route berikutnya
  });
};

module.exports = verifyToken;
