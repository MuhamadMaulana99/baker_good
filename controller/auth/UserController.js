const { User } = require('../../model/index.js');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  addUser: async (req, res) => {
    const { username, password, userRoles } = req.body;

    try {
      // Check if the username already exists in the database
      const existingUser = await User.findOne({ where: { username } });

      if (existingUser) {
        // If the username is already taken, return a 400 status with an error message
        return res.status(400).json({
          message:
            "Username sudah digunakan, silakan pilih username yang lain.",
        });
      }

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with the hashed password
      const newUser = await User.create({
        username,
        password: hashedPassword,
        userRoles,
      });

      // Return the newly created user data
      return res.status(201).json({
        message: "Registrasi berhasil",
        data: {
          id: newUser.id_users, // Adjust according to your model structure
          username: newUser.username,
          userRoles: newUser.userRoles,
        },
      });
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        errorMessage: error.message,
      });
    }
  },

  LoginUser: async (req, res) => {
    const { username, password } = req.body;

    try {
      // Validasi input tidak boleh kosong
      if (!username || !password) {
        return res.status(400).json({
          message: "Username dan password harus diisi",
        });
      }

      // Cari pengguna berdasarkan username
      const user = await User.findOne({ where: { username } });

      // Jika pengguna tidak ditemukan
      if (!user || !user.password) {
        return res.status(401).json({
          message: "Username atau password salah",
        });
      }

      // Verifikasi password menggunakan bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Username atau password salah",
        });
      }

      // Pastikan JWT_SECRET tersedia
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not set in environment variables");
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }

      // Buat token JWT
      const token = jwt.sign(
        {
          id: user.id_users, // Ubah sesuai dengan struktur model Anda
          username: user.username,
          userRoles: user.userRoles,
        },
        process.env.JWT_SECRET, // Ambil secret key dari environment
        { expiresIn: "1h" } // Token berlaku selama 1 jam
      );

      // Kirimkan response dengan token
      return res.status(200).json({
        message: "Login Berhasil",
        token, // Mengirimkan token ke client
        user: {
          id: user.id_users,
          username: user.username,
          userRoles: user.userRoles,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        errorMessage: error.message,
      });
    }
  },

  getUser: async (req, res) => {
    const get = await User.findAll({
      attributes: ["id_users", "username", "userRoles"],
    });
    // const val = get?.map((value) => {
    //   return {
    //     ...value.dataValues,
    //     userRoles: JSON.parse(value?.userRoles),
    //   };
    // });
    res.json(get);
  },

  getUserByRole: async (req, res) => {
    const { role } = req.params; // ambil dari URL
    const get = await User.findAll({
      where: { userRoles: role },
      attributes: ["id_users", "username", "password", "userRoles"],
    });
    res.json(get);
  },

  putUser: async (req, res) => {
    const id = req.params.id; // Mengambil ID dari parameter URL
    const { username, password, userRoles } = req.body; // Mengambil data dari request body

    try {
      // Memperbarui data pengguna
      const [updated] = await User.update(
        { username, password, userRoles },
        {
          where: {
            id_users: id, // Menggunakan kolom yang benar (id_users)
          },
        }
      );

      // Memeriksa apakah ada data yang diperbarui
      if (updated === 0) {
        return res.status(404).json({
          message:
            "Pengguna tidak ditemukan atau tidak ada perubahan yang dilakukan.",
        });
      } else {
        return res.status(200).json({
          message: `Pengguna dengan ID ${id} telah diperbarui.`,
          updatedData: { username, userRoles }, // Menyertakan data yang diperbarui dalam respons
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal Server Error",
        errorMessage: error.message, // Mengembalikan pesan error yang lebih informatif
      });
    }
  },
  deleteUser: async (req, res) => {
    const id = req.params.id; // Mengambil ID dari parameter URL
    try {
      const del = await User.destroy({
        where: {
          id_users: id, // Pastikan menggunakan kolom yang benar (id_users)
        },
      });

      // Memeriksa apakah ada data yang dihapus
      if (del === 0) {
        // Jika tidak ada yang dihapus
        return res.status(404).json({
          message: "Pengguna tidak ditemukan atau sudah dihapus.",
        });
      } else {
        return res.status(200).json({
          message: `Pengguna dengan ID ${id} telah dihapus.`,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal Server Error",
        errorMessage: error.message, // Mengembalikan pesan error yang lebih informatif
      });
    }
  },
};
